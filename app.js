function loadSummary(userCat) {
    var text = userCat;
    document.getElementById('summary').innerHTML = userCat.result.summary.body;
    document.getElementById('summaryHeader').innerHTML = userCat.name;
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
        $.fn.fullpage.moveSectionDown();
    });

};

function addResultText(userResults, averageResults) {
    /*    document.getElementById('userResult').innerHTML = userCat.result.result;
        document.getElementById('averageResult').innerHTML = accCat[0].result.result;*/
    var userResultText = userResults.result.result;
    var averageResultText = averageResults.result.result;

    var outputText = resultTextGenerator(userResultText, averageResultText);
    var resultHeader = d3.select("p.resultHeader span");
    resultHeader.html(outputText);
    //console.log(userResults.product.img_path + "large.png")
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

drawChart("");
loadSelection(selection);
