var testServerPort = 9295,
    helper = require('./helper'),
    Blitz = require('../lib/blitz.js');

describe("Blitz", function () {
    var blitz;
    
    beforeEach(function () {
        // Test server. Will be handling the requests sent by the tests.
        helper.mockServer.listen(testServerPort);
        //needed by the mock server to compare usernames
        process.env['BLITZ_API_USER'] = 'user';

        blitz = new Blitz('user', 'key', 'localhost', 9295);
    });
    
    afterEach(function () {
        helper.mockServer.close();
    });

    it("should return a Rush Result object", function () {
        var finished = false;
        runs (function() {
            blitz.rush({
                    pattern: {intervals: []},
                    steps: [
                        {url: 'http://127.0.0.1', user: 'c123'},
                        {url: 'http://127.0.0.1/2'}
                    ]
                }).on('complete', function (data) {
                expect(data.region).toBeDefined();
                expect(data.timeline).toBeDefined();
                expect(data.timeline[0].steps).toBeDefined();
                expect(data.timeline[0].steps.length).toEqual(2);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should return a Sprint Result object", function () {
        var finished = false;
        runs (function() {
            blitz.sprint({
                    steps: [
                        {url: 'http://127.0.0.1'},
                        {url: 'http://127.0.0.1/2'}
                    ]
                }).on('complete', function (data) {
                    expect(data.region).toBeDefined();
                    expect(data.duration).toBeDefined();
                    expect(data.steps).toBeDefined();
                    expect(data.steps.length).toEqual(2);
                    finished = true;
                });
        });
        waitsFor(function () {
            return finished;
        });
    });
    
    it('should execute a Sprint', function () {
        var finished = false;
        runs (function() {
            runner = blitz.execute('http://127.0.0.1 /2');
            runner.on('complete', function (data) {
                expect(data.region).toBeDefined();
                expect(data.duration).toBeDefined();
                expect(data.steps).toBeDefined();
                expect(data.steps.length).toEqual(2);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });        
    });

    it('should execute a Rush', function () {
        process.env['BLITZ_API_USER'] = 'user2';
        blitz = new Blitz('user2', 'key', 'localhost', 9295);
        var finished = false;
        runs (function() {
            runner = blitz.execute('-p 1-100:60 -u c123 http://127.0.0.1 /2');
            runner.on('complete', function (data) {
                expect(data.region).toBeDefined();
                expect(data.timeline).toBeDefined();
                expect(data.timeline[0].steps).toBeDefined();
                expect(data.timeline[0].steps.length).toEqual(2);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });        
    });
    
    it("should fail Rush if pattern is not given", function () {
        var finished = false;
        // run a sprint to authenticate
        runs (function () {
            blitz.sprint({
                steps: [
                    {url: 'http://127.0.0.1'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).on('complete', function (data) {
                //now we can run a rush
                expect(function () {
                    blitz.rush({
                        steps: [{url: 'http://127.0.0.1', user: 'c123'}] 
                    });  
                }).toThrow('missing pattern');
                finished = true;
            });
        });
        waitsFor (function() {
            return finished;
        });
    });
    
    it("should be authenticated", function () {
        var b = new Blitz('user', 'key', 'localhost', 9295, true);
        expect(b.authenticated).toBeTruthy();
    });
    
    it("should authenticate", function () {
        var finished = false;
        runs (function() {
            expect(blitz.authenticated).toBeFalsy();
            blitz.sprint(
                {
                    steps: [
                        {url: 'http://127.0.0.1'},
                        {url: 'http://127.0.0.1/2'}
                    ]
                }).on('complete', function (data) {
                    expect(blitz.authenticated).toBeTruthy();
                    finished = true;
                });
        });
        waitsFor(function () {
            return finished;
        });
    });
    
    it("should get account information", function () {
        var finished = false;
        runs (function() {
            blitz.about(function (data) {
                expect(data['_id']).toEqual('abc123');
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });
});
