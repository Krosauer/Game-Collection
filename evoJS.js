let stationaryDiameter = 2;
let mobileDiameter = 3;
// Array of all current organisms
let organisms = [];
// Canvas dimensions
let xCanvas = 300;
let yCanvas = 150;
// Organisms at beginning of game
let startingPlants = 10;
let startingAnimals = 0;
let scaredDistance = 40;
let greenCount = 0;
let yellowCount = 0;
let blueCount = 0;
let orangeCount = 0;
let redCount = 0;
let purpleCount = 0;
let whiteCount = 0;
let predateCount = 0;
let myChart;
let myTimeSeries;
let data;
let layout;
let timeCount = 0;
let timeArray = [];
let greenPopArray = [];
let yellowPopArray = [];
let bluePopArray = [];
let orangePopArray = [];
let redPopArray = [];

let drawInterval;
let predateInterval;
let dieInterval;
let reproduceInterval;
// Chance that an organism will be born mutated as another species
let evolutionRate = .001;
// Checks if the organism array contains organisms with species of level 1,2
let hasL1 = false;
let hasL2 = false;
let hasL3 = false;
let intervalHasChanged = false;

let canvas;
let context;

class Organism{
    constructor(xPos, yPos, levelP, birthDistance, maxChildP, reproduceRangeP){
        this.x = xPos;
        this.y = yPos;
        // Species number
        this.level = levelP
        this.timeAlive = 0;
        // Distance from the midpoint of parent organisms
        this.birthDistance = birthDistance;
        // Number of children a parent has produced this turn
        this.numChild = 0;
        // Number of children a parent is capable of producing in a single turn
        this.maxChild = maxChildP;
        // Max distance a mate can be from the organism to mate
        this.reproduceRange = reproduceRangeP
        // Only for plants
        if(levelP === 0){
            this.food = 1;
            // Turns until natural death
            this.lifeSpan = 15;
        }
        // For animals
        else{
            this.food = 10;
            // Turns until natural death
            this.lifeSpan = 30;
        }
        this.diameter = stationaryDiameter;
        if(this.level >= 2){
            this.diameter = mobileDiameter;
        }
        this.speed = this.level-1;
        this.prey = null;
    }
}

function generateChart2(){
    let data = {
        labels: ['Green', 'Yellow', 'Blue', 'Orange', 'Red', 'Purple', 'White'],
        series: [
            [greenCount, yellowCount, blueCount, orangeCount, redCount, purpleCount, whiteCount] // Sample data values
        ]
    };

// Chart options
    let options = {
        seriesBarDistance: 15,
        axisY: {
            onlyInteger: true
        }
    };

// Create the bar chart
    myChart = new Chartist.Bar('#myChart', data, options);
}

function generateTimeSeriesGraph() {

    // Sample data for multiple series
    data = [
        {
            x: timeArray,
            y: redPopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Red',
            line: { color: 'rgb(211,30,60)' },
        },
        {
            x: timeArray,
            y: orangePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Orange',
            line: { color: 'rgb(247,144,30)' },
        },
        {
            x: timeArray,
            y: bluePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Blue',
            line: { color: 'rgb(21,118,187)' },
        },
        {
            x: timeArray,
            y: yellowPopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Yellow',
            line: { color: 'rgb(218,194,37)' },
        },
        {
            x: timeArray,
            y: greenPopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Green',
            line: { color: 'rgb(24,158,73)' },
        },

        // Add more traces as needed
    ];

    // Layout configuration
    layout = {
        title: 'Population Graph',
        xaxis: {
            title: 'Generation',
        },
        yaxis: {
            title: 'Population',
        },
    };

    // Create the chart
    myTimeSeries = Plotly.newPlot('myLineChart', data, layout);
}

// Add the event listener to a button
document.getElementById('setupButton').addEventListener('click', generateTimeSeriesGraph);

function updateTimeSeriesGraph(){
    data[4].y = greenPopArray;
    data[3].y = yellowPopArray;
    data[2].y = bluePopArray;
    data[1].y = orangePopArray;
    data[0].y = redPopArray;
    console.log('were making it')
    myTimeSeries = Plotly.update('myLineChart', data, layout);
}

