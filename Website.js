

import { MazeLayout, GenerationParameters } from "./MazeLayout.js";
import { profanity } from "https://cdn.skypack.dev/@2toad/profanity";
// BEGIN SUPABASE ;

// CLIENT INITIALIZATION
const supabaseUrl = "https://inyelmyxiphvbfgmhmrk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWVsbXl4aXBodmJmZ21obXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0Nzg3NzEsImV4cCI6MjAxMzA1NDc3MX0.9ByIuA4tv1oMmEr2UPAbCvNQYSvH-wY8aU-4Y8JSprg";
const s = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
   
   // Save the initial contents of login form
   const loginForm = document.getElementById("login");
   const loginInitialFormContent = loginForm.innerHTML;

   // Save the initial contents of signup form
   const signupForm = document.getElementById("signup");
   const signupInitialFormContent = signupForm.innerHTML;


   // Check to see if user is logged in
   const { data: { user } } = await s.auth.getUser()
   if (user) {
      // User is signed in. Enable access to account tab
      document.getElementById("Account").disabled = false;
   }
   else {
      // User is not signed in. Do nothing
   }

   updateLeaderboard();

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

       if (error) {
          alert("Incorrect username or password")
       } else {
          // successful login
          alert("Success! Logged In");

          // Enable access to Account tab
          document.getElementById("Account").disabled = false;

          // Remove login tab content
          removeLoginForm(loginForm);

          // Remove sign-up tab content
          removeSignUpForm(signupForm);
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
      // User is logged out. Disable the Account tab
      document.getElementById("Account").disabled = true;

      // Remove focus from the currently focused element
      document.activeElement.blur();

      // Restore inital contents of sign-up and login forms
      loginForm.innerHTML = loginInitialFormContent;
      signupForm.innerHTML = signupInitialFormContent;

      // Move the user off of the Account tab
      // Explicitly call openTab with the 'In' tab as an argument
      openTab({ currentTarget: document.getElementById('In') }, 'In');
   }
});



// BEGIN SIGNUP
   document.getElementById("signup").addEventListener("submit", async (e) => {
    
     e.preventDefault();
     
     // Grabbing email and password entered by user
     const email = document.getElementById("suEmail").value
     const password = document.getElementById("suPassword").value 
     const user_name = document.getElementById("username").value
     
     
      // CHECKS USERNAME
     if (profanity.exists(user_name))
     {
      alert("Hark! Thy name is an unforgivable curse...")
      document.getElementById("username").value = ""
      return}

     // Checks password
     if (isStrongPassword(password)){
   
      
      const { data, error } = await s.auth.signUp({
          email: email,
          password: password,
          options:{data: {
            "username": user_name
          }}
      });

      if (error) {
          alert("error")
          console.log(error)
      } else {
         // Create a success message 
         alert("Success! Account is being created.");
         // Call sign up form removal function
         removeSignUpForm();
      }
   } else {
      // Password not entered correctly, retry
      alert("Please enter a valid password.");
  }
   });``
   // END SIGNUP
 });
// END SUPABASE

