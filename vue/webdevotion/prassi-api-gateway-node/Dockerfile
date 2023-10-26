FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 3001
CMD [ "yarn", "start" ]
