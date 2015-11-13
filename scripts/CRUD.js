/* jshint node: true */

/* A simple command-line program for doing CRUD (create, read, update, delete) operations on the database. */

'use strict';

var readline = require('readline');
var saveToDB = require('./lib/saveToDB.js').save;
var inputIsil = require('./lib/inputIsil.js').enter;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mainMenu();

function mainMenu() {
  console.log('1) Input new ISIL\n2) Show ISIL\n3) Update an ISIL-code\n4) Delete an ISIL\n5) Quit');
  rl.question('Enter a choice: ', function (choice) {
    choice = Number(choice);
    if (choice === 1) { saveISIL(); }
    //else if (choice === 2) { readIsil(); }
    else if (choice === 5) { console.log('See ya.\n'); process.exit(); }
  });
}

function saveISIL() {
  inputIsil(rl, function (library) {
    console.log('The record you entered:\n' + JSON.stringify(library));
    rl.question('Save to database (y/n)? ', function (input) {
      if (input.toLowerCase().trim() === 'y') {
        saveToDB(library, mainMenu);
      } else {
        mainMenu();
      }
    });
  });
}
