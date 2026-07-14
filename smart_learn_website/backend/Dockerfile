# Use the official Node.js version 20 image as the base for our container
FROM node:22

# Set the working directory inside the container - all subsequent commands will be executed here
WORKDIR /app 

# Copy the dependency configuration files into the container
COPY package*.json ./

# Copy the Prisma schema file and related files into the container
COPY prisma ./prisma/

# Install the dependencies specified in package.json
RUN npm install

# Generate the Prisma client to interact with the database
RUN npx prisma generate

# Copy the rest of the source code into the container
COPY . .

# Build the application for production
RUN npm run build

# Start command for the application in development mode
CMD ["npm", "run", "start:dev"]