(function(){
  /*
    polyfills for IE8
  */
  if(!Array.prototype.forEach){
    Array.prototype.forEach = function(callback){
      for(var i=0; i<this.length; i++){
        callback(this[i]);
      }      
    }
  }

  if(!Array.prototype.map){
    Array.prototype.map = function(callback){
      var items = [];
      for(var i=0; i<this.length; i++){
        items.push(callback(this[i]));
      }
      return items;
    }
  }

  var secondInMilliseconds = 1000;
  var minuteInMilliseconds = 60*secondInMilliseconds;
  var hourInMilliseconds = 60*minuteInMilliseconds;
  var floor = Math.floor;

  var extractMilliseconds = function(timeInMilliseconds){
    return timeInMilliseconds % 1000;
  }
  var extractSeconds = function(timeInMilliseconds){
    return floor(timeInMilliseconds/secondInMilliseconds);
  }
  var extractMinutes = function(timeInMilliseconds){
    return floor(timeInMilliseconds/minuteInMilliseconds);
  }
  var extractHours = function(timeInMilliseconds){
    return floor(timeInMilliseconds/hourInMilliseconds);
  }
  var pad = function(number){
    if(number < 10){
      return "0"+number;
    }else{
      return number;
    }
  }
  var extractTime = function(timeInMilliseconds){
    var hours = extractHours(timeInMilliseconds);
    timeInMilliseconds -= hours*hourInMilliseconds;
    var minutes = extractMinutes(timeInMilliseconds);
    timeInMilliseconds -= minutes*minuteInMilliseconds;
    var seconds = extractSeconds(timeInMilliseconds);
    timeInMilliseconds -= seconds*secondInMilliseconds;
    var milliseconds = timeInMilliseconds;
    return {hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds};
  }

  // Lap object which gives the time elapsed between two given laps
  var Lap = function(netTime, previousLap){
    this.previousLap = previousLap;
    this.netTime = netTime; //netTime is in milliseconds
  };

  Lap.prototype = {
    militaryTime: function(timeInMilliseconds){     
      var timeSeparator = ":";
      var time = extractTime(timeInMilliseconds);
      time.milliseconds = time.milliseconds/10;
      return ['hours', 'minutes', 'seconds', 'milliseconds'].map(function(property){
        return pad(time[property]);
      }).join(timeSeparator);
    },
    splitString: function(){
      if(this.previousLap != null){
        var timeDifference = this.netTime - this.previousLap.netTime;
        return this.militaryTime(timeDifference);
      }else{
        return this.militaryTime(this.netTime);
      }
    }
  }

  var StopWatch = window.StopWatch = function(options){
    if(options == null){
      options = {}
    }
    
    var _this = this;
    var callbackProperties = ['callback', 'callbackTarget', 'lapCallback', 'lapCallbackTarget'];
    var netTime = hours = minutes = seconds = milliseconds = 0;
    var running = false;
    var laps = [];
    
    // Initializing callbacks & its targets
    callbackProperties.forEach(function(property){
      if(options[property] != null){
        _this[property] = options[property];
      }
    });

    // getter methods
    this.running = function(){
      return running;
    };
    this.hours = function(){
      return hours;
    };
    this.minutes = function(){
      return minutes;
    };
    this.seconds = function(){
      return seconds;
    };
    this.milliseconds = function(){
      return milliseconds;
    };
    this.netTime = function(){
      return netTime;
    };

    /*
      returns military time
    */
    this.militaryTime = function(){
      return [pad(hours), pad(minutes), pad(seconds), pad(milliseconds/10)].join(":");
    };

    /*
      Set your own callbackArgument method whose result will be passed as argument to the callback that
      gets triggered during timeDidChange() observer, default value returned is military time string.
      If you use this stop watch for a canvas rendered UI you might need different value to be returned
      hence you can modify callbackArgument accordingly
    */
    this.callbackArgument = this.militaryTime;

    /*
      An Observer that gets fired every 10 milliseconds, useful to update the timer shown on the UI
      Usage:
      var myObject = {
        displayTime: function(militaryTime){
          var watch = document.getElementById("watch");
          watch.innerHTML = militaryTime;
          // Or update your canvas element if you want to
        }
      }
      var stopwatch = new StopWatch({callback: "alertTime", callbackTarget: myObject});
      callbackTarget if not provided defaults to window object.
      stopwatch.start(); //the div gets updated every millisecond with current time
    */
    var timeDidChange = function(){
      var callback = _this.callback
      if(callback != null){
        var callbackTarget = _this.callbackTarget || window;
        if(typeof callback === 'string'){
          callback = callbackTarget[callback];
        }
        if(typeof callback === 'function'){
          callback.call(callbackTarget, _this.callbackArgument.call(_this));
        }
      }
    };

    /*
      An Observer that gets fired for every lap addition, useful to display all the laps as being added on UI
      Usage:
      var myObject = {
        updateLaps: function(militaryTime){
          var table = document.getElementById("lap-table");
          table.addRow(militaryTime);
        }
      }
      var stopwatch = new StopWatch({lapCallback: 'updateLaps', lapCallbackTarget: myObject})
      stopwatch.start();
      stopwatch.addLap(); //add a row to the table
    */
    var lapDidChange = function(lap, isReset){
      if(_this.lapCallback != null){
        var lapCallbackTarget = _this.lapCallbackTarget || window;
        var lapCallback = _this.lapCallback;
        if(typeof lapCallback === "string"){
          lapCallback = lapCallbackTarget[lapCallback];
        }
        if(typeof lapCallback === 'function'){
          lapCallback.call(lapCallbackTarget, (lap && lap.splitString()), isReset);
        }
      }
    };

    /*
      Useful to initialize time for a given time in milliseconds also invokes timeDidChange()
    */
    var initializeTimer = function(timeInMilliseconds){
      var time = extractTime(timeInMilliseconds);
      hours = time.hours;
      minutes = time.minutes;
      seconds = time.seconds;
      milliseconds = time.milliseconds;
      netTime = timeInMilliseconds;
      timeDidChange();
      return _this;
    };

    /*
      Method which updates milliseconds, seconds, minutes, hours by one ten milliseconds
      invokes timeDidChange()
    */
    var incrementByTenMilliseconds = function(){
      if(milliseconds === 990){
        milliseconds = 0;
        if(seconds === 59){
          seconds = 0;
          if(minutes === 59){
            minutes = 0;
            hours += 1;
          }else{
            minutes += 1;
          }
        }else{
          seconds += 1;
        }
      }else{
        milliseconds += 10;
      }
      netTime += 10;
      timeDidChange();
      return _this;
    };

    /*
      Kick starts the stopwatch
    */
    this.start = function(){
      running = true;
      this.interval = setInterval(function(){
        incrementByTenMilliseconds();
      }, 10);
    };

    /*
      Halts/Pauses the stopwatch
    */
    this.stop = function(){
      if(this.interval != null){
        clearInterval(this.interval);
      }
      running = false;
    };


    /*
      Captures a lap
    */
    this.addLap = function(){
      var previousLap = laps[laps.length - 1];
      var currentLap = new Lap(netTime, previousLap);
      laps.push(currentLap);
      lapDidChange(currentLap, false);
    }

    /*
      Resets all laps, invokes lapDidChange
    */
    this.resetLaps = function(){
      laps = [];
      lapDidChange(null, true)
    }

    /*
      resets the stopwatch
    */
    this.reset = function(){
      this.stop();
      this.resetLaps();
      initializeTimer(0);
    };

    /* 
      Initializing netTime if provided via options
    */
    if(options.netTime != null){
      netTime = options.netTime;
      initializeTimer(netTime);
    }
  };
})()