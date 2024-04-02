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

        this.a = (this.y1 - this.y2) / (this.x1 - this.x2);
        this.b = this.y1 - this.a * this.x1;
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

        const equation = (y - this.y1) * (this.x2 - this.x1) - (this.y2 - this.y1) * (x - this.x1);
        
        if (equation < 0) {
            return "Right";
        } else if (equation > 0) {
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
        const s1 = (this.x1 + this.x2) / 2;
        const s2 = (this.y1 + this.y2) / 2;

        const refX = 2 * s1 - point.x;
        const refY = 2 * s2 - point.y;

        return new Point(refX, refY);
    }

    generalEquation() {
        const A = (this.y1 - this.y2) / (this.x1 - this.x2);
        const B = -1;
        const C = this.y1 - A * this.x1;
        return { A, B, C };
    }

    intersectionPointA(line) {
        const eq1 = this.generalEquation();
        const eq2 = line.generalEquation();

        const determinant = eq1.A * eq2.B - eq2.A * eq1.B;

        if (determinant === 0) {
            return "Proste są równoległe lub tożsame, brak punktu przecięcia.";
        } else {
            const x = ((-eq1.C*eq2.B) - (eq1.B*(-eq2.C))) / determinant;
            const y = (eq1.A * -eq2.C - eq2.A * -eq1.C) / determinant;
          
            return new Point(x, y);
        }
    
    }

    intersectionPointB(line) {
        const x = (line.b - this.b) / (this.a - line.a);
        const y = this.a * x + this.b;
      
        return new Point(x, y);
    }

    measureDistance(point) {
        const odl = Math.abs(line.a * point.x - point.y + line.b) / Math.sqrt(line.a * line.a + 1);
        return odl
    }


    angleBetween(otherLine) {
        const v1x = this.x2 - this.x1;
        const v1y = this.y2 - this.y1;
        const v2x = otherLine.x2 - otherLine.x1;
        const v2y = otherLine.y2 - otherLine.y1;
    
        const UV = v1x * v2x + v1y * v2y;
        const v1Length = Math.sqrt(v1x * v1x + v1y * v1y);
        const v2Length = Math.sqrt(v2x * v2x + v2y * v2y);
    
        const arccos = UV / (v1Length * v2Length);
    
        const safearccos = Math.max(-1, Math.min(1, arccos));
    
        return Math.acos(safearccos) * (180 / Math.PI); // Zamiana na stopnie
    }
    

}

class Triangle{
    constructor(point1,point2,point3){
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
    }

    distance(point1, point2) {
        return Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
    }

    area() {
        const a = this.distance(this.point1, this.point2);
        const b = this.distance(this.point2, this.point3);
        const c = this.distance(this.point3, this.point1);
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    pointInTriangle1(point){   
        const totalArea = this.area();
        const subArea1 = new Triangle(point, this.point1, this.point2).area();
        const subArea2 = new Triangle(point, this.point2, this.point3).area();
        const subArea3 = new Triangle(point, this.point3, this.point1).area();

        if (totalArea > subArea1 + subArea2 + subArea3)
        {
            return "Point outside";
        } 
        else
        {
            return "Point indside";
        }
    }

    pointOnRightSide(linePoint1, linePoint2, point) {
        const crossProduct = (linePoint2.x - linePoint1.x) * (point.y - linePoint1.y) - (linePoint2.y - linePoint1.y) * (point.x - linePoint1.x);
        return crossProduct < 0; 
    }

    pointInTriangleByLines(point) {
        const isOnRightSide1 = this.pointOnRightSide(this.point1, this.point2, point);
        const isOnRightSide2 = this.pointOnRightSide(this.point2, this.point3, point);
        const isOnRightSide3 = this.pointOnRightSide(this.point3, this.point1, point);

        return isOnRightSide1 && isOnRightSide2 && isOnRightSide3;
    }

}






// Testy

//Linia 1
const point1 = new Point(-9, 2);
const point2 = new Point(5, 10);
const line = new Line(point1, point2);

//Linia 2
const point5 = new Point(7,65)
const point6 = new Point(0,3)
const line2 = new Line(point5, point6);

console.log(line.angleBetween(line2))


//Linia 3
const pointQ = new Point(-3, 10);
const pointW = new Point(4, 2);
const line3 = new Line(pointQ, pointW);

//Linia 4
const pointE = new Point(7,3)
const pointR = new Point(0,3)
const line4 = new Line(pointE, pointR);



//Linia 5
const pointZ = new Point(1, 10);
const pointX = new Point(14, -5);
const line9 = new Line(pointZ, pointX);

//Linia 6
const pointC = new Point(10,3)
const pointV = new Point(-5,12)
const line8 = new Line(pointC, pointV);



//PUNKT DLA WYKRESU 1
//const point3 = new Point(0,0)
//const point3 = line.intersectionPointA(line2)
const point3 = line.intersectionPointB(line2)
const pointDistanceA = new Point(5,0)


//PUNKT DLA WYKRESU 2
const pointDistanceB = new Point(3,0)
const pointA = line3.intersectionPointA(line4)

//PUNKT DLA WYKRESU 3
const pointDistanceC = new Point(12,0)
const pointB = line8.intersectionPointA(line9)



const chartData1 = {
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
            label: "Punkt dystans",
            fill: true,
            pointRadius: 5,
            borderColor: "blue",
            backgroundColor: "blue",
            data: [{x: pointDistanceA.x, y: pointDistanceA.y}],
        },
        {
            label: "Linia 2",
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

const ctx1 = document.getElementById('myChart1');
new Chart(ctx1, chartData1);


document.getElementById("title1").textContent = "Wykres 1";
document.getElementById("distance1").textContent = "Distance: "+ line.measureDistance(pointDistanceA);



document.getElementById("title2").textContent = "Wykres 2";
document.getElementById("distance2").textContent = "Distance: "+ line3.measureDistance(pointDistanceB);


document.getElementById("title3").textContent = "Wykres 3";
document.getElementById("distance3").textContent = "Distance: "+ line8.measureDistance(pointDistanceC);


//Wykres 2
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
            data: [{x: pointA.x, y: pointA.y}],
        },
        {
            label: "Punkt dystans",
            fill: true,
            pointRadius: 5,
            borderColor: "blue",
            backgroundColor: "blue",
            data: [{x: pointDistanceB.x, y: pointDistanceB.y}],
        },
        {
            label: "Linia 2",
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




//Wykres 3
const chartData3 = {
    type: "line",
    data: {
        datasets: [{
            label: "Linia przed tranformacja",
            fill: false,
            pointRadius: 1,
            backgroundColor: "lightblue",
            borderColor: "lightblue",
            data: [{x: line9.x1, y: line9.y1 }, {x: line9.x2, y: line9.y2}],
            pointBackgroundColor: ["lightblue", "lightblue"],
            pointRadius: 5,
        },
        {
            label: "Punkt 3",
            fill: true,
            pointRadius: 5,
            borderColor: "green",
            backgroundColor: "green",
            data: [{x: pointB.x, y: pointB.y}],
        },
        {
            label: "Punkt dystans",
            fill: true,
            pointRadius: 5,
            borderColor: "blue",
            backgroundColor: "blue",
            data: [{x: pointDistanceC.x, y: pointDistanceC.y}],
        },
        {
            label: "Linia 2",
            fill: false,
            pointRadius: 1,
            borderColor: "red",
            backgroundColor: "red",
            data: [{x: line8.x1, y: line8.y1 }, {x: line8.x2, y: line8.y2}],
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

const ctx3 = document.getElementById('myChart3');
new Chart(ctx3, chartData3);


