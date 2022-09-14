FROM node:alpine

WORKDIR /usr/app

RUN npm i --global pm2

COPY ./package*.json ./

RUN npm i --production

COPY ./ ./

RUN npm run build

EXPOSE 3000

USER node

# CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "npm", "--", "start" ]
