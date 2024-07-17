# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application (if you have a build step)
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "start"]
