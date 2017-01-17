
function loadBarChart(userCat, divId) {
    //console.log(userCat);
    d3.select(divId + " svg").remove();

    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 110,
            bottom: 30,
            left: 40
        },
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

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
    x.domain(data.map(function(d) { return d.result.result; }));
    y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

    color = d3.scaleLinear().range(["#d73534", "#d1d1d1"]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { console.log(d);return x(d.result.result); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.percentage);
        })
        .attr("height", function (d) {
            return height - y(d.percentage);
        })
        .style("fill", (d,i) => { return color(i) });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    //svg.append("g")
    //    .call(d3.axisLeft(y));

    // adding legends
    var legend = svg.selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width + 90)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d,i) => { return color(i)});

    legend.append("text")
        .attr("x", width + 84)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.username; });


};
