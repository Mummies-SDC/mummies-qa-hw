require('dotenv').config();
const client = require('postgres');
const { Pool } = require('pg');

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
};

const dbconnection = new Pool(config);

// DB CONNECTION TEST
dbconnection.query(`SELECT * FROM questions LIMIT 1`)
  .then((result) => {
    console.log('Connected to PostgreSQL DB');
  })
  .catch((err) => {
    console.log('err');
  });

module.exports = dbconnection;
