app.factory('Clock', ['EventService','$interval','$timeout', function ClockFactory (EventService,$interval,$timeout) {
   var Clock = function (tps,reset) {
      var c = this;
      c.tps = parseInt(tps,10);
      if (!c.tps || c.tps < 1 || c.tps > 1000) {c.tps = 50}
      c.reset = parseInt(reset,10);
      if (!c.reset || c.reset < 1) {c.reset = 90000}
      c.tickInterval = Math.floor(1000 / c.tps);
      c.ticks = 0;
      c.seconds = 0;
      c.minutes = 0;
      c.hours = 0;
      c.ticking = false;
      c.interval = {};
      c.tocks = {};

      c.increment = function() {
         c.ticks = c.ticks >= c.reset ? 0 : ++c.ticks;
         if (c.ticks % c.tps == 0){c.secondMark()}
         angular.forEach(c.tocks, function(t,n) {
            if (c.ticks % t == 0){EventService.broadcast(n,{time:c.ticks,seconds:c.seconds,minutes:c.minutes,hours:c.hours})}
         });
      }
      c.secondMark = function () {
         c.seconds >= 60 ? c.minuteMark() : ++c.seconds;
      }
      c.minuteMark = function () {
         c.minutes >= 60 ? c.hourMark() : ++c.minutes;
         c.seconds = 0;
      }
      c.hourMark = function() {
         c.hours++;
         c.minutes = 0;
      }
      c.waitFor = function (name,o) {
         if (o.isReady) {EventService.broadcast(name,o)}
         else {$timeout(function() {c.waitFor(name,o)},c.tickInterval)}
      }
      c.start = function () {
         if(!c.ticking) {
            c.ticking = true;
            c.interval = $interval(c.increment,c.tickInterval);
         }
      }
      c.stop = function () {
         $interval.cancel(c.interval);
         c.ticking = false;
      }
      c.attachTock = function (name,interval) {
         i = parseInt(interval,10);
         if (name && i) {
            c.tocks[name] = i;
         }
      }
      c.detachTock = function (name) {
         if (name && c.tocks[name]){delete c.tocks[name]}
      }
   };
   return Clock;
}]);
