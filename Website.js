import { MazeLayout, GenerationParameters, Vector2 } from "./MazeLayout.js";

// BEGIN SUPABASE ; s = supabase client variable

// CLIENT INITIALIZATION
const supabaseUrl = "https://inyelmyxiphvbfgmhmrk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWVsbXl4aXBodmJmZ21obXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0Nzg3NzEsImV4cCI6MjAxMzA1NDc3MX0.9ByIuA4tv1oMmEr2UPAbCvNQYSvH-wY8aU-4Y8JSprg";
const s = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {

// BEGIN SIGNUP
   document.getElementById("signup").addEventListener("submit", async (e) => {
      
     e.preventDefault();
    
    
     const email = document.getElementById("email").value
     const password = document.getElementById("password").value 
     
     // Switch to Home view
     const { data, error } = await s.auth.signUp({
         email: email,
         password: password

      })

      if (error) {
         console.error(error)
      } else {
         // successful login
         alert("Success! Account is being created.")
      }
   });
   // END SIGNUP
 });
// END SUPABASE

//below is used for hint rotation
var hintsText = ["To engage in combat, move into the enemy!", "Gather items to help fight off enemies.", "If you hit the dragon, it might not like you...", "Did you know that 2 to the 3rd power is 8?", "If you look around, there might be a secret room or two somewhere...", "Watch out for goblins! Those pesky little buggers will never leave you alone!",
 "The minotaur is a scary beast, I wonder if it's within the maze?", "The cake is a lie!"];

var counter = 0;
setInterval(changeHints, 5000);
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

