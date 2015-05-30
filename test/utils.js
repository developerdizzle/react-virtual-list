var utils = require('../dist/utils');

describe('function to compare arrays', function() {
    it('returns false if arrays (of primitives) are different', function() {
        var a = [1, 2, 3];
        var b = [1, 2, 4];

        var equals = utils.areArraysEqual(a, b);

        expect(equals).toBe(false);
    });
    
    it('returns true if arrays (of primitives) are equal', function() {
        var a = [1, 2, 3];
        var b = [1, 2, 3];

        var equals = utils.areArraysEqual(a, b);

        expect(equals).toBe(true);
    });
    
    it('returns false if arrays (of references) are different', function() {
        var a1 = { value: 1 };
        var a2 = { value: 2 };
        var a3 = { value: 3 };
        
        var b1 = a1;
        var b2 = a2;
        var b3 = { value: 3 };
        
        var a = [a1, a2, a3];
        var b = [b1, b2, b3];

        var equals = utils.areArraysEqual(a, b);

        expect(equals).toBe(false);
    });    
    
    it('returns true if arrays (of references) are equal', function() {
        var a1 = { value: 1 };
        var a2 = { value: 2 };
        var a3 = { value: 3 };
        
        var b1 = a1;
        var b2 = a2;
        var b3 = a3;
        
        var a = [a1, a2, a3];
        var b = [b1, b2, b3];

        var equals = utils.areArraysEqual(a, b);

        expect(equals).toBe(true);
    });    
    
    it('returns false if array lengths are different', function() {
        var a = [1, 2, 3];
        var b = [1, 2, 3, 4];

        var equals = utils.areArraysEqual(a, b);

        expect(equals).toBe(false);
    });      
});
