console.log("Code ran first time");

var holdingObject = false;
var objectHeld = "";
var uniqueLabel = -1; //this is for a unique id for each added element to workspace

var flourCounter = 0;
var waterCounter = 0; //these are for the dough screen

var madeSauce = true; //if no sauce is made, it wont show up in the pizzaScreen
var playAudio = true;

var workspaceStack = [];

var stacks = { //dictionary for storing the stacks of each workplace
  workspaceDough: [],
  workspaceSauce: [],
  workspacePizza: [],
  workspaceCook: []
};

var currentWorkspace = "workspaceDough";
var currentScreen = "doughScreen";

var sauceDoneness = 0;
var pizzaDoneness = 0;

var score = 0; //each section allocates 400 points, displaying score will be calculatedScore / 400

function pickUp(itemPickedUp) {
  if (holdingObject == false) {               
    console.log("Picked up: " + itemPickedUp);
    objectHeld = itemPickedUp;              
    holdingObject = true;
    return true;
  }
  console.log("Not picked up, already holding item");
  return false; //ie when already holding an object
} //picks up an item

function releaseWorkspace() { //calls when released exclusively over workspace
  if (holdingObject == true) {
    drawReleasedObject(objectHeld);
    console.log("Dropped Over Workspace");
    console.log("Added to workspace: " + objectHeld);
  }
} //calls when released exclusively over workspace

function release() { //calls when mouse is released
  console.log("Release Called");
  holdingObject = false;
  objectHeld = "";
} //calls when mouse is released

function testIfMouseInWorkspace(event) { //returns true if mouse is in workspace coordinates
  var workspacePositionX = getXPosition(currentWorkspace);
  var workspacePositionY = getYPosition(currentWorkspace);
  var workspaceWidth = getProperty(currentWorkspace, "width");
  var workspaceHeight = getProperty(currentWorkspace, "height");
  var mouseX = event.x;
  var mouseY = event.y;
  
  if (mouseX < workspacePositionX || mouseX > workspacePositionX + workspaceWidth) {
    return false;
  }
  if (mouseY < workspacePositionY || mouseY > workspacePositionY + workspaceHeight) {
    return false;
  }
  return true;
} //returns true if mouse is in workspace coordinates

function testIfMouseInBottomRight(event) {
  //for some ungodly reason code.org doesnt let you duplicate ids and i dont want
  //a trillion different next buttons, so this will become the substitute and the actual
  //next "button" will do about nothing, when changing the image make sure you update coordinates
  var mouseX = event.x;
  var mouseY = event.y;
  var x = 180; //x1 pos of the next button
  var y = 375; //y1 pos of the next button
  var dx = 140;//x2 = x + dx
  var dy = 75;//y2 = y + dy
  
  if (mouseX < x || mouseX > x + dx) {
    return false;
  }
  if (mouseY < y || mouseY > y + dy) {
    return false;
  }
  return true;
} //tests for if next button is clicked

function testIfMouseInBottomLeft(event) {
  var mouseX = event.x;
  var mouseY = event.y;
  var x1 = 20; //for normal restart button
  var y1 = 380;
  var dx1 = 95;
  var dy1 = 30;
  
  var y2 = 415; //for restart from beginning button
  var dy2 = 35; //only y is really necessary bc theyre basically the same length
  
  if (mouseX < x1 || mouseX > x1 + dx1) { //out of bounds of any of the buttons in the x direction
    return false;
  }
  if (mouseY < y1 || mouseY > y2 + dy2){ //out of bounds of any of the buttons in the y direction
    return false;
  }
  //now test which button its on, if its not on one its on the other
  if (mouseX > x1 && mouseX < x1 + dx1) {
    if (mouseY > y1 && mouseY < y1 + dy1){
      console.log("Restart screen button clicked");
      return 1; //restart room button
    }
  }
  console.log("Restarting entire application");
  return 2; //restart whole thing
} //tests for if restart buttons are clicked

