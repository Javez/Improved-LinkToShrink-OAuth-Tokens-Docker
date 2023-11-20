FROM node:18.16.0
WORKDIR /backend
ENV NODE_ENV=production
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install

## this is stage two , where the app actually runs
FROM node:18.16.0
WORKDIR /backend
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --only=production
COPY dist ./
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime","server.js"]