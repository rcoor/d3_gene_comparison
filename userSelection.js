var selection = d3.select('div#userSelection').append('select');

function loadSelection(data, selection) {
    selection.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .html(function (d) { return d });
}
