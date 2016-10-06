/* jshint node: true */

'use strict';

const _ = require('underscore');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/isil';

function performQuery(req, callback) {
  const logEntry = { 
    "level": "info", 
    "message": "Normal query (" + req.body.select + ", " + req.body.query + ")" };
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

      db.collection('log').insert(logEntry, (err, doc) => {
        console.log(logEntry);
        db.collection('data').find(query).toArray( (err, doc) => {

          // Only show entries where the 'active' property is true
          // Parse the cities-array to a string

          doc = _.chain(doc)
                 .filter(entry => { return entry.active === true; })
                 .map(entry => { entry.cities = entry.cities.join(', '); return entry; })
                 .value();

          db.close();
          callback(doc);
        });
      });
  });
}

module.exports = performQuery;
