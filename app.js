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
        document.getElementById('userResult').innerHTML = userCat.result.result;
        document.getElementById('averageResult').innerHTML = accCat[0].result.result;
        loadBarChart(data, "#barchart");
    });

};

drawChart("");
loadSelection(selection);
