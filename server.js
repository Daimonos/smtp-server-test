const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const db = require('./db');
let options = require('./config/smtp-config');
const server = new SMTPServer(options);

let tmp = {};

/**
 * Handle receipt of mail data
 * @param {*} stream Streamable Data function 
 * @param {*} session Session information
 * @param {*} callback 
 */
server.onData = function (stream, session, callback) {
  console.log(session.id + ' :: DATA');
  simpleParser(stream)
  .then(mail=>{
    console.log(session.id);
    tmp[session.id].mail = mail;
    callback();
  })
};

/**
 * Handle connection of a client. Create a tmp object to hold
 * all subsequent events to send to couchdb
 * @param {*} session 
 * @param {*} callback 
 */
server.onConnect = function (session, callback) {
  console.log(session.id + " :: CONNECT")
  tmp[session.id] = {
    session:session.id,
    'openedAt':new Date()
  };
  callback();
}

/**
 * Handle acknowledgement of mailFrom and save to tmp object
 * @param {*} address 
 * @param {*} session 
 * @param {*} callback 
 */
server.onMailFrom = function (address, session, callback) {
  console.log(session.id + ' :: MAIL FROM - ' + address.address)
  //tmp[session.id]['mail_from'] = address.address;
  callback();
}

/**
 * Handle acknowledgement of Rcpt To and save to tmp object
 * @param {*} address 
 * @param {*} session 
 * @param {*} callback 
 */
server.onRcptTo = function (address, session, callback) {
  console.log(session.id + ' :: RCPT TO - ' + address.address);
  //tmp[session.id]['rcpt_to'].push(address.address)
  callback();
}

/**
 * Handle close of connection.
 *   Save mail object to couchdb
 * @param {*} session 
 */
server.onClose = function (session) {
  let mail = tmp[session.id];
  delete mail.buffer;
  mail.closedAt = new Date();
  db.addDocument(mail);
  //remove the tmp object
  delete tmp[session.id];
  console.log(session.id + ' :: CLOSED');
}


module.exports = server;