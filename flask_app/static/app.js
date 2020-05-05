window.canvasInfo = {
    width: 640,
    height: 640
};

$(document).ready(() => {
    console.log('app init');
    initSlider();

    window.app = new PIXI.Application({
        backgroundColor: 0x1099bb,
        width: canvasInfo.width, height: canvasInfo.height
    });
    document.getElementById('canvas').appendChild(window.app.view);


    /////////// plane sprites ///////////
    const planeSprite = PIXI.Sprite.from(window.plane.src);
    planeSprite.anchor.set(0.5);
    planeSprite.x = window.app.screen.width / 2;
    planeSprite.y = window.app.screen.height / 2;

    const planeFlapSprit = PIXI.Sprite.from(window.plane.flapSrc);
    planeFlapSprit.anchor.set(0.5);
    planeFlapSprit.x = window.app.screen.width / 4;
    planeFlapSprit.y = window.app.screen.height / 4;

    window.createPlaneSprite = () => {
        window.app.stage.addChild(planeSprite);
        window.app.stage.addChild(planeFlapSprit);
    };

    window.createPendulumSprite = () => {
        // ...
    };

    window.createSuspensionSprite = () => {
        // ...
    };

    window.createBallSprite = () => {
        // ...
    };


    // Listen for animate update
    window.app.ticker.add((delta) => {
        planeSprite.rotation = -window.plane.currentAngle;
        planeFlapSprit.rotation = -window.plane.currentFlapAngle;
    });
});
