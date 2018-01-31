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
    res.render('mail', {mail:mail})
  });
});
module.exports = app;
