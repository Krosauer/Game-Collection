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
// Change to mutating attributes later
let scaredDistance = 40;
let energyConversion = 1;
//This is multiplied by diameter
let minFoodToReproduce = 2;

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
let myTimeSeries2;
let data;
let data2;
let layout;
let layout2;
let timeCount = 0;
let timeArray = [];
let greenPopArray = [];
let yellowPopArray = [];
let bluePopArray = [];
let orangePopArray = [];
let redPopArray = [];
let purplePopArray = [];
let whitePopArray = [];

let overpopArray = [0,0,0,0,0,0,0];
let natiArray = [0,0,0,0,0,0,0];
let predateArray = [0,0,0,0,0,0,0];
let starveArray = [0,0,0,0,0,0,0];

let drawInterval;
let predateInterval;
let dieInterval;
let reproduceInterval;
let drawTime = 50;
let predateTime = 200;
let dieTime = 200;
let reproduceTime = 200;
// Chance that an organism will be born mutated as another species
let evolutionRate = .001;
let sympatricEvolutionFactor = 2;
// Checks if the organism array contains organisms with species of level
let hasLevels = [true, false, false, false, false, false, false];
let colors = ['Green','Yellow','Blue','Orange','Red', 'Purple', 'White'];
let intervalHasChanged = false;

let canvas;
let context;

class Organism{
    constructor(xPos, yPos, levelP, birthDistance, maxChildP, reproduceRangeP, speedP, crowdedP, mutationRateP, diameterP, scaredDistanceP, stomachCapacityP){
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
            this.food = minFoodToReproduce*diameterP;
            // Turns until natural death
            this.lifeSpan = 15;
        }
        // For animals
        else{
            this.food = 10;
            // Turns until natural death
            this.lifeSpan = 30;
        }
        this.speed = speedP;
        /*this.diameter = stationaryDiameter;
        if(this.level >= 2){
            this.diameter = mobileDiameter;
        }*/
        this.diameter = diameterP;
        this.prey = null;
        this.crowded = crowdedP;
        if(this.level === 0){
            this.crowded = 1;
        }
        this.mutationRate = mutationRateP
        this.scaredDistance = scaredDistanceP;
        this.stomachCapacity = stomachCapacityP;
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
            y: whitePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'White',
            line: { color: 'rgb(0,0,0)' },
        },
        {
            x: timeArray,
            y: purplePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Purple',
            line: { color: 'rgb(97,26,153)' },
        },
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

function generateTimeSeriesGraph2() {

    // Sample data for multiple series
    data2 = [
        {
            x: timeArray,
            y: whitePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'White',
            line: { color: 'rgb(0,0,0)' },
        },
        {
            x: timeArray,
            y: purplePopArray,
            type: 'scatter',
            mode: 'lines',
            name: 'Purple',
            line: { color: 'rgb(97,26,153)' },
        },
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

        // Add more traces as needed
    ];

    // Layout configuration
    layout2 = {
        title: 'Population Graph (Excluding Green)',
        xaxis: {
            title: 'Generation',
        },
        yaxis: {
            title: 'Population',
        },
    };

    // Create the chart
    myTimeSeries2 = Plotly.newPlot('myLineChart2', data2, layout2);
}

// Add the event listener to a button
document.getElementById('setupButton').addEventListener('click', generateTimeSeriesGraph);
document.getElementById('setupButton').addEventListener('click', generateTimeSeriesGraph2);

function updateTimeSeriesGraph(){
    data[6].y = greenPopArray;
    data[5].y = yellowPopArray;
    data[4].y = bluePopArray;
    data[3].y = orangePopArray;
    data[2].y = redPopArray;
    data[1].y = purplePopArray;
    data[0].y = whitePopArray;
    myTimeSeries = Plotly.update('myLineChart', data, layout);
}

function updateTimeSeriesGraph2(){
    data[5].y = yellowPopArray;
    data[4].y = bluePopArray;
    data[3].y = orangePopArray;
    data[2].y = redPopArray;
    data[1].y = purplePopArray;
    data[0].y = whitePopArray;
    myTimeSeries2 = Plotly.update('myLineChart2', data2, layout2);
}

