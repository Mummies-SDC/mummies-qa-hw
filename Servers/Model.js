const { Client } = require('pg')
const client = new Client()
await client.connect()

const res = await client.query(`CREATE TABLE IF NOT EXISTS questions (
  question_id integer PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  question_helpfulness integer NOT NULL DEFAULT(0),
  reported boolean DEFAULT 0,
)`)
await client.end()