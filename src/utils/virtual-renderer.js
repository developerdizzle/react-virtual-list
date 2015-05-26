function VirtualRenderer(viewTop, viewHeight, listTop, itemHeight, itemCount) {
    this.viewTop = viewTop;
    this.viewHeight = viewHeight;
    this.listTop = listTop;
    this.itemHeight = itemHeight;
    this.itemCount = itemCount;
}

VirtualRenderer.getBox = function(view, list) {
    list.height = list.height || list.bottom - list.top;
    
    return {
        top: Math.max(0, Math.min(view.top - list.top)),
        bottom: Math.max(0, Math.min(list.height, view.bottom - list.top))
    };
};

VirtualRenderer.prototype.getItems = function() {
    if (this.itemCount === 0 || this.itemHeight === 0) return {
        itemsInView: 0
    };
    
    var listHeight = this.itemHeight * this.itemCount;
    
    var listBox = {
        top: this.listTop,
        height: listHeight,
        bottom: this.listTop + listHeight
    };
    
    var viewBox = {
        top: this.viewTop,
        bottom: this.viewTop + this.viewHeight
    };
    
    // list is below viewport
    if (viewBox.bottom < listBox.top) return {
        itemsInView: 0
    };
    
    // list is above viewport
    if (viewBox.top > listBox.bottom) return {
        itemsInView: 0
    };
    
    var listViewBox = VirtualRenderer.getBox(viewBox, listBox);
    
    var firstItemIndex = Math.max(0,  Math.floor(listViewBox.top / this.itemHeight));
    var lastItemIndex = Math.ceil(listViewBox.bottom / this.itemHeight) - 1;
    
    var itemsInView = lastItemIndex - firstItemIndex + 1;
    var itemsAfterView = this.itemCount - lastItemIndex - 1;

    var result = {
        firstItemIndex: firstItemIndex,
        lastItemIndex: lastItemIndex,
        itemsInView: itemsInView,
        itemsAfterView: itemsAfterView
    };
    
    return result;
};

module.exports = VirtualRenderer;