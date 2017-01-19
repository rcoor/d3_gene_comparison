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

var svg = d3.select('body')
    .selectAll('svg')
    .append('svg')
    .attr("width", width)
    .attr("height", height);


// Draw Radar Chart
function drawRadarChart(filterValue) {

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


// Make average of scores for each category
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
            bool = percentage <= bounds[i].bound && percentage >= 0;

        } else {

            bool = percentage <= bounds[i].bound && percentage > bounds[i - 1].bound;
        }
        if (bool) {
            return bounds[i].explanation;
        }
    }
}

//compare names giving object
function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function filterByCategory(array, type) {
    if (!type) return array;
    return array.filter((value) => {
            return value.category_group.name == type;
});
}

//load summary text in div id #summary
function loadSummary(userCat) {
    var text = userCat;
    document.getElementById('summary').innerHTML = userCat.result.summary.body;
    document.getElementById('summaryHeader').innerHTML = userCat.name;
    document.getElementById('summaryHeader2').innerHTML = userCat.name;
    getAccumulatedData((accData) => {
        var accCat = accData.filter(category => {
            var bool = false;
            if (category.id == userCat.id)
                bool = true;
            return bool;
        });
        let names = ['Your results', 'Average'];
        data = [userCat, accCat[0]];


        addResultText(userCat, accCat[0]);
        addResultImage(userCat);
        loadBarChart(data, "#barchart");
        histogram(userCat);
        $.fn.fullpage.moveSectionDown();
    });

};

function addResultText(userResults, averageResults) {
    var userResultText = userResults.result.result;
    var averageResultText = averageResults.result.result;

    var outputText = resultTextGenerator(userResultText, averageResultText);
    var resultHeader = d3.select("p.resultHeader span");
    resultHeader.html(outputText);
}


function resultTextGenerator(string1, string2) {
    var string = '';
    if (string1 == string2) {
        string = "You have <strong>" + string1 + "</strong>, which is also what most people have."
    } else {
        string = "You have <strong>" + string1 + "</strong>, while most people got <strong>" + string2 + "</strong>.";
    }
    return string;
}

function addResultImage(userResults) {
    d3.select("#imageContainer img").remove();
    var image = d3.select("#imageContainer")
        .append("img")
        .attr("src", userResults.product.img_path + "large.png")
        .attr('height', '100%')
        .attr('width', '100%');
}

drawRadarChart("");
loadSelection(selection);

