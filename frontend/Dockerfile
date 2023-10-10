# Use an official Node.js runtime as a parent image
FROM node:18.16.0

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Copy the rest of the application code to the container
COPY . /app

# Install dependencies
RUN npm install

ENV NODE_ENV=development

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
