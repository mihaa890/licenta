FROM node:19.7.0-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 3001

CMD ["npm", "start"]
