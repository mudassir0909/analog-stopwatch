window.onload = function(){
  var canvas = document.getElementById("analog-stopwatch");
  var context = canvas.getContext('2d');
  var SECONDS_DIAL_X_COORDINATE = canvas.width/2;
  var SECONDS_DIAL_Y_COORDINATE = canvas.height/2;
  var SECONDS_DIAL_RADIUS = 250;
  var MINUTES_DIAL_X_COORDINATE = SECONDS_DIAL_X_COORDINATE;
  var MINUTES_DIAL_Y_COORDINATE = 200;
  var MINUTES_DIAL_RADIUS = 70;

  var clearCanvas = function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.stopwatch = new StopWatch({callback: 'animate'});
  var secondsDial = new Dial({
    cx: SECONDS_DIAL_X_COORDINATE,
    cy: SECONDS_DIAL_Y_COORDINATE,
    dialRadius: SECONDS_DIAL_RADIUS,
    dialThickness: 20,
    drawDialNumbers: true,
    equalTicks: false,
    context: context,
    innerFill: true,
    customStyling: function(ctx){
      var cx = SECONDS_DIAL_X_COORDINATE, cy = SECONDS_DIAL_Y_COORDINATE, radius = SECONDS_DIAL_RADIUS;
      ctx.arc(cx, cy, radius + 40, 0, 2*Math.PI, true);
      var radialGradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius + 40);
      radialGradient.addColorStop(0, "#333333");
      radialGradient.addColorStop(0.5, "white");
      radialGradient.addColorStop(1, "#333333");
      ctx.fillStyle = radialGradient;
      ctx.fill();
      ctx.closePath();
    }
  });
  var minutesDial = new Dial({
    cx: MINUTES_DIAL_X_COORDINATE,
    cy: MINUTES_DIAL_Y_COORDINATE,
    dialRadius: MINUTES_DIAL_RADIUS,
    dialThickness: 2,
    drawDialNumbers: false,
    equalTicks: true,
    context: context
  })

  stopwatch.callbackArgument = stopwatch.netTime;

  window.animate = function (netTime){
    if(netTime % 1000 === 0){
      clearCanvas();
      secondsDial.redraw(stopwatch.seconds()*6);
      minutesDial.redraw(stopwatch.minutes()*6);
    }
  }

  secondsDial.redraw(0);
  minutesDial.redraw(0);

  //replace's an element's given class with a specified class
  var replaceClass = function(ele, class1, class2){
    if(ele.className.indexOf(class1) > 1){
      ele.className = ele.className.replace(class1, class2);
    }
  }

  var startStopButton = document.getElementById("start-stop");

  var startOrStopWatch = function(){
    if(!stopwatch.running()){
      replaceClass(startStopButton, 'start-button', 'stop-button');
      startStopButton.innerHTML = "Stop";
      stopwatch.start();
    }else{
      replaceClass(startStopButton, 'stop-button', 'start-button');
      startStopButton.innerHTML = "Start";
      stopwatch.stop();      
    }
  }

  if(!document.addEventListener){
    startStopButton.attachEvent("onclick", startOrStopWatch); //For IE8
  }else{
    startStopButton.addEventListener("click", startOrStopWatch);
  }
}