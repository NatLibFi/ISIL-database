/* jshint node: true */
'use strict';

var fs = require('fs');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/isil';

process.stdin.setEncoding('utf8');

printMenu();

process.stdin.on('readable', function () {
  var input = process.stdin.read();
  if (Number(input) === 1) {
    console.log('Syöttö');
  } else if (Number(input) === 2) {
    console.log('Näyttö');
  } else if (Number(input) === 3) {
    console.log('Muokkaus');
  } else if (Number(input) === 4) {
    console.log('C ya');
    process.exit();
  }
});

process.stdin.on('end', function () {
  process.stdout.write('Quitting.');
});

function printMenu() {
  console.log('Valitse toiminto:\n1) Syötä uusi ISIL\n2) Näytä ISIL\n3) Muokkaa ISIL-tunnusta\n4) Lopeta');
} 