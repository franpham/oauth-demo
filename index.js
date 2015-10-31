"use strict";

const PORT = process.env.PORT || 3000;
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var OAuth2 = require('oauth').OAuth2;
var oauth2 = new OAuth2(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  'https://github.com/',       // provider base url
  'login/oauth/authorize',      // provider's login path
  'login/oauth/access_token',   // provider's access_token path
  null                          // options
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ status: 200 });
});

// Step 1: demo .env file to set process.env values for node; MUST add .env to .gitignore to protect info;

// Step 2: use oauth2 to get the provider's auth url;
app.get('/auth/login', (req, res) => {
  var authURL = oauth2.getAuthorizeUrl({
    redirect_uri: 'http://localhost:3000/auth/github/callback',
    scope: ['gist'],
    state: 'Authorize' + Math.round(Math.random() * 9999999)
  });
  res.json({ url: authURL });    // state variable prevents cross-site forgery;
});

// Step 3: create the callback route that's called after authorization; provider returns access code as as query string;
app.get('/auth/github/callback', (req, res) => {
  var code = req.query.code;
  if (!code)
    return res.status(401).json({ error: 401, message: 'Invalid auth code.' });
  oauth2.getOAuthAccessToken(code,
    { redirect_uri: 'http://localhost:3000/auth/github/callback' },
    (err, access_token, refresh_token, results) => {
      if (err) {
        console.error(err);
        res.status(401).json(err);
      }
      else if (results.error) {
        console.error(results.error);
        res.status(401).json(results.error);
      }
      else {  // send token back to the client;
        res.json({ access_token: access_token });
      }
    });
});

// Step 4: create route to support desired API's; Bearer Access Token is stored in the header as: Authorization : Bearer access_token
app.post('/gists', getAuthBearerToken, (req, res) => {
  request.post({
    url: 'https://api.github.com/gists',
    json: true,
    headers: { Authorization: 'Bearer ' + req.access_token, 'User-Agent': 'oauth_demo-dev' },
    body: {
      description: req.body.description,
      public: true,
      files: JSON.parse(req.body.files)   // keys & values must both be double quoted;
    }},
    (err, response, body) => {
      if (err)
        return res.status(500).json(err);
      res.json(body);
    }
  );
});

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

app.listen(PORT, () => {
  console.log('API is now listening on: ', PORT);
});