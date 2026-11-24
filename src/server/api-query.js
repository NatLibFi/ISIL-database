/* jshint node: true */

'use strict';

const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGO_URI;
const _ = require('underscore');

async function apiQuery(req, res, next) {
  const client = new MongoClient(mongoUrl, {
  serverSelectionTimeoutMS: 500,
  connectTimeoutMS: 300
});

  try {
    await client.connect();

    const query = Object.fromEntries(
      Object.entries(req.query).map(([key, value]) => [
        key,
        new RegExp(String(value), 'i')
      ])
    );

    const logEntry = {
      level: 'info',
      message: `API query (${JSON.stringify(req.query)})`
    };

    const db = client.db('isil');
    await db.collection('log').insertMany([logEntry]);
    // Remove internal MongoDB ID's from JSON prior to sending it to user
    const docs = await db.collection('data').find(query).toArray();
    const data = _.map(docs, doc => {
      delete doc._id;
      return doc;
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(500)
    next(err);
  } finally {
    await client.close();
  }
}

module.exports = apiQuery;
