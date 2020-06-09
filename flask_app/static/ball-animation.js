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


    const ballSprite = PIXI.Sprite.from(window.ball.src);
    ballSprite.anchor.set(0.5);
    ballSprite.x = window.app.screen.width / 2 ;
    ballSprite.y = window.app.screen.height / 2 + 70;

    const barSprite = PIXI.Sprite.from(window.bar.src);
    barSprite.anchor.set(0.5);
    barSprite.x = window.app.screen.width / 2;
    barSprite.y = (window.app.screen.height / 2)+100;




    window.createBallSprite = () => {
        window.app.stage.addChild(ballSprite);
    };


    window.createBarSprite = () => {
        window.app.stage.addChild(barSprite);
    };


    createBallSprite();
    createBarSprite();

    window.app.ticker.add((delta) => {
       ballSprite.x = 280+ window.ball.currentPosition*100;
       // ballSprite.y = window.ball.currentPosition*1000;

       barSprite.rotation = window.bar.currentTilt*100;

    });
});
