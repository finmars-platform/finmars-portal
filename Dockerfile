FROM node:19.6-alpine
USER root
ARG PROJECT_ENV

RUN apk update && apk upgrade && apk add --no-cache bash && rm -rf /var/cache/apk/*

WORKDIR /var/www/portal
ADD docker/portal-run.sh /var/www/portal/docker/portal-run.sh
COPY . .
RUN npm install
RUN PROJECT_ENV=$PROJECT_ENV npm run build
EXPOSE 8080

CMD ["/bin/bash", "/var/www/portal/docker/portal-run.sh"]