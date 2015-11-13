/* jshint node: true */

/* A script for importing data from the old spreadsheet to MongoDB. Database name is 'isil', the collection is 'data'.
   Usage: 1) Save the spreadsheet into a CSV file with semicolon (';') as the separator. Remove the heading row.
   2) Run the script: node CSVToMongo.js file */

'use strict';

var fs = require('fs');
var _ = require('underscore');
var saveToDB = require('./lib/saveToDB.js');
var constructor = require('./lib/libraryConstructor.js');
var file = process.argv[2];

if (!file) {
  console.log('Usage: node CSVToMongo.js file');
  process.exit();
}

fs.readFile(file, 'utf-8', function (err, data) {
  if (err) throw err;
  else {
    var totalData = [];
    var list = data.split('\n');
    list.forEach(function (item) {
      var items = item.split(';');
      if (items.length > 1) {
        var cities = [];
        if (items.length >= 5) {
          cities = items[4].split(',');
          cities = _.map(cities, function (city) { return city.trim(); });
        }
        var library = constructor.create(items[3], items[2], items[0], cities, items[5]);
        if (library.name !== '') {
          totalData.push(library);
        }
      }
    });
    saveToDB(totalData);
  }
});