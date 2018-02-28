var app = require('express')();
var path = require('path');
var db = require('./db');
var _ = require('lodash');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res, next){
  console.log('Returning List');
  db.getDocuments(function(err, docs){
    let mail = _.map(docs.rows, d=>{d.doc.mail._id = d.doc._id; return d.doc.mail});
    res.render('index', {mail:mail});
  });
});

app.get('/:id', function(req, res, next){
  console.log('Returning a single mail item');
  db.getDocument(req.params.id, function(err, doc){
    let mail = doc?doc.mail:null;
    if(mail) mail._id = doc?doc._id:null;
    res.render('mail', {mail:mail})
  });
});

app.get('/:id/attachments/:index', function(req, res, next) {
  console.log('Returning attachment: '+req.params.attachment+' for mail: '+req.params.id);
  let index = parseInt(req.params.index);
  console.log('getting index: '+index);
  db.getDocument(req.params.id, function(err, doc){
    let mail = doc?doc.mail:null;
    let attachments = mail.attachments;
    let attachment = attachments[index];
    if(attachment){
      console.log('Got Attachment!');
      let buffer = Buffer.from(attachment.content, 'base64');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Content-Type', attachment.contentType);
      res.setHeader('Content-Disposition', 'attachment; filename='+attachment.filename);
      res.end(buffer);
    }
    else {
      console.log('no attachment');
      res.status(404).json({message:'Attachment : '+req.params.index+' could not be found!'});
    }
  })
});
module.exports = app;
