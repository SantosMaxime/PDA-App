#syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app

COPY ./web_client/ .

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000