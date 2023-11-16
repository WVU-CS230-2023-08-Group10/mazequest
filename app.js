import { Entity } from "./Entity.js";
import { Game } from "./Game.js";
import { Renderer } from "./Renderer.js";

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
lbapp.stage.addChild(lbui);

let selectedEntity = null;

lbapp.ticker.add((delta) => {
    levelBuilder.renderEntities(delta);

    lbui.clear();
    if (selectedEntity != null)
    {
        lbapp.stage.on('pointerdown', onDragStart, lbui);
        lbui.lineStyle(1, 0xFF0000, 1);
        const t = selectedEntity._Transform
        lbui.drawRect(t._Position.x, t._Position.y, 16 * t._Scale.x, 16 * t._Scale.y);
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
    button.textContent = entity._Name;
    button.setAttribute('id','id'+entity.getID());
    button.setAttribute('class','entity-select dropbtn');
    button.addEventListener('click', highlightEntity);
    eList.appendChild(button);
}

function highlightEntity()
{
    clearEditorUI();
    const newEntity = levelBuilder.getEntity((e) => e.getID() == this.id.substring(2));
    if (selectedEntity != null)
    {
        if (newEntity.getID() == selectedEntity.getID())
        {
            this.setAttribute('class','entity-select dropbtn');
            selectedEntity = null;
            onDragEnd();
            lbapp.stage.off('pointerdown', onDragStart, lbui);
            return;
        }

        const previouslySelected = document.querySelector(`#id${selectedEntity.getID()}`);
        previouslySelected.setAttribute('class','entity-select dropbtn');
    }

    this.setAttribute('class','entity-select dropbtn selected-entity');
    selectedEntity = newEntity;
    loadEditorUI(document.querySelector('.vars'), selectedEntity);
}

function onDragMove(event)
{
    selectedEntity._Transform._Position.x = Math.floor(event.global.x / levelBuilder.grid.cellSize) * levelBuilder.grid.cellSize;
    selectedEntity._Transform._Position.y = Math.floor(event.global.y / levelBuilder.grid.cellSize) * levelBuilder.grid.cellSize;
}

function onDragStart()
{
    lbapp.stage.on('pointermove', onDragMove);
    clearEditorUI()
}

function onDragEnd()
{
    lbapp.stage.off('pointermove', onDragMove);
    loadEditorUI(document.querySelector('.vars'), selectedEntity);
}

function loadEditorUI(parent, entity, indent=0)
{
    for (let prop in entity)
    {
        if (prop.charAt(0) != '_')
            continue;

        const newElement = document.createElement(`h${indent+3}`);
        newElement.textContent = prop.substring(1);
        const val = entity[prop];
        if (val instanceof Object)
        {
            loadEditorUI(newElement, entity[prop], indent+1);
            parent.appendChild(newElement);
        }
        else
        {
            
            const div = document.createElement('div');
            const form = document.createElement('input');
            form.setAttribute('type', val instanceof Number ? 'number' : 'text');
            form.value = val;
            form.addEventListener('input', () => {updateEntityValues(entity, prop, form)});
            div.appendChild(newElement);
            div.appendChild(form);
            parent.appendChild(div);
        }
    }
}

function updateEntityValues(object, propertyName, inputSource)
{
    object[propertyName] = inputSource.value;

    if (object instanceof Entity && propertyName == '_Name')
    {
        document.querySelector(`#id${selectedEntity.getID()}`).textContent = inputSource.value;
    }

    if (object instanceof Renderer && propertyName == '_CurrentAnimation')
    {
        selectedEntity._Renderer.setAnimation(inputSource.value, 1/4, true);
    }
}

function clearEditorUI()
{
    document.querySelector('.vars').replaceChildren();
}