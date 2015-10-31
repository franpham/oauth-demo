"use strict";

const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.json({ status: 200 });
});

app.get('/', (req, res) => {
  res.json({ status: 200 });
});

app.listen(PORT, () => {
  console.log('API is now listening on: ', PORT);
});