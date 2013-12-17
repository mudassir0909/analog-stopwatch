window.onload = function(){
  var canvas = document.getElementById("analog-stopwatch");
  var context = canvas.getContext('2d');
  var PI = Math.PI;
  var CX = canvas.width/2;
  var CY = canvas.height/2;
  var CIRCLE_RADIUS = 250;
  var p = console.log;

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

  var getX = function(radius, angle){
    angle = (angle/180)*PI;
    return CX + (radius * Math.cos(angle));
  }

  var getY = function(radius, angle){
    angle = (angle/180)*PI;
    return CY + (radius * Math.sin(angle));
  }

  var drawTicks = function(){
    var x1, y1, x2, y2, text;

    context.font = '15pt monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for(var angle=0; angle<=360; angle+=6){
      if(angle%30 === 0){
        x1= getX(CIRCLE_RADIUS, angle);
        y1 = getY(CIRCLE_RADIUS, angle);
        x2 = getX(CIRCLE_RADIUS - 40, angle);
        y2 = getY(CIRCLE_RADIUS - 40, angle);
        drawLine(x1, y1, x2, y2);
        x3 = getX(CIRCLE_RADIUS - 60, angle);
        y3 = getY(CIRCLE_RADIUS - 60, angle);
        if(angle !== 360){
          text = (angle + 90)/6;
          if(text >= 60){
            text -= 60;
          }
          context.fillText(text.toString(), x3, y3);
        }
        //console.log((angle/6).toString());
      }else{
        x1= getX(CIRCLE_RADIUS, angle);
        y1 = getY(CIRCLE_RADIUS, angle);
        x2 = getX(CIRCLE_RADIUS - 20, angle);
        y2 = getY(CIRCLE_RADIUS - 20, angle);
        drawLine(x1, y1, x2, y2);
      }
    }
  }

  var drawPointerBase = function(angle){
    var x1, y1, x2, y2, x3, y3, x4, y4, xt, yt;
    x1 = getX(20, angle);
    y1 = getY(20, angle);
    xt = getX(20, angle+120);
    yt = getY(20, angle+120);
    x2 = 2*x1 - xt;
    y2 = 2*y1 - yt;
    x4 = getX(20, angle-60);
    y4 = getY(20, angle-60);
    xt = getX(20, angle+180);
    yt = getY(20, angle+180);
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

  var drawPointerTip = function(angle){
    var x1, y1, x2, y2, x3, y3;

    x1 = getX(20, angle);
    y1 = getY(20, angle);
    x2 = getX(200, angle+30);
    y2 = getY(200, angle+30);
    x3 = getX(20, angle+60);
    y3 = getY(20, angle+60);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();
    context.fill();
  }

  var drawPointer = function(pointerAngle){
    drawCircle(CX, CY, 5); // inner little circle 
    drawCircle(CX, CY, 20); // outer circle
    drawPointerBase(pointerAngle+120);
    drawPointerTip(pointerAngle+240);
  }

  drawCircle(CX, CY, CIRCLE_RADIUS, {lineWidth: 20, strokeStyle: 'black'});
  context.lineWidth = 5;
  drawTicks();
  drawPointer(30);
}