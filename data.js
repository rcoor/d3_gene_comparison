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

//fetch data for histogram
function getAccumulatedForHist(callback) {
    d3.json("data.json", function (error, data) {
        if (error) throw error;

        dataset = []

        data = data.map(category => {

                category = category.response;
        var boundCount = {"label":category.category.name};
        bounds = category.bounds;
        category.accumulated_scores.forEach((scores) => {
            if (scores.score == 0) {
            score = 0;
        }else {
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
            bool = percentage <= bounds[i].bound && percentage >= 0;

        } else {

            bool = percentage <= bounds[i].bound && percentage > bounds[i - 1].bound;
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


function filterByCategory(array, type) {
    if (!type) return array;
    return array.filter((value) => {
            return value.category_group.name == type;
});
}