async function updateLeaderboard() {

   var topDragonSlayersPromise
   var topMazeRunnersPromise
   var topEnemySlayersPromise
  

   topDragonSlayersPromise =  s
   .from("player_stats")
   .select()
   .order("dragons_slain", {ascending:false})
   .limit(3)

  
   topMazeRunnersPromise =  s
   .from("player_stats")
   .select()
   .order("mazes_escaped", {ascending:false})
   .limit(3)

   topEnemySlayersPromise =  s
   .from("player_stats")
   .select()
   .order("enemies_slain", {ascending:false})
   .limit(3)

      

     const[topDragonSlayers, topEnemySlayers, topMazeRunners] = 
     await Promise.all([
      topDragonSlayersPromise, 
      topEnemySlayersPromise, 
      topMazeRunnersPromise
   ]).catch(error => {
      console.log(error)
   })
      




      // convert data to js objects and ready to load into
         
            //TODO : Create dummy data to test
           
         

         var firstDragonSlayer = topDragonSlayers.data[0].username
         var secondDragonSlayer = topDragonSlayers.data[1].username
         var thirdDragonSlayer = topDragonSlayers.data[2].username

         var firstDragonSlayerStat = topDragonSlayers.data[0].dragons_slain
         var secondDragonSlayerStat= topDragonSlayers.data[1].dragons_slain
         var thirdDragonSlayerStat = topDragonSlayers.data[2].dragons_slain
         
         var firstMazeRunner = topMazeRunners.data[0].username
         var secondMazeRunner = topMazeRunners.data[1].username
         var thirdMazeRunner = topMazeRunners.data[2].username

         var firstMazeRunnerStat = topMazeRunners.data[0].mazes_escaped
         var secondMazeRunnerStat = topMazeRunners.data[1].mazes_escaped
         var thirdMazeRunnerStat = topMazeRunners.data[2].mazes_escaped

         var firstEnemySlayer = topEnemySlayers.data[0].username
         var secondEnemySlayer = topEnemySlayers.data[1].username
         var thirdEnemySlayer = topEnemySlayers.data[2].username

         var firstEnemySlayerStat = topEnemySlayers.data[0].enemies_slain
         var secondEnemySlayerStat = topEnemySlayers.data[1].enemies_slain
         var thirdEnemySlayerStat = topEnemySlayers.data[2].enemies_slain

         // error handling is redundant as long as 3 profiles exist, but should probably implement some try/catch or arraylength check


      document.getElementById("dragonSlayer1").innerHTML = firstDragonSlayer
      document.getElementById("dragonSlayer2").innerHTML = secondDragonSlayer
      document.getElementById("dragonSlayer3").innerHTML = thirdDragonSlayer

      document.getElementById("U1D").innerHTML = firstDragonSlayerStat
      document.getElementById("U2D").innerHTML = secondDragonSlayerStat
      document.getElementById("U3D").innerHTML = thirdDragonSlayerStat

      document.getElementById("enemySlayer1").innerHTML = firstEnemySlayer
      document.getElementById("enemySlayer2").innerHTML = secondEnemySlayer
      document.getElementById("enemySlayer3").innerHTML = thirdEnemySlayer

      document.getElementById("U1E").innerHTML = firstEnemySlayerStat
      document.getElementById("U2E").innerHTML = secondEnemySlayerStat
      document.getElementById("U3E").innerHTML = thirdEnemySlayerStat

      document.getElementById("mazeRunner1").innerHTML = firstMazeRunner
      document.getElementById("mazeRunner2").innerHTML = secondMazeRunner
      document.getElementById("mazeRunner3").innerHTML = thirdMazeRunner

      document.getElementById("U1M").innerHTML = firstMazeRunnerStat
      document.getElementById("U2M").innerHTML = secondMazeRunnerStat
      document.getElementById("U3M").innerHTML = thirdMazeRunnerStat
           
}

/**
 * Function to check if the user's password meets the criteria to be a strong enough password.
 * @param {*} password - users password to check
 * @returns returns true if the user's password meets the criteria. False otherwise.
 */
 function isStrongPassword(password) {
   const passwordBox = document.getElementById("suPassword");
   const rePasswordBox = document.getElementById("reSuPassword");
   const passwordErrMsg = document.getElementById("passwordErrorMsg");

   // Check if the two password boxes contain the same text
   if (passwordBox.value == rePasswordBox.value){
      rePasswordBox.style.backgroundColor = '';
      // Passwords match, check other requirements
      // Check password length
      if (password.length < 8) {
         passwordErrMsg.textContent = "Password is not long enough";
         passwordBox.value = "";
         rePasswordBox.value = "";
         passwordBox.style.backgroundColor = "#E3963E";
          return false;  
       }
      // Check password to see if contains "password"
      if (password.includes("password")) {
         passwordErrMsg.innerHTML = "Password cannot contain the word 'password'";
         passwordBox.value = "";
         rePasswordBox.value = "";
         passwordBox.style.backgroundColor = "#E3963E";
          return false;
      }
      // Password is valid. Return true
      else{
         passwordBox.style.backgroundColor = '';
          return true;
      }
   }
   // Text boxes did not match. Make them re-enter.
   alert("Passwords do not match.")
   passwordBox.value = "";
   rePasswordBox.value = "";
   // Make text boxes orange
   passwordBox.style.backgroundColor = "#E3963E";
   rePasswordBox.style.backgroundColor = "#E3963E";
   return false;
}

/**
 * Function to replace the contents of the sign-up tab with confirmation message
 * @param {*} form - signup form to remove contents of
 */
function removeSignUpForm(form){

   // Remove the text boxes and instructions from the form
   form.innerHTML = ' ';

   // Add "Check Email" message
   const SigDiv = document.getElementById("signup");
   const successMessage = document.createElement("succMsg");
   successMessage.textContent = "Check your email to confirm your account.";
   SigDiv.appendChild(successMessage);

   // Add Quest Birb
   const successImage = document.createElement("img");
   successImage.src = "./images/Quest_Birb_3.png";
   successImage.alt = "Birb";
   successImage.width = "500";
   SigDiv.appendChild(successImage);
}

/**
 * This function removes the login form from the tab and adds a message showing that the user successfully logged in
 * @param {*} form - login form to remove contents of
 */
function removeLoginForm(form){
   // Remove the text boxes and intstructions from the form
   form.innerHTML = ' ';

   // Add "Logged in" message
   const LoginDiv = document.getElementById("login");
   const successMessage = document.createElement("succMsg");
   successMessage.textContent = "You're logged in! Go slay the beast!";
   LoginDiv.appendChild(successMessage);

   // Add Magic Portal Image
   const successImage = document.createElement("img");
   successImage.src = "./images/portal.png";
   LoginDiv.appendChild(successImage);
   successImage.alt = "Magic Portal";
   successImage.width = "1000";
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

