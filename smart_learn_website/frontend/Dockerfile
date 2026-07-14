# Use the official Node.js version 20 image as the base for our container
FROM node:20

# Set the working directory inside the container - all subsequent commands will be executed here
WORKDIR /app 

# Copy the dependency configuration files into the container
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm install

# Copy the rest of the source code into the container
COPY . .

# Start command for the application in development mode
# --host tells Vite to listen not only to localhost inside the container, but also from outside, from the host browser
CMD ["npm", "run", "dev", "--", "--host"]
