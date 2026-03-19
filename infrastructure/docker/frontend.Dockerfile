# Stage 1: Build the React Application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY src/main/web/package*.json ./
RUN npm install

COPY src/main/web/ ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.24-alpine

# Vite outputs its generated static site to /dist by default
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
