/* jshint node: true */
'use strict';

var fs = require('fs');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/isil';

var file = process.argv[2];

var totalData = [];

var Library = function Library(name, isil, linda, cities, former) {
  this.name = name;
  this.isil = isil;
  this.linda = linda;
  this.cities = cities; 
  this.former = former;
};

if (!file) {
  console.log('Usage: node CSVToMongo.js file');
  process.exit();
} else {
  console.log('Input: ' + file);
}

fs.readFile(file, 'utf-8', function(err, data) {
  if (err) throw err;
  else {
    var list = data.split('\n');
    list.forEach(function(item) {
      var items = item.split(';');
      if (items.length > 1) {
        var cities = [];
        if (items.length >= 5) {
          cities = items[4].split(',');
          cities = _.map(cities, function (city) { return city.trim(); });
        }
        var library = new Library(items[3], items[2], items[0], cities, items[5]);
        if (library.name !== '') {
          totalData.push(library);
        }
      }
    });
    saveToDB(totalData);
  }
});

function printItems(data) {
  console.log(data);
}


function saveToDB(data) {
  // database: isil, collection: data
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    else {
      //console.log('Successfully connected to ' + mongoUrl + '.');
      db.collection('data').insert(data, function(err, doc) {
        console.log('Successfully inserted: ' + totalData.length + ' items.');
        db.close();
      });
    }
  });
}