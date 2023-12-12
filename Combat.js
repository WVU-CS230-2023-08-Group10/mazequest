import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";
import { Vector2 } from "./Vectors.js";

export {Combat}

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

    constructor(attacker,defender)
    {
        this.attacker = attacker;
        this.defender = defender;
        initiateCombat();
    }

    initiateCombat()
    {
        //originally put "initialize combat UI", might just keep to side of screen
        let combatDamage;
        //needs establishment of attackers high/low damage of weapon
        const attackingWeapon = this.attacker.inventory.getWeapon();
        //needs establishment of defenders high/low damage of weapon
        const defendingArmor = this.defender.inventory.getArmor();
        
        if(this.isAttackerPlayer())
        {
            //floatAccuracy = traceGame(vertical swipe)
            combatDamage = attackingWeapon.damage(floatAccuracy);
        }
        else
        {
            combatDamage = attackingWeapon.damage(Math.random());
        }

        if(isDefenderPlayer())
        {
            //floatAccuracy = traceGame(horizantel swipe)
            // combat += floatAccuracy * (highDamageDefender - lowDamageDefender) + lowDamageDefender;
        }
        // defender.damage(combatDamage)
        //endCombat
        return;
    }
    traceGame()
    {
        // In the top right of the game canvas, a pattern will appear (in the tranparent hitbox) over the creature. 
        // Press and Drag the mouse over the pattern to deal damage to the creature, 
        // the higher the accuracy of the trace, the more damage is dealt.
        
        //TODO 
        //connect pattern vectors to hitbox circles
            //Notes
            //maximum hieght is 155px
            //only works from top so invert it ->
            //(155 - y) coord
            //maximum width is 105px

        //after done, place temp traceGame here
        
        

       

    }
    
    //might need adjustment
    isAttackerPlayer()
    {
        if(this.attacker instanceof Player)
        {
            return true;
        }
        return false;
    }
    //might need adjustment
    isDefenderPlayer()
    {
        if(this.defender instanceof Player)
        {
            return true;
        }
        return false;
    }

}
//temp traceGame
        let mouseTracePoints = new Array();
        let tracePoints = new Array();
        const hitbox = document.getElementById("hitbox");
        hitbox.addEventListener("mouseover", handleMousePress);
        
        function handleMousePress()
        {
            hitbox.addEventListener("mousedown", handleMouseDown);
        }
        
        function handleMouseDown()
        {
            //register the mouse move listener
            hitbox.addEventListener("mousemove", handleMouseMove);
        }
        
        function handleMouseMove(event) 
        {
            mouseTracePoints.push(new Vector2(event.clientX, event.clientY));
             console.log(mouseTracePoints);
        }
        var continueGame = false;
        window.addEventListener("mouseup", function() 
        {
            // Unregister the mouse move listener
            hitbox.removeEventListener("mousemove", handleMouseMove);
            this.hitbox.removeEventListener("mousedown",handleMouseDown);
            console.log(mouseTracePoints.length);
            if(tracePoints.length>0)
            {
                tracePoints = new Array();  
            }
            tracePoints = mouseTracePoints;
            // Clear the mouse trace array
            mouseTracePoints = new Array();
            continueGame = true;
        });
        if(continueGame){
            var damagePercentage = Accuracy(mouseTracePoints);
            return damagePercentage;
        }
//end temp traceGame
function Accuracy(tracePoints)
{
    
    //connect basicPatternPoints to weapons pattern
    let basicPatternPoints = new Array();
    let points =4;
    //Makes array divisible by 4
    let extra = tracePoints%3;
    for(let i=0;i<extra;i++)
    {
        tracePoints.pop();
    }
    //array for average point Distances
    let totalAverageDistance =0;
    //compares points
    for(let i=0;i<points;i++){
        //finds point of pattern
        let patternVector = basicPatternPoints.at(i);
        let patternX = patternVector.getX();
        let patternY = patternVector.getY();
        //finds point of pattern
        var mouseVector;
        if(i==1)
        {
            mouseVector = tracePoints.at(0);
        }
        if(i==2)
        {
            let p2Index = tracePoints.length/3;
            mouseVector = tracePoints.at(p2Index);
        }
        if(i==3)
        {
            let p3Index = (tracePoints.length/3)*2;
            mouseVector = tracePoints.at(p3Index);
        }
        if(i==4)
        {
            mouseVector = tracePoints.at(tracePoints.length-1);
        }
        let mouseX = mouseVector.getX();
        let mouseY = mouseVector.getY();
        //TODO
        //fix vectors to be equivalent ->
            //pattern vector only accounts for inside hitbox while mouse accounts for window
        //then compare the x and y distances to find distances from pattern point, 
        //add x distance with y distance, then divide by two to find average distance from pattern for averageDistance.
        let averageDistance;
        totalAverageDistance+=averageDistance;
    }
    //average the four points
    let DExtra = totalAverageDistance%4;
    totalAverageDistance = ((totalAverageDistance-DExtra)/4);
    //score the average distance
    ScalingScore(totalAverageDistance);
    const isBetween = (n, start, stop) => n >= start && n <= stop ;
    //switch case for range of distances, returns damage percentage
    function ScalingScore (num) {
        switch (true) {
            case isBetween(num, 0, 20):
                return 0.95;          
            case isBetween(num, 21, 40):
                return 0.85;
            case isBetween(num,41, 60):
                return 0.75;
            case isBetween(num, 61, 80):
                return 0.65;
            default:
                return 0.55;
        }
    } 
}