function generateStatisticsTable() {
    // Get a reference to the table
    let table = document.getElementById('statTable');

    // Clear existing table content
    table.innerHTML = '';

    // Create the table header
    let headerRow = table.insertRow();
    let th0 = headerRow.insertCell(0);
    let th1 = headerRow.insertCell(1);
    let th2 = headerRow.insertCell(2);
    let th3 = headerRow.insertCell(3);
    let th4 = headerRow.insertCell(4);
    let th5 = headerRow.insertCell(5);
    let th6 = headerRow.insertCell(6);
    let th7 = headerRow.insertCell(7);
    let th8 = headerRow.insertCell(8);
    let th9 = headerRow.insertCell(9);
    th0.innerHTML = 'Species';
    th1.innerHTML = 'Birth Distance';
    th2.innerHTML  = 'Reproductive Output';
    th3.innerHTML  = 'Reproduction Distance';
    th4.innerHTML = 'Speed';
    th5.innerHTML = 'Overpopulation Resistance';
    th6.innerHTML = 'Mutation Rate';
    th7.innerHTML = 'Size';
    th8.innerHTML = 'Defensiveness';
    th9.innerHTML = 'Stomach Capacity';

    let statistics = updateStats();
    // Create the specified number of rows
    for(let i = 0; i < hasLevels.length; i++) {
        if(hasLevels[i]) {
            let row = table.insertRow();
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);
            let cell6 = row.insertCell(6);
            let cell7 = row.insertCell(7);
            let cell8 = row.insertCell(8);
            let cell9 = row.insertCell(9);
            cell0.innerHTML = statistics[i][0];
            cell1.innerHTML = statistics[i][1].toFixed(2);
            cell2.innerHTML = statistics[i][2].toFixed(2);
            cell3.innerHTML = statistics[i][3].toFixed(2);
            cell4.innerHTML = statistics[i][4].toFixed(2);
            cell5.innerHTML = statistics[i][5].toFixed(2);
            cell6.innerHTML = statistics[i][6].toFixed(2);
            cell7.innerHTML = statistics[i][7].toFixed(2);
            cell8.innerHTML = statistics[i][8].toFixed(2);
            cell9.innerHTML = statistics[i][9].toFixed(2);
            cell0.className = 'matchup';
        }
    }
}
function generateDeathTable() {
    // Get a reference to the table
    let table = document.getElementById('deathTable');

    // Clear existing table content
    table.innerHTML = '';

    // Create the table header
    let headerRow = table.insertRow();
    let th0 = headerRow.insertCell(0);
    let th1 = headerRow.insertCell(1);
    let th2 = headerRow.insertCell(2);
    let th3 = headerRow.insertCell(3);
    let th4 = headerRow.insertCell(4);
    th0.innerHTML = 'Species';
    th1.innerHTML = 'Overpopulation';
    th2.innerHTML = 'Predation';
    th3.innerHTML = 'Starvation';
    th4.innerHTML = 'Age';

    let statistics = updateStats();
    // Create the specified number of rows
    for(let i = 0; i < hasLevels.length; i++) {
        if(hasLevels[i]) {
            let row = table.insertRow();
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            cell0.innerHTML = statistics[i][0];
            cell1.innerHTML = overpopArray[i];
            cell2.innerHTML = predateArray[i];
            cell3.innerHTML = starveArray[i];
            cell4.innerHTML = natiArray[i];
            cell0.className = 'matchup';
        }
    }
}

// May change from button to onload later
function setup() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    for(let i = 0; i < startingPlants; i++){
        // Adds plants with random coordinates and random genetics to organisms array (birthDistance: 30, maxChild: 2, reproduceRange: 63)
        let org = new Organism(Math.random()*xCanvas, Math.random()*yCanvas, 0, Math.random()*20+20, Math.random()*2+1, Math.random()*50+25, 0, 1.5 + Math.random()*0.2-0.1, 1 + Math.random()*0.2-0.1, 2 + Math.random()-0.5, 40 + Math.random()*20-10, 30 + Math.random()*10-5);
        organisms.push(org);
    }
    generateChart2();
    draw();
    changeIntervalsBack();
    generateStatisticsTable();
    generateDeathTable();
}

