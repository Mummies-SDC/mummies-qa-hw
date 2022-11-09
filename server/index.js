require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./router.js');
const controllers = require('./controllers.js');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`listening to PORT ${process.env.PORT}`);
})