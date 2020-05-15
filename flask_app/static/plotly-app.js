const options = [
    {value: 'ball', text: 'Ball Beam'},
    {value: 'suspension', text: 'Suspension'},
    {value: 'pendulum', text: 'Inverted Pendulum'},
    {value: 'plane', text: 'Aircraft Pitch'},
];

window.ball = {
    src: 'http://getdrawings.com/image/step-by-step-airplane-drawing-57.jpg',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

window.pendulum = {
    src: 'static/assets/pendulum/obdlznik.png',
    pos: [],
    tilt: [],
    currentPos: 0,
    currentTilt: 0
};

window.plane = {
    src: 'static/assets/plane/plane.png',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

// r is current value of r parameter, needed for suspension animation (you might need it as well)
let r;
let previousType;

$(document).ready(function () {
    let slider = $("input#slider").bootstrapSlider({
        precision: 2,
        tooltip: 'always'
    });
    options.forEach(option => {
        $('#data-options').append($('<option>', option));
    });
    getApiKey();
    $('#show').on('click', () => {
        const type = $('#data-options').val();
        if (type !== '0') {
            r = slider.bootstrapSlider('getValue');
            if (type === previousType) {
                getData(type, r, plotY1, plotY2);
            } else {
                previousType = type;
                getData(type, r, 0, 0);
            }
        }
    })
});

function getData(type, value, init1, init2) {
    if (graphInterval) stopGraph();
    $.get(`/api/data/${type}?r=${value}&init1=${init1}&init2=${init2}&key=${sessionStorage.getItem('apiKey')}`,
        response => {
            switch (type) {
                case 'ball':
                    break;
                case 'suspension':
                    break;
                case 'pendulum':
                    window.pendulum.pos = response.pos;
                    window.pendulum.tilt = response.tilt;
                    break;
                case 'plane':
                    window.plane.angles = response.plane_tilt;
                    window.plane.currentFlapAngle = response.rear_flap_tilt;
                    break;
            }
            // clear canvas
            $('#canvas').html('');
            loadAnimationScript(response, type);
        }).fail(err => console.log('fail: ', err));
}

let graphInterval;
let plotX = 0;
let plotY1;
let plotY2;
let i = 0;

function drawGraph(data, type) {
    graphInterval = setInterval(() => {
        // plotly data
        plotX = i;
        plotY1 = data[Object.keys(data)[0]][i];
        plotY2 = data[Object.keys(data)[1]][i++];
        // animacne data
        switch (type) {
            case 'ball':
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
    }, 100);

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

function stopGraph() {
    clearInterval(graphInterval);
    // Plotly.deleteTraces('chart', [0, 1]);
    plotX = 0;
    i = 0;
    // plotY1 = undefined;
    // plotY2 = undefined;
}

/**
 * Loads script with current animation
 *
 *  I don't really care if its 5 lines of code or not,
 *  separate each animation to its own file to prevent merge conflicts
 *  and to give the app some structure, even when it's for Webte
 */
function loadAnimationScript(response, type) {
    if ($('#animation-script')) {
        $('#animation-script').remove();
    }
    const script = document.createElement('script');
    script.onload = () => {
        // draw graph only after script load
        drawGraph(response, type);
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
