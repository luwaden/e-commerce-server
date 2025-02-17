# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only necessary files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Then copy only necessary source code files
COPY src/ ./src/

COPY src/ ./src/ 

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
