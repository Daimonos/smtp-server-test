# smtp-server-test
A simple server to intercept SMTP messages in a test environment.

## Requirements
* Node.js
* CouchDB

## Installation
* Ensure you have Node.js installed
* Ensure you have CouchDB installed
* Clone this repo
* run: `npm install`

## Configuration
* Config files located at `config/`

### DB Configuration
* Can set up host and database name in `config/db.js`

### SMTP Configuration
* Can set all requirements for smtp-server in `config/smtp-config`

## Useful Links
* CouchDB: http://couchdb.apache.org/
* NodeJS: https://nodejs.org
* Nodemailer SMTP Server: https://github.com/nodemailer/smtp-server
* Nodemailer Mail Parser: https://github.com/nodemailer/mailparser

## Things to note
Assumes CouchDB is running in AdminParty mode as this isn't expected to contain serious data in a production environment. You probably shouldn't run this on a public facing CouchDB Server.

## Improvements
* Add some UI to act as a mailbox of sorts
* Add users & SMTP authentication so that you can have more than one project running on the same server
  * If this happens, make more improvements to the first point
* Maybe fix CouchDB Admin Party. Add in some authentication if it is defined in `config/db.js`
