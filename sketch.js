const points = [];
const hull = [];
let leftMost;
let currentVertex;
let index;
let nextIndex = -1;
let nextVertex;

function preload() {
  // Load data from an external file using fetch
  fetch('ksztalt_3.txt')
  .then(response => response.text())
  .then(data => {
    const lines = data.trim().split('\n');
    // Pominięcie pierwszej linii
    lines.shift();
    for (let line of lines) {
      const [x, y] = line.trim().split(' ').map(parseFloat);
      points.push(createVector(x, y));
    }
    
    points.sort((a, b) => a.x - b.x);
    leftMost = points[0];
    currentVertex = leftMost;
    hull.push(currentVertex);
    nextVertex = points[1];
    index = 2;
  })
  .catch(error => console.error('Error loading data:', error));
}

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0);

  stroke(255);
  strokeWeight(1);
  for (let p of points) {
    point(p.x, p.y);
  }

  stroke(0, 0, 255);
  fill(0, 0, 255, 50);
  beginShape();
  for (let p of hull) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  stroke(0, 255, 0);
  strokeWeight(1);
  point(leftMost.x, leftMost.y);

  stroke(200, 0, 255);
  strokeWeight(1);
  point(currentVertex.x, currentVertex.y);

  stroke(0, 255, 0);
  strokeWeight(2);
  line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);

  let checking = points[index];
  stroke(1);
  line(currentVertex.x, currentVertex.y, checking.x, checking.y);

  const a = p5.Vector.sub(nextVertex, currentVertex);
  const b = p5.Vector.sub(checking, currentVertex);
  const cross = a.cross(b);

  if (cross.z < 0) {
    nextVertex = checking;
    nextIndex = index;
  }

  index = index + 1;
  if (index == points.length) {
    if (nextVertex == leftMost) {
      console.log('done');
      console.log(hull);
      noLoop();
    } else {
      console.log(hull);
      console.log(points)
      hull.push(nextVertex);
      currentVertex = nextVertex;
      index = 0;
      //points.splice(nextIndex, 1);
      nextVertex = leftMost;
    }
  }
}
