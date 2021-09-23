FROM mongo:4.2.16-rc0-bionic

WORKDIR /usr/src/app

COPY . .

RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_14.x| bash -
RUN apt-get install nodejs  -y
RUN npm install -g nodemon
RUN npm install

RUN touch commands.sh
RUN chmod 777 commands.sh
RUN echo "#!/bin/sh" >> commands.sh
RUN echo "mongod &" >> commands.sh
RUN echo "node index.js" >> commands.sh

ENTRYPOINT ["./commands.sh"]