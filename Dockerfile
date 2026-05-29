# Use an official Node.js runtime as a parent image
ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:1.29.7-alpine

FROM $NODE_IMAGE AS builder

# Define argument
ARG PROJECT_ENV="production"

# Update and install packages
RUN apk update && apk upgrade && \
    apk add --no-cache bash && \
    rm -rf /var/cache/apk/*

# Set working directory in the container
WORKDIR /var/www/portal

# Copy package files
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Copy the current directory contents into the container
COPY src ./src
COPY libs ./libs
COPY vocabulary ./vocabulary
COPY bootstrap.js \
     index.html \
     postcss.config.js \
     protractor.config.js \
     tailwind.config.js \
     vite.config.ts \
     ./
#COPY server-local.js server.js


# Build the application
RUN npm run build -- --mode $PROJECT_ENV

FROM $NGINX_IMAGE
WORKDIR /var/www/portal
COPY --from=builder /var/www/portal/dist/ /usr/share/nginx/html
COPY docker/ /usr/local/bin
COPY docker/nginx.conf /etc/nginx/default.conf

# Node and npm use a non-root user provided by the base Node image
# Creating a new user "finmars" for running the application

# Change permission of the shell script
RUN chmod +x /usr/local/bin/portal-run.sh

# Change to non-root privilege
#USER finmars

# Make port 8080 available to the world outside this container
EXPOSE 8080

