import express, { response } from 'express';
import { pool } from '../model/weatherDatabase.js';

const router = express.Router();

router.get('/', (request, response) => {
    response.send('Hello World!')
  });

router.post('/weather', async (request, response) => {
    // Validate the incoming JSON data
    const { weatherdate, conditions, mintemp, maxtemp, precip } = request.body;
    console.log(request.body);
    if (!weatherdate || !conditions || !mintemp || !maxtemp || !precip) {
      return response.status(400).send('One of the weatherDate, conditions, minTemp, maxTemp, precip data points is missing');
    }
  
    try {
      // try to send data to the database
      const query = `
        INSERT INTO weather (weatherdate, conditions, mintemp, maxtemp, precip)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const values = [weatherdate, conditions, mintemp, maxtemp, precip];
  
      const result = await pool.query(query, values);
      response.status(200).send({ message: 'New weather record created', weatherId: result.rows[0].id });
    } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
    }
  });

  router.get('/weather', async (request, response) => {
    try {
      const query = 'SELECT * FROM weather;';
      const allWeather = await pool.query(query);
      response.status(200).json(allWeather.rows);
      } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
      }
  });

  router.get('/weather/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const weatherById = 'SELECT * FROM weather WHERE id = $1;';
      const { rows } = await pool.query(weatherById, [id]);
  
      if (rows.length === 0) {
        return response.status(404).send('this date is not in the database');
      }
  
      response.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
    }
  });

  router.put('/weather/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const { weatherdate, conditions, mintemp, maxtemp, precip } = request.body;
  
      if (!weatherdate && !conditions && !mintemp && !maxtemp && !precip) {
        return response.status(400).send('provide a field (weatherdate, conditions, mintemp, maxtemp, precip)');
      }
  
      const query = `
        UPDATE weather
        SET weatherdate = COALESCE($1, weatherdate),
            conditions = COALESCE($2, conditions),
            mintemp = COALESCE($3, mintemp),
            maxtemp = COALESCE($4, maxtemp),
            precip = COALESCE($5, precip)
        WHERE id = $6
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [weatherdate, conditions, mintemp, maxtemp, precip, id]);
  
      if (rows.length === 0) {
        return response.status(404).send('Cannot find anything');
      }
  
      response.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).send('Some error has occured failed');
    }
  });

  router.delete('/weather/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const query = 'DELETE FROM weather WHERE id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);
  
      if (rows.length === 0) {
        return response.status(404).send('we have not found that date');
      }
  
      response.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
    }
  });

  export default router;