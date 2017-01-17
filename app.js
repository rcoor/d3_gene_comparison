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

function getAccumulated(callback) {
    d3.json("data.json", function (error, data) {
        if (error) throw error;

        dataset = []

        data = data.map(category => {

            category = category.response;
            var boundCount = {"label":category.category.name};
            console.log(category.bounds)
            bounds = category.bounds;
            category.accumulated_scores.forEach((scores) => {
                if (scores.score == 0) {
                    score = 0;
                } else {
                    score = (scores.score / category.max_score)*100;
                }

                bound = getResultsFromBounds(score,bounds);

                if (boundCount[bound] == undefined) {
                    boundCount[bound] = scores.count;
                } else {
                    boundCount[bound] = boundCount[bound] + scores.count;
                }
            });
            dataset.push(boundCount)
            return
        })
        callback(dataset);
    });
}

function histogram(userCat) {
    getAccumulated((data) => {

        data = data.filter((d) =>
        {
            var bool = false;
            if (d.label == userCat.name) {
                bool = true;
            }
            return bool
        });
        loadHistogram(data);
    });
};

drawChart("");
loadSelection(selection);

