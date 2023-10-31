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
        case 'w':
            player.texture = PIXI.Texture.from("./images/up.png");
            if (player.y - 32 < 32)
                break;
            player.y -= 32;
            break;
        case 'ArrowLeft':
        case 'a':
            player.texture = PIXI.Texture.from("./images/left.png");
            if (player.x - 32 < 32)
                break;
            player.x -= 32;
            break;
        case 'ArrowDown':
        case 's':
            player.texture = PIXI.Texture.from("./images/down.png");
            if (player.y + 32 > 480)
                break;
            player.y += 32;
            break;
        case 'ArrowRight':
        case 'd':
            player.texture = PIXI.Texture.from("./images/right.png");
            if (player.x + 32 > 480)
                break;
            player.x += 32;
            break;
        default:
            break;
    }
})


