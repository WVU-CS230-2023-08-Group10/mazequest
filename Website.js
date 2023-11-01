import { MazeLayout, GenerationParameters } from "./MazeLayout.js";
// import { createClient } from '@supabase/supabase-js';
// BEGIN SUPABASE ;

// CLIENT INITIALIZATION
const supabaseUrl = "https://inyelmyxiphvbfgmhmrk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWVsbXl4aXBodmJmZ21obXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0Nzg3NzEsImV4cCI6MjAxMzA1NDc3MX0.9ByIuA4tv1oMmEr2UPAbCvNQYSvH-wY8aU-4Y8JSprg";
const s = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
   


// BEGIN LOGIN
   document.getElementById("login").addEventListener("submit", async (e) => {
      
      e.preventDefault();
     
     
     
      const email = document.getElementById("liEmail").value
      const password = document.getElementById("liPassword").value 
      
      // Switch to Home view
      const { data, error } = await s.auth.signInWithPassword({
          email: email,
          password: password
 
       })

       document.getElementById("liEmail").value = ""
       document.getElementById("liPassword").value = ""
       if (error) {
          console.error(error)
       } else {
          // successful login
          alert("Success! Logged In")
       }
    });
// END LOGIN

//BEGIN LOGOUT 
document.getElementById("logout").addEventListener("click", async (e) =>{
   const { error } = await s.auth.signOut()
   if (error){
      console.error(error)
   } else {
      alert("You have been successfully signed out")
   }
});



// BEGIN SIGNUP
   document.getElementById("signup").addEventListener("submit", async (e) => {
    
     e.preventDefault();
     
     // Grabbing email and password entered by user
     const email = document.getElementById("suEmail").value
     const password = document.getElementById("suPassword").value 
     const user_name = document.getElementById("username").value
     
     // Switch to Home view
     if (isStrongPassword(password)){
   
      
      const { data, error } = await s.auth.signUp({
          email: email,
          password: password,
          options:{data: {
            "username": user_name
          }}
      });

      

      // Get the form. And get the email and password text boxes.
      document.getElementById("suEmail").value = "";
      document.getElementById("suPassword").value = "";
      document.getElementById("username").value = "";
      const SigDiv = document.getElementById("Sig");

      if (error) {
          alert("error")
          console.log(error)
      } else {
         // Create a success message 
          alert("Success! Account is being created.");

         // Remove the text boxes and instructions from the form
         document.getElementById("signup").remove();

          // Add Quest Birb and check email message
          const successMessage = document.createElement("succMsg");
          successMessage.textContent = "Check your email to confirm your account.";
          SigDiv.appendChild(successMessage);

          const successImage = document.createElement("img");
          successImage.src = "./images/Quest_Birb_3.png";
          successImage.alt = "Birb";
          successImage.width = "500";
          SigDiv.appendChild(successImage);
      }
   } else {
      // Password not entered correctly, retry
      alert("Please enter a valid password.");
  }
   });
   // END SIGNUP
 });
// END SUPABASE

// Function to check the length of the user entered password
 function isStrongPassword(password) {
   const passwordBox = document.getElementById("suPassword");
   const passwordErrMsg = document.getElementById("passwordErrorMsg");
   if (password.length < 8) {
      passwordErrMsg.innerHTML = " ";
      passwordBox.value = "";
      passwordBox.style.backgroundColor = "#E3963E";
       return false;
   }
   if (password.includes("password")) {
      passwordErrMsg.innerHTML = "Password cannot contain the word 'password'";
      passwordBox.value = "";
      passwordBox.style.backgroundColor = "#E3963E";
      return false;
  }
   else{
      passwordBox.style.backgroundColor = '';
      return true;
   }
}

//below is used for hint rotation
var hintsText = ["To engage in combat, move into the enemy!",
   "Different weapons have different attack patterns. Find one that works for you!",
   "The better you trace an attack pattern, the more damage you deal.",
   "Gather items to help fight off enemies.", 
   "If you hit the dragon, it might not like you...", 
   "Did you know that 2 to the 3rd power is 8?", 
   "If you look around, there might be a secret room or two somewhere...", 
   "Watch out for goblins! Those pesky little buggers will never leave you alone!",
   "The minotaur is a scary beast, I wonder if it's within the maze?", 
   "The cake is a lie!",
   "Hey, you, you're finally awake.",
   "I used to be an adventurer like you. Then I took an arrow to the knee...",
   "Beware the Jabberwock! It's jaws that bite, it's claws that catch!",
   "Have you heard of the High Elves?"];

var counter = 0;
shuffle(hintsText);
setInterval(changeHints, 5000);
function shuffle(array) {
   let currentIndex = array.length,  randomIndex;
   
   // While there remain elements to shuffle.
   while (currentIndex > 0) {
   
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
   
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }
   
   return array;
}
function changeHints() 
{
   elem.textContent = hintsText[counter];
   counter++;
   if (counter >= hintsText.length)
   {
      counter = 0;
      shuffle(hintsText);
   }
}
//^ Hint rotation

var layout = new MazeLayout(new GenerationParameters(10, 10, 16, 64, .5));
layout.generateRoomLayout();

