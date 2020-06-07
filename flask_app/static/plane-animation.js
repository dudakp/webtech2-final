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
    const flapSprite = PIXI.Sprite.from(window.plane.flapSrc);

    flapSprite.scale.set(1.25, 1.25);
    planeSprite.anchor.set(0.5);
    flapSprite.anchor.set(0.5);
    planeSprite.x = window.app.screen.width / 2;
    planeSprite.y = window.app.screen.height / 3;

    flapSprite.x = window.app.screen.width / 2;
    flapSprite.y = window.app.screen.height / 2;


    window.createPlaneSprite = () => {
        window.app.stage.addChild(planeSprite);
        window.app.stage.addChild(flapSprite);
    };


    createPlaneSprite();
    window.app.ticker.add((delta) => {
        planeSprite.rotation = -window.plane.currentAngle;
        flapSprite.rotation = -window.plane.currentFlapAngle;
    });
});
