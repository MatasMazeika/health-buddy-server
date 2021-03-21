FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set unsafe-perm true
RUN npm ci
RUN npm install -g pm2
RUN npm install --global @babel/cli
RUN npm install --global @babel/core

COPY . ./

EXPOSE 3000
EXPOSE 9200

CMD npm run start
