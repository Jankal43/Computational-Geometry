class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  
  class Node2D {
    constructor(point) {
      this.point = point;
      this.yNode = null;
      this.left = null;
      this.right = null;
    }
  }
  
  class Node1D {
    constructor(point) {
      this.point = point;
      this.left = null;
      this.right = null;
    }
  }
  
  class RangeTree2D {
    constructor(points) {
      this.root = this.buildRangeTree2D(points);
    }
  
    buildRangeTree2D(points, depth = 0) {
      if (!points.length) {
        return null;
      }
  
      // Sort points by x-coordinate
      points.sort((a, b) => a.x - b.x);
  
      const medianIndex = Math.floor(points.length / 2);
  
      const node = new Node2D(points[medianIndex]);
  
      node.yNode = this.buildRangeTree1D(points);
  
      node.left = this.buildRangeTree2D(points.slice(0, medianIndex), depth + 1);
      node.right = this.buildRangeTree2D(points.slice(medianIndex + 1), depth + 1);
  
      return node;
    }
  
    buildRangeTree1D(points, depth = 0) {
      if (!points.length) {
        return null;
      }
  
      // Sort points by y-coordinate
      points.sort((a, b) => a.y - b.y);
  
      const medianIndex = Math.floor(points.length / 2);
  
      const node = new Node1D(points[medianIndex]);
  
      node.left = this.buildRangeTree1D(points.slice(0, medianIndex), depth + 1);
      node.right = this.buildRangeTree1D(points.slice(medianIndex + 1), depth + 1);
  
      return node;
    }
  
    print2DUtil(node, space) {
      if (!node) {
        return;
      }
  
      space += 10;
  
      this.print2DUtil(node.right, space);
  
      console.log();
      for (let i = 10; i < space; i++) {
        process.stdout.write(" ");
      }
      console.log(`${node.point.x}, ${node.point.y}`);
  
      this.print2DUtil(node.left, space);
    }
  
    print2D(root) {
      this.print2DUtil(root, 0);
    }
  }
  
  // Example usage
  const points = [
    new Point(3, 6), new Point(17, 15), new Point(13, 15), new Point(6, 12),
    new Point(9, 1), new Point(2, 7), new Point(10, 19),
  ];
  
  const rangeTree = new RangeTree2D(points);
  
  console.log("X Tree:");
  rangeTree.print2D(rangeTree.root);
  console.log("Y Tree:");
  rangeTree.print2D(rangeTree.root.yNode);