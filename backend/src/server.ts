import express from 'express';
import router from './routes/app-routes';
import db from './db/models/sequelizeDb';
var path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

db.openConnection().then(() => {
  const PORT: any = process.env.PORT ?? 3000;

  app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });
  db.createTable().then(() => {
    console.log('Model for db created');
  });
});