// May change from button to onload later
function setup() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    for(let i = 0; i < startingPlants; i++){
        // Adds plants with random coordinates and random genetics to organisms array (birthDistance: 30, maxChild: 2, reproduceRange: 63)
        let org = new Organism(Math.random()*xCanvas, Math.random()*yCanvas, 0, Math.random()*20 + 20, Math.random()*2 + 1, Math.random()*50 + 25)
        organisms.push(org);
    }
    // Adds level 1 animals with random coordinates and random genetics to organisms array
    for(let i = 0; i < startingAnimals; i++){
        let org = new Organism(Math.random()*xCanvas, Math.random()*yCanvas, 1, Math.random()*20 + 20, Math.random()*2 + 1, Math.random()*50 + 25)
        organisms.push(org);
    }
    generateChart2();
    draw();
    changeIntervalsBack();
}

function setIntervals(){
    drawInterval = setInterval(draw,50);
    reproduceInterval = setInterval(reproduce,200);
    dieInterval = setInterval(die,200);
    predateInterval = setInterval(predate, 200);
}
function clearIntervals(){
    clearInterval(drawInterval);
    clearInterval(predateInterval);
    clearInterval(dieInterval);
    clearInterval(reproduceInterval);
}

function changeIntervals(){
    clearIntervals();
    dieInterval = setInterval(die,1000);
    predateInterval = setInterval(predate, 100);
    drawInterval = setInterval(draw,50);
    reproduceInterval = setInterval(reproduce,2000);
}

function changeIntervalsBack(){
    clearIntervals();
    setIntervals();
}

function draw() {
    // Resets canvas
    context.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        context.beginPath();
        // Draws organisms
        context.ellipse(org.x,org.y,org.diameter,org.diameter,0,0,2 * Math.PI);
        if(org.level === 0){
            context.fillStyle = "green";
        }
        if(org.level === 1){
            context.fillStyle = "yellow";
        }
        if(org.level === 2){
            context.fillStyle = "blue";
        }
        if(org.level === 3){
            context.fillStyle = "orange";
        }
        if(org.level === 4){
            context.fillStyle = "red";
        }
        if(org.level === 5){
            context.fillStyle = "purple";
        }
        if(org.level === 6){
            context.fillStyle = "white";
        }
        context.fill();
        context.strokeStyle = 'black'; // Set the outline color
        context.lineWidth = 0.5; // Set the outline width
        context.stroke();
    }
    /*if(hasL2 && !intervalHasChanged){
        changeIntervals();
        intervalHasChanged = true;
    }
    if(!hasL2 && intervalHasChanged){
        changeIntervalsBack();
        intervalHasChanged = false;
    }*/
    moveOrganisms();
}


function reproduce(){
    generateChart2();
    // Organisms that are newly born
    let newBorn = [];
    // Organisms that have not maxed out their reproductive capacity in a given turn
    let horny = [];
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        horny.push(org);
    }
    for(let i = 0; i < organisms.length-1; i++){
        let org1 = organisms[i];
        if(horny.includes(org1)){
            for(let j = i+1; j < organisms.length; j++){
                let org2 = organisms[j];
                // Checks if the two organisms are the same species and if they are close enough to reproduce
                if(org1.level === org2.level && horny.includes(org2) && inRange(org1,org2,average(org1.reproduceRange, org2.reproduceRange))){
                    // Birth food taken from parents
                    org1.food -= 5;
                    org2.food -= 5;
                    // Average of parent birth distances
                    let b = average(org1.birthDistance, org2.birthDistance);
                    // Randomizes coordinates with range birth distance
                    let xPos = average(org1.x,org2.x) + Math.random()*b - b/2;
                    let yPos = average(org1.y, org2.y) + Math.random()*b - b/2;
                    // Randomizes birth distance with range 10
                    let birthDistance = b + Math.random()*10 - 5;
                    let level;
                    let rand = Math.random();
                    // Species Mutations
                    if(rand > 1 - evolutionRate){
                        level = org1.level + 1;
                    }
                    else if(rand < evolutionRate && org1.level !== 0){
                        level = org1.level - 1;
                    }
                    else{
                        level = org1.level;
                    }
                    // Randomizes maximum children, range 2
                    let maxChild = average(org1.maxChild, org2.maxChild) + Math.random()*2 - 1;
                    // Randomizes reproduction rang, range 20
                    let reproduceRange = average(org1.reproduceRange, org2.reproduceRange) + Math.random()*20 - 10
                    // Checks if new organism is on canvas
                    if(xPos >= mobileDiameter && xPos <= xCanvas - mobileDiameter && yPos >= mobileDiameter && yPos <= yCanvas - mobileDiameter){
                        let newOrg = new Organism(xPos, yPos, level, birthDistance, maxChild,reproduceRange);
                        newBorn.push(newOrg);
                    }
                    org1.numChild ++;
                    org2.numChild ++;
                    // Checks if the organisms have produced max offspring
                    if(org1.numChild >= org1.maxChild){
                        horny.splice(j,1);
                    }
                    if(org2.numChild >= org2.maxChild){
                        horny.splice(i,1);
                    }
                    break;
                }
            }
        }
    }
    // Adds new organisms to main organism array
    for(let i = 0; i < newBorn.length; i++){
        incrementPopCounts(newBorn[i]);
        organisms.push(newBorn[i]);
    }
    updatePopCounts();
    updateStats();
    updateTimeSeriesGraph();
}

