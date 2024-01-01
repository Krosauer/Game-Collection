let stationaryDiameter = 2;
let mobileDiameter = 4;
// Array of all current organisms
let organisms = [];
// Canvas dimensions
let xCanvas = 300;
let yCanvas = 150;
// Organisms at beginning of game
let startingPlants = 100;
let startingAnimals = 50;

let drawInterval;
let predateInterval;
let dieInterval;
let reproduceInterval;
// Chance that an organism will be born mutated as another species
let evolutionRate = .001;
// Checks if the organism array contains organisms with species of level 1,2
let hasL1 = false;
let hasL2 = false;
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
            this.lifeSpan = 70;
        }
        this.diameter = stationaryDiameter;
        if(this.level >= 2){
            this.diameter = mobileDiameter;
        }
    }
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
    draw();
    changeIntervalsBack();
}

function setIntervals(){
    dieInterval = setInterval(die,100);
    predateInterval = setInterval(predate, 100);
    drawInterval = setInterval(draw,50);
    reproduceInterval = setInterval(reproduce,200);
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
    if(hasL2 && !intervalHasChanged){
        changeIntervals();
        intervalHasChanged = true;
    }
    if(!hasL2 && intervalHasChanged){
        changeIntervalsBack();
        intervalHasChanged = false;
    }
    moveOrganisms();
}


function reproduce(){
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
                    // Randmizes coordinates with range birth distance
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
                    // Randomizes maximimum children, range 2
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
        let org = newBorn[i]
        organisms.push(org);
    }
    updateStats();
}

//Checks to see if predator organisms are touching prey organisms. Kills prey, increments food for predator.
function predate(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        if(org1.level !== 0){
            for(let j = 0; j < organisms.length; j++){
                let org2 = organisms[j];
                if(!temp.includes(org2) && org1.level > org2.level && inRange(org1,org2,org1.diameter + org2.diameter)){
                    temp.push(org2);
                    org1.food += 5;
                }
            }
        }
    }
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < temp.length; j++){
            if(organisms[i] === temp[j]){
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
    }
    // Updates has species booleans
    if(level1Orgs.length === 0){
        hasL1 = false;
    }
    if(level2Orgs.length === 0){
        hasL2 = false;
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
    }
    // Printed statistics
    let name0 = "Cyanobacteria:"
    let l0BD = "Average birth distance: " + level0BirthDistanceSum / level0Orgs.length;
    let l0CN = "Average offspring count: " + level0ChildSum / level0Orgs.length;
    let l0RR = "Average reproduction range: " + level0ReproduceRangeSum / level0Orgs.length;
    let name1 = "Zooplankton:"
    let l1BD = "Average birth distance: " + level1BirthDistanceSum / level1Orgs.length;
    let l1CN = "Average offspring count: " + level1ChildSum / level1Orgs.length;
    let l1RR = "Average reproduction range: " + level1ReproduceRangeSum / level1Orgs.length;
    let name2 = "Fish:"
    let l2BD = "Average birth distance: " + level2BirthDistanceSum / level2Orgs.length;
    let l2CN = "Average offspring count: " + level2ChildSum / level2Orgs.length;
    let l2RR = "Average reproduction range: " + level2ReproduceRangeSum / level2Orgs.length;
    let answer = "\n" + name0 + "\n" + l0BD + "\n" + l0CN + "\n" + l0RR;
    if(hasL1){
        answer += "\n" + name1 + "\n" + l1BD + "\n" + l1CN + "\n" + l1RR;
    }
    if(hasL2){
        answer += "\n" + name2 + "\n" + l2BD + "\n" + l2CN + "\n" + l2RR;
    }
    document.getElementById('stats').innerText = answer;
}

function moveOrganisms(){
    for(let i = 0; i < organisms.length; i++){
        if(organisms[i].level > 1){
            let org = organisms[i];
            let hungry = false;
            let scared = false;
            let preyCount = 0;
            let predatorCount = 0;
            let mateCount = 0;
            let lastPrey;
            let lastPredator;
            let lastMate;
            if(org.food <= 5){
                hungry = true;
            }
            for(let j = 0; j < organisms.length; j++){
                let tempOrg = organisms[j];
                if(j !== i && tempOrg.level > org.level){
                    scared = true;
                }
                if(tempOrg.level > org.level){
                    predatorCount += 1;
                    lastPredator = tempOrg;
                }
                if(tempOrg.level < org.level){
                    preyCount += 1;
                    lastPrey = tempOrg;
                }
                if(tempOrg.level === org.level){
                    mateCount += 1;
                    lastMate = tempOrg;
                }
            }

            if(hungry && preyCount >= 1){
                let prey = lastPrey;
                for(let j = 0; j < organisms.length; j++){
                    let tempOrg = organisms[j];
                    let minDistance = Number.MAX_SAFE_INTEGER;
                    if(tempOrg.level < org.level){
                        if(findDistance(org, tempOrg) < minDistance){
                            prey = tempOrg;
                            minDistance = findDistance(org, tempOrg);
                        }
                    }
                }
                moveTo(org, prey);
            }
            else if(scared && predatorCount >= 1){
                let predator = lastPredator;
                for(let j = 0; j < organisms.length; j++){
                    let tempOrg = organisms[j];
                    let minDistance = Number.MAX_SAFE_INTEGER;
                    if(tempOrg.level > org.level){
                        if(findDistance(org, tempOrg) < minDistance){
                            predator = tempOrg;
                            minDistance = findDistance(org, tempOrg);
                        }
                    }
                }
                moveAway(org, predator);
            }
            else{
                if(mateCount >= 2) {
                    let mate = lastMate;
                    for (let j = 0; j < organisms.length; j++) {
                        let tempOrg = organisms[j];
                        let minDistance = Number.MAX_SAFE_INTEGER;
                        if (tempOrg.level === org.level) {
                            if (findDistance(org, tempOrg) < minDistance) {
                                mate = tempOrg;
                                minDistance = findDistance(org, tempOrg);
                            }
                        }
                    }
                    moveTo(org, mate);
                }
            }
        }
    }
}

function moveTo(org, goal){
    let distance = findDistance(org, goal);
    let dx = (org.x - goal.x) / distance;
    let dy = (org.y - goal.y) / distance;
    console.log(1 === Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
    console.log("old x" + org.x);
    console.log("old y" + org.y);
    org.x += dx;
    org.y += dy;
    console.log("Is Moving");
    console.log("new x" + org.x)
    console.log("new y" + org.y);
}

function moveAway(org, danger){
    let distance = findDistance(org, danger);
    let dx = (org.x - danger.x) / distance;
    let dy = (org.y - danger.y) / distance;
    console.log(1 === Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
    org.x -= dx;
    org.y -= dy;
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
    context.clearRect(0,0, canvas.width, canvas.height);
    context.closePath();
    hasL1 = false;
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