import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";



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
const mouseTracePoints = new Array;
const cords = { x:0, y:0};
   
    window.addEventListener("mousedown",function(){    
        
        var index=0;
        var maxIndex=640;
        var nice= this.setInterval(function(){
            cords.x= m_pos_x ;
            cords.y= m_pos_y ;
            
            console.log(cords);
            mouseTracePoints.push(cords);
            console.log(mouseTracePoints);
            index++;
            if(index==maxIndex){
                clearInterval(nice);
            }
        },1);
        this.setTimeout(function(){
            console.log(mouseTracePoints);
        },4000)
        
    },false);
    
    var m_pos_x,m_pos_y;
    window.onmousemove = function(e) { m_pos_x = e.pageX;m_pos_y = e.pageY; }
   
    