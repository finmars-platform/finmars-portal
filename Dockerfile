# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Define argument
ARG PROJECT_ENV

# Update and install packages
RUN apk update && apk upgrade && \
    apk add --no-cache bash && \
    rm -rf /var/cache/apk/*

# Set working directory in the container
WORKDIR /var/www/portal

# Copy package files
COPY package.json package-lock.json .

# Install Node.js dependencies
RUN npm install

# Copy the current directory contents into the container
COPY src ./src
COPY docker ./docker
COPY libs ./libs
COPY vocabulary ./vocabulary
COPY copy-config.js \
     copy-content-files.js \
     copy-html-files.js \
     server.js \
     bootstrap.js \
     index.html \
     postcss.config.js \
     protractor.config.js \
     tailwind.config.js \
     vite.config.js \
     ./
#COPY server-local.js server.js

# Change permission of the shell script
RUN chmod +x docker/portal-run.sh

# Build the application
RUN npm run build -- --env $PROJECT_ENV

# Node and npm use a non-root user provided by the base Node image
# Creating a new user "finmars" for running the application
RUN adduser -D finmars

RUN chown -R finmars:finmars /var/www/portal/dist

# Change to non-root privilege
USER finmars

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the command on container startup
CMD ["/bin/bash", "docker/portal-run.sh"]