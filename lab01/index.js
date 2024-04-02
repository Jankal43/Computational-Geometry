class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        
        this.x1 = point1.x;
        this.y1 = point1.y;
        this.x2 = point2.x;
        this.y2 = point2.y;
    }

    equation() {
        const a = (this.y1 - this.y2) / (this.x1 - this.x2);
        const b = this.y1 - a * this.x1;
        return `y = ${a}*x + ${b}`;
    }

    pointInEquation(point) {
        const x = point.x;
        const y = point.y;
        const equation = (y - this.y1) * (this.x2 - this.x1) - (this.y2 - this.y1) * (x - this.x1);
        return equation === 0;
    }

    pointInLine(point) {
        const x = point.x;
        const y = point.y;

        if (this.pointInEquation(point) && (x > Math.min(this.x1, this.x2) && x < Math.max(this.x1, this.x2)) && (y > Math.min(this.y1, this.y2) && y < Math.max(this.y1, this.y2))) {
            return true;
        } else {
            return false;
        }
    }

    pointPosition(point) {
        const x = point.x;
        const y = point.y;

        const equation = (x - this.x1) * (this.y2 - this.y1) - (y - this.y1) * (this.x2 - this.x1);
        
        if (equation > 0) {
            return "Right";
        } else if (equation < 0) {
            return "Left";
        } else {
            return "On the line";
        }
    }

    translate(vector) {
        const dx = vector[0];
        const dy = vector[1];

        this.x1 += dx;
        this.y1 += dy;
        this.x2 += dx;
        this.y2 += dy;

        this.point1.x += dx;
        this.point1.y += dy;
        this.point2.x += dx;
        this.point2.y += dy;

    }

    reflectPoint(point) {
        const a = (this.y2 - this.y1) / (this.x2 - this.x1);
        const b = this.y1 - a * this.x1;

        const x = point.x;
        const y = point.y;
        const xp = (x * (1 - a * a) - 2 * a * y + 2 * a * b) / (1 + a * a);
        const yp = (2 * a * x + (a * a - 1) * y + 2 * b) / (1 + a * a);

        return new Point(xp, yp);
    }

    // reflectPoint(point) {
    //     const x1 = this.x1;
    //     const y1 = this.y1;
    //     const x2 = this.x2;
    //     const y2 = this.y2;
    //     const px = point.x;
    //     const py = point.y;
    
    //     // Calculate the line's midpoint
    //     const midX = (x1 + x2) / 2;
    //     const midY = (y1 + y2) / 2;
    
    //     // Calculate the vector from the midpoint to the original point
    //     const vecX = px - midX;
    //     const vecY = py - midY;
    
    //     // Double the vector to find the reflection point
    //     const refX = midX + 2 * vecX;
    //     const refY = midY + 2 * vecY;
    
    //     return new Point(refX, refY);
    //   }


    
}

// Testy
const point1 = new Point(-7, 3);
const point2 = new Point(5, 10);
const point3 = new Point(-1, 5);

vector = [10,3]

const line = new Line(point1, point2);
const line2 = new Line(point1, point2);
line2.translate(vector)
let point4 = line.reflectPoint(point3)

// console.log("Przed translacją:");
// console.log(line.equation());
// console.log(line.pointInEquation(point3));
// console.log(line.pointInLine(point3));

const chartData = {
    type: "line",
    data: {
        datasets: [{
            label: "Linia przed tranformacja",
            fill: false,
            pointRadius: 1,
            backgroundColor: "lightblue",
            borderColor: "lightblue",
            data: [{x: line.x1, y: line.y1 }, {x: line.x2, y: line.y2}],
            pointBackgroundColor: ["lightblue", "lightblue"],
            pointRadius: 5,
        },
        {
            label: "Punkt 3",
            fill: true,
            pointRadius: 5,
            borderColor: "green",
            backgroundColor: "green",
            data: [{x: point3.x, y: point3.y}],
        },
        {
            label: "Punkt 3- po zmanie",
            fill: true,
            pointRadius: 5,
            borderColor: "lightgreen",
            backgroundColor: "lightgreen",
            data: [{x: point4.x, y: point4.y}],
        },
        // {
        //     hidden: null,
        //     fill: true,
        //     pointRadius: 5,
        //     backgroundColor: "blue",
        //     data: [{x: -20, y: -20}],
        // },
        // {
        //     hidden: null,
        //     fill: false,
        //     pointRadius: 5,
        //     backgroundColor: null,
        //     data: [{x: 20, y: 20}],
        // },
        {
            label: "Linia po transformacji  ["+vector[0]+","+vector[1]+"]",
            fill: false,
            pointRadius: 1,
            borderColor: "red",
            backgroundColor: "red",
            data: [{x: line2.x1, y: line2.y1 }, {x: line2.x2, y: line2.y2}],
            pointBackgroundColor: ["red", "red"],
            pointRadius: 5,
        },
    ]
    },
    options: {
        legend: {
            display: false
        },
        plugins: {
            title: {
                display: true,
                text: 'Wykres danych',
                fontSize: 20
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    beginAtZero: false,
                    min: -20,
                    max: 20,
                    stepSize: 1
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: false,
                    min: -20,
                    max: 20,
                    stepSize: 1
                }
            }
        }
    }
};

