FROM node

EXPOSE 4000

WORKDIR /usr/src/app

COPY . .
RUN npm install -g nodemon
RUN npm install

ENTRYPOINT ["npm", "start"]