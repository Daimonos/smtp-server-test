const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;

const nano = require('nano')('http://localhost:5984');
let db;
nano.db.destroy('smtp-test', function () {
  nano.db.create('smtp-test', function () {
    db = nano.use('smtp-test');
  });
});
let options = require('./config/smtp-config');
console.log(options);

let tmp = {};

const server = new SMTPServer(options)

server.listen(25);

server.onData = function (stream, session, callback) {
  console.log(session.id + ' :: DATA');
  simpleParser(stream)
  .then(mail=>{
    console.log(session.id);
    tmp[session.id].body = mail;
    callback();
  })
};

server.onConnect = function (session, callback) {
  console.log(session.id + " :: CONNECT")
  tmp[session.id] = {
    'mail_from': "",
    'rcpt_to': []
  };
  callback();
}

server.onMailFrom = function (address, session, callback) {
  console.log(session.id + ' :: MAIL FROM - ' + address.address)
  tmp[session.id]['mail_from'] = address.address;
  callback();
}

server.onRcptTo = function (address, session, callback) {
  console.log(session.id + ' :: RCPT TO - ' + address.address);
  tmp[session.id]['rcpt_to'].push(address.address)
  callback();
}

server.onClose = function (session) {
  let mail = tmp[session.id];
  delete mail.buffer;
  mail.session = session.id;
  db.insert(mail, function (err, body, header) {
    if (err) {
      console.error('ERROR INSERTING TO COUCHDB');
    }
  });
  delete tmp[session.id];
  console.log(session.id + ' :: CLOSED');

}