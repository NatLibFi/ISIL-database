/* jshint node: true */

'use strict';

process.chdir(__dirname);

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const _ = require('underscore');
const winston = require('winston');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/isil';

const logger = new (winston.Logger) ({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logfile.log' })
  ]
});

const app = express();

// App configuration

const hbs = exphbs.create({
  helpers: {
    section: (name, options) => {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('port', 3000);
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(session({ secret: 'no heippa' }));

app.use(passport.initialize());
app.use(passport.session());

// Middleware for handling the queries submitted using the POST method
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

function performQuery(req, callback) {
  MongoClient.connect(mongoUrl, (err, db) => {
      if (err) throw err;
      let query = {};
      if (req.body.select === 'Haku organisaatioista') {
        query = { 'name': new RegExp(req.body.query, 'i')};
      } else if (req.body.select === 'Haku tunnuksella') {
        const queryRegex = new RegExp(req.body.query, 'i');
        query = { $or: [
          {'isil': queryRegex},
          {'linda': queryRegex}
          ]};
      } else if (req.body.select === 'Haku paikkakunnalla') {
        query = { 'cities': new RegExp(req.body.query, 'i')};
      }
      db.collection('data').find(query).toArray( (err, doc) => {
        console.log(doc);

        // Parse the cities-array to a string

        doc.forEach(d => {
          d.cities = d.cities.join(', ');
        });
        db.close();
        logger.log('info', 'Normal query (%s: %s)', req.body.select, req.body.query);
        callback(doc);
    });
  });
}

// Process the query

app.post('/process', (req, res) => {
  performQuery(req, function(doc) {
      if (doc.length === 0) {
        res.render('empty', { body: 'Ei hakutuloksia' });
      } else {
        res.render('results', { results: doc });
      }
  });
});

app.post('/en/process', (req, res) => {
  performQuery(req, function(doc) {
      if (doc.length === 0) {
        res.render('empty', { layout: 'en_main', body: 'Nothing was found' });
      } else {
        res.render('en_results', { layout: 'en_main', results: doc });
      }
  });
});


// Root

app.get('/', (req, res) => {
  res.render('home');
});

// Main page in en_main

app.get('/en/', (req, res) => {
  res.render('en_home', { layout: 'en_main' });
});

// Admin page

app.get('/admin/', (req, res) => {
  res.render('admin', { layout: 'admin' });
});

// REST api

app.get('/api/query?', (req, res) => {
  logger.log('info', 'API query (%s)', JSON.stringify(req.query));
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    let query = req.query;
    _.each(query, (value, key) => {
      query[key] = new RegExp(value, 'i');
    });
    db.collection('data').find(query).toArray( (err, doc) => {
      console.log(doc);
      db.close();
      // Remove internal MongoDB ID's from JSON prior to sending it to user
      doc = _.map(doc, library => { delete library._id; return library; });
      const result = {'data' : doc};
      res.status(200);
      res.json(result);
    });
  });
});

// Api page

app.get('/api/', (req, res) => {
  res.render('api');
});

// Api page in en_main

app.get('/en/api/', (req, res) => {
  res.render('en_api', { layout: 'en_main' });
});

// Fallback route

app.get('*', (req, res) => {
  res.status(302);
  res.redirect('/');
});

// 404

app.use( (req, res) => {
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use( (err, req, res) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
