#
Demo using node-oauth

##
Step 1: demo .env file to set process.env values for node; MUST add .env to .gitignore to protect info;

Step 2: use oauth2 to get the provider's auth url;

Step 3: create the callback route that's called after authorization; provider returns access code as as query string;
Manually: you must paste the url returned from step 2 into a new browser tab to authorize use by the new client;

Step 4: create route to post new object; Bearer Access Token is stored in the header as: Authorization : Bearer access_token

Step 5: create route to get object with id; get the id from the json of the new object and add it to the GET route;

Step 6: at the Terminal: env $(cat .env | xargs) nodemon index.js
"| xargs" pipes all lines in .env into 1 line to pass to nodemon;
