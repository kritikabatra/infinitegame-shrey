//zombie
var zombie ,zombie_running,zombie_stand;

//boy
var boy, boy_running, boy_fall;

//backgorund
var background1, background_img;

//obstacles (rocks)
var rock1, rock2, obstacle

//obstacles (tombstone)
var gravestone_img, gravestone

//power-ups
var arrow, spikes, sword, shield
var arrow_img, spikes_img, sword_img, shield_img
var powerups_Group, power_up

//creating obstacles group
var obstaclesGroup;

//game states
var play = 1, end = 0;
var gameState = play;

//game over button
var gameOver, gameOver_img

//invisible ground
var invisibleGround;

//sounds
var die, checkpoint, jump

var score = 0;

function preload(){ // load images, animations and sound files
  
  //zombie images
  zombie_running = loadAnimation("zombie1.png", "zombie2.png", "zombie3.png", "zombie4.png", "zombie5.png", "zombie6.png",);

  //zombie standing
  zombie_stand= loadAnimation("zombie5.png");

  //boy images
  boy_running = loadAnimation("boy1.png", "boy2.png", "boy3.png", "boy4.png", "boy5.png", "boy6.png", "boy7.png", "boy8.png", "boy9.png", "boy10.png");

  //boy falling image
  boy_fall = loadAnimation("boyfall2.png");
  //background image
  //background_img = loadImage("background.png")
  background_img = loadImage("bg6.jpg")
  //rocks
  rock1 = loadImage("rock1.png");
  rock2 = loadImage("rock2.png");

  //gravestone
  gravestone_img = loadImage("gravestone.png");

  //game over
  gameOver_img = loadImage("gameOver.png")

  //sounds
  die = loadSound("die.mp3")
  checkpoint = loadSound("checkpoint.mp3")
  jump = loadSound("jump.mp3")

  //power ups
  arrow_img = loadImage("arrow.png");
  spikes_img = loadImage("spikes.png");
  sword_img = loadImage("sword.png");
  shield_img = loadImage("shield.png");
}

function setup()
{ // create sprites, add animation and images, executes its st. only once
 createCanvas(1000,600)

 
 //creating a background sprite
 background1 = createSprite(200, 300 )
 background1.addImage("background", background_img)
 background1.scale = 0.6 ;
 background1.velocityX = -2;

 //power-ups
 powerups_Group = new Group();

 //creating the obstcles group
 obstaclesGroup = new Group();

 //create a zombie sprite
 zombie = createSprite(60,520,40,80);
 zombie.addAnimation("running", zombie_running);
 zombie.addAnimation("standing", zombie_stand);
 zombie.scale = 1;

 //create a boy sprite
 boy = createSprite(200, 570, 40, 80);
 boy.addAnimation("running", boy_running);
 boy.addAnimation("falling", boy_fall);
 boy.scale = 0.5;

 //invisible ground
 invisibleGround = createSprite(400,580,800,10)
 invisibleGround.visible=false;

 //game over
 gameOver = createSprite(500,300,20,20);
 gameOver.addImage("gameOver", gameOver_img);
 //gameOver.scale = 0.7;

  //boy.debug = true;
 boy.setCollider("circle", 0, 20, 70)
 //zombie.debug = true;
 zombie.setCollider("circle" , -18, 0, 25)

}

function draw(){
  background("brown")
  drawSprites();

  textSize(20)
  fill("white");
  text("Distance: " + score, 650, 50);

  //colliding the boy with invisible ground
  boy.collide(invisibleGround);

  console.log(zombie.x);

  if (gameState === play){
    
  //infinite background
  if (background1.x < 250)
  { 
    background1.x = 650;
  }


  //invisible game over
  gameOver.visible = false;

  //Jumping the hero
  if (keyDown("space") && boy.y >= 440) 
  {   
   boy.velocityY = -10;  
   jump.play()
  } 
  
  //stopping the boy from flying
  boy.velocityY = boy.velocityY + 0.5;

  if(zombie.isTouching(obstaclesGroup))
  {
    //obstaclesGroup.destroyEach();
    zombie.velocityX = zombie.velocityX - 0.02;
  }

  //Scoring
  score = score + Math.round(getFrameRate() / 60);

  //power ups giving the zombie its original x position
  if (powerups_Group.isTouching(boy))
  {
    zombie.x = 40;
    powerups_Group.destroyEach();
  }

  if (score > 0 && score % 100 === 0)
  {
    checkpoint.play()
  }

  if (zombie.isTouching(boy))
  {
    //boy.changeAnimation()
    gameState = end;
    die.play()
  }

  //Calling function for obstacle
  spawnObstacles();

  //Calling function for the power-ups
  spawnpowerups();

  //changing the game state to end
  if (obstaclesGroup.isTouching(boy))
 {
  gameState = end;
  //boy.x=obstaclesGroup.x;
  zombie.x=boy.x;
  die.play()
 }

 //speeding the zombie's speed
 zombie.velocityX = (0.22 + score / 9999)

  }

  
 //game state end
 if (gameState === end)
{
 //stopping the movement of the ground
 background1.velocityX = 0;

 //stop the obstacles
 obstaclesGroup.setVelocityXEach(0);

 //stop the power-ups
 powerups_Group.setVelocityXEach(0);

 //stop trex
 boy.velocityY = 0;

 //changing boy animation to collided
 //boy.changeAnimation("boy.collided");
 boy.changeAnimation("falling",boy_fall);

 //changing zombie animation to standing
 zombie.changeAnimation("standing",zombie_stand);

 //making zombie static
 zombie.velocityX =0;

 //changing lifetime for obstacles
 obstaclesGroup.setLifetimeEach(-1);

 ////changing lifetime for power-ups
 powerups_Group.setLifetimeEach(-1);

 //showing game over and restart button
 gameOver.visible = true;

 //calling functiion restart
 if (mousePressedOver(gameOver))
 {
   restart();
 }
}

}
 


// function spawn obstacles
function spawnObstacles()
{
  if (frameCount % 85 === 0)
  {
    obstacle = createSprite(600, 545, 10, 40);
    obstacle.velocityX = -6;

  //var num1 = Math.round(random(1,3));
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(rock1);
              obstacle.scale = 0.34;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 5, 0 , 74)
              break;
      case 2: obstacle.addImage(rock2);
              obstacle.scale = 0.34;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 0, 0 , 74)
              break;
      case 3: obstacle.addImage(gravestone_img);
              obstacle.scale = 0.15;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 0, 0 , 140)
              break;
     default: break;
       
  }
  obstacle.lifetime = 107;
  obstaclesGroup.add(obstacle);
  }
  
}

// function spawn power-ups
function spawnpowerups()
{
  if (frameCount % 300 === 0)
  {
    power_up = createSprite(600, 450, 10, 40);
    power_up.velocityX = -6;

  //var num1 = Math.round(random(1,3));
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: power_up.addImage(shield_img);
              power_up.scale = 0.34;
              break;

      case 2: power_up.addImage(sword_img);
              power_up.scale = 0.1;
              break;

      case 3: power_up.addImage(arrow_img);
              power_up.scale = 0.33;
              break;

      //case 4: power_up.addImage(spikes_img);
              //power_up.scale = 0.5;
              //break;
     default: break;
       
  }
  power_up.lifetime = 107;
  powerups_Group.add(power_up);
  }
  
}

function restart()
{
  gameState = play;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  zombie.x=30;
  //boy.changeAnimation("boy.collided");
 boy.changeAnimation("running",boy_running);

 //changing zombie animation to standing
 zombie.changeAnimation("running", zombie_running);
 background1.velocityX = -2;
  score = 0;
}