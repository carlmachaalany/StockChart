// margins 
const margin = {top: 20, right: 100, bottom: 50, left: 20};
const graphWidth = 560 - margin.right - margin.left;
const graphHeight = 450 - margin.top - margin.bottom;

// main svg 
const svg = d3.select('.canvas').append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

// graph wrapper
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales
const x = d3.scaleTime()
    .range([0, graphWidth]);
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')

//  d3 line path generator
// you give it the functions to find the  x coordinate and y coordinate
// and spits out the "d" attribute of the path that connects the dots.
const line = d3.line()
    .x(function(d){ return x(new Date(d.date))})
    .y(function(d){ return y(d.distance)});

// line path element
const path = graph.append('path');

// create dotted line group and append to graph
const lineGroup = graph.append('g');
// create x dotted line and append to dotted line group
const xLine = lineGroup.append('line')
    .attr('stroke', 'grey')
    .attr('stroke-width', "2px")
    .attr('stroke-dasharray', 4);
// create y dotted line and append to dotted line group
const yLine = lineGroup.append('line')
    .attr('stroke', 'grey')
    .attr('stroke-width', "2px")
    .attr('stroke-dasharray', 4);

d3.csv('TBTCUSD_5.csv').then(data => {

    //initialize scales
    // xExtent = d3.extent(data, function (d, i) {
    // return new Date(d.date);
    // });
    // yExtent = d3.extent(data, function (d, i) {
    // return d.value;
    // });

    // set the domain of the scales
    x.domain(d3.extent(data,  d => new Date(d.date)));
    y.domain([0, d3.max(data, d => d.distance)]);

    //initialize axis
    xAxis = d3.axisBottom(x);
    yAxis = d3.axisRight(y);

    //the path generator for the line chart
    line = d3.svg
    .line()
    .x(function (d) {
        return x(new Date(d.date));
    })
    .y(function (d) {
        return y(d.value);
    });

    //initialize svg
    svg = d3.select('#chart').append('svg');
    chartWrapper = svg.append('g');
    path = chartWrapper.append('path').datum(data).classed('line', true);
    chartWrapper.append('g').classed('x axis', true);
    chartWrapper.append('g').classed('y axis', true);

    //render the chart
    render();
});

function render() {
    //get dimensions based on window size
    updateDimensions(window.innerWidth);

    //update x and y scales to new dimensions
    x.range([0, width]);
    y.range([height, 0]);

    //update svg elements to new dimensions
    svg
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom);
    chartWrapper.attr(
    'transform',
    'translate(' + margin.left + ',' + margin.top + ')'
    );

    //update the axis and line
    xAxis.scale(x);
    yAxis.scale(y);

    svg
    .select('.x.axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    svg.select('.y.axis').call(yAxis);

    path.attr('d', line);
}

function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = 50;
    margin.left = 50;
    margin.bottom = 50;

    width = winWidth - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
}; //load data, then initialize chart
