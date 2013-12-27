var testServerPort = 9295,
    helper = require('../helper'),
    Runner = require('../../lib/blitz/runner'),
    credentials = {username: 'user', apiKey: 'key', host: 'localhost', port: 9295};

describe("Runner", function () {
    var runner;
    
    beforeEach(function() {
        // Test server. Will be handling the requests sent by the tests.
        helper.mockServer.listen(testServerPort);
        //needed by the mock server to compare usernames
        process.env['BLITZ_API_USER'] = 'user';

        runner = new Runner(credentials);
    });
    
    afterEach(function () {
        helper.mockServer.close();
    });

    it('should execute a Sprint', function () {
        var finished = false;
        runs (function() {
            runner.execute('http://127.0.0.1 /2');
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
        runner = new Runner({username: 'user2', apiKey: 'key', host: 'localhost', port: 9295});
        var finished = false;
        runs (function() {
            runner.execute('-p 1-100:60 -u c123 http://127.0.0.1 /2');
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

    it('should return a parser error', function () {
        process.env['BLITZ_API_USER'] = 'user3';
        runner = new Runner({username: 'user3', apiKey: 'key', host: 'localhost', port: 9295});
        var finished = false;
        runs (function() {
            runner.execute('-z');
            runner.on('error', function (message) {
                expect(message.error).toBeDefined();
                expect(message.reason).toBeDefined();
                expect(message.error).toEqual('parse');
                finished = true;
            });
        });
        waitsFor(function () {
            return finished;
        });        
    });
});
