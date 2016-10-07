/* jshint node: true */

'use strict';

process.chdir(__dirname);

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const _ = require('underscore');
const dbQuery = require('./src/server/db-query');
const apiQuery = require('./src/server/api-query');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const favicon = require('serve-favicon');

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
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({ secret: 'no heippa' }));

app.use(passport.initialize());
app.use(passport.session());

// Middleware for handling the queries submitted using the POST method
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Process the query

app.post('/process', (req, res) => {
  dbQuery(req, doc => {
      if (doc.length === 0) {
        res.render('empty', { body: 'Ei hakutuloksia' });
      } else {
        res.render('results', { results: doc });
      }
  });
});

app.post('/en/process', (req, res) => {
  dbQuery(req, doc => {
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
  res.render('home');
  //res.render('admin', { layout: 'admin' });
});

// REST api

app.get('/api/query?', (req, res) => {
  apiQuery(req, res);
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
