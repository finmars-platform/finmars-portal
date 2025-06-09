# Use an official Node.js runtime as a parent image
FROM node:19.6-alpine

# Define argument
ARG PROJECT_ENV

# Update and install packages
RUN apk update && apk upgrade && \
    apk add --no-cache bash && \
    rm -rf /var/cache/apk/*

# Set working directory in the container
WORKDIR /var/www/portal

# Copy the current directory contents into the container
COPY src ./src
COPY docker ./docker
COPY libs ./libs
COPY vocabulary ./vocabulary
COPY copy-config.js .
COPY copy-content-files.js .
COPY copy-html-files.js .
COPY server.js .
#COPY server-local.js server.js
COPY package.json .
COPY package-lock.json .
COPY bootstrap.js .
COPY index.html .
COPY postcss.config.js .
COPY protractor.config.js .
COPY tailwind.config.js .
COPY vite.config.js .

# Change permission of the shell script
RUN chmod +x docker/portal-run.sh

# Install Node.js dependencies
RUN npm install

# Build the application
RUN npm run build -- --env $PROJECT_ENV

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the command on container startup
CMD ["/bin/bash", "docker/portal-run.sh"]