function restartScreen(){
  console.log("Restarting current screen : " + currentScreen);
  clearWorkspace();
  setScreen(currentScreen);
} //restarts currentScreen

function restartApp(){
  console.log("Restarting application");
  clearWorkspace();
  clearStackDictionary();
  setScreen("startScreen");
} //restarts app

function clearStackDictionary() {
  for (var key in stacks){
    console.log("Clearing " + key + " stack (" + stacks[key].length + " objects)");
    stacks[key] = [];
  }
} //clears the dictionary for restarting game

function drawReleasedObject(objectHeld) { //draws the object added to workspace, also adds to workspace stack
  uniqueLabel ++;
  var xPosition = getXPosition(currentWorkspace);
  var yPosition = getYPosition(currentWorkspace);
  var newElementId = "";
  switch(objectHeld) {
    case "Flour": //instead of adding an image to the workspace, simply increment a counter
      flourCounter ++;
      calculateHydration();
      break;
    case "Water":
      waterCounter ++;
      calculateHydration();
      break;
    case "Tomato Sauce":  
      //newElementId = "tomatoSauceWorkspace" + uniqueLabel;
      //image(newElementId, "tomatoSauceWorkspace.jpg");
      //setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, 0]);
      setProperty("workspaceSauce", "image", "potFilled.png");
      break;
    case "Bacon":
      newElementId = "baconWorkspace" + uniqueLabel;
      image(newElementId, "baconWorkspace.png");
      xPosition += 15;
      yPosition += 10;
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Garlic":
      newElementId = "garlicWorkspace" + uniqueLabel;
      image(newElementId, "garlicWorkspace.png");
      xPosition += 25;
      //yPosition += randomNumber(0, 64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Prezzemolo":
      newElementId = "prezzemoloWorkspace" + uniqueLabel;
      image(newElementId, "prezzemoloWorkspace.png");
      xPosition += 25;
      yPosition += 5;
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "the Sauce":
      newElementId = "sauceWorkspace" + uniqueLabel;
      image(newElementId, "tomatoSauceWorkspace.png");
      xPosition += 7;
      yPosition += 7;
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Mozzarella":
      newElementId = "mozzarellaWorkspace" + uniqueLabel;
      image(newElementId, "mozzarellaWorkspace.png");
      xPosition += randomNumber(0, 64);
      yPosition += randomNumber(0, 64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Tomato":
      newElementId = "tomatoWorkspace" + uniqueLabel;
      image(newElementId, "tomatoWorkspace.png"); 
      xPosition += randomNumber(0, 64);
      yPosition += randomNumber(0, 64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Bell Pepper":
      newElementId = "bellPepperWorkspace" + uniqueLabel;
      image(newElementId, "pepperWorkspace.png");
      xPosition += randomNumber(0, 64);
      yPosition += randomNumber(0, 64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Pepperoni":
      newElementId = "pepperoniWorkspace" + uniqueLabel;
      image(newElementId, "pepperoniWorkspace.png");
      xPosition += randomNumber(0, 64);
      yPosition += randomNumber(0, 64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    case "Sausage":
      newElementId = "sausageWorkspace" + uniqueLabel;
      image(newElementId, "sausageWorkspace.png");
      xPosition += randomNumber(0,64);
      yPosition += randomNumber(0,64);
      setPosition(newElementId, xPosition, yPosition);
      workspaceStack.push([objectHeld, newElementId]);
      break;
    default:
      console.log("Object held does not match any cases");
      break;
  }
} //draws the object added to workspace, also adds to workspace stack

function removeFromWorkspace() { //removes object from workspace
  //this is probably super confusing; it uses a 2d array which stores the unique id
  //of the element to remove, along with the object it is for the pickUp function
  //it works Lol, but the way it is stored is [ObjectHeld, idOfTheElement]
  var topOfStackIndex = workspaceStack.length - 1;
  var topOfStack = workspaceStack[topOfStackIndex];
  console.log("Removed from workspace: " + topOfStack[0]);
  pickUp(topOfStack[0]);
  deleteElement(topOfStack[1]);
  workspaceStack.pop();
} //removes object from workspace

function moveScreenForward(curScreen) {
  switch(curScreen) {
    case "doughScreen":
      currentScreen = "sauceScreen";
      currentWorkspace = "workspaceSauce";
      console.log("Moved to: " + currentScreen);
      setScreen(currentScreen);
      if (playAudio == true) {
        playSpeech("Mamma Mia you gotta maka da sauce! Donta burn it!", "male", "Italiano");
      }
      //write(currentWorkspace);
      return true;
    case "sauceScreen":
      currentScreen = "pizzaScreen";
      currentWorkspace = "workspacePizza";
      console.log("Moved to: " + currentScreen);
      setScreen(currentScreen);
      if (playAudio == true) {
        playSpeech("Okay Dokay you gotta adda da toppings!", "male", "Italiano");
      }
      if (madeSauce == false) {
        hideElement("saucePickup");
        hideElement("yourSauceLabel");
      }
      else {
        showElement("saucePickup");
        showElement("yourSauceLabel");
      }
      //write(currentWorkspace);
      return true;
    case "pizzaScreen":
      currentScreen = "cookScreen";
      currentWorkspace = "workspaceCook";
      console.log("Moved to:" + currentScreen);
      setScreen(currentScreen);
      if (playAudio == true) {
        playSpeech("Madonna mia donta burna my pizza!", "male", "Italiano");
      }
      //write(currentWorkspace);
      return true;
    case "cookScreen":
      currentScreen = "resultsScreen";
      console.log("Moved to: " + currentScreen);
      setScreen(currentScreen);
      if (playAudio == true) {
        playSpeech("Okay letsa seea how youa did.", "male", "Italiano");
      }
      //write("Results:");
      finalizeResults();
      return true;
    default:
      console.log("Reached the End");
      setScreen("startScreen");
  } 
} //advances to the next screen

function clearWorkspace() { //iterates over the workspace stack and clears it
  if (currentScreen == "doughScreen") {
    flourCounter = 0; //resets dough screen stuff as well
    waterCounter = 0;
    setText("hydrationPercentage", "Current Hydration : ");
    setProperty("workspaceDough", "image", "flourBowlEmpty.png");
  }
  else if (currentScreen == "sauceScreen") {
    stopTimedLoop();
    sauceDoneness = 0;
    setProperty("temperatureSliderSauce", "value", 0);
    setProperty("workspaceSauce", "image", "potEmpty.png");
    setText("temperatureLabelSauce", "Temperature : 0°C");
    setText("saucePercentage", "Not Cooking");
    if (workspaceStack.length < 2) {
      console.log("No sauce created");
      madeSauce = false;
    }
    else {
      madeSauce = true;
    }
  }
  else if (currentScreen == "cookScreen") {
    stopTimedLoop();
    pizzaDoneness = 0;
    setProperty("temperatureSliderCook", "value", 0);
    setText("temperatureLabelCook", "Temperature : 0°C");
    setText("cookPercentage", "Not Cooking");
  }
  if (workspaceStack.length < 1) {
    console.log("Did not clear workspace: empty");
    return false;
  }
  for (var i = 0; i < workspaceStack.length; i ++) {
    if (workspaceStack[i][1] == "cookTime" || workspaceStack[i][1] == "doughHydration" || workspaceStack[i][0] == "Tomato Sauce") {
      continue;
    }
    deleteElement(workspaceStack[i][1]);
  }
  workspaceStack = [];
  console.log("Cleared workspace: " + workspaceStack);
} //iterates over the workspace stack and clears it

function logStack(currentStack) { //logs the current stack for moving to next screen
  stacks[currentWorkspace] = currentStack; //adds to the dictionary
  console.log("Logged " + currentStack + " in current workspace: " + currentWorkspace);
  console.log("Stacks dictionary (" + currentWorkspace + "): " + stacks[currentWorkspace]);
} //logs the current stack for moving to next screen

function calculateHydration() { //calculates hydration of the dough
  if (flourCounter < 1) {
    return false;
  }
  var hydration = waterCounter / flourCounter;
  console.log("Current Dough Hydration : " + hydration * 100 + "%");
  if (hydration <= 1.5) {
    setText("hydrationPercentage", "Current Hydration : " + Math.floor(hydration * 100) + "%");
  }
  else if (hydration > 1.5) {
    setText("hydrationPercentage", "Current Hydration : SOUP!");
    setProperty("workspaceDough", "image", "flourBowlWater.png");
  } //sets to wet flour bowl
  if (flourCounter > 0 && waterCounter == 0) {
    setProperty("workspaceDough", "image", "flourBowlDry.png");
  } //sets to dry flour bowl
  else if (hydration < 0.5){
    setProperty("workspaceDough", "image", "flourBowlDry.png");
  } //sets to dry flour bowl
  else if (hydration < 1.5) {
    setProperty("workspaceDough", "image", "flourBowlGood.png");
  } //sets to good flour bowl
  return hydration * 100;
} //calculates hydration of the dough

function percentError(measuredValue, expectedValue) {
  if (expectedValue <= 0) {
    return 0;
  }
  var error = (measuredValue - expectedValue) / expectedValue;
  if (error > 1) {
    return 100;
  }
  if (error < 0) {
    return -100 * error;
  }
  return 100 * error;
}

function finalizeResults() {
  score = 0;
  console.log("Finalizing Dough Results");
  var doughResults = stacks.workspaceDough;
  var finalDoughHydration = doughResults[doughResults.length - 1][0];
  if (finalDoughHydration > 150) {
    setText("doughResults", "Make a bowl of soup.");
    score -= 50;
  }
  else {
    setText("doughResults", "Make a " + finalDoughHydration + "% Hydration Dough.");
  }
  console.log("Hydration Percent Error : " + percentError(finalDoughHydration, 65));
  score += 100 - percentError(finalDoughHydration, 65);
  console.log("Current Score : " + score);
  
  console.log("Finalizing Sauce Results");
  var sauceString = "";
  var sauceResults = stacks.workspaceSauce;
  var sauceCookTime = sauceResults[sauceResults.length - 1][0];
  var sauceScore = 0;
  if (sauceCookTime > 8100) { //if sauce is burnt, 8000 is a magic number but js doesnt have constants for whatever reason
    sauceString += "BURN a sauce using ";
    var burntScore = Math.floor((8000 / sauceCookTime)*100);
    console.log("Burn score (Sauce) : " + burntScore);
    score += burntScore / 4;
    console.log("Current Score : " + score);
  }
  else {
    sauceString += "Cook a sauce using ";
    sauceScore += Math.floor((sauceCookTime / 8000) * 75);
  }
  for (var i = 0; i < sauceResults.length; i ++) {
    if (i != sauceResults.length - 1) {
      sauceString += sauceResults[i][0];
    }
    else {
      break;
    }
    if (i != sauceResults.length - 2) {
      sauceString += " and ";
    }
  }
  if (sauceResults.length == 1) {
    sauceString += "literally nothing";
  }
  else if (sauceResults.length > 1) {
    sauceScore += 25;
  }
  sauceString += ".";
  setText("sauceResults", sauceString);
  score += sauceScore;
  console.log("Current Score : " + score);
  
  console.log("Finalizing Topping Results");
  var pizzaString = "Add ";
  var pizzaResults = stacks.workspacePizza;
  
  for (var u = 0; u < pizzaResults.length; u ++) {
    if (typeof pizzaResults[u][0] == "string") {
      pizzaString += pizzaResults[u][0];
    }
    else {
      pizzaString += "literally nothing";
    }
    if (u == pizzaResults.length - 1) {
      break;
    }
    pizzaString += " and ";
  }
  if (pizzaResults.length == 0) {
    pizzaString += "literally nothing";
  }
  else if (pizzaResults.length > 0) {
    score += 25;
    console.log("Current Score : " + score);
  }
  pizzaString += ".";
  setText("pizzaResults", pizzaString);
  
  console.log("Finalizing Cooking Results");
  var ovenCookTime = stacks.workspaceCook[0][0];
  if (ovenCookTime < 6000) {
    setText("cookingResults", "Then undercook the pizza");
    score += Math.floor((ovenCookTime / 12000)*100);
  }
  else if (ovenCookTime > 12500) {
    setText("cookingResults", "Then burn the pizza");
    var burntScore = Math.floor((12000 / ovenCookTime)*100);
    //This variable is defined already but its not necessarily always defined previously
    console.log("Burn score (Oven) : " + burntScore);
    score += burntScore / 4;
    console.log("Current Score : " + score);
  }
  else {
    setText("cookingResults", "Then cook the pizza");
    score += Math.floor((ovenCookTime / 12000)*100);
    console.log("Current Score : " + score);
  }
  console.log("Raw score : " + score);
  var measuredScore = Math.floor((score / 325) * 100);
  setText("score", "score : " + measuredScore + "%");
  
  if (measuredScore > 80) {
    setProperty("morrisseyResultsImage", "image", "happyMorrissey.jpg");
    setText("morrisseySpeech", "This is a work of art..");
    setProperty("morrisseySpeech", "font-size", 12);
  }
  else if (measuredScore > 50) {
    setProperty("morrisseyResultsImage", "image", "indifferentMorrissey.jpg");
    setText("morrisseySpeech", "Truly Mediocre");
  }
  else {
    setProperty("morrisseyResultsImage", "image", "upsetMorrissey.jpg");
    setText("morrisseySpeech", "A wicked job, you deserve to be at the stake");
    setProperty("morrisseySpeech", "font-size", 10);
  }
  
  
} //finalizes the results of what you made

onEvent("flourPickup", "mousedown", function(){ //Pickup flour
  pickUp("Flour");
});

onEvent("waterPickup", "mousedown", function(){ //Pickup Water
  pickUp("Water");
});

onEvent("tomatoSaucePickup", "mousedown", function(){ //Pickup tomato sauce
  pickUp("Tomato Sauce");
});

onEvent("baconPickup", "mousedown", function(){ //Pickup bacon
  pickUp("Bacon");
});

onEvent("garlicPickup", "mousedown", function(){ //Pickup garlic
  pickUp("Garlic");
});

onEvent("prezzemoloPickup", "mousedown", function(){ //Pickup prezzemolo
  pickUp("Prezzemolo");
});

onEvent("saucePickup", "mousedown", function(){ //Pickup the sauce
  pickUp("the Sauce");
});

onEvent("mozzarellaPickup", "mousedown", function(){ //Pickup cheese
  pickUp("Mozzarella");
});

onEvent("tomatoPickup", "mousedown", function(){ //Pickup tomato
  pickUp("Tomato");
});

onEvent("pepperPickup", "mousedown", function(){ //Pickup Bell Pepper
  pickUp("Bell Pepper");
});

onEvent("pepperoniPickup", "mousedown", function(){ //Pickup Pepperoni
  pickUp("Pepperoni");
});

onEvent("sausagePickup", "mousedown", function (){ //Pickup sausage
  pickUp("Sausage");
});

onEvent("sauceScreen", "mousedown", function(event){ //picks up object on the sauceScreen workspace
  if (testIfMouseInWorkspace(event) == true && holdingObject == false && workspaceStack.length > 0) {
    removeFromWorkspace();
  }
});

onEvent("pizzaScreen", "mousedown", function(event){ //picks up object on the pizzaScreen workspace
  if (testIfMouseInWorkspace(event) == true && holdingObject == false && workspaceStack.length > 0) {
    removeFromWorkspace();
  }
});

onEvent("doughScreen", "mouseup", function(event){ //calls release (ALWAYS HAPPENS)
  if (testIfMouseInBottomLeft(event) == 1) { //tests if on restart screen button
    restartScreen();
  }
  else if (testIfMouseInBottomLeft(event) == 2) { //tests if on restart app button
    restartApp();
  }

  if (testIfMouseInBottomRight(event)) { //tests if on next screen button
    console.log("Next screen button pressed");
    console.log("Logging dough hydration");
    logStack(workspaceStack);
    stacks[currentWorkspace].push([Math.floor(calculateHydration()), "doughHydration"]); //logs dough hydration
    clearWorkspace();
    moveScreenForward(currentScreen);
  }
  if (testIfMouseInWorkspace(event) == true) { //tests if on the workspace
    releaseWorkspace();
  }
  release();
}); //handles doughScreen

onEvent("sauceScreen", "mouseup", function(event){ //calls release (ALWAYS HAPPENS) FOR SAUCE SCREEN
  if (testIfMouseInBottomLeft(event) == 1) { //tests if on restart screen button
    restartScreen();
  }
  else if (testIfMouseInBottomLeft(event) == 2) { //tests if on restart app button
    restartApp();
  }
  
  if (testIfMouseInBottomRight(event)) { //tests if on next screen button
    console.log("Next screen button pressed");
    console.log("Logging sauce cook time");
    logStack(workspaceStack);
    stacks[currentWorkspace].push([sauceDoneness, "cookTime"]); //logs cooktime
    clearWorkspace();
    moveScreenForward(currentScreen);
  }
  if (testIfMouseInWorkspace(event) == true) { //tests if on the workspace
    releaseWorkspace();
  }
  release();
}); //handles sauceScreen

onEvent("pizzaScreen", "mouseup", function(event){ //calls release (ALWAYS HAPPENS) FOR PIZZA SCREEN
  if (testIfMouseInBottomLeft(event) == 1) { //tests if on restart screen button
    restartScreen();
  }
  else if (testIfMouseInBottomLeft(event) == 2) { //tests if on restart app button
    restartApp();
  }
  
  if (testIfMouseInBottomRight(event)) { //tests if on next screen button
    console.log("Next screen button pressed");
    logStack(workspaceStack);
    clearWorkspace();
    moveScreenForward(currentScreen);
  }
  if (testIfMouseInWorkspace(event) == true) { //tests if on the workspace
    releaseWorkspace();
  }
  release();
}); //handles pizzaScreen

onEvent("cookScreen", "mouseup", function(event){ //calls release (ALWAYS HAPPENS) FOR COOK SCREEN
  if (testIfMouseInBottomLeft(event) == 1) { //tests if on restart screen button
    restartScreen();
  }
  else if (testIfMouseInBottomLeft(event) == 2) { //tests if on restart app button
    restartApp();
  }
  
  if (testIfMouseInBottomRight(event)) { //tests if on next screen button
    console.log("Next screen button pressed");
    console.log("Logging oven cook time");
    logStack(workspaceStack);
    stacks[currentWorkspace].push([pizzaDoneness, "cookTime"]); //logs cooktime
    clearWorkspace();
    moveScreenForward(currentScreen);
  }
  if (testIfMouseInWorkspace(event) == true) { //tests if on the workspace
    releaseWorkspace();
  }
  release();
}); //handles cookScreen

onEvent("resultsScreen", "mouseup", function(event){ //for results screen
  if (testIfMouseInBottomLeft(event) == 1) { //tests if on restart screen button
    restartScreen();
  }
  else if (testIfMouseInBottomLeft(event) == 2) { //tests if on restart app button
    restartApp();
  }
}); //handles resultsScreen

onEvent("doughScreen", "keyup", function(){ //testing
  console.log("Currently on Dough Screen - " + currentScreen);
  console.log("Workspace stack: " + workspaceStack); //logs the content of the stack
  console.log("Holding Object State: " + holdingObject);
  console.log("Current Screen: " + currentScreen);
  console.log("Dictionary: " + stacks[currentWorkspace]);
}); //testing

onEvent("pizzaScreen", "keyup", function(){ //testing
  console.log("Currently on Pizza Screen - " + currentScreen);
  console.log("Workspace stack: " + workspaceStack); //logs the content of the stack
  console.log("Holding Object State: " + holdingObject);
  console.log("Current Screen: " + currentScreen);
  console.log("Dictionary: " + stacks[currentWorkspace]);
}); //testing

onEvent("sauceScreen", "keyup", function(){ //testing
  console.log("Currently on Sauce Screen - " + currentScreen);
  console.log("Workspace stack: " + workspaceStack); //logs the content of the stack
  console.log("Holding Object State: " + holdingObject);
  console.log("Current Screen: " + currentScreen);
  console.log("Dictionary: " + stacks[currentWorkspace]);
}); //testing

onEvent("cookScreen", "keyup", function(){ //testing
  console.log("Currently on Cook Screen - " + currentScreen);
  console.log("Workspace stack: " + workspaceStack); //logs the content of the stack
  console.log("Holding Object State: " + holdingObject);
  console.log("Current Screen: " + currentScreen);
  console.log("Dictionary: " + stacks[currentWorkspace]);
}); //testing

onEvent("start", "mouseup", function(){ //starts the game and resets values
  if (getChecked("playAudio") == false) {
    playAudio = false;
  }
  else {
    playAudio = true;
  }
  currentScreen = "doughScreen";
  currentWorkspace = "workspaceDough";
  setScreen(currentScreen);
  if (playAudio == true) {
    playSpeech("OKayy letsa maka the dough!", "male", "Italiano");
  }
  //write(currentWorkspace);
}); //starts game and resets values

onEvent("temperatureSliderSauce", "change", function(){ //alters the temp for the sauce screen
  var temperature = getProperty("temperatureSliderSauce", "value");
  setText("temperatureLabelSauce", "Temperature : " + temperature + "°C");
  stopTimedLoop();
  if (temperature > 0) {
    timedLoop(150, function(){ //runs for an arbitrary amount of time
      sauceDoneness += (temperature);
      var percentageDone = (sauceDoneness / 8000) * 100;
      setText("saucePercentage", "Cooking : " + Math.floor(percentageDone) + "% Done");
      if (Math.floor(percentageDone) > 110) {
        setText("saucePercentage", "BURNT!");
        if (playAudio == true) {
          playSpeech("How youa burna the sauce itsa all water! Che schiafa..", "male", "Italiano");
        }
        stopTimedLoop();
      }
    });
  }
  else if (temperature < 1) {
    stopTimedLoop();
  }
}); //this is as complicated as nesting gets, i really didnt feel like optimizing this

onEvent("temperatureSliderCook", "change", function(){ //alters the temp for the cook screen
  var temperature = getProperty("temperatureSliderCook", "value");
  setText("temperatureLabelCook", "Temperature : " + temperature + "°C");
  stopTimedLoop();
  if (temperature > 0) {
    timedLoop(250, function(){
      pizzaDoneness += (temperature / 1.5);
      var percentageDone = (pizzaDoneness / 12000) * 100;
      setText("cookPercentage", "Cooking : " + Math.floor(percentageDone) + "% Done");
      if (Math.floor(percentageDone) > 110) {
        setText("cookPercentage", "BURNT!");
        if (playAudio == true) {
          playSpeech("YOU BURNA MY PIZZA! CHE CAVOLO??", "male", "Italiano");
        } //4 indentations im so sorry
        stopTimedLoop();
      }
    });
  }
  else if (temperature < 1) {
    stopTimedLoop();
  }
});
