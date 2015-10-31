"use strict";

const PORT = process.env.PORT || 3000;
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

app.get('/', (req, res) => {
  res.json({ status: 200 });
});

// Step 1: OAuth2: get the provider's auth url;
app.get('/auth/login', (req, res) => {
  var authURL = oauth2.getAuthorizeUrl({
    redirect_uri: 'http://localhost:3000/auth/github/callback',
    scope: ['gist'],
    state: 'Authorize' + Math.round(Math.random() * 9999999)
  });
  res.json({ url: authURL });    // state variable prevents cross-site forgery;
});

app.listen(PORT, () => {
  console.log('API is now listening on: ', PORT);
});