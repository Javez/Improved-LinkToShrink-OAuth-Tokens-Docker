import express from 'express';
import router from './routes/app-routes';
import { SequelizeDB } from './db/sequelizeDb';
import dotenv from 'dotenv';

const db = new SequelizeDB();
dotenv.config();

var path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
