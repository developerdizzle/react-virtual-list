var window = {};

var VirtualList = require('../dist/VirtualList.js');

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

describe('box that defines the visible part of the list', function() {
    it('matches the viewport when starting at 0 and filling the viewport', function() {
        var view = {
            top: 0,
            bottom: 1000
        };
        
        var list = {
            top: view.top,
            bottom: view.bottom
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(0);
        expect(box.bottom).toBe(1000);
    });

    it('matches the viewport when starting at 0 and overfilling the viewport', function() {
        var view = {
            top: 0,
            bottom: 1000
        };
        
        var list = {
            top: 0,
            bottom: 2000
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(0);
        expect(box.bottom).toBe(1000);
    });

    it('matches the top half of the viewport when starting at 0 and only filling the first half', function() {
        var view = {
            top: 0,
            bottom: 1000
        };
        
        var list = {
            top: 0,
            bottom: 500
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(0);
        expect(box.bottom).toBe(500);
    });
    
    it('matches the bottom half of the viewport when starting halfway down', function() {
        var view = {
            top: 0,
            bottom: 1000
        };
        
        var list = {
            top: 500,
            bottom: 1500
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(0);
        expect(box.bottom).toBe(500);
    });

    it('matches the bottom half of the list when scrolled 500px past the bottom of the list', function() {
        var view = {
            top: 500,
            bottom: 1500
        };
        
        var list = {
            top: 0,
            bottom: 1000
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(500);
        expect(box.bottom).toBe(1000);
    });
    
    it('matches the mid-section of the list when scrolled down appropriately', function() {
        var view = {
            top: 1000,
            bottom: 2000
        };
        
        var list = {
            top: 0,
            bottom: 3000
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(1000);
        expect(box.bottom).toBe(2000);
    });    
    
    it('fills the list box when the viewbox is larger', function() {
        var view = {
            top: 0,
            bottom: 2000
        };
        
        var list = {
            top: 500,
            bottom: 1500
        };
        
        var box = VirtualList.getBox(view, list);
        
        expect(box.top).toBe(0);
        expect(box.bottom).toBe(1000);
    });    
    
    it('performs well', function() {
        var count = 1000000;
        var start = Date.now();
        
        for (var i=0;i<count;i++) {
            var view = {
                top: random(0, 1000),
                bottom: random(1000, 2000)
            };
            
            var list = {
                top: random(0, 1000),
                bottom: random(0, 200 * 500)
            };
            
            var box = VirtualList.getBox(view, list);
        }
        
        var end = Date.now();
        var duration = end - start;
        
        // console.log('VirtualRenderer.getBox ran %d iterations in %d ms', count, end - start);
        
        expect(duration).toBeLessThan(1000);
    });
});
