/* jshint node:true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/isil';

var app = express();

var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// Middleware for handling the queries submitted using the POST method

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post('/process', function(req, res) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('Select (from visible form field): ' + req.body.select);
  console.log('Query (from visible form field): ' + req.body.query);
  var selection = req.body.select;
  var query = req.body.query;

  MongoClient.connect('mongodb://localhost:27017/isil', function(err, db) {
    if (err) throw err;
    var query = { 'name': new RegExp(req.body.query, 'i')};
    console.log(query);
    db.collection('data').find(query).toArray(function(err, doc) {
      console.log(doc);
      db.close();
      res.render('results', { results: doc });
    });
  });

  //res.redirect(303, '/results');
});

// Root

app.get('/', function(req, res) {
  res.render('home');
});

// View results

app.get('/results', function(req, res) {
  res.render('results');
});

// Admin page

app.get('/admin', function(req, res) {
  res.render('admin');
});

// 404

app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});