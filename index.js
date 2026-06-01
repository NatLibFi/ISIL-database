/* jshint node: true */

'use strict';

process.chdir(__dirname);

const express = require('express');
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

app.engine('hbs', exphbs.engine({defaultLayout: 'fi_main', extname: '.hbs'}));
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

app.post('/:language/process', (req, res, next) => {
  const language = req.params.language
  const texts = {
    'fi': 'Ei hakutuloksia',
    'sv': 'Inga sökresultat',
    'en': 'Nothing was found'
  }
  dbQuery(req, doc => {
    if (!doc) {
      const err = new Error("Unsupported Media Type");
      err.status = 415;
      return next(err);
    } else if (doc.length === 0) {
      res.render('empty', { layout: language + '_main' , body: texts[language] });
    } else {
      res.render(language + '_results', { layout: language + '_main' , results: doc });
    }
  });
});

// Root

app.get('/index/:language/', (req, res) => {
  const language = req.params.language
  res.render(language + '_home', { layout: language + '_main' });
});

app.get('/accessibility/:language/', (req, res) => {
  const language = req.params.language
  res.render(language + '_accessibility', { layout: 'container_' + language });
});

// REST api

app.get('/api/query', (req, res) => {
  apiQuery(req, res);
});

// Api page

app.get('/api/:language/', (req, res) => {
  const language = req.params.language
  res.render(language + '_api', { layout: language + '_main' });
});

app.get('/', (req, res) => {
  res.status(302);
  res.redirect('/index/fi');
});

app.use('/', (req, res) => {
  res.status(404);
  res.render('404');
});

app.use( (err, req, res, next) => {
  res.status(415);
  res.render('415');
});

// 500 error handler (middleware)
app.use( (err, req, res) => {
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
