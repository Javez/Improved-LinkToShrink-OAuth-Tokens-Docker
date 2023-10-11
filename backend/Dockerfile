FROM node:18.16.0

WORKDIR /backend

ADD package.json /tmp

RUN cd /tmp && npm install

RUN mv /tmp/node_modules /backend

ENV NODE_ENV=development

COPY . /backend

EXPOSE 8080

CMD ["npm", "run", "start"]
