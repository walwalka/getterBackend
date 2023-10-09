import express from 'express';
import { PORT } from './config.js';
// import { Pool } from './model/albumModel.js';
import poolRoute from './routes/albumRoute.js'


const app = express()

app.use(express.json());

app.use('/', poolRoute);

app.use('/albums', poolRoute);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  });