const options = [
    {value: 'ball', text: 'Ball Beam'},
    {value: 'suspension', text: 'Suspension'},
    {value: 'pendulum', text: 'Inverted Pendulum'},
    {value: 'plane', text: 'Aircraft Pitch'},
];
window.bar = {
    src: 'static/assets/ball/tyc.png',
    tilt:[],
    currentTilt:[],
};

window.ball = {
    src: 'static/assets/ball/ballfinal.png',
    position:[],
    currentPosition:[]
};

window.pendulum = {
    src: 'static/assets/pendulum/obdlznik.png',
    srcPerpendicular: 'static/assets/pendulum/obdlznik_kolmy.png',
    pos: [],
    tilt: [],
    currentPos: 0,
    currentTilt: 0
};

window.plane = {
    src: 'static/assets/plane/plane.png',
    flapSrc: 'static/assets/plane/rear_flap.png',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

// r is current value of r parameter, needed for suspension animation (you might need it as well)
let r;
let previousType;
// more global variables, because why not?
let data;
let type;

$(document).ready(function () {
    let parameterSlider = $("input#parameter-slider").bootstrapSlider({
        precision: 2,
        tooltip: 'always',
        labeledBy: 'parameter-slider-label'
    });
    let speedSlider = $("input#speed-slider").bootstrapSlider({
        precision: 1,
        tooltip: 'always',
        labeledBy: 'speed-slider-label'
    });
    speedSlider.on('slideStop', e => {
        if (graphInterval) {
            changeIntervalSpeed(e.value);
        }
    });

    options.forEach(option => {
        $('#data-options').append($('<option>', option));
    });
    getApiKey();
    $('#show').on('click', () => {
        type = $('#data-options').val();
        r = parameterSlider.bootstrapSlider('getValue');
        if (type === previousType) {
            getData(r, plotY1, plotY2, false);
        } else {
            previousType = type;
            plotX = 0;
            getData(r, 0, 0, true);
        }
    });
    $('#show').attr('disabled', true);
    $('#data-options').change(function () {
        $('#show').attr('disabled', $(this).val() === null);
    })
});

function getData(value, init1, init2, isNewGraph) {
    if (graphInterval) {
        stopGraph(isNewGraph);
    }
    $.get(`/api/data/${type}?r=${value}&init1=${init1}&init2=${init2}&key=${sessionStorage.getItem('apiKey')}`,
        response => {
            switch (type) {
                case 'ball':
                    window.ball.position=response.ball_pos;
                    window.bar.tilt = response.rod_pos;
                    break;
                case 'suspension':
                    break;
                case 'pendulum':
                    window.pendulum.pos = response.pos;
                    window.pendulum.tilt = response.tilt;
                    break;
                case 'plane':
                    window.plane.angles = response.plane_tilt;
                    window.plane.flapAngles = response.rear_flap_tilt;
                    break;
            }
            data = response;
            if (isNewGraph) {
                // clear canvas
                $('#canvas').html('');
                loadAnimationScript();
            } else {
                drawGraph(false);
            }
        }).fail(err => console.log('fail: ', err));
}

let graphInterval;
let plotX = 0;
let plotY1;
let plotY2;
let i = 0;

function drawGraph(isNewGraph) {
    if (interval !== 0) {
        graphInterval = setInterval(() => {
            // plotly data
            plotX++;
            plotY1 = data[Object.keys(data)[0]][i];
            plotY2 = data[Object.keys(data)[1]][i++];
            // animacne data
            switch (type) {
                case 'ball':
                    window.ball.currentPosition=window.ball.position[i];
                    window.bar.currentTilt = window.bar.tilt[i];
                    break;
                case 'suspension':
                    updateAnimation(plotY1, plotY2);
                    break;
                case 'pendulum':
                    window.pendulum.currentPos = window.pendulum.pos[i];
                    window.pendulum.currentTilt = window.pendulum.tilt[i];
                    break;
                case 'plane':
                    window.plane.currentAngle = window.plane.angles[i];
                    window.plane.currentFlapAngle = window.plane.flapAngles[i];
                    break;
            }
            updatePlotly();
            if (i === data[Object.keys(data)[0]].length) {
                clearInterval(graphInterval);
                if (type === 'suspension') {
                    // this stops animation for suspension, pixi probably stops automatically
                    stopAnimation();
                }
            }
        }, interval);
    }

    function updatePlotly() {
        Plotly.extendTraces('chart', {
                y: [
                    [plotY1]
                ]
            },
            [0]);
        Plotly.extendTraces('chart', {
                y: [
                    [plotY2]
                ]
            },
            [1]);
    }

    if (isNewGraph) {
        Plotly.plot('chart', [
            {
                y: [plotY1],
                type: 'line',
                name: Object.keys(data)[0]
            },
            {
                y: [plotY2],
                type: 'line',
                name: Object.keys(data)[1]
            }
        ]);
    }
}

function stopGraph(isNewGraph) {
    clearInterval(graphInterval);
    i = 0;
    if (isNewGraph) {
        Plotly.deleteTraces('chart', [0, 1]);
        plotY1 = undefined;
        plotY2 = undefined;
    }
}

/**
 * Loads script with current animation
 *
 *  I don't really care if its 5 lines of code or not,
 *  separate each animation to its own file to prevent merge conflicts
 *  and to give the app some structure, even when it's for Webte
 */
function loadAnimationScript() {
    if ($('#animation-script')) {
        $('#animation-script').remove();
    }
    const script = document.createElement('script');
    script.onload = () => {
        // draw graph only after script load
        drawGraph(true);
    };
    script.src = `static/${type}-animation.js`;
    script.id = 'animation-script';

    document.body.appendChild(script); //or something of the likes
}

function getApiKey() {
    let apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) {
        $.get('/issue-key', (key) => {
            sessionStorage.setItem('apiKey', key);
        })
    }
}

let interval = 75;

function changeIntervalSpeed(value) {
    clearInterval(graphInterval);
    if (value === 0) {
        interval = 0;
        stopAnimation();
        return;
    }
    interval = parseInt(75 / value);
    drawGraph(false);
    updateAnimationSpeed(value);
}