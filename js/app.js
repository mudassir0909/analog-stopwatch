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

  var stopwatch = new StopWatch({callback: 'animate'});
  var secondsDial = new Dial({
    cx: SECONDS_DIAL_X_COORDINATE,
    cy: SECONDS_DIAL_Y_COORDINATE,
    dialRadius: SECONDS_DIAL_RADIUS,
    dialThickness: 20,
    drawDialNumbers: true,
    equalTicks: false,
    context: context
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
  stopwatch.start();
}