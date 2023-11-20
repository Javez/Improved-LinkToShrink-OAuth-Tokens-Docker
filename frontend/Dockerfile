# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the Docker image
WORKDIR /frontend

ADD package.json /tmp

RUN cd /tmp && npm install

RUN mv /tmp/node_modules /frontend

# Copy the build directory from your host to the Docker image
COPY build /frontend

# Install a simple http server to serve static content
RUN npm install --only=production
RUN npm install -g serve

# Make port 5000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["serve", "-s", ".", "-l", "3000"]