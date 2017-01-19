
function loadBarChart(userCat, divId) {
    d3.select(divId + " svg").remove();

    // set the dimensions and margins of the graph
    var margin = {
            top: 45,
            right: 110,
            bottom: 30,
            left: 70
        },
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var divTooltip = d3.select("#section4").append("div").attr("class", "toolTip");

    var svg = d3.select(divId).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.username; }));
    y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

    color = d3.scaleLinear().range(["#d73534", "#d1d1d1"]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.username); })
        .attr("width", x.bandwidth)
        .attr("y", function (d) {
            return y(d.percentage);
        })
        .attr("height", function (d) {
            return height - y(d.percentage);
        })
        .on("mousemove", function (d) {
            console.log(d)
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l - 1
            elementData = elements[l].__data__
            divTooltip.html("Score: " + (d.percentage) + "<br>" + elementData.name + "<br>" + d.result.result);
        })
        .on("mouseout", function (d) {
            divTooltip.style("display", "none");
        })
        .style("fill", (d,i) => { return color(i) });

    // add the x Axis
    svg.append("g")
        .attr("class", "x axis")
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
        .attr("y", -40)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d,i) => { return color(i)});

    legend.append("text")
        .attr("x", width + 84)
        .attr("y", -32)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.result.result; });


};
