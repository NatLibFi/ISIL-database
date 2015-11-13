/* jshint node: true */

module.exports = (function() {

  'use strict';

  var Library = function Library(name, isil, linda, cities, former) {
    this.name = name;
    this.isil = isil;
    this.linda = linda;
    this.cities = cities; 
    this.former = former;
  };

  return {
    create: function (name, isil, linda, cities, former) {
      return new Library(name, isil, linda, cities, former);
    }
  };
})();