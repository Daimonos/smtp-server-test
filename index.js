/**
 * Simple SMTP intercept for testing purposes
 * Require the SMTP server and listen on port 25
 * 
 */
const smtp = require('./server');
const app = require('./app');
smtp.listen(25);
app.listen(8080);