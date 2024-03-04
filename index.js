const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 3000;


app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

app.get('/health', (req, res) => {
  res.send('Hello World! service is okay.... Cool!!');
});

app.listen(port, () => {
  console.log(`server is running on PORT` + " " + port);
});
app.use(cors());
app.use(function (err, req, res, next) {

  //logger.error(err);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(err.status || 500);
  res.send('Invalid API Request ');
});

// router initialize 
const indexRouter = require("./src/router/receiptRouter")
app.use('/api',indexRouter);