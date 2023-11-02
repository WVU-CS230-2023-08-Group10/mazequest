import { Game } from "./Game.js";

const canvasSize = 512;
const canvas = document.getElementById("canvas");
const app = new PIXI.Application(
    { 
        view: canvas, 
        width: canvasSize, 
        height: canvasSize, 
        backgroundColor: 0xFFFFFF
    }
);
document.getElementById("Gam").appendChild(app.view);

const bkgTexture = PIXI.Texture.from("./images/preview.png");
const bkg = new PIXI.Sprite(bkgTexture);

app.stage.addChild(bkg);

const game = new Game(app.stage);

document.addEventListener('keydown', function(input) {
    if (!input.repeat)
        game.broadcastToEntities({type:'keydown', key:input.key});
});

app.ticker.add((delta) => {
    game.updateEntities(delta);
});

