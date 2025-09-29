# Use Node 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .




# Build TypeScript
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the server
CMD ["node", "dist/server.js"]
