var dog,sadDog,happyDog, hungryDog, database, foodStockRef;
var frameCountNow = 0;
var foodS,foodStock;

var fedTime,lastFed;
var feed,addFood;

var milk,input,name;
var gameState = "hungry";
var input, button;

var foodObj;
var play,bath,play,eat;
var currentTime
var bedroomIMG, washroomIMG, gardenIMG, sleepIMG, runIMG;

function preload(){
      hungryDog = loadImage("images/Dog-Copy.png")
      sadDog=loadImage("images/Dog.png");
      happyDog=loadImage("images/happy dog.png");
      washroomIMG = loadImage("images/Wash Room.png");
      bedroomIMG = loadImage("images/Bed Room.png");
      gardenIMG = loadImage("images/Garden.png");
      sleepIMG = loadImage("images/Lazy.png");
      runIMG = loadImge("images/running.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  readState=database.ref('gameState');
  readState.on("value", function(data){
  gameState=data.val();

  })

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.addAnimation("hungry",hungryDog);
  dog.asddAnimation("")
  
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  eat = createButton("Feed");
  eat.position(520,95);

  bath = createButton("Bath");
  bath.position(620,95);

  sleep = createButton("Sleep");
  sleep.position(300,95);

  play = createButton("Play");
  play.position(230,95);

}


function draw() {
  background("orange");
  foodObj.display();

      currentTime = hour();
      if(currentTime==(lastFed)){
        update("Playing");
        foodObj.garden();
      }else if(currentTime==(lastFed+2)){
        update("Sleeping");
        foodObj.bedroom();

      }else if(currentTime>(lastFed+2)&& currnetTime<=(lastFed+4)){
        update("Bathing");
        foodObj.washroom();


      }else{
        update("Hungry")
        foodObj.display();
      }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);

    
  }
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
database.ref('/').update({
  gameState:state
});

}