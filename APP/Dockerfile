    # Use Node.js to build the Angular app
FROM node:20.17 AS build

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular project files
COPY . .

# Build the Angular app
RUN npm run build --configuration=production

# Use Nginx to serve the built Angular app
FROM nginx:alpine
COPY --from=build /app/dist/YOUR-ANGULAR-PROJECT /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
