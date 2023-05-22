FROM node:19.7.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .
EXPOSE 3000
CMD ["npm","start"]