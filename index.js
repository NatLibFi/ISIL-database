/* jshint node: true */

'use strict';

process.chdir(__dirname);

const express = require('express');
//import exphbs from 'express-handlebars';
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const _ = require('underscore');
const dbQuery = require('./src/server/db-query');
const apiQuery = require('./src/server/api-query');
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

app.engine('hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('port', process.env.HTTP_PORT);
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.enable('trust proxy', process.env.ENABLE_PROXY);

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

app.post('/sv/process', (req, res) => {
  dbQuery(req, doc => {
      if (doc.length === 0) {
        res.render('empty', { layout: 'sv_main', body: 'Inga sökresultat' });
      } else {
        res.render('sv_results', { layout: 'sv_main', results: doc });
      }
  });
});

// Root

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/en/', (req, res) => {
  res.render('en_home', { layout: 'en_main' });
});

app.get('/sv/', (req, res) => {
  res.render('sv_home', { layout: 'sv_main' });
});

app.get('/accessibility/', (req, res) => {
  res.render('accessibility', { layout: 'container' });
});

app.get('/en_accessibility/', (req, res) => {
  res.render('en_accessibility', { layout: 'container_en' });
});

app.get('/sv_accessibility/', (req, res) => {
  res.render('sv_accessibility', { layout: 'container_sv' });
});

// REST api

app.get('/api/query?', (req, res) => {
  apiQuery(req, res);
});

// Api page

app.get('/api/', (req, res) => {
  res.render('api');
});

app.get('/en/api/', (req, res) => {
  res.render('en_api', { layout: 'en_main' });
});

app.get('/sv/api/', (req, res) => {
  res.render('sv_api', { layout: 'sv_main' });
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
