const planeSprite = new Image();

const angles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const plane = {
    src: 'http://getdrawings.com/image/step-by-step-airplane-drawing-57.jpg',
    angle: 0,
    flapAngle: 0
};

let angle = 0;

const canvasInfo = {
    width: 640,
    height: 640
}

let k = 0;
// $(document).ready(() => {
const letsGo = () => {
    fetch(`/api/data/plane?r=0.2&key=5098a67d11ed2dd2477b8a509b681a7a7bbacdde5783101e09b4e7e25ba51e7bef4a6d`)
        .then(r => r.json())
        .then(res => {
            plane.angle = res.plane_tilt;
            plane.flapAngle = res.rear_flap_tilt;
        });

    const app = new PIXI.Application({backgroundColor: 0x1099bb});
    document.getElementById('canvas').appendChild(app.view);

    // create a new Sprite from an image path
    const planeSprite = PIXI.Sprite.from('static/plane.png');

    // center the sprite's anchor point
    planeSprite.anchor.set(0.5);

    // move the sprite to the center of the screen
    planeSprite.x = app.screen.width / 2;
    planeSprite.y = app.screen.height / 2;

    app.stage.addChild(planeSprite);

    // Listen for animate update
    app.ticker.add((delta) => {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        planeSprite.rotation = -angle;
    });


    const planeInterval = setInterval(() => {
        angle = plane.angle[k];
        k++;
        if (k === plane.angle.length) {
            console.error('hotovo');
            clearInterval(planeInterval);
        }
    }, 100);
};
// });
