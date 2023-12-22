var clicks = 0;
var perClick = 1;
var perClickPrice = {1:50,2:300,3:5000};//how much it costs per level for the per click powerup
var perClickLevel = 1;


function onClickMain() {
  //add click increment to display
  clicks += perClick;
  document.getElementById("clicks").innerHTML = clicks;
};

function onClickIncrease(){
  //if you have enough money, increase level

  if (document.getElementById("clicks").innerHTML > perClickPrice[perClickLevel]) {
    document.getElementById("clicks").innerHTML = clicks-perClickPrice[perClickLevel];
    perClickLevel += 1;
    increaseClick(level + 1)
  }

}
function increaseClick(level){
  //based on what level you are on, perClick will increase
  if (level === 1) {
    perClick = 5;
  }
  if (level === 2) {
    perClick = 10;
  }

}