function loadSummary(userCat) {
    var text = userCat;
    document.getElementById('summary').innerHTML = userCat.result.summary.body;
    getAccumulatedData((accData) => {
        var accCat = accData.filter(category => {
            var bool = false;
            if (category.id == userCat.id)
                bool = true;
            return bool;
        });
        let names = ['Your results', 'Average'];
        data = [userCat,accCat[0]];
        loadBarChart(data,"#barchart");
    });

};

drawChart("");
loadSelection(selection);

