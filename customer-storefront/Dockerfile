# Build stage — compile static assets with Node.js
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ARG REACT_APP_API_GATEWAY_URL=http://localhost:8080
ENV REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL

RUN npm run build

# Serve stage — lightweight Nginx on Alpine
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
