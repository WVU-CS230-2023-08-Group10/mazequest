import { MazeLayout, GenerationParameters, Vector2 } from "./MazeLayout.js";

//below is used for hint rotation
var hintsText = ["To engage in combat, move into the enemy", "Gather items to help fight off enemys", "If you hit the dragon, it might not like you", "Did you know that 2 to the 3rd power is 8?", "If you look around, there might be a secret room or two somewhere...", "Watch out for goblins! Those Pesky little Buggers will neevr leave you alone",
 "The minotaur is a scary beast, I wonder if it's within the maze?", "The cake is a lie"];

var counter = 0;
var inst = setInterval(changeHints, 5000);
function changeHints() {
  elem.textContent = hintsText[counter];
  counter++;
  if (counter >= hintsText.length) {
    counter = 0;
  }
}
//^ Hint rotation

var layout = new MazeLayout(new GenerationParameters(10, 10, 16, 64, .5));
layout.generateRoomLayout();

