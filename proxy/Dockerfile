FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY proxy ./proxy

EXPOSE 3005

CMD ["node", "proxy/proxy.js"] 