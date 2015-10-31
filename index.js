"use strict";

const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var auth = require('./routes/auth');
var gists = require('./routes/gists');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ status: 200 });
});
app.use('/auth', auth);
app.use('/gists', gists);

app.listen(PORT, () => {
  console.log('API is now listening on: ', PORT);
});