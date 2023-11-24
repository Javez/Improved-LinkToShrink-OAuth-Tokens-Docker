import express from 'express';
import router from './routes/app-routes';
import { SequelizeDB } from './db/sequelize.db';
import dotenv from 'dotenv';

dotenv.config();
const _frontend_port = process.env.FRONTEND_PORT;
const _frontend_host = process.env.FRONTEND_HOST;
const db = new SequelizeDB();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const upload = multer();
const app = express();

// TODO: Change origin to actual origin of frontend in time of production build

const corsOptions = {
  origin: `http://${_frontend_host}:${_frontend_port}`, // replace with your frontend's origin
  credentials: true,
  methods: ['GET', 'POST'], // replace with the methods your application uses
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(upload.none());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

db.openConnection().then(() => {
  const PORT = parseInt(process.env.APP_PORT || '8080');

  app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });
  db.createTables().then(() => {
    console.log('Model for db created');
  });
});
