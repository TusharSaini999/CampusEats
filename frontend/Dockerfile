# Stage 1: Build the React application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Note: Ensure the build environment variables are correctly read by Vite.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom config
COPY nginx.conf /etc/nginx/conf.d
# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
