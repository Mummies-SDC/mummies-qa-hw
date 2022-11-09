require('dotenv').config();
const client = require('postgres');

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
};

const dbconnection = client(config);
console.log('listening?');

module.exports = dbconnection;

// const connection = async() => {
//   try {
//     await client.connect();
//     console.log(`Connected to PGDB at ${process.env.PGPORT}`);
//     await client.end();
//   } catch (error) {
//     console.log(error);
//   }
// }

// connection();