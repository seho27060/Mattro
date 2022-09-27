FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm i

COPY ./ ./

EXPOSE 8000

USER node

CMD [ "npm", "run", "dev" ]
