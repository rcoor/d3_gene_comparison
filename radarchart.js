function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

var RadarChart = {
    draw: function (id, d, names, options) {
        var cfg = {
            radius: 2,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            legendPos: {
                x: 400,
                y: -20
            },
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleLinear().range(["#d73534", "#d1d1d1"])
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }

        cfg.maxValue = 100;

        var allAxis = (d[0].map(function (i, j) {
            return i
        }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        var tooltip;

        //Circular segments
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y1", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("x2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                })
                .attr("y2", function (d, i) {
                    return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function (d) {
                    return levelFactor * (1 - cfg.factor * Math.sin(0));
                })
                .attr("y", function (d) {
                    return levelFactor * (1 - cfg.factor * Math.cos(0));
                })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text((j + 1) * 100 / cfg.levels);
        }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y2", function (d, i) {
                return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis = axis.append("g")
            .attr("class", "category")
            .append("text")
            .html(function (d) {
                return wrap(d);
            })

        axis.style("font-family", "sans-serif")
            .text(function (d) {
                return d.name
            })
            .on("click", function (d) {
                loadSummary(d);
            })
            .transition()
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) {
                return "translate(0, -10)"
            })
            .attr("x", function (d, i) {
                return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
            })
            .attr("y", function (d, i) {
                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
            });

        /* Legend */
        var legend = g
            .selectAll(".legendItems")
            .data(names)
            .enter().append("g")
            .attr("class", "legend")
            .attr("data-legend", function (d) {
                //console.log(d)
            });

        legend.append("rect")
            .style("fill", function (d, i) {
                return cfg.color(i)
            })
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", cfg.legendPos.x)
            .attr("y", function (d, i) {
                return cfg.legendPos.y + i * 18
            });

        legend.append("text")
            .text(function (d, i) {
                return d
            })
            .style("font-size", "12px")
            .style("font-family", "sans-serif")
            .attr("x", cfg.legendPos.x + 16)
            .attr("y", function (d, i) {
                return cfg.legendPos.y + 10 + i * 18
            });


        // Create some guiding text and a line
        g.append("line") // attach a line
            .style("stroke", "black") // colour the line
            .attr("x1", cfg.w + 95) // x position of the first end of the line
            .attr("y1", 170) // y position of the first end of the line
            .attr("x2", cfg.w + 120) // x position of the second end of the line
            .attr("y2", 170); // y position of the second end of the line

        g.append("text")
            .text("click a category")
            .attr("x", cfg.w + 125)
            .attr("y", 173)
            .style("font-size", "12px");

        g.append("text")
            .text("to investigate")
            .attr("x", cfg.w + 125)
            .attr("y", 189)
            .style("font-size", "12px");


        d.forEach(function (y, x) {
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.percentage, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.percentage, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });

            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "1.5px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) {
                    return cfg.color(series)
                })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d) {
                    z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function () {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });
            series++;
        });
        series = 0;


        //var divSelect = d3.select("body").append('div').attr("class", "#userSelection");

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        d.forEach(function (y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function (j) {
                    return Math.max(j.percentage, 0)
                })
                .attr("cx", function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.percentage, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.percentage, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.percentage, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function (j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.percentage, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function (j) {
                    return j.area
                })
                .style("fill", cfg.color(series))
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series)).style("fill-opacity", .9)
                .on('click', function (d) {
                    loadSummary(d);
                    $.fn.fullpage.moveSectionDown();
                })
                .on('mouseover', function (d) {
                    tooltip
                        .style("display", "inline-block")
                        .html((d.name) + "<br><span> Score: " + (parseInt((d.percentage))) + "%" + "<br>Result: " + d.result.result + "</span>");

                    var tooltipWidth = tooltip.node().getBoundingClientRect().width;
                    tooltip
                        .style("left", d3.event.pageX - tooltipWidth / 2 + 0.5 + "px")
                        .style("top", d3.event.pageY - 88 + "px")
                })
                .on("mouseout", function (d) {
                    tooltip.style("display", "none");
                });

            series++;
        });
    }
};

// Dimensions of radar chart
var width = 300,
    height = 300;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 300
}

// fetch data
function getAccumulatedData(callback) {
    // Call function to draw the Radar chart
    d3.json("data.json", function (error, data) {
        if (error) throw error;


        data = data.map(category => {
            category = category.response;
            category = countScores(category);
            result = getResultsFromBounds(category.percentage, category.bounds);
            return {
                "username": "Average",
                "name": category.category.name,
                "id": category.category.id,
                "score": category.score,
                "max_score": category.max_score,
                "percentage": category.percentage,
                "result": {
                    "result": result
                },
                "category_group": {
                    "name": category.category.category_group.name
                }
            };
        });
        callback(data);
    });
}


// fetch data on users
function getUserData(callback) {
    d3.json("neymar.json", function (error, data) {
        if (error) throw error;

        data = data.map((category) => {

            category['percentage'] = (category.user_score / category.max_score * 100);
            category['username'] = 'Your result';
            return category;
        });

        callback(data);
    });
}


/** Make average of scores for each category */
function countScores(category) {
    var storeScores = 0;
    var peopleCount = 0;
    category.accumulated_scores.map(scores => {
        storeScores += scores.score * scores.count;
        peopleCount += scores.count;
    });
    var percentage = (storeScores / peopleCount) / category.max_score * 100;
    category['percentage'] = percentage;
    return category;
}


// get result from bounds
function getResultsFromBounds(percentage, bounds) {

    var bool = false;
    for (var i = 0; i < bounds.length; i++) {
        if (i == 0) {
            bool = percentage < bounds[i].bound && percentage >= 0;

        } else {

            bool = percentage < bounds[i].bound && percentage > bounds[i - 1].bound;
        }
        if (bool) {
            return bounds[i].explanation;
        }
    }
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function wrap(text) {
    /*    var concattedString = '';
        text.split(" ").forEach(x => {
            concattedString += '<tspan dy="1.4em">' + x + '</tspan>';
        });
        return concattedString;*/
    return text
}

function filterByCategory(array, type) {
    if (!type) return array;
    return array.filter((value) => {
        return value.category_group.name == type;
    });
}


var svg = d3.select('body')
    .selectAll('svg')
    .append('svg')
    .attr("width", width)
    .attr("height", height);


// Draw chart
function drawChart(filterValue) {

    getAccumulatedData((accData) => {
        getUserData((userData) => {

            var categories = []
            userData.forEach(category => {
                categories.push(category.name);
            });

            accData = accData.filter(category => {
                var bool = false;
                categories.forEach(name => {
                    if (category.name == name)
                        bool = true;
                });
                return bool;
            });

            accData = filterByCategory(accData, filterValue);
            userData = filterByCategory(userData, filterValue);
            accData = accData.sort(compare);
            userData = userData.sort(compare);

            userData = [userData];
            userData.push(accData);
            data = userData;

            // quickfix to names
            let names = ['Your results', 'Average'];

            RadarChart.draw("#chart", data, names, config);
        });
    });
}
