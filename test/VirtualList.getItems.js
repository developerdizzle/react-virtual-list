var VirtualList = require('../dist/VirtualList.js');

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

describe('renderer that calculates the items to render (and to not render)', function() {
    var viewHeight = 1000;
    var itemHeight = 200;
    var itemCount = 20;
    var itemBuffer = 0;
    
    it('shows items that are in the viewHeight', function() {
        var viewTop = 0;
        var listTop = 0;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
   
        expect(result.itemsInView).toBeGreaterThan(0);
    });

    it('does not show items after the viewHeight', function() {
        var viewTop = 0;
        var listTop = 1000;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);

        expect(result.itemsInView).toBe(0);
    });

    it('does not show items before the viewHeight', function() {
        var viewTop = 4000;
        var listTop = 0;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);

        expect(result.itemsInView).toBe(0);
    });

    it('shows the first 5 items at the top of the viewHeight', function() {
        var viewTop = 0;
        var listTop = 0;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
   
        expect(result.itemsInView).toBe(5);
        expect(result.firstItemIndex).toBe(0);
        expect(result.lastItemIndex).toBe(4);
    });

    it('shows the last 5 items at the bottom of the viewHeight', function() {
        var viewTop = 3000;
        var listTop = 0;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
   
        expect(result.itemsInView).toBe(5);
        expect(result.firstItemIndex).toBe(15);
        expect(result.lastItemIndex).toBe(19);
    });

    it('shows 6 items if the viewHeight starts in the middle of an item', function() {
        var viewTop = 100;
        var listTop = 0;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
   
        expect(result.itemsInView).toBe(6);
    });

    it('shows the first 3 (2.5 items) if the list starts halfway down the page', function() {
        var viewTop = 0;
        var listTop = viewHeight / 2;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
   
        expect(result.firstItemIndex).toBe(0);
        expect(result.itemsInView).toBe(3);
    });

    it('shows the last 3 (2.5 items) if the viewHeight is scrolled 500px past the bottom of the list', function() {
        var viewTop = 3500;
        var listTop = 0;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
        
        expect(result.firstItemIndex).toBe(17);
        expect(result.itemsInView).toBe(3);
    });

    it('shows all items if the list is smaller than the viewbox', function() {
        var viewTop = 0;
        var listTop = 100;

        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, 4, itemBuffer);
   
        expect(result.firstItemIndex).toBe(0);
        expect(result.itemsInView).toBe(4);
        expect(result.lastItemIndex).toBe(3);
    });

    it('shows items that are in the viewHeight and buffer', function() {
        var viewTop = 0;
        var listTop = 0;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, 5);

        expect(result.itemsInView).toBeGreaterThan(5);
    });

    it('does not show items after the viewHeight, beyond the buffer', function() {
        var viewTop = 0;
        var listTop = 1000;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, 5);

        expect(result.itemsInView).toBe(5);
    });

    it('does not show items before the viewHeight, beyond the buffer', function() {
        var viewTop = 4000;
        var listTop = 0;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, 5);

        expect(result.itemsInView).toBe(5);
    });

    it('shows items before and after the viewHeight, in the buffer', function() {
        var viewTop = 1000;
        var listTop = 0;
        
        var listHeight = itemCount * itemHeight;
        
        var listBox = {
            top: listTop,
            height: listHeight,
            bottom: listTop + listHeight
        };
        
        var viewBox = {
            top: viewTop,
            height: viewHeight,
            bottom: viewTop + viewHeight
        };

        var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, 5);

        expect(result.itemsInView).toBe(15);
    });     
    
    it('performs well', function() {
        var count = 1000000;
        var totalDuration = 0;
        
        for (var i=0;i<count;i++) {
            var itemHeight = random(0, 500);
            var itemCount = random(500, 1000);
            var itemBuffer = random(0, 100);
            
            var viewTop = random(0, 1000);
            var viewHeight = random(0, 1000);
            var listTop = random(0, 1000);
            
            var listHeight = itemCount * itemHeight;

            var listBox = {
                top: listTop,
                height: listHeight,
                bottom: listTop + listHeight
            };
            
            var viewBox = {
                top: viewTop,
                height: viewHeight,
                bottom: viewTop + viewHeight
            };

            var start = Date.now();
            
            var result = VirtualList.getItems(viewBox, listBox, itemHeight, itemCount, itemBuffer);
            
            var end = Date.now();
            
            var duration = end - start;
            totalDuration += duration;
        }
        
        var averageDuration = totalDuration / count;
        
        expect(averageDuration).toBeLessThan(16);
    });
});