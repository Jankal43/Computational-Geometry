var target = document.querySelector("#main"),
    svg = document.querySelector("svg"),
    ns = svg.namespaceURI,
    reset = document.querySelector('#reset'),
    count = 50,
    vertices = [],
    { innerWidth, innerHeight } = window;

innerWidth -= 0;
innerHeight -= 0;


var triangleInfo = [];


function calculateTriangleQualities(vertices, triangles) {
    const triangleQualities = [];
    for (let i = 0; i < triangles.length; i += 3) {
        const triangleVertices = [
            vertices[triangles[i]],
            vertices[triangles[i + 1]],
            vertices[triangles[i + 2]]
        ];
        const triangleQuality = calculateTriangleQuality(triangleVertices);
        triangleQualities.push(triangleQuality);
    }
    return triangleQualities;
}






function calculateTriangleQuality(triangleVertices) {
    const sideLengths = [
        distance(triangleVertices[0], triangleVertices[1]),
        distance(triangleVertices[1], triangleVertices[2]),
        distance(triangleVertices[2], triangleVertices[0])
    ];

    const longestSide = Math.max(...sideLengths);
    const shortestSide = Math.min(...sideLengths);
    const quality = shortestSide / longestSide;
    const normalizedQuality = 1 - quality; 

    return normalizedQuality;
}

function median(data) {
    const sortedData = data.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
}



function action() {
    svg.setAttribute("width", innerWidth);
    svg.setAttribute("height", innerHeight);
    svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
    target.innerHTML = "";
   
    var startTime = performance.now();
    var triangles = Delaunator.from(vertices).triangles;
   
    console.log(triangles);

    const triangleVertices = [];
    for (let i = 0; i < triangles.length; i++) {
        const vertexIndex = triangles[i];
        triangleVertices.push(vertices[vertexIndex]);
    }
    

    const triangleQualities = calculateTriangleQualities(vertices, triangles);
    console.log(triangleQualities); 

    console.log("MEDIANA " + median(triangleQualities))


    
    addLines(vertices, triangles, target);
    triangleInfo = [];
    collectTriangleInfo(vertices, triangles);
    var endTime = performance.now();
    var executionTime = endTime - startTime;
    outputTriangleInfo(executionTime);



}



function newGrid() {
    vertices = [];
    var x, y;
    for (var i = 0; i < count; i++) {
        x = Math.random() * innerWidth;
        y = Math.random() * innerHeight;
        vertices.push([x, y]);
    }
}

function addLines(vertices, triangles, target) {
    for (var ii = 0; ii < triangles.length; ii += 3) {
        var d = "";
        for (var i = 0; i < 3; i++) {
            const x = vertices[triangles[ii + i]][0],
                y = vertices[triangles[ii + i]][1];
            d += i === 0 ? "M " : "";
            d += x + " " + y;
            d += i === 0 ? " L " : " ";
            circle = createElement("circle", {
                cx: x,
                cy: y,
                r: 10,
                fill: "hsla(0,0%,80%,.4)",
                title: ii
            });
            var c = target.appendChild(circle);
        }

        path = createElement("path", {
            stroke: "black",
            fill: "none",
            strokeWidth: "1px",
            d: d + " z"
        });
        target.appendChild(path);
    }
}

function createElement(name, attrs) {
    var ele = document.createElementNS(ns, name);
    Object.keys(attrs).forEach(attr => {
        ele.setAttribute(attr, attrs[attr]);
    });
    return ele;
}

function collectTriangleInfo(vertices, triangles) {
    for (var ii = 0; ii < triangles.length; ii += 3) {
        var triangleVertices = [];
        for (var i = 0; i < 3; i++) {
            const x = vertices[triangles[ii + i]][0],
                y = vertices[triangles[ii + i]][1];
            triangleVertices.push([x, y]);
        }
        var triangleStats = calculateTriangleStats(triangleVertices);
        triangleInfo.push(triangleStats);
    }
}

function calculateTriangleStats(vertices) {

    return {
        median: calculateMedian(vertices),

    };
}

