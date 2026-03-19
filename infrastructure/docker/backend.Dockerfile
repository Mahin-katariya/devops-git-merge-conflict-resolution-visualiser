FROM node:18-alpine

WORKDIR /usr/src/app

COPY src/main/api/package*.json ./
RUN npm install

COPY src/main/api/ ./

EXPOSE 3001
CMD ["node", "index.js"]
