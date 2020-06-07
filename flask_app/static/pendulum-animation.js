window.canvasInfo = {
    width: 640,
    height: 640
};

$(document).ready(() => {
    window.app = new PIXI.Application({
        backgroundColor: '#FFFFFF',
        width: canvasInfo.width,
        height: canvasInfo.height
    });
    document.getElementById('canvas').appendChild(window.app.view);


    // const planeSprite = PIXI.Sprite.from(window.plane.src);
    // // center the sprite's anchor point
    // planeSprite.anchor.set(0.5);
    // // move the sprite to the center of the screen
    // planeSprite.x = window.app.screen.width / 2;
    // planeSprite.y = window.app.screen.height / 2;

    const pendulumSprite = PIXI.Sprite.from(window.pendulum.src);
    const pendulumPerpendicular = PIXI.Sprite.from(window.pendulum.srcPerpendicular)
    const background = PIXI.Sprite.from('static/assets/pendulum/background.png');

    background.scale.set(1, 1.2);

    pendulumPerpendicular.anchor.set(0.5);
    pendulumPerpendicular.x = window.app.screen.width / 2;
    pendulumPerpendicular.y = window.app.screen.height;

    pendulumSprite.anchor.set(0.5);
    pendulumSprite.x = window.app.screen.width / 2;
    pendulumSprite.y = window.app.screen.height;

    window.createPendulumSprite = () => {
        window.app.stage.addChild(background);
        window.app.stage.addChild(pendulumSprite);
        window.app.stage.addChild(pendulumPerpendicular);
    };

    createPendulumSprite();
    // Listen for animate update
    window.app.ticker.add((delta) => {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation

        pendulumSprite.x = window.pendulum.currentPos * 500 + 30;
        pendulumPerpendicular.x = window.pendulum.currentPos * 500 + 35;
        pendulumPerpendicular.rotation = -window.pendulum.currentTilt * 3;
    });
});
