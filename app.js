import { Entity } from "./Entity.js";
import { Game } from "./Game.js";
import { Renderer } from "./Renderer.js";
import { Vector2 } from "./Vectors.js";

// New supabase session 
const supabaseUrl = "https://inyelmyxiphvbfgmhmrk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWVsbXl4aXBodmJmZ21obXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0Nzg3NzEsImV4cCI6MjAxMzA1NDc3MX0.9ByIuA4tv1oMmEr2UPAbCvNQYSvH-wY8aU-4Y8JSprg";
const s = supabase.createClient(supabaseUrl, supabaseKey);

// Creating the game window
const canvasWidth = 640;
const canvasHeight = 512;
const canvas = document.getElementById("canvas");
const app = new PIXI.Application(
    { 
        view : canvas, 
        width : canvasWidth, 
        height : canvasHeight, 
        backgroundColor : 0xFFFFFF
    }
);
app.stage.sortableChildren = true;
document.getElementById("Gam").appendChild(app.view);

// Stores the background image as a new sprite
let bkgTexture = PIXI.Texture.from("./images/tiles/default_bg.png");
let bkg = new PIXI.Sprite(bkgTexture);
bkg.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
bkg.setTransform(0, 0, 2, 2);

// Load prefabs from .json file
const prefabs = await fetch('./prefabs.json')
    .then((response) => response.json()).catch(error => console.error(error));

// Load our weapons from .json file
const masterList = await fetch('./Items/Weapons.json')
    .then((response) => response.json()).catch(error => console.error(error));

// Temporary implementation of sidebar with loaded elements
const loadSidebar = async () =>
{
    const sheet = await PIXI.Assets.load('./images/sb/sidebar.json');
    // const wpnTexture = prefabs.Player.inventory.weapon.resnderer.spriteSheetInfo.img;
    const sidebar = new PIXI.Sprite(sheet.textures['sidebar']);
        sidebar.setTransform(512, 0);
        // sidebar.anchor.set(0.5, 0.5);
        sidebar.height = 512;
        sidebar.width = 128;
        sidebar.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(sidebar);
    const battleBkg = new PIXI.Sprite(PIXI.Texture.from('./images/sb/frutiger.png'));
        battleBkg.setTransform(514, 2);
        battleBkg.height = 172;
        battleBkg.width = 124;
        battleBkg.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(battleBkg);
    const invTxt = new PIXI.Sprite(sheet.textures['inv_text']);
        invTxt.setTransform(512, 176);
        invTxt.height = 32;
        invTxt.width = 128;
        invTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invTxt);
    const invSlot = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot.setTransform(518, 212);
        invSlot.height = 32;
        invSlot.width = 32;
        invSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot);
    const invSlot2 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot2.setTransform(560, 212);
        invSlot2.height = 32;
        invSlot2.width = 32;
        invSlot2.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot2);
    const invSlot3 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot3.setTransform(602, 212);
        invSlot3.height = 32;
        invSlot3.width = 32;
        invSlot3.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot3);
    const invSlot4 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot4.setTransform(518, 254);
        invSlot4.height = 32;
        invSlot4.width = 32;
        invSlot4.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot4);
    const invSlot5 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot5.setTransform(560, 254);
        invSlot5.height = 32;
        invSlot5.width = 32;
        invSlot5.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot5);
    const invSlot6 = new PIXI.Sprite(sheet.textures['circle_slot']);
        invSlot6.setTransform(602, 254);
        invSlot6.height = 32;
        invSlot6.width = 32;
        invSlot6.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(invSlot6);
    const armorTxt = new PIXI.Sprite(sheet.textures['armor_text']);
        armorTxt.setTransform(528, 292);
        armorTxt.height = 32;
        armorTxt.width = 96;
        armorTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(armorTxt);
    const armorSlot = new PIXI.Sprite(sheet.textures['square_slot_big']);
        armorSlot.setTransform(544, 326);
        armorSlot.height = 64;
        armorSlot.width = 64;
        armorSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(armorSlot);
    const weaponTxt = new PIXI.Sprite(sheet.textures['weapon_text']);
        weaponTxt.setTransform(512, 394);
        weaponTxt.height = 32;
        weaponTxt.width = 128;
        weaponTxt.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(weaponTxt);
    const weaponSlot = new PIXI.Sprite(sheet.textures['circle_slot_big']);
        weaponSlot.setTransform(544, 432);
        weaponSlot.height = 64;
        weaponSlot.width = 64;
        weaponSlot.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.stage.addChild(weaponSlot);
}

