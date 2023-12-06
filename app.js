import { Entity } from "./Entity.js";
import { Game } from "./Game.js";
import { Renderer } from "./Renderer.js";

const canvasWidth = 640;
const canvasHeight = 512;
const canvas = document.getElementById("canvas");
const app = new PIXI.Application(
    { 
        view: canvas, 
        width: canvasWidth, 
        height: canvasHeight, 
        backgroundColor: 0xFFFFFF,
    }
);
document.getElementById("Gam").appendChild(app.view);

const bkgTexture = PIXI.Texture.from("./images/preview.png");
const bkg = new PIXI.Sprite(bkgTexture);

// Temporary implementation of sidebar with loaded elements
const loadSidebar = async () =>
{
    const sheet = await PIXI.Assets.load('./images/sb/sidebar.json');
    const sidebar = new PIXI.Sprite(sheet.textures['sidebar']);
        sidebar.anchor.set(-4, 0);
        sidebar.height = 512;
        sidebar.width = 128;
        sidebar.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(sidebar);
    const battleBkg = new PIXI.Sprite(PIXI.Texture.from('./images/sb/frutiger.png'));
        battleBkg.anchor.set(-4.145, -0.01);
        battleBkg.height = 172;
        battleBkg.width = 124;
        battleBkg.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(battleBkg);
    const goblin = new PIXI.Sprite(PIXI.Texture.from('./images/sb/goblin.png'));
        goblin.anchor.set(-4.94, -0.4);
        goblin.height = 106;
        goblin.width = 106;
        goblin.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(goblin);
    // const screen = new PIXI.Sprite(sheet.textures['screen']);
    //     screen.anchor.set(-4, 0);
    //     screen.height = 176;
    //     screen.width = 128;
    //     screen.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    // app.stage.addChild(screen);
    // const testTxt = new PIXI.Sprite(sheet.textures['test_text']);
    //     testTxt.anchor.set(-8.5, -2);
    //     testTxt.height = 32;
    //     testTxt.width = 64;
    //     testTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    // app.stage.addChild(testTxt);
    const invTxt = new PIXI.Sprite(sheet.textures['inv_text']);
        invTxt.anchor.set(-4, -5.5);
        invTxt.height = 32;
        invTxt.width = 128;
        invTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invTxt);
    const invSlot = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot.anchor.set(-16.2, -6.65);
        invSlot.height = 32;
        invSlot.width = 32;
        invSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot);
    const invSlot2 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot2.anchor.set(-17.5, -6.65);
        invSlot2.height = 32;
        invSlot2.width = 32;
        invSlot2.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot2);
    const invSlot3 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot3.anchor.set(-18.8, -6.65);
        invSlot3.height = 32;
        invSlot3.width = 32;
        invSlot3.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot3);
    const invSlot4 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot4.anchor.set(-16.2, -7.9);
        invSlot4.height = 32;
        invSlot4.width = 32;
        invSlot4.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot4);
    const invSlot5 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot5.anchor.set(-17.5, -7.9);
        invSlot5.height = 32;
        invSlot5.width = 32;
        invSlot5.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot5);
    const invSlot6 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot6.anchor.set(-18.8, -7.9);
        invSlot6.height = 32;
        invSlot6.width = 32;
        invSlot6.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot6);
    const armorTxt = new PIXI.Sprite(sheet.textures['armor_text']);
        armorTxt.anchor.set(-5.5, -9.1);
        armorTxt.height = 32;
        armorTxt.width = 96;
        armorTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(armorTxt);
    const armorSlot = new PIXI.Sprite(sheet.textures['square_slot_big']);
        armorSlot.anchor.set(-8.5, -5.1);
        armorSlot.height = 64;
        armorSlot.width = 64;
        armorSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(armorSlot);
    const weaponTxt = new PIXI.Sprite(sheet.textures['weapon_text']);
        weaponTxt.anchor.set(-4, -12.3);
        weaponTxt.height = 32;
        weaponTxt.width = 128;
        weaponTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(weaponTxt);
    const weaponSlot = new PIXI.Sprite(sheet.textures['circle_slot_big']);
        weaponSlot.anchor.set(-8.5, -6.75);
        weaponSlot.height = 64;
        weaponSlot.width = 64;
        weaponSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(weaponSlot);
}

// Custom background + sprite for screen
const encounterScreen = () => 
{
    
}

app.stage.addChild(bkg);
loadSidebar();
encounterScreen();



const game = new Game(app.stage);

game.deserializeEntity(JSON.parse(`{ "type":"Player", "name": "Player", "transform": 
{ "position" : { "x" : 256, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/armor/leatherArmor.json", 
"img":"./images/armor/leatherArmor.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"default"}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));
game.deserializeEntity(JSON.parse(`{ "type":"Collider", "name": "Wall", "transform": 
{ "position" : { "x" : 128, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/armor/leatherArmor.json", 
"img":"./images/armor/leatherArmor.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"default"}}`));

const gameWindowTab = document.querySelector("#GameWindow");

document.addEventListener('keydown', function(input) {
    if (!gameWindowTab.classList.contains("active")) return;

    if (!input.repeat)
        game.broadcastToEntities({type:'keydown', key:input.key});
});

app.ticker.add((delta) => {
    if (!gameWindowTab.classList.contains("active")) return;

    game.updateEntities(delta);
});

/**
 *  Level Builder Stuff
 */

const lbcanvas = document.getElementById("levelBuilderCanvas");
const lbapp = new PIXI.Application(
    { 
        view: lbcanvas, 
        width: canvasHeight, 
        height: canvasHeight, 
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
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/enemies/goblin.json", 
"img":"./images/enemies/goblin.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"walkright"}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));
prefabs.set('Slime', JSON.parse(`{ "type":"Player", "name": "Slime", "transform": 
{ "position" : { "x" : 256, "y" : 256}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/enemies/slime.json", 
"img":"./images/enemies/slime.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"walkright"}, "inventory":{ "type":"Inventory", "weapon":null, 
"armor":null, "consumables":[]}}`));
prefabs.set('Exit Indicator', JSON.parse(`{ "type":"ExitIndicator", "name": "Exit Indicator", "transform": 
{ "position" : { "x" : 256, "y" : 32}, "scale" : { "x" : 2, "y" : 2}, "rotation" : 0}, 
"renderer": { "type":"Renderer", "spriteSheetInfo": { "json":"./images/levelEditor/exit_indicator.json",
"img":"./images/levelEditor/exit_indicator.png"}, "transform": { "position" : { "x" : 0, "y" : 0}, 
"scale" : { "x" : 1, "y" : 1}, "rotation" : 0}, "animation":"up"}}`));

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
    clearEditorUI();
}

function onDragEnd()
{
    lbapp.stage.off('pointermove', onDragMove);
    clearEditorUI();
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
            form.addEventListener('input', () => {updateEntityValues(entity, prop, form);});
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
        selectedEntity.renderer.setAnimation(inputSource.value, 1/4, true);
    }
}

function clearEditorUI()
{
    document.querySelector('.vars').replaceChildren();
}