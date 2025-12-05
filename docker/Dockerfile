# Use Node 22 as base image
FROM node:22

# Set working directory inside container
WORKDIR /web

# Copy only dependency files first (better caching)
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY web/. .

# Expose Vite port
EXPOSE 5173

# Start Vite in dev mode
CMD ["npm", "run", "dev"]