function calculateMedian(vertices) {
}

function outputTriangleInfo(executionTime) {
    console.log("Number of triangles:", triangleInfo.length);
    console.log("Execution time:", executionTime, "ms");

    // console.log(vertices)
}

reset.addEventListener('click', () => {
    if (confirm('Delete current pattern?')) {
        target.innerHTML = '';
        newGrid();
        action();
    }
});

svg.addEventListener("click", addPoint);

function addPoint({ clientX, clientY }) {
    vertices.push([clientX - 10, clientY - 10]);
    action();
}

function delaunay(vertices) {
    const superTriangle = createSuperTriangle(vertices);


    let triangles = [superTriangle];


    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const badTriangles = [];
        

        for (let j = 0; j < triangles.length; j++) {
            const triangle = triangles[j];
            if (isPointInsideCircumcircle(vertex, triangle)) {
                badTriangles.push(triangle);
            }
        }


        const polygon = [];
        for (let j = 0; j < badTriangles.length; j++) {
            const triangle = badTriangles[j];
            for (let k = 0; k < 3; k++) {
                const edge = [triangle[k], triangle[(k + 1) % 3]];
                if (!isEdgeShared(edge, badTriangles)) {
                    polygon.push(edge);
                }
            }
        }

  
        for (let j = 0; j < badTriangles.length; j++) {
            const triangle = badTriangles[j];
            triangles = triangles.filter(t => t !== triangle);
        }


        for (let j = 0; j < polygon.length; j++) {
            const edge = polygon[j];
            const newTriangle = [edge[0], edge[1], vertex];
            triangles.push(newTriangle);
        }
    }


    return triangles.filter(t => !t.some(v => superTriangle.includes(v)));
}


function determinant(a, b, c, d) {
    return a * d - b * c;
}


function distance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function isPointInsideCircumcircle(point, triangle) {
    const [p1, p2, p3] = triangle;
    const ax = p1[0] - point[0];
    const ay = p1[1] - point[1];
    const bx = p2[0] - point[0];
    const by = p2[1] - point[1];
    const cx = p3[0] - point[0];
    const cy = p3[1] - point[1];

    const ab = ax * by - ay * bx;
    const bc = bx * cy - by * cx;
    const ca = cx * ay - cy * ax;

    const ac = cx * by - cy * bx;
    const ba = bx * ay - by * ax;
    const cb = cy * ax - cx * ay;

    const ad = ax * ax + ay * ay;
    const bd = bx * bx + by * by;
    const cd = cx * cx + cy * cy;

    const det = determinant(p1[0] - p2[0], p1[1] - p2[1], p1[0] - p3[0], p1[1] - p3[1]);

    const circumcenterX = (ab * cd + bd * ca + ac * bd) / (det * 2);
    const circumcenterY = (ab * cd + bd * ca + ac * bd) / (det * 2);
    const circumcenter = [circumcenterX, circumcenterY];
    
    const radius = distance(circumcenter, p1);

    const distanceToPoint = distance(circumcenter, point);

    return distanceToPoint <= radius;
}

function createSuperTriangle(vertices) {
    const maxX = Math.max(...vertices.map(v => v[0]));
    const maxY = Math.max(...vertices.map(v => v[1]));
    const minX = Math.min(...vertices.map(v => v[0]));
    const minY = Math.min(...vertices.map(v => v[1]));

    const dx = maxX - minX;
    const dy = maxY - minY;
    const deltaMax = Math.max(dx, dy);
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    return [
        [midX - 20 * deltaMax, midY - deltaMax],
        [midX, midY + 20 * deltaMax],
        [midX + 20 * deltaMax, midY - deltaMax]
    ];
}

function isEdgeShared(edge, triangles) {
    let count = 0;
    for (let i = 0; i < triangles.length; i++) {
        const triangle = triangles[i];
        if (triangle.includes(edge[0]) && triangle.includes(edge[1])) {
            count++;
            if (count > 1) {
                return true;
            }
        }
    }
    return false;
}







newGrid();
action();
