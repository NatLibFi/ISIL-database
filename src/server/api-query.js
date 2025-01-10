/* jshint node: true */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGO_URI;
const _ = require('underscore');

function apiQuery(req, res) {

  const logEntry = { 
    "level": "info", 
    "message": "API query (" + JSON.stringify(req.query) + ")" 
  };

  MongoClient.connect(mongoUrl)
    .then(client => {
      let query = req.query;
      _.each(query, (value, key) => {
        query[key] = new RegExp(value, 'i');
      });
      const db = client.db('isil');
      return db.collection('log').insertMany([logEntry])
        .then(() => {
          console.log(logEntry);
          return db.collection('data').find(query).toArray();
        })
        .then(doc => {
          client.close();
          // Remove internal MongoDB ID's from JSON prior to sending it to user
          doc = _.map(doc, library => { delete library._id; return library; });
          const result = { 'data': doc };
          res.status(200).json(result);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

module.exports = apiQuery;
