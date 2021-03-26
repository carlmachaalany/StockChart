// margins 
const margin = {top: 20, right: 50, bottom: 80, left: 20};
const graphWidth = window.screen.width - 60 - margin.right - margin.left;
const graphHeight = window.screen.width*0.8 - margin.top - margin.bottom;

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
const c = d3.scaleLinear()
    .range([0, graphHeight]);

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
    .attr('stroke-width', "1px")
    .attr('stroke-dasharray', 2);
// create y dotted line and append to dotted line group
const yLine = lineGroup.append('line')
    .attr('stroke', 'grey')
    .attr('stroke-width', "1px")
    .attr('stroke-dasharray', 2);

// grab the data from the csv file
d3.csv('TBTCUSD_5.csv').then(data => {

    // change the close attribute from string to a number
    data.forEach(item => {
        item.open = Number(item.open);
        item.high = Number(item.high);
        item.low = Number(item.low);
        item.close = Number(item.close);
        item.volume = Number(item.volume);
        item.trades = Number(item.trades);
    })
                
    //render the chart
    render(data);
});

// render function to render graph
const render = (data) =>  {

    // set the domain of the scales
    x.domain([Date.now(), Date.now() + 713]).nice();
    y.domain([0, d3.max(data, d => d.close)]);
    c.domain([0, d3.max(data, d => Math.abs(d.open - d.close))])

    const candles = graph.selectAll("rect")
            .data(data);
    
    //remove unwanted candles
    candles.exit().remove()

    // update current candles
    candles.attr("y", function(d) {return y(d3.max([d.OPEN, d.CLOSE]));})
        .attr("height", function(d) { 
            return y(-Math.abs(d.OPEN - d.CLOSE));})
        .classed("rise", function(d) { return (d.CLOSE>d.OPEN); })
        .classed("fall", function(d) { return (d.OPEN>d.CLOSE); });

    // add new candles
    candles.enter().append('rect')
        .attr("x", (d, i) => x(Date.now() + i))
        .attr("y", d => y(d3.max([d.open, d.close])))
        .attr('width', 2)  
        .attr("height", d => c(Math.abs(d.open-d.close)))
        .classed("rise", function(d) { return (d.close>d.open); })
        .classed("fall", function(d) { return (d.open>d.close); });

    // update path data
    // path.data() takes in an array of arrays 
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 0.7)
        .attr('d', line)
        .on('click', MouseOverGraph) // mouseover eventListener for showing dotted line (still not implemented well)

    //initialize axis
    xAxis = d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d3.timeFormat("%M:%Spm")); // change the timeFormat 
    yAxis = d3.axisRight(y);
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate axis text (remove it?)
    xAxisGroup.selectAll('text')
        .attr('text-anchor', "end")
        .attr('transform', "rotate(-40)");
}

//function that shows dotted lines + circle 
function MouseOverGraph(e, d) {
    // remove the previous circle
    graph.selectAll('circle').remove();

    // get the coordinates of the pointer
    var coord = d3.pointer(e);

    // set the vertical dotted line
    xLine.attr("x1", coord[0])
        .attr("y1", coord[1])
        .attr('x2', coord[0])
        .attr('y2', graphHeight)
        .style('opacity', 0.7)
        // .on('mouseout', function() { d3.select(this.setAttribute('opacity', 0)); })
    
    // set the horizonal dotted line
    yLine.attr("x1", coord[0])
        .attr("y1", coord[1])
        .attr('x2', graphWidth)
        .attr('y2', coord[1])
        .style('opacity', 0.7);

    // add the circle 
    graph.append('circle')
        .attr('fill', '#ccc')
        .attr('cx', coord[0])
        .attr('cy', coord[1])
        .transition().duration(200)
            .attr('r', 1)
}

// window.addEventListener('resize', resize); (for responsiveness?)

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
