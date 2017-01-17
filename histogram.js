function loadHistogram(dataset) {

    var margin = {
            top: (parseInt(d3.select('body').style('width'), 10) / 10),
            right: (parseInt(d3.select('body').style('width'), 10) / 20),
            bottom: (parseInt(d3.select('body').style('width'), 10) / 5),
            left: (parseInt(d3.select('body').style('width'), 10) / 20)
        },
        width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
        height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;

    var x0 = d3.scaleBand()
        .rangeRound([0,width], .1);

    var x1 = d3.scaleBand();

    var y = d3.scaleLinear()
        .range([height, 0]);

    var colorRange = d3.schemeCategory20;
    var color = d3.scaleOrdinal()
        .range(colorRange);

    var xAxis = d3.axisBottom();

    var yAxis = d3.axisLeft();

    var divTooltip = d3.select("#section5").append("div").attr("class", "toolTip");


    var svg = d3.select("#histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var options = d3.keys(dataset[0]).filter(function (key) {
        return key !== "label";
    });

    dataset.forEach(function (d) {
        d.valores = options.map(function (name) {
            return {name: name, value: +d[name]};
        });
    });

    // Scale the range of the data in the domains
    x0.domain(dataset.map(function(d) { return d.label; }));
    //x1.domain(options).scale.bandwidth();
    x1.domain(options).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(dataset, function(d) {
        return d3.max(d.valores, (d) => {
          return d.value;
        })
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Satisfaction %");

    var bar = svg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "rect")
        .attr("transform", function (d) {
            return "translate(" + x0(d.label) + ",0)";
        });

    bar.selectAll("rect")
        .data(function (d) {
            return d.valores;
        })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function (d) {
            return x1(d.name);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("value", function (d) {
            return d.name;
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    bar
        .on("mousemove", function (d) {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l - 1
            elementData = elements[l].__data__
            divTooltip.html((d.label) + "<br>" + elementData.name + "<br>" + elementData.value + "%");
        });
    bar
        .on("mouseout", function (d) {
            divTooltip.style("display", "none");
        });


    var legend = svg.selectAll(".legend")
        .data(options.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

}