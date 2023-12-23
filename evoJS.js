let orgDiameter = 2;
let organisms = [];
let xCanvas = 300;
//with #myCanvas width = 1024px
let yCanvas = 150;
//with #myCanvas height = 526px
let startingPlants = 10;
let drawInterval;
let predateInterval;
let dieInterval;
let reproduceInterval;
let evolutionRate = .001;
let count = 0;
let hasL1 = false;
let hasL2 = false;

let canvas;
let context;

function Organism(xPos, yPos, levelP, birthDistance, maxChildP, reproduceRangeP){
    this.x = xPos;
    this.y = yPos;
    this.level = levelP
    this.diameter = orgDiameter;
    this.timeAlive = 0;
    this.birthDistance = birthDistance;
    this.numChild = 0;
    this.maxChild = maxChildP;
    this.reproduceRange = reproduceRangeP
    if(levelP > 0){
        this.food = 10;
        this.lifeSpan = 50;
    }
    else{
        this.food = 1;
        this.lifeSpan = 10;
    }
}

function setup() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    for(let i = 0; i < startingPlants; i++){
        let org = new Organism(Math.random()*xCanvas, Math.random()*yCanvas, 0, Math.random()*20 + 20, Math.random()*2 + 1, Math.random()*50 + 25)
        organisms.push(org);
    }
    draw();
    clearIntervals();
    setIntervals();
}

function setIntervals(){
    predateInterval = setInterval(predate, 99);
    drawInterval = setInterval(draw,200);
}
function clearIntervals(){
    clearInterval(drawInterval);
}

function draw() {
    count++;
    //console.log(count + "-----------------------------")
    context.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        context.beginPath();
        context.ellipse(org.x,org.y,orgDiameter,orgDiameter,0,0,2 * Math.PI);
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
    reproduce();
    die();
    updateStats();
}


function reproduce(){
    let temp = [];
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
                if(org1.level === org2.level && horny.includes(org2) && inRange(org1,org2,average(org1.reproduceRange, org2.reproduceRange))){
                    org1.food -= 5;
                    org2.food -= 5;
                    let b = average(org1.birthDistance, org2.birthDistance);
                    let xPos = average(org1.x,org2.x) + Math.random()*b - b/2;
                    let yPos = average(org1.y, org2.y) + Math.random()*b - b/2;
                    let rand = Math.random();
                    let birthDistance = b + Math.random()*10 - 5;
                    let level;
                    if(rand > 1 - evolutionRate){
                        level = org1.level + 1;
                    }
                    else if(rand < evolutionRate && org1.level !== 0){
                        level = org1.level - 1;
                    }
                    else{
                        level = org1.level;
                    }
                    let maxChild = average(org1.maxChild, org2.maxChild) + Math.random()*2 - 1;
                    let reproduceRange = average(org1.reproduceRange, org2.reproduceRange) + Math.random()*20 - 10
                    if(xPos >= orgDiameter && xPos <= xCanvas - orgDiameter && yPos >= orgDiameter && yPos <= yCanvas - orgDiameter){
                        let newOrg = new Organism(xPos, yPos, level, birthDistance, maxChild,reproduceRange);
                        temp.push(newOrg);
                    }
                    org1.numChild ++;
                    org2.numChild ++;
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
    for(let i = 0; i < temp.length; i++){
        let org = temp[i]
        organisms.push(org);
    }
}

function predate(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        if(org1.level !== 0){
            org1.food -= 1;
            for(let j = 0; j < organisms.length; j++){
                let org2 = organisms[j];
                if(!temp.includes(org2) && org1.level - 1 === org2.level && inRange(org1,org2,org1.diameter + org2.diameter)){
                    temp.push(org2);
                    org1.food += 5;
                    //console.log("Predation Death");
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

function die(){
    let temp = [];
    for(let i = 0; i < organisms.length; i++){
        let org1 = organisms[i];
        org1.timeAlive++;
        for(let j = i+1; j < organisms.length; j++) {
            let org2 = organisms[j];
            //console.log(org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter)))
            if (org1.level === org2.level && inRange(org1, org2, average(org1.diameter, org2.diameter))) {
                temp.push(org1);
                temp.push(org2);
                //console.log("Population Death");
            }
        }
        if(org1.timeAlive >= org1.lifeSpan){
            temp.push(org1);
            //console.log("Natural Death");
        }
        if(org1.level > 0 && org1.food <= 0){
            temp.push(org1);
            //console.log("Food Limited Death");
        }
    }
    //print(temp)
    for(let i = organisms.length - 1; i >= 0; i--){
        for(let j = 0; j < temp.length; j++){
            if(organisms[i] === temp[j]){
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
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        if(org.level === 0){
            level0Orgs[i] = org;
        }
    }
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        if(org.level === 1){
            level1Orgs[i] = org;
        }
    }
    for(let i = 0; i < organisms.length; i++){
        let org = organisms[i];
        if(org.level === 2){
            level2Orgs[i] = org;
        }
    }
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
    for(let k = 0; k < organisms.length; k++){
        if(organisms[k].level === 0) {
            level0BirthDistanceSum += organisms[k].birthDistance;
            level0ChildSum += organisms[k].maxChild;
            level0ReproduceRangeSum += organisms[k].reproduceRange;
        }
        if(organisms[k].level === 1){
            hasL1 = true;
            level1BirthDistanceSum += organisms[k].birthDistance;
            level1ChildSum += organisms[k].maxChild;
            level1ReproduceRangeSum += organisms[k].reproduceRange;
        }
        if(organisms[k].level === 2){
            hasL2 = true;
            level2BirthDistanceSum += organisms[k].birthDistance;
            level2ChildSum += organisms[k].maxChild;
            level2ReproduceRangeSum += organisms[k].reproduceRange;
        }
    }
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
    //console.log(level1Orgs.length)
    let answer = "\n" + name0 + "\n" + l0BD + "\n" + l0CN + "\n" + l0RR;
    if(hasL1){
        answer += "\n" + name1 + "\n" + l1BD + "\n" + l1CN + "\n" + l1RR;
    }
    if(hasL2){
        answer += "\n" + name2 + "\n" + l2BD + "\n" + l2CN + "\n" + l2RR;
    }
    document.getElementById('stats').innerText = answer;
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

function average(num1, num2){
    return (num1 + num2) / 2;
}