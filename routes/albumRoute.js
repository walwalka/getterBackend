import express, { response } from 'express';
import { pool } from '../model/albumDatabase.js';

const router = express.Router();

router.get('/', (request, response) => {
    response.send('Hello World!')
  });

router.post('/albums', async (request, response) => {
    // Validate the incoming JSON data
    const { title, artist, price } = request.body;
    console.log(request.body);
    if (!title || !artist || !price) {
      return response.status(400).send('One of the title, or artist, or price is missing in the data');
    }
  
    try {
      // try to send data to the database
      const query = `
        INSERT INTO albums (title, artist, price)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
      const values = [title, artist, price];
  
      const result = await pool.query(query, values);
      response.status(200).send({ message: 'New Album created', albumId: result.rows[0].id });
    } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
    }
  });

  router.get('/albums', async (request, response) => {
    try {
      const query = 'SELECT * FROM albums;';
      const allAlbums = await pool.query(query);
      response.status(200).json(allAlbums.rows);
      } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
      }
  });

  router.get('/albums/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const albumById = 'SELECT * FROM albums WHERE id = $1;';
      const { rows } = await pool.query(albumById, [id]);
  
      if (rows.length === 0) {
        return response.status(404).send('this album is not in the database');
      }
  
      response.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).send('some error has occured');
    }
  });

  router.put('/albums/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const { title, artist, price } = request.body;
  
      if (!title && !artist && !price) {
        return response.status(400).send('provide a field (title, artist, or price)');
      }
  
      const query = `
        UPDATE albums
        SET title = COALESCE($1, title),
            artist = COALESCE($2, artist),
            price = COALESCE($3, price)
        WHERE id = $4
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [title, artist, price, id]);
  
      if (rows.length === 0) {
        return response.status(404).send('Cannot find anything');
      }
  
      response.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).send('Some error has occured failed');
    }
  });

  router.delete('/albums/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const query = 'DELETE FROM albums WHERE id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);
  
      if (rows.length === 0) {
        return response.status(404).send('we have not found the album');
      }
  
      response.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      response.status(500).send('some error has occured');
    }
  });

  export default router;