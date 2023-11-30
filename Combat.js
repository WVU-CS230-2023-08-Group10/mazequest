import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";
import { Vector2 } from "./Vectors.js";



/**
 * Class representing game combat.
 * 
 * Fields:
 *  - attacker    : String
 *  - defender    : Transform
 *  - run         : Boolean
 *  - minDistance :
 *  - maxDistance :
 *  - Renderer    : Renderer
 * 
 * Methods:
 *  - 
 */
class Combat
{
    attacker;
    defender;
    run = false;
    minDistance;
    MaxDistance;
    Renderer;

    constructor(attacker,defender){
        this.attacker = attacker;
        this.defender = defender;
        initiateCombat();
    }
    initiateCombat(){
        //originally put "initialize combat UI", might just keep to side of screen
        combatDamage;
        //needs establishment of attackers high/low damage of weapon
        lowDamageAttacker;
        highDamageAttacker;
        //needs establishment of defenders high/low damage of weapon
        lowDamageDefender;
        highDamageDefender;
        if(this.isAttackerPlayer()){
            //floatAccuracy = traceGame(vertical swipe)
            combatDamage = floatAccuracy * (highDamageAttacker - lowDamageAttacker) + lowDamageAttacker;
        }
        else{
            combatDamage = Math.random() * (highDamageAttacker - lowDamageAttacker) + lowDamageAttacker;
        }

        if(isDefenderPlayer()){
            //floatAccuracy = traceGame(horizantel swipe)
            // combat += floatAccuracy * (highDamageDefender - lowDamageDefender) + lowDamageDefender;
        }
        // defender.damage(combatDamage)
        //endCombat
        return;
    }
    traceGame(){
        
        canvasE = document.getElementById('game');
        
        // Get pixel length of mouseTrace
        // Split up mouseTrace based on number of points in the pattern trace
        
        // Initialize accuracy
        // For each segment of mouse trace
        //     Get the distance between trace point and mouse point
        //     Add to accuracy based on where distance falls in min to max distance
        //     Distance <= min is accuracy of 1
        //     Distance >= max is accuracy of 0
        // End for
        // Return the average of the accuracies

    }
    
    //might need adjustment
    isAttackerPlayer(){
        if(typeof this.attacker === "Player"){
            return true;
        }
        return false;
    }
    //might need adjustment
    isDefenderPlayer(){
        if(typeof this.defender === "Player"){
            return true;
        }
        return false;
    }

}
let mouseTracePoints = new Array();

function handleMouseMove(event) 
{
    mouseTracePoints.push(new Vector2(event.clientX, event.clientY));
    //console.log(mouseTracePoints);
}

window.addEventListener("mousedown", function() {
    window.addEventListener("mousemove", handleMouseMove);
});

window.addEventListener("mouseup", function() {
    // Unregister the mouse move listener
    window.removeEventListener("mousemove", handleMouseMove);
    // Clear the mouse trace array
    mouseTracePoints = new Array();
});