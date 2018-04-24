FROM node:9.10-alpine
USER root
RUN apk update && apk upgrade && apk add --no-cache bash git openssh python make g++ curl && rm -rf /var/cache/apk/*
WORKDIR /var/www/legacy-frontend
COPY . .
RUN npm install && npm run build
EXPOSE 8080
ENTRYPOINT ["node", "./server.js"]