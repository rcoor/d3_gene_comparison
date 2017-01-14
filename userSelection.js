function getSelectedValue(selector) {
    return d3.select(selector).property('value')
}
// create selection
var selection = d3.select("#userSelection").append("select").on("change", function() {
    selectedValue = getSelectedValue(this);
    drawChart(selectedValue);
});

function loadSelection(select) {
    var categories = [];
    getUserData((userData) => {
        userData.forEach(category => {
            var found = jQuery.inArray(category.category_group.name, categories);
            if (found < 0) {
                // Element was not found, add it.
                categories.push(category.category_group.name);
            }
        });
    });
    console.log(categories);
    data = ["nutrition","fitness","lifestyle"]//categories;
    console.log(data);
    select.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function (d) {
            console.log(d); return d;
        })
        .html(function (d) { return d });

}