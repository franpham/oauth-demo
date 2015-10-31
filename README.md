#
Demo using node-oauth

##
Step 1: demo .env file to set process.env values for node; MUST add .env to .gitignore to protect info;

Step 2: use oauth2 to get the provider's auth url;

Step 3: create the callback route that's called after authorization; provider returns access code as as query string;

Step 4: create route to post new object; Bearer Access Token is stored in the header as: Authorization : Bearer access_token

Step 5: create route to get object with id;
