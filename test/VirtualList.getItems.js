var VirtualList = require('../dist/VirtualList.js');

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

describe('renderer that calculates the items to render (and to not render)', function() {
    var viewport = 1000;
    var itemHeight = 200;
    var itemCount = 20;

    it('shows items that are in the viewport', function() {
        var windowScrollY = 0;
        var offsetTop = 0;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.itemsInView).toBeGreaterThan(0);
    });

    it('does not show items after the viewport', function() {
        var windowScrollY = 0;
        var offsetTop = 1000;
        
        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
        
        expect(result.itemsInView).toBe(0);
    });

    it('does not show items before the viewport', function() {
        var windowScrollY = 4000;
        var offsetTop = 0;
        
        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
        
        expect(result.itemsInView).toBe(0);
    });

    it('shows the first 5 items at the top of the viewport', function() {
        var windowScrollY = 0;
        var offsetTop = 0;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.itemsInView).toBe(5);
        expect(result.firstItemIndex).toBe(0);
        expect(result.lastItemIndex).toBe(4);
    });

    it('shows the last 5 items at the bottom of the viewport', function() {
        var windowScrollY = 3000;
        var offsetTop = 0;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.itemsInView).toBe(5);
        expect(result.firstItemIndex).toBe(15);
        expect(result.lastItemIndex).toBe(19);
    });

    it('shows 6 items if the viewport starts in the middle of an item', function() {
        var windowScrollY = 100;
        var offsetTop = 0;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.itemsInView).toBe(6);
    });

    it('shows the first 3 (2.5 items) if the list starts halfway down the page', function() {
        var windowScrollY = 0;
        var offsetTop = viewport / 2;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.firstItemIndex).toBe(0);
        expect(result.itemsInView).toBe(3);
    });

    it('shows the last 3 (2.5 items) if the viewport is scrolled 500px past the bottom of the list', function() {
        var windowScrollY = 3500;
        var offsetTop = 0;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, itemCount);
   
        expect(result.firstItemIndex).toBe(17);
        expect(result.itemsInView).toBe(3);
    });

    it('shows all items if the list is smaller than the viewbox', function() {
        var windowScrollY = 0;
        var offsetTop = 100;

        var result = new VirtualList.getItems(windowScrollY, viewport, offsetTop, itemHeight, 4);
   
        expect(result.firstItemIndex).toBe(0);
        expect(result.itemsInView).toBe(4);
        expect(result.lastItemIndex).toBe(3);
    });
     
    
    it('performs well', function() {
        var count = 1000000;
        var start = Date.now();
        
        for (var i=0;i<count;i++) {
            var result = new VirtualList.getItems(random(0, 1000), random(0, 1000), random(0, 1000), random(0, 500), random(500, 1000));
        }
        
        var end = Date.now();
        var duration = end - start;
        
        // console.log('new VirtualRenderer().getItems ran %d iterations in %d ms', count, end - start);
        
        expect(duration).toBeLessThan(1000);
    });
});