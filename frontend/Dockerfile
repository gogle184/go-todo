FROM node:22.14.0-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install -g npm && npm install

RUN mkdir -p /certs
COPY /certs/* /certs/

COPY . .
