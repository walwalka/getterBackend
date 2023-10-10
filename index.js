import express from 'express';
import { PORT } from './config.js';
import poolRoute from './routes/weatherRoute.js'


const app = express()

app.use(express.json());

app.use('/', poolRoute);

app.use('/weather', poolRoute);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  });