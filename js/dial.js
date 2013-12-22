Dial = function(dialOptions){
  var _this = this;
  var configurableProperties = ['cx', 'cy', 'dialRadius', 'dialThickness',
                                'drawDialNumbers', 'equalTicks', 'context'];

  configurableProperties.forEach(function(property){
    if(dialOptions[property] != null){
      _this[property] = dialOptions[property];
    }
  });

  // angle in degrees
  var getX = function(cx, radius, angle){
    angle = (angle/180)*(Math.PI);
    return cx + (radius * Math.cos(angle));
  }

  // angle in degrees
  var getY = function(cy, radius, angle){
    angle = (angle/180)*(Math.PI);
    return cy + (radius * Math.sin(angle));
  }
  
  var drawCircle = function(radius, options){
    var cx = _this.cx;
    var cy = _this.cy;
    var context = _this.context;

    context.beginPath();
    context.arc(cx, cy, radius, 0, 2 * Math.PI, false);
    if(options != null){
      ['lineWidth', 'strokeStyle'].forEach(function(property){
        if(options[property] != null){
          context[property] = options[property];
        }
      })
    }
    context.stroke();
  }

  var drawLine = function(x1, y1, x2, y2){
    var context = _this.context;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  var configureTextOptions = function(){
    var context = _this.context;

    context.font = '15pt monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
  }

  var drawPointer = function(pointerAngle){
    var dialRadius = _this.dialRadius;
    var innerCircleRadius = dialRadius/50;
    var outerCircleRadius = dialRadius/12.5;
    var context = _this.context;
    var cx = _this.cx;
    var cy = _this.cy;

    var drawPointerBase = function(angle){
      var x1, y1, x2, y2, x3, y3, x4, y4, xt, yt;
      var radius = outerCircleRadius;

      x1 = getX(cx, radius, angle);
      y1 = getY(cy, radius, angle);
      xt = getX(cx, radius, angle + 120);
      yt = getY(cy, radius, angle + 120);
      x2 = (2 * x1) - xt;
      y2 = (2 * y1) - yt;
      x4 = getX(cx, radius, angle - 60);
      y4 = getY(cy, radius, angle - 60);
      xt = getX(cx, radius, angle + 180);
      yt = getY(cy, radius, angle + 180);
      x3 = (2 * x4) - xt;
      y3 = (2 * y4) - yt;

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
      var radius = outerCircleRadius;
      var tipHeight = _this.dialRadius * 0.8;

      x1 = getX(cx, radius, angle);
      y1 = getY(cy, radius, angle);
      x2 = getX(cx, radius + tipHeight, angle + 30);
      y2 = getY(cy, radius + tipHeight, angle + 30);
      x3 = getX(cx, radius, angle + 60);
      y3 = getY(cy, radius, angle + 60);

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.closePath();
      context.fill();
    }
    
    drawCircle(innerCircleRadius, {lineWidth: 5});
    drawCircle(outerCircleRadius);
    drawPointerBase(pointerAngle + 120);
    drawPointerTip(pointerAngle + 240);
  }


  var drawTicks = function(){
    var x1, y1, text;
    var cx = _this.cx;
    var cy = _this.cy;
    var dialRadius = _this.dialRadius;
    var largerTickLength = (_this.dialRadius)/5;
    var smallerTickLength = largerTickLength/2;
    if(_this.equalTicks){
      var largerTickLength = smallerTickLength;
    }
    var context = _this.context;
    var drawTick = function(angle, tickLength){
      var x1, x2, y1, y2;

      x1 = getX(cx, dialRadius, angle);
      y1 = getY(cy, dialRadius, angle);
      x2 = getX(cx, dialRadius - tickLength, angle);
      y2 = getY(cy, dialRadius - tickLength, angle);

      drawLine(x1, y1, x2, y2);
    }

    configureTextOptions();
    context.lineWidth = 2; // tick width

    for(var angle = 0; angle <= 360; angle += 6){
      if(angle % 30 === 0){
        drawTick(angle, largerTickLength);

        if(_this.drawDialNumbers){
          /* Drawing the text beneath the tick */
          x1 = getX(cx, dialRadius - (largerTickLength + 20), angle);
          y1 = getY(cy, dialRadius - (largerTickLength + 20), angle);

          if(angle !== 360){
            /*
              when the second's hand is at 15 seconds the angle as per the canvas is 0
            */
            text = (angle + 90)/6;
            if(text >= 60){
              text -= 60;
            }
            context.fillText(text.toString(), x1, y1);
          }
        }
      }else {
        drawTick(angle, smallerTickLength);
      }
    }
  }

  this.redraw = function(tickAngle){
    drawCircle(this.dialRadius, {lineWidth: this.dialThickness, strokeStyle: 'black'});
    drawTicks();
    drawPointer(tickAngle);
  }
}