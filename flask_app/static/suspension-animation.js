let stopped = true;
function createObjectsForAnimation() {
    $('#canvas').css('width', '600px')
        .css('height', '400px')
        .html('')
        .append(
            '<div class="background">' +
            '      <div class="road animated"></div>' +
            '      <div class="city animated"></div>' +
            '      <div class="car">' +
            '        <img src="static/assets/suspension/car.png" alt="car">' +
            '      </div>' +
            '      <div class="wheels">' +
            '        <img src="static/assets/suspension/wheel.png" alt="back-wheel" class="back-wheel animated">' +
            '        <img src="static/assets/suspension/wheel.png" alt="front-wheel" class="front-wheel animated">' +
            '      </div>' +
            '    </div>'
        );
    startAnimation();
}
createObjectsForAnimation();

function stopAnimation() {
    $('.animated').each((index, value) => {
        $('.animated')[index].style.webkitAnimationPlayState = 'paused';
    });
    stopped = true;
}

function startAnimation() {
    stopped = false;
    $('.animated').each((index, value) => {
        $('.animated')[index].style.webkitAnimationPlayState = 'running';
    });
}

function updateAnimation(value1, value2) {
    if (stopped) {
        startAnimation();
    }
    $('.car img').css('transform', 'translateY(' + (value1 - r) * 10 + 'px)');
    $('.wheels').css('transform', 'translateY(' + value2 * 10 + 'px)');
}

function updateAnimationSpeed(value) {
    $('.road').css('-webkit-animation-duration', 5 / value + 's');
    $('.city').css('-webkit-animation-duration', 5 / value + 's');
    $('.wheels img').css('-webkit-animation-duration', 1 / value + 's');
}