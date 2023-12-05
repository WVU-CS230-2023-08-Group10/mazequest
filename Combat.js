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
        const attackingWeapon = this.attacker.inventory.getWeapon();
        //needs establishment of defenders high/low damage of weapon
        const defendingArmor = this.defender.inventory.getArmor();
        
        if(this.isAttackerPlayer()){
            //floatAccuracy = traceGame(vertical swipe)
            combatDamage = attackingWeapon.damage(floatAccuracy);
        }
        else{
            combatDamage = attackingWeapon.damage(Math.random());
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
        // In the top right of the game canvas, a pattern will appear (in the tranparent hitbox) over the creature. 
        // Press and Drag the mouse over the pattern to deal damage to the creature, 
        // the higher the accuracy of the trace, the more damage is dealt.
       
        // TO DO
        // Get pixel length of mouseTrace
        // Split up mouseTrace based on number of points in the pattern trace, will be four for base start
        
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
let tracePoints = new Array();
const hitbox = document.getElementById("hitbox");
hitbox.addEventListener("mouseover", handleMousePress);

function handleMousePress(){
    window.addEventListener("mousedown", handleMouseDown);
}
function handleMouseDown(){
    //register the mouse move listener
    window.addEventListener("mousemove", handleMouseMove);
}
function handleMouseMove(event) 
{
    mouseTracePoints.push(new Vector2(event.clientX, event.clientY));
    console.log(mouseTracePoints);
}

window.addEventListener("mouseup", function() {
    // Unregister the mouse move listener
    window.removeEventListener("mousemove", handleMouseMove);
    this.window.removeEventListener("mousedown",handleMouseDown);
    console.log(mouseTracePoints.length);
    if(tracePoints.length>0)
    {
        tracePoints = new Array();  
    }
    tracePoints = mouseTracePoints;
    // Clear the mouse trace array
    mouseTracePoints = new Array();
});
function Accuracy()
{
    extra = tracePoints%3;
    for(let i=0;i<extra;i++)
    {
        tracePoints.pop();
    }
    var point1 = tracePoints.at(0);
    let p2Index = tracePoints.length/3;
    var point2 = tracePoints.at(p2Index);
    let p3Index = p2Index*2;
    var point3 = tracePoints.at(p3Index);
    var point4 = tracePoints.at(tracePoints.length-1);
}
