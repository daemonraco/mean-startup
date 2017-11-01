'use strict';

const simpleMerge = (left, right) => {
    for (var p in right) {
        try {
            if (right[p].constructor == Object) {
                left[p] = simpleMerge(left[p], right[p]);
            } else {
                left[p] = right[p];
            }
        } catch (e) {
            left[p] = right[p];
        }
    }

    return left;
}

module.exports = function () {
    if (arguments.length < 1) {
        throw "No parameters given";
    }

    let results = null;
    for (let i = 0; i < arguments.length; i++) {
        if (results === null) {
            results = arguments[i];
        } else {
            results = simpleMerge(results, arguments[i]);
        }
    }

    return results;
}