import pg from 'pg'

const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: '10.3.100.223',
    database: 'getterdb',
    password: 'P0stGr3sAdmin',
    port: 5432,
  });

  async function createAlbumsTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS albums (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          artist VARCHAR(255) NOT NULL,
          price NUMERIC(10, 2)
        );
      `;
  
      await pool.query(query);
      console.log('Albums table created');
    } catch (err) {
      console.error(err);
      console.error('Albums table creation failed');
    }
  }
  
  createAlbumsTable();

