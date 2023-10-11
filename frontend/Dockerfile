FROM node:18.16.0

WORKDIR /frontend

ADD package.json /tmp

RUN cd /tmp && npm install

RUN mv /tmp/node_modules /frontend

ENV NODE_ENV=development

COPY . /frontend

EXPOSE 3000

CMD ["npm", "run", "start"]
