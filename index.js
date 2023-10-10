import express from 'express';
import { PORT } from './config.js';
import poolRoute from './routes/weatherRoute.js'
import cors from 'cors';

const app = express()

app.use(express.json());

// middleware for handling CORS policy
app.use(cors());

// Default route for app
app.use('/', poolRoute);

// weather api endpoint
app.use('/weather', poolRoute);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  });