FROM node:22.14.0-alpine

ARG LOCAL_FRONTEND_PATH=./frontend
ARG CERT_NAME

WORKDIR /frontend

ENV NODE_ENV=development

COPY $LOCAL_FRONTEND_PATH/package*.json ./
RUN npm install -g npm && npm install

RUN mkdir -p /certs
COPY /certs/* /certs/

COPY $LOCAL_FRONTEND_PATH/. .
