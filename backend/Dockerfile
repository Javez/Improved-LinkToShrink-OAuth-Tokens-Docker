FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

COPY . /app

RUN npm install

ENV NODE_ENV=development

EXPOSE 8080

CMD ["npm", "run", "dev"]
