/* jshint node: true */

'use strict';

const _ = require('underscore');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGO_URI;

function performQuery(req, callback) {

  const logEntry = { 
    "level": "info", 
    "message": "Normal query (" + req.body.select + ", " + req.body.query + ")" 
  };

  MongoClient.connect(mongoUrl)
    .then(client => {
      const db = client.db('isil');
      let query = {};
      if (req.body.select === 'Haku organisaatioista') {
        query = { 'name': new RegExp(req.body.query, 'i') };
      } else if (req.body.select === 'Haku tunnuksella') {
        const queryRegex = new RegExp(req.body.query, 'i');
        query = { $or: [
          {'isil': queryRegex},
          {'linda': queryRegex}
          ]};
      } else if (req.body.select === 'Haku paikkakunnalla') {
        query = { 'cities': new RegExp(req.body.query, 'i')};
      }
      return db.collection('log').insertMany([logEntry])
        .then(() => db.collection('data').find(query).toArray())
        .then(doc => {
          client.close();

          // Only show entries where the 'active' property is true
          // Parse the cities-array to a string
          doc = _.chain(doc)
                 .filter(entry => entry.active === true)
                 .map(entry => {
                   return _.mapObject(entry, field => {
                     return _.isArray(field) ? field.join(", ") : field;
                   });
                 })
                 .value();

          callback(doc);
        });
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}

module.exports = performQuery;
