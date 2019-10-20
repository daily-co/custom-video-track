const WIDTH = 640,
      HEIGHT = 480,
      DRAW_INTERVAL = 1/100,
      STREAM_FRAMERATE = 30,
      // for our graphic
      SWEEP_PERIOD = 3;

let visibleCanvas, visibleCtx, // "front" canvas, source of MediaStream
    bufferCanvas, ctx, // "back" canvas for double buffering
    canvasStartTimestamp,
    canvasDrawLoopInterval;

function getCanvasStream() {
  createCanvas();
  startDrawLoop();
  // document.body.appendChild(visibleCanvas);
  return {
    stream: visibleCanvas.captureStream(STREAM_FRAMERATE),
    canvas: visibleCanvas 
  };
}

function createCanvas() {
  visibleCanvas = document.createElement('canvas');
  bufferCanvas = document.createElement('canvas');
  ctx = bufferCanvas.getContext('2d');
  visibleCtx = visibleCanvas.getContext('2d');
  canvasStartTimestamp = Date.now();
  visibleCanvas.width = WIDTH;
  visibleCanvas.height = HEIGHT;
  bufferCanvas.width = WIDTH;
  bufferCanvas.height = HEIGHT;
}

function startDrawLoop() {
  canvasDrawLoopInterval = setInterval(draw, DRAW_INTERVAL * 1000);
}

function stopDrawLoop() {
  clearInterval(canvasDrawLoopInterval);
}

function draw() {
  const elapsed = Date.now() - canvasStartTimestamp;
  // background and border
  ctx.resetTransform();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 12;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeRect(0, 0, WIDTH, HEIGHT);
  // rotating line
  ctx.lineWidth = 3;
  ctx.resetTransform();
  ctx.translate(WIDTH/2, HEIGHT/2);
  let angle = (((elapsed)/1000) / SWEEP_PERIOD) * 
                Math.PI*2;
  ctx.rotate(angle);
  ctx.translate(WIDTH/-2, HEIGHT/-2);
  ctx.beginPath();
  ctx.moveTo(WIDTH/2, HEIGHT/2);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.stroke();
  // arc
  ctx.strokeStyle = 'lightgrey';
  ctx.lineWidth = 30;
  ctx.resetTransform();
  ctx.beginPath();
  ctx.arc(WIDTH/2, HEIGHT/2, (HEIGHT/2*0.7), 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  // timestamp
  const rounded = (elapsed/1000).toFixed(2);
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(rounded, WIDTH/2, HEIGHT/2);
  // draw to front canvas
  visibleCtx.drawImage(bufferCanvas, 0, 0);
}
  


