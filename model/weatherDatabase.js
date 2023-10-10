import pg from 'pg'

const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: '10.3.100.223',
    database: 'getterdb',
    password: 'P0stGr3sAdmin',
    port: 5432,
  });

  async function createWeatherTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS weather (
          id SERIAL PRIMARY KEY,
          weatherdate date NOT NULL,
          conditions VARCHAR(255) NOT NULL,
          mintemp NUMERIC(10, 2) NOT NULL,
          maxtemp NUMERIC(10, 2) NOT NULL,
          precip NUMERIC(10, 2)
        );
      `;
  
      await pool.query(query);
      console.log('Weather table created');
    } catch (err) {
      console.error(err);
      console.error('Weather table creation failed');
    }
  }
  
  createWeatherTable();

