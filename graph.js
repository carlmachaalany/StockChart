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

// axes groups
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

d3.csv("TBTCUSD_5.csv").then(data => {
    console.log(data);
    // set the values to integers

    // range of scales
    x.domain(data.map(d => d.col1));
    y.domain([0, d3.max(data, d => d.col2)]);
    data.forEach(d => {
        d.col1 = Number(d.col1);
        d.col2 = Number(d.col2);
    });

    
    // d3.interval(() => {
    //     flag = !flag;
    //     const newData = flag? data : data.slice(1)
    //     update(newData);
    // }, 1000);

    // update(data);
})

//Scale for the X axis
const xAxis = d3.axisBottom(x)
    .ticks(3)
    .tickFormat(d3.timeFormat('%b %d'));
const yAxis = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d + "m");
xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);
// xAxis legend