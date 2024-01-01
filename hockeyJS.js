function toggleDropdown() {
    var dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
let mainTeam = newTeam("Wild", 3, 3);
class team{
    constructor(name, offense, defense){
        this.name = name;
        this.offense = offense;
        this.defense = defense;
    }
}

function setup(){
    chooseTeam()
    //var url = 'hocp1.html';
    //var popupOptions = 'width=500,height=300,scrollbars=yes';
    //window.open(url, 'PopupWindow', popupOptions);
}

function chooseTeam(){
    let yourTeam = prompt
}

function playGame(team1, team2){
    let score1 = Math.ceiling(Math.random()*team1.offense - Math.random()*team2.defense) + 3;
    let score2 = Math.ceiling(Math.random()*team2.offense - Math.random()*team1.defense) + 3;
    let score = score1 + '-' + score2;
    let winner;
    if(score1 < 0){
        score1 = 0;
    }
    if(score2 < 0){
        score2 = 0;
    }
    if(score1 > score2){
        winner = team1.name;
    }
    else if(score2 < score1){
        winner = team2.name;
    }
    else{
        winner = 'draw';
    }
    return {'winner':winner,'score':score};
}