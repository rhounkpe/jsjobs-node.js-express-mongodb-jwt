'use strict';

module.exports = (function () {
  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    return date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  };

  Date.prototype.subtractDays = function(days) {
    const date = new Date(this.valueOf());
    return date.setTime(date.getTime() - (days * 24 * 60 * 60 * 1000));
  };

  Date.prototype.addMinutes = function(minutes) {
    const date = new Date(this.valueOf());
    return new Date(date.setTime(date.getTime() + (minutes * 60 * 1000)));
  };

  Date.prototype.subtractMinutes = function(minutes) {
    const date = new Date(this.valueOf());
    return new Date(date.setTime(date.getTime() - (minutes * 60 * 1000)))
  };
})();