//Checks to see if predator organisms are touching prey organisms. Kills prey, increments food for predator.
function predate(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        if(org1.level !== 0){
            for(let j = 0; j < organisms.length; j++){
                let org2 = organisms[j];
                if(!temp.includes(org2) && (org1.level === org2.level+1 || org1.level === org2.level+2) && inRange(org1,org2,org1.diameter + org2.diameter)){
                    temp.push(org2);
                    org1.food += 5;
                }
            }
        }
    }
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < temp.length; j++){
            if(organisms[i] === temp[j]){
                decrementPopCounts(organisms[i]);
                organisms.splice(i,1);
                break;
            }
        }
    }
}

// Kills off organisms that: overlap with organisms of same species (population death), food = 0 (Starvation Death), or reach max age (Natural Death)
function die(){
    // Array of organisms to be removed
    let dead = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        org1.timeAlive++;
        for(let j = i+1; j < organisms.length; j++) {
            let org2 = organisms[j];
            //console.log(org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter)))
            if (org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter))) {
                dead.push(org1);
                dead.push(org2);
                //Population Death
            }
        }
        if(org1.timeAlive >= org1.lifeSpan){
            dead.push(org1);
            //Natural Death
        }
        if(org1.level > 0){
            org1.food -= 1;
        }
        if(org1.level > 0 && org1.food <= 0){
            dead.push(org1);
            //Food Limited Death
        }
    }
    // Remove dead organisms
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < dead.length; j++){
            if(organisms[i] === dead[j]){
                decrementPopCounts(organisms[i]);
                organisms.splice(i,1);
                break;
            }
        }
    }
}

