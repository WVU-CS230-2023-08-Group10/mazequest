import { profanity } from "https://cdn.skypack.dev/@2toad/profanity";

// BEGIN SUPABASE ;

// CLIENT INITIALIZATION
const supabaseUrl = "https://inyelmyxiphvbfgmhmrk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWVsbXl4aXBodmJmZ21obXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0Nzg3NzEsImV4cCI6MjAxMzA1NDc3MX0.9ByIuA4tv1oMmEr2UPAbCvNQYSvH-wY8aU-4Y8JSprg";
const s = supabase.createClient(supabaseUrl, supabaseKey);

/* Event listener for when the contents of the DOM are loaded */
document.addEventListener("DOMContentLoaded", async () => {

   // Save the initial contents of login form
   const loginForm = document.getElementById("login");
   const loginInitialFormContent = loginForm.innerHTML;

   // Save the initial contents of signup form
   const signupForm = document.getElementById("signup");
   const signupInitialFormContent = signupForm.innerHTML;

   // Constants to pass to form removal methods to specify what the user should do
   const CHECK_EMAIL = "Check your email to confirm your account.";
   const SIGNED_IN = "You're signed in! Go slay the beast!";


   // Check to see if user is logged in

   const { data: { user } } = await s.auth.getUser()

   if (user) {
      // User is signed in.

      // Get the user's username
      const user = await s.auth.getUser();
      var username = JSON.stringify(user.data.user.user_metadata.username);
      // Pull the user's levels from database
      loadUserLevels(username);

      // Enable access to account tab
      document.getElementById("Account").disabled = false;
      document.getElementById("Level_Builder").disabled = false;
      document.getElementById("GameWindow").disabled = false;

      // Remove sign-up and login forms
      removeLoginForm(loginForm, SIGNED_IN);
      removeSignUpForm(signupForm, SIGNED_IN);

   }
   else {
      // User is not signed in. Do nothing
      // Remove focus from the currently focused element
      document.activeElement.blur();
      // Move the user to the sign-in tab
      // Explicitly call openTab with the 'In' tab as an argument
      openTab({ currentTarget: document.getElementById('In') }, 'In');

   }

   updateLeaderboard();

   // BEGIN LOGIN
   document.getElementById("login").addEventListener("submit", async (e) => {

      // Prevent the webpage from reloading
      e.preventDefault();

      // Get user's entered email and password
      const email = document.getElementById("liEmail").value
      const password = document.getElementById("liPassword").value

      // Call Supabase sign-in function
      const { data, error } = await s.auth.signInWithPassword({
         email: email,
         password: password

      })

      if (error) {
         alert("Incorrect email or password")
      } else {
         // Successful login
         alert("Success! Logged In");
         location.reload();

         // Enable access to Account tab
         document.getElementById("Account").disabled = false;
         document.getElementById("Level_Builder").disabled = false;
         document.getElementById("GameWindow").disabled = false;

         // Remove login tab content
         removeLoginForm(loginForm, SIGNED_IN);

         // Remove sign-up tab content
         removeSignUpForm(signupForm, SIGNED_IN);
      }
   });
   // END LOGIN

   //BEGIN LOGOUT 
   document.getElementById("logout").addEventListener("click", async (e) => {

      const { error } = await s.auth.signOut()
      if (error) {
         console.error(error)
      } else {
         alert("You have been successfully signed out")
         location.reload()
         // User is logged out. Disable the Account tab
         document.getElementById("Account").disabled = true;
         document.getElementById("Level_Builder").disabled = true;
         document.getElementById("GameWindow").disabled = true;


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

      // Prevent the webpage from reloading
      e.preventDefault();

      // Grabbing email and password entered by user
      const email = document.getElementById("suEmail").value
      const password = document.getElementById("suPassword").value
      const user_name = document.getElementById("username").value

      user_name.substring(0, user_name.length - 1)

      // CHECKS USERNAME FOR PROFANITY
      if (profanity.exists(user_name)) {
         alert("Hark! Thy name is an unforgivable curse...")
         document.getElementById("username").value = ""
         return
      }

      // Checks password
      if (isStrongPassword(password, document.getElementById("suPassword"), document.getElementById("reSuPassword"))) {


         const { data, error } = await s.auth.signUp({
            email: email,
            password: password,
            options: {
               data: {
                  "username": user_name
               }
            }
         });

         if (error) {
            alert("error")
            console.log(error)
         } else {
            // Create a success message 
            alert("Success! Account is being created.");
            // Call sign up form removal function
            removeSignUpForm(signupForm, CHECK_EMAIL);
         }
      } else {
         // Password not entered correctly, retry
         alert("Please enter a valid password.");
      }
   }); ``
   // END SIGNUP

   // BEGIN RESET PASSWORD
   document.getElementById("resetPassword").addEventListener("click", async (e) => {

      // Prevent the webpage from reloading
      e.preventDefault();

      // Get the user's entered password
      const new_password = document.getElementById("newPassword").value;

      // Check to see if new password is strong enough
      if (isStrongPassword(new_password, document.getElementById("newPassword"), document.getElementById("reNewPassword"))) {

         if (await s.auth.updateUser({ password: new_password })) {
            alert("Password was changed!");
         }
      }
      else {
         // Password not entered correctly, retry
         alert("Please enter a valid password.");
      }
   });

});
// END SUPABASE

/**
 * Function to update the leaderboard, including both top player's statistics and the user's personal stats.
 * @param {*} none
 */
async function updateLeaderboard() {

   var topDragonSlayersPromise
   var topMazeRunnersPromise
   var topEnemySlayersPromise



   // retrieve promises
   topDragonSlayersPromise = s
      .from("player_stats")
      .select()
      .order("dragons_slain", { ascending: false })
      .limit(3)

   topMazeRunnersPromise = s
      .from("player_stats")
      .select()
      .order("mazes_escaped", { ascending: false })
      .limit(3)

   topEnemySlayersPromise = s
      .from("player_stats")
      .select()
      .order("enemies_slain", { ascending: false })
      .limit(3)



   // resolve all promises at once so database calls don't block each other
   const [topDragonSlayers, topEnemySlayers, topMazeRunners] =
      await Promise.all([
         topDragonSlayersPromise,
         topEnemySlayersPromise,
         topMazeRunnersPromise,

      ]).catch(error => {
         console.log(error)
      })





   // convert data to js objects and ready to load into

   //TODO : Create dummy data to test


   // grabs stats and usernames for leaderboard
   var firstDragonSlayer = topDragonSlayers.data[0].username
   var secondDragonSlayer = topDragonSlayers.data[1].username
   var thirdDragonSlayer = topDragonSlayers.data[2].username

   var firstDragonSlayerStat = topDragonSlayers.data[0].dragons_slain
   var secondDragonSlayerStat = topDragonSlayers.data[1].dragons_slain
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




   const user = await s.auth.getUser()


   // if user is logged in, retrieve personal stats
   if (user.data.user) {


      // console.log(JSON.stringify(user))
      var stringId = JSON.stringify(user.data.user.id)

      // retrieve user id to access stats table
      const id = stringId.substring(1, stringId.length - 1)



      const personalStats = await s
         .from("player_stats")
         .select()
         .eq("id", id)


      // convert username to json and display
      // console.log(JSON.stringify(personalStats.data[0].username))
      const usernameString = JSON.stringify(personalStats.data[0].username)

      //const username = usernameString.substring(1,usernameString.length-1)
      document.getElementById("personal_stat").innerHTML = usernameString.substring(3, usernameString.length - 3) + "'s conquests..."


      //console.log(JSON.stringify(personalStats))
      var personalDragons = personalStats.data[0].dragons_slain
      var personalMazes = personalStats.data[0].mazes_escaped
      var personalenemies = personalStats.data[0].enemies_slain

      document.getElementById("PD").innerHTML = personalDragons
      document.getElementById("PM").innerHTML = personalMazes
      document.getElementById("PE").innerHTML = personalenemies


   }


   //error handling is redundant as long as 3 profiles exist


   // stat assignments
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
function isStrongPassword(password, passwordBox, rePasswordBox) {

   // Check if the two password boxes contain the same text
   if (passwordBox.value == rePasswordBox.value) {
      rePasswordBox.style.backgroundColor = '';

      // Passwords match, check other requirements

      // Create boolean to return the result of the function 
      let isStrong = true;

      let validationRegex = [{ regex: /.{8,}/ }, { regex: /[0-9]/ }, { regex: /[A-Z]/ }, { regex: /[^A-Za-z0-9]/ }]
      validationRegex.forEach((item) => {

         // Set a boolean value to reflect the result of the password test
         let isValid = item.regex.test(password);

         // If the password is not valid
         if (!isValid) {
            // Remove text from text boxes
            passwordBox.value = "";
            rePasswordBox.value = "";
            // Make the text box orange
            passwordBox.style.backgroundColor = "#E3963E";
            console.log("invalid password");
            // Set boolean to false
            isStrong = false;
         }
      })
      if (isStrong) {
         // Password is strong, change textbox color to default color
         passwordBox.style.backgroundColor = '';
      }
      // Return the current boolean value of isStrong
      return isStrong
   }

   // Text boxes did not match. Make them re-enter.
   alert("Passwords do not match.")
   // Remove text from text boxes
   passwordBox.value = "";
   rePasswordBox.value = "";
   // Make text boxes orange
   passwordBox.style.backgroundColor = "#E3963E";
   rePasswordBox.style.backgroundColor = "#E3963E";
   // Return false
   return false;
}

/**
 * Function to replace the contents of the sign-up tab with confirmation message
 * @param {*} form - signup form to remove contents of
 */
function removeSignUpForm(form, message){

   // Remove the text boxes and instructions from the form
   form.innerHTML = ' ';

   // Add parameter message
   const SigDiv = document.getElementById("signup");
   const successMessage = document.createElement("h2");
   successMessage.textContent = message;
   SigDiv.appendChild(successMessage);

   // Add Quest Birb
   const successImage = document.createElement("img");
   successImage.src = "./images/Quest_Birb_3.png";
   successImage.alt = "Birb";
   successImage.width = "500";
   successImage.style.display = "block";
   successImage.style.margin = "auto";
   SigDiv.appendChild(successImage);
}

/**
 * This function removes the login form from the tab and adds a message showing that the user successfully logged in
 * @param {*} form - login form to remove contents of
 */
function removeLoginForm(form, message) {
   // Remove the text boxes and intstructions from the form
   form.innerHTML = ' ';

   // Add parameter message
   const LoginDiv = document.getElementById("login");
   const successMessage = document.createElement("h2");
   successMessage.textContent = message;
   LoginDiv.appendChild(successMessage);

   // Add Magic Portal Image
   const successImage = document.createElement("img");
   successImage.src = "./images/portal.png";
   LoginDiv.appendChild(successImage);
   successImage.alt = "Magic Portal";
   successImage.width = "500";
   successImage.style.display = "block";
   successImage.style.margin = "auto";
}

/**
 * loadUserLevels - method to pull the user's levels from Supaabse. This method Queries the database and loads the elements into the levelBuilder.
 * @param {*} username - used to pull user's levels from the database
 */
async function loadUserLevels(username) {
   // Pull all levels associated with user's username from database
   const { data, error } = await s
      .from('levels')
      .select('*') // Select all columns
      .eq('username', username); // Filter by the username


   // Check if there was an error
   if (error) {
      alert("error getting levels.");
   }

   // Check if levels were pulled
   if (data == null) {
      // No levels pulled. Do nothing and return
      return;
   }
   else 
   {
      // Find the HTML element to display the data
      const listElement = document.getElementById('userLevels');

      const lList = document.querySelector('#levelList');

      // Loop through the data and create list items for each name
      data.forEach(item => {
         const button = document.createElement('button');
         button.textContent = String(item.level_name);
         button.setAttribute('class','levelbtn dropbtn');
         button.addEventListener('click', (e) => {
            const jstring = String(item.level_file);
            const event = new CustomEvent('loadLevel', { detail : { level_obj : JSON.parse(jstring), level_name : item.level_name } });
            document.getElementById("Bui").dispatchEvent(event);
         })
         lList.appendChild(button);
      });

      // Append the list to the selected HTML element
      listElement.appendChild(lList);
   }
}

// List of all the hints to be rotated regularly on the bottom of the website
let hintsText = ["To engage in combat, move into the enemy!",
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
   "Have you heard of the High Elves?",
   "Grand Theft Auto 6 releases in 2025.",
   "We fr got the GTA 6 trailer before MazeQuest.",
   "Did you know that mochi is not a good consolation gift?",
   "Remember not to drop the keyfob to your motorcycle!",
   "Blood, sweat, and tears went into this game... you better like it. Or else.",
   "There is currently no way for the dragon to entire your home... yet.",
   "Try out our new level builder!",
   "Recombobulating the discombobulators...",
   "Watch the tram car please.",
   "Press Ctrl+W for more hints!",
   "Press Alt+F4 to unlock super saiyan mode.",
   "If you're seeing this, the dragon already knows your location and he is rapidly approaching.",
   "Follow your attack trace accurately to get the best damage roll!",
   "There are hot goblins in your area waiting to meet you!",
   "\"F*** JavaScript.\" - Lead developer",
   "According to all known laws of aviation, there is no way that a bee should be able to fly.",
   "Do not drop STAT 215. Worst mistake I ever made.",
   "We love StoodBood.",
   "World of wings addictions end here!"];

// Keeps track of number of hints that have been displayed in the current shuffle
let counter = 0;
// Sets the time each hint is displayed on the website
let interval = 5000;
shuffle(hintsText);
// Changes the hint on the website based on
setInterval(changeHints, interval);

/**
 * Function to randomly shuffle the contents of a list
 * @param {*} array - list to shuffle
 * @returns - returns the shuffled array
 */
function shuffle(array) {
   let currentIndex = array.length, randomIndex;

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
/**
 * Changes the current hint being showed on the website.
 */
function changeHints() {
   elem.textContent = hintsText[counter];
   counter++;
   if (counter >= hintsText.length) {
      counter = 0;
      shuffle(hintsText);
   }
}