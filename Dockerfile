FROM node:9.10-alpine
USER root
ARG PROJECT_ENV
ARG API_HOST

RUN echo $API_HOST
RUN echo $PROJECT_ENV

RUN apk update && apk upgrade && apk add --no-cache bash git openssh python make g++ curl && rm -rf /var/cache/apk/*
WORKDIR /var/www/legacy-frontend
COPY . .
RUN npm install
RUN PROJECT_ENV=$PROJECT_ENV API_HOST=$API_HOST npm run build
EXPOSE 8080
ENTRYPOINT ["node", "./server.js"]