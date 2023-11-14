import { Game } from "./Game.js";

const canvasSize = 512;
const canvas = document.getElementById("canvas");
const app = new PIXI.Application(
    { 
        view: canvas, 
        width: canvasSize, 
        height: canvasSize, 
        backgroundColor: 0xFFFFFF,
    }
);
document.getElementById("Gam").appendChild(app.view);

const bkgTexture = PIXI.Texture.from("./images/preview.png");
const bkg = new PIXI.Sprite(bkgTexture);

app.stage.addChild(bkg);

const game = new Game(app.stage);

game.deserializeEntity(JSON.parse(`{ "type":"Player", "name": "Player", "transform": 
{ "position" : { "x" : 256, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/armor/leatherArmor.json", 
"img":"./images/armor/leatherArmor.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));

document.addEventListener('keydown', function(input) {
    if (!input.repeat)
        game.broadcastToEntities({type:'keydown', key:input.key});
});

app.ticker.add((delta) => {
    game.updateEntities(delta);
});

/**
 *  Level Builder Stuff
 */

const lbcanvas = document.getElementById("levelBuilderCanvas");
const lbapp = new PIXI.Application(
    { 
        view: lbcanvas, 
        width: canvasSize, 
        height: canvasSize, 
        backgroundColor: 0x000000,
    }
)
document.getElementById("lbCanvasAnchor").appendChild(lbapp.view);

const levelBuilder = new Game(lbapp.stage);

lbapp.ticker.add((delta) => {
    levelBuilder.renderEntities(delta);
});