const ctx = document.getElementById('myChart1');
new Chart(ctx, chartData);


document.getElementById("title1").textContent = "Wykres 1";
document.getElementById("equation1").textContent = "Equation: "+ line.equation();
document.getElementById("pointInEquation1").textContent = "Point in equation: "+ line.pointInEquation(point3);
document.getElementById("pointInLine1").textContent = "Point in line: "+ line.pointInLine(point3);
document.getElementById("pointPosition1").textContent = "Poion position: "+ line.pointPosition(point3);







const point5 = new Point(0, 2);
const point6 = new Point(3, 5);
const point7 = new Point(2, 4);

vector = [3,3]

const line3 = new Line(point5, point6);
const line4 = new Line(point5, point6);
line2.translate(vector)
let point8 = line.reflectPoint(point7)

// console.log("Przed translacją:");
// console.log(line.equation());
// console.log(line.pointInEquation(point3));
// console.log(line.pointInLine(point3));

const chartData2 = {
    type: "line",
    data: {
        datasets: [{
            label: "Linia przed tranformacja",
            fill: false,
            pointRadius: 1,
            backgroundColor: "lightblue",
            borderColor: "lightblue",
            data: [{x: line3.x1, y: line3.y1 }, {x: line3.x2, y: line3.y2}],
            pointBackgroundColor: ["lightblue", "lightblue"],
            pointRadius: 5,
        },
        {
            label: "Punkt 3",
            fill: true,
            pointRadius: 5,
            borderColor: "green",
            backgroundColor: "green",
            data: [{x: point7.x, y: point7.y}],
        },
        {
            label: "Punkt 3- po zmanie",
            fill: true,
            pointRadius: 5,
            borderColor: "lightgreen",
            backgroundColor: "lightgreen",
            data: [{x: point8.x, y: point8.y}],
        },
        // {
        //     hidden: null,
        //     fill: true,
        //     pointRadius: 5,
        //     backgroundColor: "blue",
        //     data: [{x: -20, y: -20}],
        // },
        // {
        //     hidden: null,
        //     fill: false,
        //     pointRadius: 5,
        //     backgroundColor: null,
        //     data: [{x: 20, y: 20}],
        // },
        {
            label: "Linia po transformacji  ["+vector[0]+","+vector[1]+"]",
            fill: false,
            pointRadius: 1,
            borderColor: "red",
            backgroundColor: "red",
            data: [{x: line4.x1, y: line4.y1 }, {x: line4.x2, y: line4.y2}],
            pointBackgroundColor: ["red", "red"],
            pointRadius: 5,
        },
    ]
    },
    options: {
        legend: {
            display: false
        },
        plugins: {
            title: {
                display: true,
                text: 'Wykres danych',
                fontSize: 20
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    beginAtZero: false,
                    min: -20,
                    max: 20,
                    stepSize: 1
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: false,
                    min: -20,
                    max: 20,
                    stepSize: 1
                }
            }
        }
    }
};

const ctx2 = document.getElementById('myChart2');
new Chart(ctx2, chartData2);


document.getElementById("title2").textContent = "Wykres 2";
document.getElementById("equation2").textContent = "Equation: "+ line3.equation();
document.getElementById("pointInEquation2").textContent = "Point in equation: "+ line3.pointInEquation(point7);
document.getElementById("pointInLine2").textContent = "Point in line: "+ line3.pointInLine(point7);
document.getElementById("pointPosition2").textContent = "Poion position: "+ line3.pointPosition(point7);


