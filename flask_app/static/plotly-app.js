const options = [
    {value: 'ball', text: 'Ball Beam'},
    {value: 'suspension', text: 'Suspension'},
    {value: 'pendulum', text: 'Inverted Pendulum'},
    {value: 'plane', text: 'Aircraft Pitch'},
];

$(document).ready(function () {
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
    })
});

function getData(type, value) {
    if (graphInterval) {
        stopGraph();
    }
    // todo do we want to use localhost when on localhost?
    $.get(`http://147.175.121.210:9687/api/data/${type}?r=${value}&key=5098a67d11ed2dd2477b8a509b681a7a7bbacdde5783101e09b4e7e25ba51e7bef4a6d`,
        (response) => {
            drawGraph(response);
        }).fail(err => console.log('fail: ', err))
}

let graphInterval;
let plotX = 0;
let plotY1;
let plotY2;
let i = 0;

function drawGraph(data) {
    graphInterval = setInterval(() => {
        plotX = i;
        plotY1 = data[Object.keys(data)[0]][i];
        plotY2 = data[Object.keys(data)[1]][i++];
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