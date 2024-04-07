var fs = require('fs');

fs.readFile('ksztalt_2.txt', 'utf8', function(err, data) {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    
    const lines = data.trim().split('\n');

    const numPoints = parseInt(lines.shift().trim());
    const points = [];


    for (let i = 0; i < numPoints; i++) {
        const [x, y] = lines[i].trim().split(' ').map(parseFloat);
        points.push({ x, y });
    }


    console.log("Points:", points);
});