app.stage.addChild(bkg);
loadSidebar();

const game = new Game(app.stage);

game.deserializeEntity(prefabs.Player);
// game.deserializeEntity(prefabs.Wall);

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
lbapp.stage.sortableChildren = true;
document.getElementById("lbCanvasAnchor").appendChild(lbapp.view);

bkgTexture = PIXI.Texture.from("./images/tiles/default_bg.png");
bkg = new PIXI.Sprite(bkgTexture);
bkg.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
bkg.setTransform(0, 0, 2, 2);
lbapp.stage.addChild(bkg);

const levelBuilder = new Game(lbapp.stage);
const lbui = new PIXI.Graphics();
lbui.eventMode = 'static';
lbui.cursor = 'pointer';
lbui.zIndex = 1024;
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


const prefabButtons = document.querySelectorAll('.prefab-button');

for (const e of prefabButtons)
{
    e.addEventListener('click', () => addToLevelBuilder(prefabs[e.textContent]));
}

function addToLevelBuilder(obj, rawAdd = false)
{
    const entity = levelBuilder.deserializeEntity(obj);
    if (selectedEntity != null && !rawAdd)
    {
        entity.transform.position = Vector2.add(selectedEntity.transform.position, {x:32, y:0});
        if (entity.transform.position.x >= 512)
        {
            entity.transform.position.y += 32;
            entity.transform.position.x = 0;
        }
    }
    const eList = document.querySelector('#entityList');
    const button = document.createElement('button');
    button.textContent = entity.name;
    button.setAttribute('id','id'+entity.getID());
    button.setAttribute('class','entity-select dropbtn');
    button.addEventListener('click', highlightEntity);
    if (!rawAdd)
        button.click();
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

document.getElementById("Bui").addEventListener('loadLevel', (e) => {
    levelBuilder.unloadRoom();
    for (const obj of e.detail.level_obj)
    {
        addToLevelBuilder(obj, true);
    }
    document.getElementById("levelName").value = e.detail.level_name;
});

/* Event listener for saving levels to supabase */
document.getElementById("saveLevel").addEventListener("click", async (e) => {

    e.preventDefault();

    // Integer that represents max length allowed for a level name
    let maxNameSize = 15;

    // Get the level name text box
    const levelNameTextBox = document.getElementById("levelName");

    // Check to see if there is a name in the text box
    if (levelNameTextBox.value == 0) {
       // Textbox is empty, make user enter a name
       alert("Error: No name provided for the level.")
       levelNameTextBox.style.backgroundColor = "#E3963E";
       return;
    }

    // Check to see if name exceeds maximum length
    if (levelNameTextBox.value.length > maxNameSize) {
       // Name is too long. Make user enter a new name
       alert("Error: Level name cannot be longer than 15 characters. Please enter a new name.");
       levelNameTextBox.style.backgroundColor = "#E3963E";
       return;
    }

    // Get the user's level name
    const level_name = levelNameTextBox.value;

    // Get the user's username
    const user = await s.auth.getUser();
    var username = JSON.stringify(user.data.user.user_metadata.username);

    await removeLevel(username, level_name);

    // Call the saveRoom() function to get the level file and index
    const levelObject = levelBuilder.saveRoom();

    // Insert data into Supabase
    const { data, error } = await s.from('levels').insert([
       {
          username: username,
          level_file: levelObject.level_file,
          index: levelObject.index,
          level_name: level_name,
          published: false,
       },
    ])

    if (error) {
       // Error saving to database
       alert("Error: There was an error saving your level. Please retry.");
       return;
    }
    else {
       // Level was successfully added
       alert("Level saved!");
       // Change text box color back to original (if necessary)
       levelNameTextBox.style.backgroundColor = '';
       return;
    }
 });

 async function removeLevel(username, levelname)
 {
    const { data, error } = await s
        .from('levels')
        .delete()
        .eq('username', username)
        .eq('level_name', levelname);
 }