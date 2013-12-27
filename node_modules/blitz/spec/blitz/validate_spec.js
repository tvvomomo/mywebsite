var testServerPort = 9295,
    Validate = require('../../lib/blitz/validate');

describe("Validate", function () {
    it("should validate a step with a IP address", function () {
        var json = { steps: [{url: 'http://172.0.0.1'}] },
            hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should validate a step with a hostname", function () {
        var json = { steps: [{url: 'http://blitz.io'}] },
            hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should validate a step with a hostname and a path", function () {
        var json = { steps: [{url: 'http://blitz.io/play'}] },
            hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should fail validation with no steps", function () {
        var json = {},
            hash = Validate(json),
            result = hash.result();
            
        expect(hash.valid()).toBeFalsy();
        expect(result.error).toEqual('validation');
    });

    it("should fail validation with no url", function () {
        var json = { steps: [{}] },
            hash = Validate(json),
            result = hash.result();
            
        expect(hash.valid()).toBeFalsy();
        expect(result.error).toEqual('validation');
    });

    it("should validate with 2 steps", function () {
        var json = { steps: [
                {url: 'http://blitz.io/play'}, 
                {url: 'http://blitz.io'}
            ] 
        }, hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should validate with a cookies array", function () {
        var json = { steps: [{url: 'http://172.0.0.1', cookies: []}] },
            hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should fail validation with a cookie object", function () {
        var json = { steps: [{ url: 'http://172.0.0.1', cookies: {}}] },
            hash = Validate(json),
            result = hash.result();
            
        expect(hash.valid()).toBeFalsy();
        expect(result.error).toEqual('validation');
    });

    it("should validate with a status number", function () {
        var json = { steps: [{url: 'http://172.0.0.1', status: 200}] },
            hash = Validate(json);
            
        expect(hash.valid()).toBeTruthy();
        expect(hash.result()).toBeNull();
    });

    it("should fail validation with a status string", function () {
        var json = { steps: [{url: 'http://172.0.0.1', status: "abc"}] },
            hash = Validate(json),
            result = hash.result();
            
        expect(hash.valid()).toBeFalsy();
        expect(result.error).toEqual('validation');
    });

    it("should fail validation with an empty region", function () {
        var json = { steps: [{url: 'http://172.0.0.1'}], region: ""},
            hash = Validate(json),
            result = hash.result();
            
        expect(hash.valid()).toBeFalsy();
        expect(result.error).toEqual('validation');
    });
});
