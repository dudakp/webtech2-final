window.canvasInfo = {
    width: 640,
    height: 640
};

$(document).ready(() => {
    window.app = new PIXI.Application({
        backgroundColor: 0x1099bb,
        width: canvasInfo.width, height: canvasInfo.height
    });
    document.getElementById('canvas').appendChild(window.app.view);


    const planeSprite = PIXI.Sprite.from(window.plane.src);
    // center the sprite's anchor point
    planeSprite.anchor.set(0.5);
    // move the sprite to the center of the screen
    planeSprite.x = window.app.screen.width / 2;
    planeSprite.y = window.app.screen.height / 2;

    // const pendulumSprite = PIXI.Sprite.from(window.pendulum.src);
    //
    // pendulumSprite.anchor.set(0.5);
    // pendulumSprite.x = window.app.screen.width / 2;
    // pendulumSprite.y = window.app.screen.height;


    window.createPlaneSprite = () => {
        // window.app.destroy();
        window.app.stage.addChild(planeSprite);
    };

    // window.createPendulumSprite = () => {
    //     window.app.stage.addChild(pendulumSprite)
    // };

    createPlaneSprite();
    // Listen for animate update
    window.app.ticker.add((delta) => {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        planeSprite.rotation = -window.plane.currentAngle;

    });
});
