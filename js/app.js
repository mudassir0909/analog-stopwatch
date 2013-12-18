window.onload = function(){
  var canvas = document.getElementById("analog-stopwatch");
  var context = canvas.getContext('2d');
  var PI = Math.PI;
  var SECONDS_DIAL_X_COORDINATE = canvas.width/2;
  var SECONDS_DIAL_Y_COORDINATE = canvas.height/2;
  var SECONDS_DIAL_RADIUS = 250;
  var MINUTES_DIAL_X_COORDINATE = SECONDS_DIAL_X_COORDINATE;
  var MINUTES_DIAL_Y_COORDINATE = 200;
  var MINUTES_DIAL_RADIUS = 75;
  var secondsTickAngle = 0;

  var clearCanvas = function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  var drawLine = function(x1, y1, x2, y2){
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  var drawCircle = function(cx, cy, radius, options){
    if(options == null){
      options = {};
    }

    context.beginPath();
    context.arc(cx, cy, radius, 0, 2*PI, false);
    ['lineWidth', 'strokeStyle'].forEach(function(property){
      if(options[property] != null){
        context[property] = options[property];
      }
    })
    context.stroke();
  }

  var getX = function(cx, radius, angle){
    angle = (angle/180)*PI;
    return cx + (radius * Math.cos(angle));
  }

  var getY = function(cy, radius, angle){
    angle = (angle/180)*PI;
    return cy + (radius * Math.sin(angle));
  }

  var drawTicks = function(options){
    var x1, y1, x2, y2, text, largerTickLength, smallerTickLength;
    var dialRadius = options.dialRadius;

    context.font = '15pt monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = options.tickWidth;
    for(var angle=0; angle<=360; angle+=6){
      if(angle%30 === 0){
        largerTickLength = options.largerTickLength;
        /* Drawing the larger ticks */
        x1= getX(options.cx, dialRadius, angle); // x coordinate on the circumference
        y1 = getY(options.cy, dialRadius, angle); // y coordinate on the circumference
        x2 = getX(options.cx, dialRadius - largerTickLength, angle); // 40 is the length of the larger mark
        y2 = getY(options.cy, dialRadius - largerTickLength, angle);
        drawLine(x1, y1, x2, y2);

        if(options.drawText){
          x3 = getX(options.cx, dialRadius - (largerTickLength + 20), angle);        
          y3 = getY(options.cy, dialRadius - (largerTickLength + 20), angle);
          if(angle !== 360){
            text = (angle + 90)/6;
            if(text >= 60){
              text -= 60;
            }
            context.fillText(text.toString(), x3, y3);
          }
        }
      }else if (options.drawSmallerTicks){
        smallerTickLength = options.smallerTickLength;
        x1= getX(options.cx, dialRadius, angle);
        y1 = getY(options.cy, dialRadius, angle);
        x2 = getX(options.cx, dialRadius - smallerTickLength, angle);
        y2 = getY(options.cy, dialRadius - smallerTickLength, angle);
        drawLine(x1, y1, x2, y2);
      }
    }
  }

  var drawPointerBase = function(options){
    var x1, y1, x2, y2, x3, y3, x4, y4, xt, yt;
    var angle = options.angle;

    x1 = getX(options.cx, options.radius, angle);
    y1 = getY(options.cy, options.radius, angle);
    xt = getX(options.cx, options.radius, angle+120);
    yt = getY(options.cy, options.radius, angle+120);
    x2 = 2*x1 - xt;
    y2 = 2*y1 - yt;
    x4 = getX(options.cx, options.radius, angle-60);
    y4 = getY(options.cy, options.radius, angle-60);
    xt = getX(options.cx, options.radius, angle+180);
    yt = getY(options.cy, options.radius, angle+180);
    x3 = 2*x4 - xt;
    y3 = 2*y4 - yt;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.lineTo(x4, y4);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
  }

  var drawPointerTip = function(options){
    var x1, y1, x2, y2, x3, y3;
    x1 = getX(options.cx, options.outerCircleRadius, options.pointerAngle);
    y1 = getY(options.cy, options.outerCircleRadius, options.pointerAngle);
    x2 = getX(options.cx, options.outerCircleRadius + options.tipHeight, options.pointerAngle + 30);
    y2 = getY(options.cy, options.outerCircleRadius + options.tipHeight, options.pointerAngle + 30);
    x3 = getX(options.cx, options.outerCircleRadius, options.pointerAngle + 60);
    y3 = getY(options.cy, options.outerCircleRadius, options.pointerAngle + 60);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();
    context.fill();
  }

  var drawPointer = function(options){
    drawCircle(options.cx, options.cy, options.innerCircleRadius); // inner little circle 
    drawCircle(options.cx, options.cy, options.outerCircleRadius); // outer circle
    options.pointerBaseOptions.angle = options.pointerAngle + 120;
    drawPointerBase(options.pointerBaseOptions);
    options.tipOptions.pointerAngle = options.pointerAngle + 240
    drawPointerTip(options.tipOptions);
  }

  var drawWatch = function(options){
    drawCircle(
                options.cx, 
                options.cy, 
                options.dialRadius, 
                {
                  lineWidth: options.dialThickness, 
                  strokeStyle: 'black'
                });
    options.tickOptions.dialRadius = options.dialRadius;
    options.pointerOptions.pointerAngle = options.tickAngle;
    drawTicks(options.tickOptions);
    drawPointer(options.pointerOptions);
  }

  var drawMinutesWatch = function(tickAngle){
    var tickOptions = {
      drawSmallerTicks: true,  
      smallerTickLength: 5,
      largerTickLength: 5,
      cx: MINUTES_DIAL_X_COORDINATE,
      cy: MINUTES_DIAL_Y_COORDINATE,
      tickWidth: 2
    };
    var tipOptions = {
      outerCircleRadius: 10,
      tipHeight: 60,
      cx: MINUTES_DIAL_X_COORDINATE,
      cy: MINUTES_DIAL_Y_COORDINATE
    }
    var pointerBaseOptions = {
      radius: 10,
      cx: MINUTES_DIAL_X_COORDINATE,
      cy: MINUTES_DIAL_Y_COORDINATE
    }
    var pointerOptions = {
      cx: MINUTES_DIAL_X_COORDINATE,
      cy: MINUTES_DIAL_Y_COORDINATE,
      innerCircleRadius: 2.5,
      outerCircleRadius: 10,
      tipOptions: tipOptions,
      pointerBaseOptions: pointerBaseOptions
    }
    var watchConfiguration = {
      cx: MINUTES_DIAL_X_COORDINATE,
      cy: MINUTES_DIAL_Y_COORDINATE,
      tickAngle: tickAngle,
      dialRadius: MINUTES_DIAL_RADIUS,
      dialThickness: 2,
      tickOptions: tickOptions,
      pointerOptions: pointerOptions
    }
    drawWatch(watchConfiguration);
  }

  var drawSecondsWatch = function(tickAngle){
    var tickOptions =   {
                          drawSmallerTicks: true, 
                          largerTickLength: 40, 
                          smallerTickLength: 20, 
                          drawText: true,
                          cx: SECONDS_DIAL_X_COORDINATE,
                          cy: SECONDS_DIAL_Y_COORDINATE,
                          tickWidth: 5
                        };
    var tipOptions = {
      outerCircleRadius: 20,
      tipHeight: 180,
      cx: SECONDS_DIAL_X_COORDINATE,
      cy: SECONDS_DIAL_Y_COORDINATE
    }
    var pointerBaseOptions = {
      radius: 20,
      cx: SECONDS_DIAL_X_COORDINATE,
      cy: SECONDS_DIAL_Y_COORDINATE
    }
    var pointerOptions = {
      cx: SECONDS_DIAL_X_COORDINATE,
      cy: SECONDS_DIAL_Y_COORDINATE,
      innerCircleRadius: 5,
      outerCircleRadius: 20,
      tipOptions: tipOptions,
      pointerBaseOptions: pointerBaseOptions
    }
    var watchConfiguration = {
      cx: SECONDS_DIAL_X_COORDINATE,
      cy: SECONDS_DIAL_Y_COORDINATE,
      tickAngle: tickAngle,
      dialRadius: SECONDS_DIAL_RADIUS,
      dialThickness: 20,
      tickOptions: tickOptions,
      pointerOptions: pointerOptions
    }
    drawWatch(watchConfiguration);
  }

  var stopwatch = new StopWatch({callback: 'animate'});
  stopwatch.callbackArgument = stopwatch.netTime;

  window.animate = function (netTime){
    if(netTime % 1000 === 0){
      clearCanvas();
      drawSecondsWatch(stopwatch.seconds()*6);
      drawMinutesWatch(stopwatch.minutes()*6);
    }
  }

  drawSecondsWatch(0);
  drawMinutesWatch(0);
  stopwatch.start();
}