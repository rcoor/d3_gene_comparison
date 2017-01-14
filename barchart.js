/**
 * Created by gruner on 1/14/17.
 */
function loadBarChart(userCat,divId) {
    console.log(userCat);
    d3.select(divId + " svg").remove();


    // // let make it responsive and sexy
    // var margin = {top: 30, right: 10, bottom: 30, left: 10}
    //     , width = parseInt(d3.select('#chart').style('width'), 10)
    //     , width = width - margin.left - margin.right
    //     , barHeight = 20
    //     , percent = d3.format('%');
    //
    // // scales and axes
    // var x = d3.scaleLinear()
    //     .range([0, width])
    //     .domain([0, .4]); // hard-coding this because I know the data
    //
    // // ordinal scales are easier for uniform bar heights
    // // I'll set domain and rangeBands after data loads
    // var y = d3.scaleOrdinal();
    //
    // var xAxis = d3.axisBottom()
    //     .scale(x)
    //     .tickFormat(percent);

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select(divId).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.percentage; }));
    y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.percentage); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.percentage); })
        .attr("height", function(d) { return height - y(d.percentage); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // d3.select(window).on('resize', resize);
    //
    // function resize() {
    //     // update width
    //     width = parseInt(d3.select('#chart').style('width'), 10);
    //     width = width - margin.left - margin.right;
    //
    //     // resize the chart
    //     x.range([0, width]);
    //     d3.select(chart.node().parentNode)
    //         .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
    //         .style('width', (width + margin.left + margin.right) + 'px');
    //
    //     chart.selectAll('rect.background')
    //         .attr('width', width);
    //
    //     chart.selectAll('rect.percent')
    //         .attr('width', function(d) { return x(d.percent); });
    //
    //     // update median ticks
    //     var median = d3.median(chart.selectAll('.bar').data(),
    //         function(d) { return d.percent; });
    //
    //     chart.selectAll('line.median')
    //         .attr('x1', x(median))
    //         .attr('x2', x(median));
    //
    //
    //     // update axes
    //     chart.select('.x.axis.top').call(xAxis.orient('top'));
    //     chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));

    //}



};