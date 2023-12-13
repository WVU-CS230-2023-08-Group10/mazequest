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
    maxDistance;
    graphics;
    stage;

    constructor(attacker, defender, stage)
    {
        this.attacker = attacker;
        this.defender = defender;

        this.stage = stage;
        this.graphics = new PIXI.Graphics();
        this.stage.addChild(graphics);

        initiateCombat();
    }

    initiateCombat()
    {
        //originally put "initialize combat UI", might just keep to side of screen
        let combatDamage, floatAccuracy;
        //needs establishment of attackers high/low damage of weapon
        const attackingWeapon = this.attacker.inventory.getWeapon();
        //needs establishment of defenders high/low damage of weapon
        const defendingArmor = this.defender.inventory.getArmor();
        
        if(this.isAttackerPlayer())
        {
            this.drawPattern(attackingWeapon.trace);
            //floatAccuracy = traceGame(vertical swipe)
            combatDamage = attackingWeapon.damage(floatAccuracy);
        }
        else
        {
            combatDamage = attackingWeapon.damage(Math.random());
        }

        if(this.isDefenderPlayer())
        {
            this.drawPattern(defendingArmor.trace);
            //floatAccuracy = traceGame(horizantel swipe)
            combatDamage -= defendingArmor.damage(floatAccuracy);
        }
        else
        {
            combatDamage -= defendingArmor.damage(Math.random());
        }
        this.defender.damage(combatDamage);
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
    
    isAttackerPlayer()
    {
        return this.attacker instanceof Player;
    }

    isDefenderPlayer()
    {
        return this.defender instanceof Player;
    }

    /**
     * 
     * @param {Array<Vector2>} pattern 
     */
    drawPattern(pattern)
    {
        if (trace.length <= 0)
            return;

        const baseCoord = new Vector2(512, 0);

        this.graphics.lineStyle({
            native:true, 
            color:0xffffff,
            width:2
        });
        this.graphics.moveTo(pattern[0].x + baseCoord.x, pattern[0].y + baseCoord.y);
        // remove the starting point
        pattern.splice(0, 1);
        for (const vec of pattern)
        {
            this.graphics.lineTo(vec.x + baseCoord.x, vec.y + baseCoord.y);
        }
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
            var damagePercentage = Accuracy(tracePoints);
        });
        
//end temp traceGame
function Accuracy(tracePoints)
{
    
    //connect basicPatternPoints to weapons pattern
    let basicPatternPoints = attackingWeapon.getTrace();
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