function updateStats(){
    let level0Orgs = [];
    let level1Orgs = [];
    let level2Orgs = [];
    let level3Orgs = [];
    // Adds organisms to respective arrays according to their species
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        if(org.level === 0){
            level0Orgs.push(org);
        }
        else if(org.level === 1){
            level1Orgs.push(org);
        }
        else if(org.level === 2){
            level2Orgs.push(org);
        }
        else if(org.level === 3){
            level3Orgs.push(org);
        }
    }
    // Updates has species booleans
    if(level1Orgs.length === 0){
        hasL1 = false;
    }
    if(level2Orgs.length === 0){
        hasL2 = false;
    }
    if(level3Orgs.length === 0){
        hasL3 = false;
    }
    let level0BirthDistanceSum = 0;
    let level0ChildSum = 0;
    let level0ReproduceRangeSum = 0;
    let level1BirthDistanceSum = 0;
    let level1ChildSum = 0;
    let level1ReproduceRangeSum = 0;
    let level2BirthDistanceSum = 0;
    let level2ChildSum = 0;
    let level2ReproduceRangeSum = 0;
    let level3BirthDistanceSum = 0;
    let level3ChildSum = 0;
    let level3ReproduceRangeSum = 0;
    //Finds average statistics for each species
    for(let k = 0; k < organisms.length; k++){
        if(organisms[k].level === 0) {
            level0BirthDistanceSum += organisms[k].birthDistance;
            level0ChildSum += organisms[k].maxChild;
            level0ReproduceRangeSum += organisms[k].reproduceRange;
        }
        else if(organisms[k].level === 1){
            hasL1 = true;
            level1BirthDistanceSum += organisms[k].birthDistance;
            level1ChildSum += organisms[k].maxChild;
            level1ReproduceRangeSum += organisms[k].reproduceRange;
        }
        else if(organisms[k].level === 2){
            hasL2 = true;
            level2BirthDistanceSum += organisms[k].birthDistance;
            level2ChildSum += organisms[k].maxChild;
            level2ReproduceRangeSum += organisms[k].reproduceRange;
        }
        else if(organisms[k].level === 3){
            hasL3 = true;
            level3BirthDistanceSum += organisms[k].birthDistance;
            level3ChildSum += organisms[k].maxChild;
            level3ReproduceRangeSum += organisms[k].reproduceRange;
        }
    }
    // Printed statistics
    let name0 = "Green:";
    let l0BD = "Average birth distance: " + level0BirthDistanceSum / level0Orgs.length;
    let l0CN = "Average offspring count: " + level0ChildSum / level0Orgs.length;
    let l0RR = "Average reproduction range: " + level0ReproduceRangeSum / level0Orgs.length;
    let name1 = "Yellow:"
    let l1BD = "Average birth distance: " + level1BirthDistanceSum / level1Orgs.length;
    let l1CN = "Average offspring count: " + level1ChildSum / level1Orgs.length;
    let l1RR = "Average reproduction range: " + level1ReproduceRangeSum / level1Orgs.length;
    let name2 = "Blue:"
    let l2BD = "Average birth distance: " + level2BirthDistanceSum / level2Orgs.length;
    let l2CN = "Average offspring count: " + level2ChildSum / level2Orgs.length;
    let l2RR = "Average reproduction range: " + level2ReproduceRangeSum / level2Orgs.length;
    let name3 = "Orange:"
    let l3BD = "Average birth distance: " + level3BirthDistanceSum / level3Orgs.length;
    let l3CN = "Average offspring count: " + level3ChildSum / level3Orgs.length;
    let l3RR = "Average reproduction range: " + level3ReproduceRangeSum / level3Orgs.length;
    let answer = "\n" + name0 + "\n" + l0BD + "\n" + l0CN + "\n" + l0RR;
    if(hasL1){
        answer += "\n" + name1 + "\n" + l1BD + "\n" + l1CN + "\n" + l1RR;
    }
    if(hasL2){
        answer += "\n" + name2 + "\n" + l2BD + "\n" + l2CN + "\n" + l2RR;
    }
    if(hasL3){
        answer += "\n" + name3 + "\n" + l3BD + "\n" + l3CN + "\n" + l3RR;
    }
    document.getElementById('stats').innerText = answer;
}

function moveOrganisms(){
    for(let i = 0; i < organisms.length; i++){
        if(organisms[i].level > 1){
            let org = organisms[i];
            let hungry = false;
            let scared = false;
            let inReproduceRange = false;
            let preyCount = 0;
            let predatorCount = 0;
            let mateCount = 0;
            this.prey= new Organism(0,0,0,0,0,0);
            let predator= new Organism(0,0,0,0,0,0);
            let mate= new Organism(0,0,0,0,0,0);
            if(org.food <= 5){
                hungry = true;
            }
            for(let j = 0; j < organisms.length; j++) {
                if (j !== i) {
                    let tempOrg = organisms[j];
                    if (tempOrg.level > org.level && findDistance(org, tempOrg) <= scaredDistance) {
                        scared = true;
                    }
                    if (tempOrg.level > org.level) {
                        predatorCount += 1;
                        predator = tempOrg;
                    }
                    if (tempOrg.level < org.level) {
                        preyCount += 1;
                        this.prey = tempOrg;
                    }
                    if (tempOrg.level === org.level) {
                        mateCount += 1;
                        mate = tempOrg;
                        if (inRange(org, tempOrg, average(org.reproduceRange, tempOrg.reproduceRange))) {
                            inReproduceRange = true;
                        }
                    }
                }
            }

            if(hungry && preyCount >= 1){
                if(predateCount % 5 === 0){
                    changePrey(org);
                }
                moveTo(org, this.prey);
                predateCount++;
            }
            else if(scared && predatorCount >= 1){
                let minDistance = Number.MAX_SAFE_INTEGER;
                for(let j = 0; j < organisms.length; j++){
                    let tempOrg = organisms[j];
                    if(organisms[j].level > org.level && findDistance(org, tempOrg) < minDistance){
                        predator = tempOrg;
                        minDistance = findDistance(org, tempOrg);
                    }
                }
                moveAway(org, predator);
            }
            else{
                if(mateCount >= 2) {
                    let minDistance = Number.MAX_SAFE_INTEGER;
                    for (let j = 0; j < organisms.length; j++) {
                        let tempOrg = organisms[j];
                        if (tempOrg.level === org.level && tempOrg.x !== org.x && tempOrg.y !== org.y) {
                            if (findDistance(org, tempOrg) < minDistance) {
                                mate = tempOrg;
                                minDistance = findDistance(org, tempOrg);
                            }
                        }
                    }
                    if(!inReproduceRange) {
                        moveTo(org, mate);
                    }
                }
            }
        }
    }
}

