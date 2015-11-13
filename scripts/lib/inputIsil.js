/* jshint node: true */

module.exports = (function() {

  'use strict';

  function inputQuery(rl, callback) {

    var constructor = require('./libraryConstructor.js');
    var name = '';
    var isil = '';
    var linda = '';
    var cities = [];
    var former = '';
    rl.question('Enter the name of the organization: ', function (input) {
      name = input;
      rl.question('Enter the ISIL: ', function (input) {
        isil = input;
        rl.question('Enter the Linda-code (if any): ', function (input) {
          linda = input;
          rl.question('Enter the cities (use comma (,) as the separator): ', function (input) {
            cities = input.split(',');
            rl.question('If the organization has changed name, enter the old name: ', function (input) {
              former = input;
              var library = constructor.create(name, isil, linda, cities, former);
              callback(library);
            });
          });
        });
      });
    });
  }

  return {
    enter: function (rl, callback) {
      inputQuery(rl, callback);
    }
  };
})();