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
document.body.appendChild(app.view);

const playerTexture = PIXI.Texture.from('./images/down.png');
const player = new PIXI.Sprite(playerTexture);

player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;

const bkgTexture = PIXI.Texture.from("./images/bliss.jpg");
const bkg = new PIXI.Sprite(bkgTexture);

app.stage.addChild(bkg);
app.stage.addChild(player);

document.addEventListener('keydown', function(input) {
    switch (input.key) {
        case 'ArrowUp':
            player.texture = PIXI.Texture.from("./images/up.png");
            player.y -= 10;
            break;
        case 'ArrowLeft':
            player.texture = PIXI.Texture.from("./images/left.png");
            player.x -= 10;
            break;
        case 'ArrowDown':
            player.texture = PIXI.Texture.from("./images/down.png");
            player.y += 10;
            break;
        case 'ArrowRight':
            player.texture = PIXI.Texture.from("./images/right.png");
            player.x += 10;
            break;
        default:
            break;
    }
})

