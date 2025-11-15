pipeline {
    agent any

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run')
        string(name: 'TAG', defaultValue: '@smoke', description: 'Tag to run')
        choice(name: 'ENV', choices: ['dev','stage','prod'], description: 'Environment to test')
        booleanParam(name: 'PARALLEL', defaultValue: true, description: 'Run tests parallel or single thread')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests in Docker') {
            steps {
                sh """
                docker build -t playwright-ci .
                
                docker run --rm \
                    -e BROWSER=${BROWSER} \
                    -e TAG=${TAG} \
                    -e ENV=${ENV} \
                    -e PARALLEL=${PARALLEL} \
                    -v \$(pwd)/playwright-report:/app/playwright-report \
                    -v \$(pwd)/test-results:/app/test-results \
                    playwright-ci \
                    npx playwright test
                """
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
                archiveArtifacts artifacts: 'test-results/**/*.mp4', fingerprint: true
                archiveArtifacts artifacts: 'test-results/**/*.png', fingerprint: true
                archiveArtifacts artifacts: 'test-results/**/*.zip', fingerprint: true
            }
        }
    }

    post {
        always {
            echo "Run finished — Reports & Videos archived"
        }
    }
}
