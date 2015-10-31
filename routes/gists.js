"use strict";

var request = require('request');
var express = require('express');
var router = express.Router();
var OAuth2 = require('oauth').OAuth2;
var oauth2 = new OAuth2(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  'https://github.com/',       // provider base url
  'login/oauth/authorize',      // provider's login path
  'login/oauth/access_token',   // provider's access_token path
  null                          // options
);

// Step 4: create route to post new object; Bearer Access Token is stored in the header as: Authorization : Bearer access_token
router.post('/', getAuthBearerToken, (req, res) => {
  request.post({
    url: 'https://api.github.com/gists',
    json: true,
    headers: { Authorization: 'Bearer ' + req.access_token, 'User-Agent': 'oauth_demo-dev' },
    body: {
      description: req.body.description,
      public: true,
      files: JSON.parse(req.body.files)   // keys & values must both be double quoted;
    }
  },
  (err, response, body) => {
    if (err)
      return res.status(500).json(err);
    res.json(body);
  });
});

// Step 5: create route to get object with id; get the id from the json of the new object and add it to the GET route;
router.get('/:id', getAuthBearerToken, (req, res) => {
  request.get({
    url: 'https://api.github.com/gists/' + req.params.id,
    json: true,
    headers: { Authorization: 'Bearer ' + req.access_token, 'User-Agent': 'oauth_demo-dev' }
  },
  (err, response, body) => {
    if (err)
      return res.status(500).json(err);
    res.json(body);
  });
});

// Step 6: at the Terminal: env $(cat .env | xargs) nodemon index.js
// "| xargs" pipes all lines in .env into 1 line to pass to nodemon;

function getAuthBearerToken(req, res, next) {
  if (req.headers.hasOwnProperty('Authorization')) {
    return res.status(401).json({ error: 401, message: 'Bearer auth token not found' });
  }
  var auth_header = req.headers.authorization;
  var auth_header_value = auth_header.split(' ');
  if (auth_header_value.length != 2)
    return res.status(401).json({ error: 401, message: 'Authorization header is malformed' });
  req.access_token = auth_header_value[1];
  next();   // MUST ALWAYS CALL next();
}

module.exports = router;