function moveTo(org, goal){
    let distance = findDistance(org, goal);
    let dx = (org.x - goal.x) / distance * org.speed;
    let dy = (org.y - goal.y) / distance * org.speed;
    org.x -= dx;
    org.y -= dy;
}

function moveAway(org, danger){
    let distance = findDistance(org, danger);
    let dx = (org.x - danger.x) / distance;
    let dy = (org.y - danger.y) / distance;
    if(org.x + dx + org.diameter/2 <= xCanvas && org.x - dx - org.diameter/2 >= 0) {
        org.x += dx;
    }
    if(org.y + dy + org.diameter/2 <= yCanvas && org.y - dy - org.diameter/2 >= 0) {
        org.y += dy;
    }
}

function changePrey(org){
    let minDistance = Number.MAX_SAFE_INTEGER;
    for(let j = 0; j < organisms.length; j++){
        let tempOrg = organisms[j];
        if(tempOrg.level < org.level){
            if(findDistance(org, tempOrg) < minDistance){
                this.prey = tempOrg;
                minDistance = findDistance(org, tempOrg);
            }
        }
    }
}

function pause(){
    clearIntervals();
    context.closePath();
}

function resume(){
    setIntervals();
    context.beginPath();
}

function reset(){
    organisms = [];
    greenCount = 0;
    yellowCount = 0;
    blueCount = 0;
    orangeCount = 0;
    redCount = 0;
    purpleCount = 0;
    whiteCount = 0;
    timeCount = 0;
    greenPopArray = [];
    yellowPopArray = [];
    bluePopArray = [];
    orangePopArray = [];
    redPopArray = [];
    timeArray = [];
    context.clearRect(0,0, canvas.width, canvas.height);
    context.closePath();
    hasL1 = false;
    hasL2 = false;
    hasL3 = false;
    pause();
}


function inRange(org1, org2, distance){
    return Math.sqrt(Math.pow(org1.x - org2.x, 2) + Math.pow(org1.y - org2.y, 2)) <= distance;
}

function findDistance(org1, org2){
    return Math.sqrt(Math.pow(org1.x - org2.x, 2) + Math.pow(org1.y - org2.y, 2))
}

function average(num1, num2){
    return (num1 + num2) / 2;
}

function updatePopCounts(){
    timeArray.push(timeCount);
    greenPopArray.push(greenCount);
    yellowPopArray.push(yellowCount);
    bluePopArray.push(blueCount);
    orangePopArray.push(orangeCount);
    redPopArray.push(redCount);
    timeCount++;
}


function incrementPopCounts(org){
    if(org.level === 0){
        greenCount++;
    }
    if(org.level === 1){
        yellowCount++;
    }
    if(org.level === 2){
        blueCount++;
    }
    if(org.level === 3){
        orangeCount++;
    }
    if(org.level === 4){
        redCount++;
    }
    if(org.level === 5){
        purpleCount++;
    }
    if(org.level === 6){
        whiteCount++;
    }
}

function decrementPopCounts(org){
    if(org.level === 0 && greenCount > 0){
        greenCount--;
    }
    if(org.level === 1 && yellowCount > 0){
        yellowCount--;
    }
    if(org.level === 2 && blueCount > 0){
        blueCount--;
    }
    if(org.level === 3 && orangeCount > 0){
        orangeCount--;
    }
    if(org.level === 4 && redCount > 0){
        redCount--;
    }
    if(org.level === 5 && purpleCount > 0){
        purpleCount--;
    }
    if(org.level === 6 && whiteCount > 0){
        whiteCount--;
    }
}