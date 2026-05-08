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
      if (typeof req.body.query === 'string' || req.body.query === '') {
        const queryRegex = new RegExp(req.body.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        if (req.body.select === 'Haku organisaatioista') {
          query = { 'name': queryRegex };

        } else if (req.body.select === 'Haku tunnuksella') {
          query = { $or: [
            {'isil': queryRegex},
            {'linda': queryRegex}
            ]};
        } else if (req.body.select === 'Haku paikkakunnalla') {
          query = { 'cities': queryRegex};
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
        }
        client.close();
        callback()
      });
}

module.exports = performQuery;
