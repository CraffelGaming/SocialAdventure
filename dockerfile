FROM node:19-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --production

COPY . .
EXPOSE 80

CMD [ "node", "bot.js" ]