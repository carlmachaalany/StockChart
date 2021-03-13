// margins 
const margin = {top: 20, right: 50, bottom: 80, left: 20};
const graphWidth = window.screen.width - 60 - margin.right - margin.left;
const graphHeight = window.screen.height/2.5 - margin.top - margin.bottom;

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

// Axis Groups
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')
    .attr('transform',`translate(${graphWidth}, 0)`)

//  d3 line path generator
// you give it the functions to find the  x coordinate and y coordinate
// and spits out the "d" attribute of the path that connects the dots.
const line = d3.line()
    .x(function(d, i){ return x(Date.now() +  i)})
    .y(function(d){ return y(d.close)});

// line path element
const path = graph.append('path');

// create dotted line group and append to graph.
// This is a dotted line that's gonna show whenever you hover on the graph
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

// grab the data from the csv file
d3.csv('TBTCUSD_5.csv').then(data => {

    // change the close attribute from string to a number
    data.forEach(item => {
        item.close = Number(item.close);
    })

    // testing the waters
    console.log(data);
    //initialize scales
    // xExtent = d3.extent(data, function (d, i) {
    // return new Date(d.date);
    // });
    // yExtent = d3.extent(data, function (d, i) {
    // return d.value;
    // });


    //the path generator for the line chart
    // line = d3.svg
    // .line()
    // .x(function (d) {
    //     return x(new Date(d.date));
    // })
    // .y(function (d) {
    //     return y(d.value);
    // });

    //initialize svg
    // svg = d3.select('#chart').append('svg');
    // chartWrapper = svg.append('g');
    // path = chartWrapper.append('path').datum(data).classed('line', true);
    // chartWrapper.append('g').classed('x axis', true);
    // chartWrapper.append('g').classed('y axis', true);

    //render the chart
    render(data);
});

// render function to render graph
const render = (data) =>  {

    // set the domain of the scales
    x.domain([Date.now(), Date.now() + 713]).nice();
    y.domain([0, d3.max(data, d => d.close)]);

    // update path data
    // path.data() takes in an array of arrays 
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 2)
        .attr('d', line)
        .on('mouseover', d => MouseOverGraph(d)) // mouseover eventListener for showing dotted line (still not implemented well)
        .on('mouseout', d => MouseOutGraph(d)); // mouseout eventListener for hiding dotted line (still not implemented)

    //initialize axis
    xAxis = d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d3.timeFormat("%Ss")); // change the timeFormat 
    yAxis = d3.axisRight(y);
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate axis text (remove it?)
    xAxisGroup.selectAll('text')
        .attr('text-anchor', "end")
        .attr('transform', "rotate(-40)");


    // create circles for objects
    // const circles = graph.selectAll('circle')
    //     .data(data);
    
    // // remove unwanted points
    // circles.exit().remove();

    // // update current points
    // circles.attr('cx', 1)
    //     .attr('cy', d => y(d.close));

    // // add new points
    // console.log(circles.enter());
    // circles.enter().append('circle')
    //     .attr('r', 1)
    //     .attr('cx', (d, i) => x(Date.now() + i))
    //     .attr('cy', d => y(d.close))
    //     .attr('fill', "#ccc");

    // graph.selectAll('circle')
    //     .on('mouseover', circleMouseOver)
    //     .on('mouseout', circleMouseOut);
}

//function that shows dotted lines 
function MouseOverGraph(d) {
    console.log(d);
    xLine.attr("x1", d.x-40)
        .attr("y1", d.y-40)
        .attr('x2', d.x-40)
        .attr('y2', graphHeight)
        .style('opacity', 0.2)
    // set y dotted line coords (x1, x2, y1, y2)
    yLine.attr("x1", d.x)
        .attr("y1", d.y)
        .attr('x2', graphWidth)
        .attr('y2', d.y)
        .style('opacity', 0.2)
}

// function that hides dotted lines
function MouseOutGraph (d) {
    console.log(d);
}

// IGNORE from here and on, this is for later
function circleMouseOver(e, d) {
    // console.log(e);
    d3.select(this)
        .transition().duration(100)
        .attr('r', 8);
    // set x dotted line coords (x1, x2, y1, y2)
    xLine.attr("x1", d3.select(this).attr('cx'))
        .attr("y1", d3.select(this).attr('cy'))
        .attr('x2', d3.select(this).attr('cx'))
        .attr('y2', graphHeight)
        .style('opacity', 0.2)
    // set y dotted line coords (x1, x2, y1, y2)
    yLine.attr("x1", d3.select(this).attr('cx'))
        .attr("y1", d3.select(this).attr('cy'))
        .attr('x2', graphWidth)
        .attr('y2', d3.select(this).attr('cy'))
        .style('opacity', 0.2)
    // show the dotted line group (.style, opacity)
}

function circleMouseOut(e, d) {
    d3.select(this)
        .transition().duration(100)
        .attr('r', 4);
    // hide the dotted line group(.style, opacity)
    xLine.style('opacity', 0)
    yLine.style('opacity', 0)
}
// function render() {
//     //get dimensions based on window size
//     updateDimensions(window.innerWidth);

//     //update x and y scales to new dimensions
//     x.range([0, width]);
//     y.range([height, 0]);

//     //update svg elements to new dimensions
//     svg
//     .attr('width', width + margin.right + margin.left)
//     .attr('height', height + margin.top + margin.bottom);
//     chartWrapper.attr(
//     'transform',
//     'translate(' + margin.left + ',' + margin.top + ')'
//     );

//     //update the axis and line
//     xAxis.scale(x);
//     yAxis.scale(y);

//     svg
//     .select('.x.axis')
//     .attr('transform', 'translate(0,' + height + ')')
//     .call(xAxis);

//     svg.select('.y.axis').call(yAxis);

//     path.attr('d', line);
// }

// function updateDimensions(winWidth) {
//     margin.top = 20;
//     margin.right = 50;
//     margin.left = 50;
//     margin.bottom = 50;

//     width = winWidth - margin.left - margin.right;
//     height = 500 - margin.top - margin.bottom;
// }; //load data, then initialize chart
