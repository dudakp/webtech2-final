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

window.suspension = {
    src: 'http://getdrawings.com/image/step-by-step-airplane-drawing-57.jpg',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

window.pendulum = {
    src: 'http://getdrawings.com/image/step-by-step-airplane-drawing-57.jpg',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

window.plane = {
    src: 'static/plane.png',
    flapSrc: 'static/flap.png',
    angles: [],
    flapAngles: [],
    currentAngle: 0,
    currentFlapAngle: 0
};

const initSlider = () => {
    console.log('plotly init');

    let slider = $("input#slider").bootstrapSlider({
        precision: 2,
        tooltip: 'always'
    });

    options.forEach(option => {
        $('#data-options').append($('<option>', option));
    });

    $('#show').on('click', () => {
        const type = $('#data-options').val();
        if (type !== '0') {
            getData(type, slider.bootstrapSlider('getValue'));
        }
    });
};

function getData(type, value) {
    if (graphInterval) {
        stopGraph();
    }
    // todo somehow get api key of logged user from BE
    $.get(`/api/data/${type}?r=${value}&key=5098a67d11ed2dd2477b8a509b681a7a7bbacdde5783101e09b4e7e25ba51e7bef4a6d`,
        (response) => {
            switch (type) {
                case 'ball':
                    break;
                case 'suspension':
                    break;
                case 'pendulum':
                    break;
                case 'plane':
                    window.plane.angles = response.plane_tilt;
                    window.plane.flapAngles = response.rear_flap_tilt;
                    break;
            }
            drawGraph(response, type);
            loadAnimationScript(type);
        }).fail(err => console.log('fail: ', err))
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
                break;
            case 'pendulum':

                break;
            case 'plane':
                window.plane.currentAngle = window.plane.angles[i];
                window.plane.currentFlapAngle = window.plane.flapAngles[i];
                break;
        }
        updatePlotly();
        if (i === data[Object.keys(data)[0]].length) {
            clearInterval(graphInterval);
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
    Plotly.deleteTraces('chart', [0, 1]);
    plotX = 0;
    i = 0;
    plotY1 = undefined;
    plotY2 = undefined;
}

function loadAnimationScript(type) {
    if ($('#animation-script')) {
        $('#animation-script').remove();
    }
    const script = document.createElement('script');
    script.onload = () => {
        //do stuff with the script
    };
    script.src = `static/${type}-animation.js`;
    script.id = 'animation-script';

    document.body.appendChild(script); //or something of the likes
}