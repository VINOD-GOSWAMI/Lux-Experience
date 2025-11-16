pipeline {
    agent any

    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run')
        choice(name: 'ENV', choices: ['prod','local'], description: 'Environment to test')
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
                    -e CI=true \
                    -e BROWSER=${BROWSER} \
                    -e ENV=${ENV} \
                    -e PARALLEL=${PARALLEL} \
                    -v \$(pwd)/playwright-report:/app/playwright-report \
                    -v \$(pwd)/test-results:/app/test-results \
                    playwright-ci \
                    sh -c "npx playwright test --reporter=html || true"
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
