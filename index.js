/**
 * Simple SMTP intercept for testing purposes
 * Require the SMTP server and listen on port 25
 * 
 */
const smtp = require('./server');
smtp.listen(25);
