function visualizeTree(node, level = 0, prefix = "") {
    if (node !== null) {
        console.log(" ".repeat(level * 4) + prefix + node.point);
        visualizeTree(node.left, level + 1, "L: ");
        visualizeTree(node.right, level + 1, "R: ");
    }
}

class RangeTreeNode {
    constructor(point) {
        this.point = point;
        this.left = null;
        this.right = null;
    }
}

class RangeTree1D {
    constructor(points) {
        this.root = this.buildTree(points);
    }

    buildTree(points) {
        if (points.length === 0) {
            return null;
        }
        points.sort((a, b) => a - b);

        const mid = Math.floor(points.length / 2) ;
        const root = new RangeTreeNode(points[mid]);

        root.left = this.buildTree(points.slice(0, mid));
        root.right = this.buildTree(points.slice(mid + 1));

        return root;
    }

    searchRange(min, max, node = this.root) {
        if (node === null) {
            return [];
        }

        const result = [];

        if (node.point >= min && node.point <= max) {
            result.push(node.point);
        }

        if (min < node.point) {
            result.push(...this.searchRange(min, max, node.left));
        }
        if (max > node.point) {
            result.push(...this.searchRange(min, max, node.right));
        }

        return result;
    }
}

const points1D = []
// const points1D = [ 43, 12, 4, -4, 0, 1, 96, 400, 13, 312, 39, 500 ];
for (let i = 0; i < 100; i++) {
    points1D.push(Math.floor(Math.random() * 100));
}

const rangeTree1D = new RangeTree1D(points1D);


const minRange = 10;
const maxRange = 41;
const pointsInRange = rangeTree1D.searchRange(minRange, maxRange);





console.log("Wizualizacja drzewa zakresowego 1D:");
visualizeTree(rangeTree1D.root);

console.log("Punkty w zakresie:", pointsInRange);






