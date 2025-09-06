# server/Dockerfile

# 1. Use an official Node.js runtime as a parent image
FROM node:20-alpine

# 2. Set the working directory in the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# 4. Install app dependencies
RUN npm install

# 5. Copy the rest of the application source code
COPY . .

# 6. Compile TypeScript code
RUN npm run build

# 7. Expose the port the app runs on
EXPOSE 5001

# 8. Define the command to run the app
CMD [ "npm", "start" ]