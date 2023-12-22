let clicks = 0;
let perClick = 1;
let increasePerClickPrice = 5;
let farmerPrice = 5;
let farmerInterval = 100;
let farmerProductivity = 1;
let farmerNum = 0;
let foodNum = 0;
let foodSellAmount = 10;
let foodSellPrice = 1;
let foodPriceChangerInterval = 1000;

function setup(){
  document.getElementById("foodSellPrice") = foodSellPrice;
  setIntervals();
}

function setIntervals(){
  setInterval(farmerGrowsFood, farmerInterval);
  setInterval(foodPriceChanger, foodPriceChangerInterval);
}

function onClickMain() {
  //add click increment to display
  clicks += perClick;
  updateClicks()
}

function increasePerClick(){
  if(clicks - increasePerClickPrice >= 0){
    perClick += 1;
    clicks -= Math.ceil(increasePerClickPrice);
    increasePerClickPrice *= 1.5;
    increasePerClickPrice = Math.ceil(increasePerClickPrice);
    document.getElementById("clickPrice").innerHTML = increasePerClickPrice;
    updateClicks();
  }
}

function buyFarmer(){
  if(clicks - farmerPrice >= 0){
    farmerNum += 1
    clicks -= farmerPrice;
    farmerPrice *= 1.5;
    farmerPrice = Math.ceil(farmerPrice);
    document.getElementById("farmerPrice").innerHTML = farmerPrice;
    document.getElementById("farmerNumber").innerHTML = farmerNum;
    updateClicks();
  }
}

function farmerGrowsFood(){
  foodNum += farmerNum * farmerProductivity;
  document.getElementById("foodNum").innerHTML = foodNum;
}

function sellFood(){
  if(foodNum - foodSellAmount >= 0){
    foodNum -= foodSellAmount;
    clicks += foodSellAmount * foodSellPrice;
    updateClicks()
  }
}

function updateClicks(){
  document.getElementById("clicks").innerHTML = clicks;
}

function foodPriceChanger(){
  let foodPrice = Math.random()*20;
  document.getElementById("foodSellPrice") = foodPrice;
}