function setIntervals(){
    drawInterval = setInterval(draw,drawTime);
    reproduceInterval = setInterval(reproduce,reproduceTime);
    dieInterval = setInterval(die,dieTime);
    predateInterval = setInterval(predate, predateTime);
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
    let breeders = [];
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        breeders.push(org);
    }
    for(let i = 0; i < organisms.length-1; i++){
        let org1 = organisms[i];
        if(breeders.includes(org1) && org1.food >= minFoodToReproduce*org1.diameter){
            for(let j = i+1; j < organisms.length; j++){
                let org2 = organisms[j];
                // Checks if the two organisms are the same species and if they are close enough to reproduce
                if(org1.level === org2.level && breeders.includes(org2) && inRange(org1,org2,average(org1.reproduceRange, org2.reproduceRange)) && org2.food >= minFoodToReproduce*org2.diameter && (org1.diameter*sympatricEvolutionFactor >= org2.diameter && org2.diameter*sympatricEvolutionFactor >= org1.diameter)){
                    //Average of parent mutation rates
                    let m = average(org1.mutationRate, org2.mutationRate);
                    // Average of parent birth distances
                    let b = average(org1.birthDistance, org2.birthDistance);
                    // Randomizes coordinates with range birth distance
                    let xPos = average(org1.x,org2.x) + Math.random()*b*m - b/2*m;
                    let yPos = average(org1.y, org2.y) + Math.random()*b*m - b/2*m;
                    // Randomizes birth distance with range 10
                    let birthDistance = b + Math.random()*10*m - 5*m;
                    let level;
                    let rand = Math.random();
                    // Species Mutations
                    if(rand > 1 - evolutionRate*m){
                        level = org1.level + 1;
                    }
                    else if(rand < evolutionRate*m && org1.level !== 0){
                        level = org1.level - 1;
                    }
                    else{
                        level = org1.level;
                    }
                    // Randomizes maximum children, range 2
                    let maxChild = average(org1.maxChild, org2.maxChild) + Math.random()*2*m - 1*m;
                    // Randomizes reproduction rang, range 20
                    let reproduceRange = average(org1.reproduceRange, org2.reproduceRange) + Math.random()*20*m - 10*m;
                    // Checks if new organism is on canvas
                    let speed = 0;
                    if(level >= 2){
                        speed = average(org1.speed, org2.speed) + Math.random()*m - 0.5*m;
                        if(speed < 0){
                            speed = 0;
                        }
                    }
                    let crowded = average(org1.crowded, org2.crowded) + Math.random()*0.2*m - 0.1*m;
                    if(crowded > 3){
                        crowded = 3;
                    }
                    let mutationRate = average(org1.mutationRate, org2.mutationRate) + Math.random()*0.2*m - 0.1*m;
                    let diameter = average(org1.diameter, org2.diameter) + Math.random()*m - 0.5*m;
                    if(diameter < 2){
                        diameter = 2;
                    }
                    if(level === 0){
                        diameter = 2;
                    }
                    let scaredDistance = average(org1.scaredDistance, org2.scaredDistance) + Math.random()*10*m - 5*m;
                    let stomachCapacity = average(org1.stomachCapacity, org2.stomachCapacity) + Math.random()*10*m -5*m;
                    // Birth food taken from parents
                    if(org1.level > 0) {
                        org1.food -= diameter;
                        org2.food -= diameter;
                    }
                    if(xPos >= mobileDiameter && xPos <= xCanvas - mobileDiameter && yPos >= mobileDiameter && yPos <= yCanvas - mobileDiameter){
                        let newOrg = new Organism(xPos, yPos, level, birthDistance, maxChild, reproduceRange, speed, crowded, mutationRate, diameter, scaredDistance, stomachCapacity);
                        newBorn.push(newOrg);
                    }
                    org1.numChild ++;
                    org2.numChild ++;
                    // Checks if the organisms have produced max offspring
                    if(org1.numChild >= org1.maxChild){
                        breeders.splice(j,1);
                    }
                    if(org2.numChild >= org2.maxChild){
                        breeders.splice(i,1);
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
    generateStatisticsTable();
    generateDeathTable();
    updateTimeSeriesGraph();
    updateTimeSeriesGraph2();
}

//Checks to see if predator organisms are touching prey organisms. Kills prey, increments food for predator.
function predate(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        if(org1.level !== 0){
            for(let j = 0; j < organisms.length; j++){
                let org2 = organisms[j];
                if(!temp.includes(org2) && (org1.level === org2.level+1 || org1.level === org2.level+2) && inRange(org1,org2,org1.diameter + org2.diameter) && org1.food <= org1.stomachCapacity){
                    temp.push(org2);
                    //Predation death
                    predateArray[org2.level]++;
                    org1.food += org2.diameter;
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
            if (org1.level === org2.level && inRange(org1, org2, average(org1.diameter/org1.crowded, org2.diameter/org1.crowded))) {
                if(org1.diameter < org2.diameter) {
                    dead.push(org1);
                    overpopArray[org1.level]++
                }
                else {
                    dead.push(org2);
                    overpopArray[org2.level]++;
                }
                //Population Death
            }
        }
        if(org1.timeAlive >= org1.lifeSpan){
            dead.push(org1);
            natiArray[org1.level]++;
            //Natural Death
        }
        if(org1.level > 0){
            org1.food -= org1.speed*energyConversion*org1.diameter ;
            if(org1.speed*energyConversion*org1.diameter <= 0) {
                org1.food -= 0.3;
            }
        }
        if(org1.level > 0 && org1.food <= 0){
            dead.push(org1);
            starveArray[org1.level]++;
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
    let answer = [];
    //Finds average statistics for each species
    for(let i = 0; i < hasLevels.length; i++) {
        //counts the species of level i
        let levelOrgs = [];
        let birthDistanceSum = 0;
        let childSum = 0;
        let reproduceRangeSum = 0;
        let speedSum = 0;
        let crowdedSum = 0;
        let mutationSum = 0;
        let sizeSum = 0;
        let scaredSum = 0;
        let stomachSum = 0;
        for (let k = 0; k < organisms.length; k++) {
            let org = organisms[k]
            if (org.level === i) {
                birthDistanceSum += org.birthDistance;
                if (org.maxChild > 1) {
                childSum += org.maxChild;
                }
                else{
                    childSum += 1;
                }
                reproduceRangeSum += org.reproduceRange;
                speedSum += org.speed;
                crowdedSum += org.crowded;
                mutationSum += org.mutationRate;
                sizeSum += org.diameter;
                scaredSum += org.scaredDistance;
                stomachSum += org.stomachCapacity;
                levelOrgs.push(org);
            }
        }
        // Updates has species booleans
        hasLevels[i] = levelOrgs.length !== 0;
        let len = levelOrgs.length
        let thisAnswer = [colors[i], birthDistanceSum/len, childSum/len, reproduceRangeSum/len, speedSum/len, crowdedSum/len, mutationSum/len, sizeSum/len, scaredSum/len, stomachSum/len];
        for(let j = 0; j < thisAnswer.length; j++){
            if (typeof thisAnswer[j] === 'number') {
                if(thisAnswer[j] < 0) {
                    thisAnswer[j] = 0;
                }
            }
        }
        answer.push(thisAnswer);
    }
    return answer;
}

function moveOrganisms(){
    for(let i = 0; i < organisms.length; i++){
        if(organisms[i].level > 1){
            let org = organisms[i];
            let hungry = false;
            let scared = false;
            let inReproduceRange = false;
            let overpopulationRisk = false;
            let preyCount = 0;
            let predatorCount = 0;
            let mateCount = 0;
            org.prey= new Organism(0,0,0,0,0,0,0,0,0,0,0,0);
            let predator= new Organism(0,0,0,0,0,0,0,0,0,0,0,0);
            let mate= new Organism(0,0,0,0,0,0,0,0,0,0,0,0);
            if(org.food <= 15){
                hungry = true;
            }
            for(let j = 0; j < organisms.length; j++) {
                if (j !== i) {
                    let tempOrg = organisms[j];
                    if(inRange(org, tempOrg, average(org.diameter/Math.pow(org.crowded,3),tempOrg.diameter/Math.pow(tempOrg.crowded,3)))){
                        overpopulationRisk = true;
                    }
                    if (tempOrg.level > org.level && findDistance(org, tempOrg) <= scaredDistance) {
                        scared = true;
                    }
                    if (tempOrg.level > org.level) {
                        predatorCount += 1;
                        predator = tempOrg;
                    }
                    if (tempOrg.level < org.level) {
                        preyCount += 1;
                        org.prey = tempOrg;
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
            if(overpopulationRisk){
                let minDistance = Number.MAX_SAFE_INTEGER;
                let closest = new Organism(0,0,0,0,0,0,0,0,0,0,0,0);
                for(let j = 0; j < organisms.length; j++){
                    let tempOrg = organisms[j];
                    if(tempOrg.level === org.level && findDistance(org, tempOrg) < minDistance && tempOrg !== org){
                        closest = tempOrg;
                        minDistance = findDistance(org, tempOrg);
                    }
                }
                moveAway(org, closest);
            }
            else if(hungry && preyCount >= 1){
                if(predateCount % 1 === 0){
                    changePrey(org);
                }
                moveTo(org, org.prey);
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
        if(tempOrg.level === org.level-2 || tempOrg.level === org.level-1){
            if(findDistance(org, tempOrg) < minDistance){
                org.prey = tempOrg;
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
    purplePopArray = [];
    whitePopArray = [];
    timeArray = [];
    overpopArray = [0,0,0,0,0,0,0];
    predateArray = [0,0,0,0,0,0,0];
    natiArray = [0,0,0,0,0,0,0];
    starveArray = [0,0,0,0,0,0,0];
    context.clearRect(0,0, canvas.width, canvas.height);
    context.closePath();
    hasLevels = [false, false, false, false, false, false, false];
    clearIntervals();
    pause();
    generateStatisticsTable();
    generateDeathTable();
    generateTimeSeriesGraph();
    generateTimeSeriesGraph2();
    generateChart2();
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
    purplePopArray.push(purpleCount);
    whitePopArray.push(whiteCount);
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