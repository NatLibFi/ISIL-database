/* jshint node: true */

module.exports = (function() {

  'use strict';

  var MongoClient = require('mongodb').MongoClient;
  var mongoUrl = 'mongodb://localhost:27017/isil';

  function saveToDB(data, callback) {
    // database: isil, collection: data
    MongoClient.connect(mongoUrl, function (err, db) {
      if (err) throw err;
      else {
        db.collection('data').insert(data, function (err, doc) {
          if (err) throw err;
          console.log('Success.');
          console.log(JSON.stringify(doc) + '\n');
          db.close();
          callback();
        });
      }
    });
  }

  return {
    save: function (input, callback) {
      saveToDB(input, callback);
    }
  };
})();