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
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"default"}, "inventory":{ "type":"Inventory", "weapon":null, 
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
const lbui = new PIXI.Graphics();
lbui.eventMode = 'static';
lbui.cursor = 'pointer';
lbapp.stage.on('pointerdown', onDragStart, lbui);
lbapp.stage.addChild(lbui);

let selectedEntity = undefined;

lbapp.ticker.add((delta) => {
    levelBuilder.renderEntities(delta);

    if (selectedEntity != undefined)
    {
        lbui.clear();
        lbui.lineStyle(1, 0xFF0000, 1);
        lbui.drawRect(selectedEntity.transform.position.x, selectedEntity.transform.position.y, 32, 32);
    }
});
lbapp.stage.eventMode = 'static';
lbapp.stage.hitArea = lbapp.screen;
lbapp.stage.on('pointerup', onDragEnd);
lbapp.stage.on('pointerupoutside', onDragEnd);

const prefabs = new Map();
prefabs.set('Player', JSON.parse(`{ "type":"Player", "name": "Player", "transform": 
{ "position" : { "x" : 256, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/armor/leatherArmor.json", 
"img":"./images/armor/leatherArmor.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"default"}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));
prefabs.set('Goblin', JSON.parse(`{ "type":"Player", "name": "Goblin", "transform": 
{ "position" : { "x" : 128, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/armor/leatherArmor.json", 
"img":"./images/armor/leatherArmor.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"walkright"}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));

const prefabButtons = document.querySelectorAll('.prefab-button');

for (const e of prefabButtons)
{
    e.addEventListener('click', () => addToLevelBuilder(e.textContent));
}

function addToLevelBuilder(id)
{
    const obj = prefabs.get(id);
    const entity = levelBuilder.deserializeEntity(obj);
    const eList = document.querySelector('#entityList');
    const button = document.createElement('button');
    button.textContent = entity.name;
    button.setAttribute('id',entity.getID());
    button.setAttribute('class','dropbtn');
    button.addEventListener('click', highlightEntity);
    eList.appendChild(button);
}

function highlightEntity()
{
    selectedEntity = levelBuilder.getEntity((e) => e.getID() == this.id);
}

function onDragMove(event)
{
    selectedEntity.transform.position.x = Math.floor(event.global.x / levelBuilder.grid.cellSize) * levelBuilder.grid.cellSize;
    selectedEntity.transform.position.y = Math.floor(event.global.y / levelBuilder.grid.cellSize) * levelBuilder.grid.cellSize;
}

function onDragStart()
{
    lbapp.stage.on('pointermove', onDragMove);
    console.log("drag start");
}

function onDragEnd()
{
    lbapp.stage.off('pointermove', onDragMove); 
    console.log("drag end");
}