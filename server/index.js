require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./router.js');
const controllers = require('./controllers.js');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(router);

// Loader.io Verification Token Send
app.get('/loaderio-d78c76fc4bc7ab2d723161c2df1f8f2b/', (req, res) => {
  console.log('loader token sending');
  res.send('loaderio-d78c76fc4bc7ab2d723161c2df1f8f2b');
})

app.listen(process.env.PORT, () => {
  console.log(`Listening to PORT ${process.env.PORT}`);
})