var testServerPort = 9295,
    helper = require('../helper'),
    Rush = require('../../lib/blitz/rush'),
    credentials = {username: 'user', apiKey: 'key', host: 'localhost', port: 9295};

describe("Rush", function () {
    var rush;
    
    beforeEach(function() {
        // Test server. Will be handling the requests sent by the tests.
        helper.mockServer.listen(testServerPort);

        rush = new Rush();
    });
    
    afterEach(function () {
        helper.mockServer.close();
    });

    it("should have a Result object", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                expect(data.region).toBeDefined();
                expect(data.timeline).toBeDefined();
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should have a Array of Points inside Results", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                var timeline = data.timeline;
                expect(Object.prototype.toString.apply(timeline)).toBe('[object Array]');
                expect(timeline[0].duration).toBeDefined();
                expect(timeline[0].total).toBeDefined();
                expect(timeline[0].hits).toBeDefined();
                expect(timeline[0].errors).toBeDefined();
                expect(timeline[0].timeouts).toBeDefined();
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should match the expected Result data", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                expect(data.region).toEqual('california');
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should match the expected Timeline data", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                var timeline = data.timeline;
                expect(timeline[0].duration).toEqual(10);
                expect(timeline[0].total).toEqual(10);
                expect(timeline[0].hits).toEqual(8);
                expect(timeline[0].errors).toEqual(1);
                expect(timeline[0].timeouts).toEqual(1);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    });

    it("should fail if pattern is not given", function () {
        expect(function() {
            rush.create(credentials, {
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute();  
        }).toThrow('missing pattern');
    });
    
    it("should have an Array of Steps inside the timeline", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                var steps = data.timeline[0].steps;
                expect(Object.prototype.toString.apply(steps)).toBe('[object Array]');
                expect(steps[0].duration).toBeDefined();
                expect(steps[0].connect).toBeDefined();
                expect(steps[0].asserts).toBeDefined();
                expect(steps[0].errors).toBeDefined();
                expect(steps[0].timeouts).toBeDefined();
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    })

    it("should match the expect step data", function () {
        var finished = false;
        runs (function() {
            rush.create(credentials, {
                pattern: { intervals: []}, 
                steps: [
                    {url: 'http://127.0.0.1', user: 'c123'},
                    {url: 'http://127.0.0.1/2'}
                ]
            }).execute().on('complete', function (data) {
                var steps = data.timeline[0].steps;
                expect(Object.prototype.toString.apply(steps)).toBe('[object Array]');
                expect(steps[0].duration).toEqual(5);
                expect(steps[0].connect).toEqual(1);
                expect(steps[0].asserts).toEqual(4);
                expect(steps[0].errors).toEqual(0);
                expect(steps[0].timeouts).toEqual(1);
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });
    })
});
