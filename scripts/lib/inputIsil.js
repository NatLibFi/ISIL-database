/* jshint node: true */

module.exports = (function() {

  'use strict';

  function inputQuery(rl, callback) {

    var constructor = require('./libraryConstructor.js');
    rl.question('Enter the name of the organization: ', function (input) {
      var name = input;
      rl.question('Enter the ISIL: ', function (input) {
        var isil = input;
        rl.question('Enter the Linda-code (if any): ', function (input) {
          var linda = input;
          rl.question('Enter the cities (use comma (,) as the separator): ', function (input) {
            var cities = input.split(',');
            rl.question('If the organization has changed name, enter the old name: ', function (input) {
              var former = input;
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