FROM node:16

EXPOSE 80

WORKDIR /usr/src/app

COPY . .
RUN npm install

ENTRYPOINT ["npm", "start"]
