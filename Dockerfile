FROM mcr.microsoft.com/playwright:latest

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

ENTRYPOINT ["npm", "run", "test:ci"]
