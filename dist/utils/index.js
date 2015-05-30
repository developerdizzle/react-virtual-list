function areArraysEqual(a, b) {
    if (!a || !b) return false;

    if (a.length != b.length) return false;
    
    for (var i = 0, length = a.length; i < length; i++) {
        if (a[i] != b[i]) return false;   
    }
    
    return true;
}

function topDifference(element, container) {
    return topFromWindow(element) - topFromWindow(container);
}

function topFromWindow(element) {
    if (!element || element === window) return 0;
    
    return element.offsetTop + topFromWindow(element.offsetParent);
}

module.exports = {
    areArraysEqual: areArraysEqual,
    topDifference: topDifference,
    topFromWindow: topFromWindow
};