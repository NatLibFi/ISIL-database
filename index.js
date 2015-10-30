/* jshint node: true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/isil';

var app = express();

var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function (name, options) {
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

// Process the query

app.post('/isil/process', function (req, res) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('Select (from visible form field): ' + req.body.select);
  console.log('Query (from visible form field): ' + req.body.query);
  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) throw err;
    var query = {};
    if (req.body.select === 'Haku organisaatioista') {
      query = { 'name': new RegExp(req.body.query, 'i')};
    } else if (req.body.select === 'Haku tunnuksella') {
      var queryRegex = new RegExp(req.body.query, 'i');
      query = { $or: [
        {'isil': queryRegex},
        {'linda': queryRegex}
        ]};
    } else if (req.body.select === 'Haku paikkakunnalla') {
      query = { 'cities': new RegExp(req.body.query, 'i')};
    }
    db.collection('data').find(query).toArray(function (err, doc) {
      console.log(doc);

      // Parse the cities-array to a string

      doc.forEach(function (d) {
        d.cities = d.cities.join(', ');
      });

      db.close();

      if (doc.length === 0) {
        res.render('empty');
      } else {
        res.render('results', { results: doc });
      }
    });
  });
});

// Root

app.get('/isil/', function (req, res) {
  res.render('home');
});

// Admin page

app.get('/isil/admin/', function (req, res) {
  res.render('admin');
});

// REST api

app.get('/isil/api/query?', function (req, res) {
  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) throw err;
    var query = req.query;
    _.each(query, function(value, key) {
      query[key] = new RegExp(value, 'i');
    });
    db.collection('data').find(query).toArray(function (err, doc) {
      console.log(doc);
      db.close();
      // Remove internal MongoDB ID's from JSON prior to sending it to user
      doc = _.map(doc, function (library) { delete library._id; return library; });
      var result = {'data' : doc}
      res.status(200);
      res.json(result);
    });
  });
});

app.get('/isil/api', function (req, res) {
  res.render('api');
});

// 404

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});