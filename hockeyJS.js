function toggleDropdown() {
    let dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
function removeButton() {
    // Get a reference to the button element
    let button = document.getElementById('myButton');

    // Check if the button exists
    if(button) {
        // Remove the button from its parent node
        button.parentNode.removeChild(button);
    }
}
class team{
    constructor(name, offense, defense){
        this.name = name;
        this.offense = offense;
        this.defense = defense;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.gamesPlayed = 0;
        this.hasPlayed = [];
    }
}

let wild = new team('Wild',3.06,3.17);
let blackhawks = new team('Blackhawks', 2.42, 3.78);
let jets = new team('Jets', 3.34, 2.49);
let avalanche = new team('Avalanche',3.59,2.97);
let flames = new team('Flames',3.06,3.17);
let oilers = new team('Oilers', 2.42, 3.78);
let kraken = new team('Kraken', 3.34, 2.49);
let canucks = new team('Canucks',3.59,2.97);
let league = [wild, blackhawks, jets, avalanche,flames,oilers,kraken,canucks];
let mainTeam = wild;
let week = 0;
let playWeek = 0;
let calendar = [];
let numWeeks = league.length - 1;
let playoffNum = 3;

function setup(){
    generateStandingsTable();
    generateCalendar();
    generateScheduleTable();
}

function chooseTeam(team1) {
    for (let i = 0; i < league.length; i++) {
        if (league[i].name === team1) {
            mainTeam = league[i];
        }
    }
    removeButton();
    document.getElementById('yourTeam').innerHTML = "Your Team: " + mainTeam.name;
}

function playGame(team1, team2){
    team1.gamesPlayed++;
    team2.gamesPlayed++;
    document.getElementById('currentGame').innerHTML = team1.name + ' vs ' + team2.name;
    let score1 = Math.ceil(Math.random() * team1.offense - Math.random() * team2.defense) + 3;
    let score2 = Math.ceil(Math.random() * team2.offense - Math.random() * team1.defense) + 3;
    let score = score1 + '-' + score2;
    let winner;
    if (score1 < 0) {
        score1 = 0;
    }
    if (score2 < 0) {
        score2 = 0;
    }
    if (score1 > score2) {
        winner = team1.name;
        team1.wins++;
        team2.losses++;
    } else if (score2 > score1) {
        winner = team2.name;
        team1.losses++;
        team2.wins++;
    } else {
        winner = 'draw';
        team1.draws++;
        team2.draws++;
    }

    generateStandingsTable();
    return {'winner': winner, 'score': score};
}

function simAllGames(except){
    if(week < numWeeks) {
        for (let i = 0; i < calendar[week].length; i++) {
                let team = calendar[week][i][0];
                let opponent = calendar[week][i][1];
                if(team.name !== except.name) {
                    calendar[week][i][2] = playGame(team, opponent)['score'];
            }
        }
        week++;
        playWeek++;
    }
    generateScheduleTable();
}

function generateStandingsTable() {
    // Get a reference to the table
    let table = document.getElementById('standingTable');

    // Clear existing table content
    table.innerHTML = '';

    // Create the table header
    let headerRow = table.insertRow();
    let th0 = headerRow.insertCell(0);
    let th1 = headerRow.insertCell(1);
    let th2 = headerRow.insertCell(2);
    let th3 = headerRow.insertCell(3);
    th0.innerHTML = 'Teams';
    th1.innerHTML = 'Wins';
    th2.innerHTML = 'Losses';
    th3.innerHTML = 'Draws';

    // Create the specified number of rows
    for (let i = 0; i < league.length; i++) {
        let team = league[i];
        let row = table.insertRow();
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3= row.insertCell(3);
        cell0.innerHTML = team.name;
        cell1.innerHTML = team.wins;
        cell2.innerHTML = team.losses;
        cell3.innerHTML = team.draws;
    }
}
function generateScheduleTable() {
    // Get a reference to the table
    let table = document.getElementById('scheduleTable');

    // Clear existing table content
    table.innerHTML = '';

    // Create the table header
    let headerRow = table.insertRow();
    let th0 = headerRow.insertCell(0);
    let th1 = headerRow.insertCell(1);
    th0.innerHTML = 'Matchup';
    th1.innerHTML = 'Score';

    // Create the specified number of rows
    for (let i = 0; i < calendar.length; i++) {
        for(let j = 0; j < calendar[i].length; j++) {
            let row = table.insertRow();
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            cell0.innerHTML = calendar[i][j][0].name + ' vs ' + calendar[i][j][1].name;
            cell1.innerHTML = calendar[i][j][2];
            cell0.className = 'matchup';
        }
    }
}
function generateCalendar(){
    for(let i = 0; i < numWeeks; i++){
        let week1 = [];
        let tempLeague = [];
        for(let j = 0; j < league.length; j++){
            tempLeague.push(league[j]);
        }
        while(tempLeague.length > 0){
            let index1 = Math.floor(Math.random()*tempLeague.length);
            let team = tempLeague[index1];
            tempLeague.splice(tempLeague.indexOf(team),1);
            let index2 = Math.floor(Math.random()*tempLeague.length);
            let opponent = tempLeague[index2];
            let loopCount = 0;
            while(team.hasPlayed.includes(opponent) && loopCount < 10){
                index2 = Math.floor(Math.random()*tempLeague.length);
                opponent = tempLeague[index2];
                loopCount++;
            }
            team.hasPlayed.push(opponent);
            opponent.hasPlayed.push(team);
            tempLeague.splice(tempLeague.indexOf(opponent),1);
            let game1 = [team, opponent, '_-_'];
            week1.push(game1);
        }
        calendar.push(week1);
    }
}

function playoffs(){
    let sorted = [];
    league.sort((a, b) => {
        // Use the localeCompare() method for case-insensitive sorting
        sorted = a.name.localeCompare(b.name);
    });
    while(sorted.length > playoffNum){
        sorted.pop();
    }
    console.log("we're in")
    for(let i = 0; i < sorted.length; i++) {
        document.getElementById('playoffs').innerHTML += '<br>' + sorted[i].name
    }
}