var Parser = require('../../lib/blitz/parser');

describe("Parser", function () {
    var parser;
    beforeEach(function () {
        parser = new Parser();
    });
    
    it ('should check for no URL specified', function () {
        expect(function () {
            parser.parse('');
        }).toThrow('no URL specified!');
        
        expect(function () {
            parser.parse('-p 1-10:60');
        }).toThrow('no URL specified!');
    });
    
    it ('should throw unknown option', function () {
        expect(function () {
            parser.parse('-z');
        }).toThrow('unknown option -z');
    });
    
    describe('user-agent', function () {
        it('should set the user-agent in the options', function () {
            [ '--user-agent', '-A' ].forEach(function (v) {
                var options = parser.parse(v + ' foo blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step['user-agent']).toEqual('foo');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-A #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -A #{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step['user-agent']).toEqual('#{foo}');
        });
    });
    
    describe('cookie', function () {
        it('should set the cookie in the options', function () {
            [ '--cookie', '-b' ].forEach(function (v) {
                var options = parser.parse(v + ' foo blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.cookies.length).toEqual(1);
                expect(step.cookies[0]).toEqual('foo');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-b #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -b #{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.cookies.length).toEqual(1);
            expect(step.cookies[0]).toEqual('#{foo}');
        });
    });
    
    describe('data', function () {
        it('should set the data in the options', function () {
            [ '--data', '-d' ].forEach(function (v) {
                var options = parser.parse(v + ' foo blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.content).not.toBeUndefined();
                expect(step.content.data).not.toBeUndefined();
                expect(step.content.data.length).toEqual(1);
                expect(step.content.data[0]).toEqual('foo');
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-d #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -d #{foo}=bar blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.content).not.toBeUndefined();
            expect(step.content.data).not.toBeUndefined();
            expect(step.content.data.length).toEqual(1);
            expect(step.content.data[0]).toEqual('#{foo}=bar');
        });
    });    
    
    describe('referer', function () {
        it('should set the referer in the options', function () {
            [ '--referer', '-e' ].forEach(function (v) {
                var options = parser.parse(v + ' foo blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.referer).toEqual('foo');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-e #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -e #{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.referer).toEqual('#{foo}');
        });
    });
    
    describe('header', function () {
        it('should set the header in the options', function () {
            [ '--header', '-H' ].forEach(function (v) {
                var options = parser.parse(v + ' foo blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.headers).toBeDefined();    
                expect(step.headers.length).toEqual(1);
                expect(step.headers[0]).toEqual('foo');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-H #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -H a=#{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.headers).toBeDefined();    
            expect(step.headers.length).toEqual(1);
            expect(step.headers[0]).toEqual('a=#{foo}');
        });
    });
    
    describe('pattern', function () {
        it('should set the pattern in the options', function () {
            [ '--pattern', '-p' ].forEach(function (v) {
                var options = parser.parse(v + ' 1-10:60 blitz.io');
                expect(options.pattern).toBeDefined();
                expect(options.pattern.iterations).toEqual(1);
                expect(options.pattern.intervals).toBeDefined();
                expect(options.pattern.intervals.length).toEqual(1);
                expect(options.pattern.intervals[0].iterations).toEqual(1);
                expect(options.pattern.intervals[0].start).toEqual(1);
                expect(options.pattern.intervals[0].end).toEqual(10);
                expect(options.pattern.intervals[0].duration).toEqual(60);
            });
        });
        
        it('should support multiple intervals', function () {
            [ '--pattern', '-p' ].forEach(function (v) {
                var options = parser.parse(v + ' 1-10:60,2-20:30 blitz.io');
                expect(options.pattern).toBeDefined();
                expect(options.pattern.iterations).toEqual(1);
                expect(options.pattern.intervals).toBeDefined();
                expect(options.pattern.intervals.length).toEqual(2);
                expect(options.pattern.intervals[0].iterations).toEqual(1);
                expect(options.pattern.intervals[0].start).toEqual(1);
                expect(options.pattern.intervals[0].end).toEqual(10);
                expect(options.pattern.intervals[0].duration).toEqual(60);
                expect(options.pattern.intervals[1].iterations).toEqual(1);
                expect(options.pattern.intervals[1].start).toEqual(2);
                expect(options.pattern.intervals[1].end).toEqual(20);
                expect(options.pattern.intervals[1].duration).toEqual(30);
            });
        });
    });
    
    describe('region', function () {
        it('should set the region in the options', function () {
            [ '--region', '-r' ].forEach(function (v) {
                [ 'california', 'oregon', 'virginia', 'singapore', 'japan', 'ireland', 'brazil' ].forEach(function (r) {
                    var options = parser.parse(v + ' ' + r + ' blitz.io');
                    expect(options.region).toEqual(r);
                });
            });
        });
        
        it('should fail if no region is given', function () {
            expect(function () {
                parser.parse('-r');
            }).toThrow('missing value for -r');

            expect(function () {
                parser.parse('-r blitz.io');
            }).toThrow('no URL specified!');
        });
    });
    
    describe('status', function () {
        it('should set the status in the options', function () {
            [ '--status', '-s' ].forEach(function (v) {
                var options = parser.parse(v + ' 200 blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.status).toEqual(200);
            });
        });
        
        it('should not support variables', function () {
            var options = parser.parse('-s #{v} blitz.io');
            expect(options.steps.length).toEqual(1);
            var step = options.steps[0];
            expect(step.status).toEqual(0);
        });
    });
    
    describe('timeout', function () {
        it('should set the timeout in the options', function () {
            [ '--timeout', '-T' ].forEach(function (v) {
                var options = parser.parse(v + ' 200 blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.timeout).toEqual(200);
            });
        });
        
        it('should not support variables', function () {
            var options = parser.parse('-T #{v} blitz.io');
            expect(options.steps.length).toEqual(1);
            var step = options.steps[0];
            expect(step.timeout).toEqual(1000);
        });
    });
    
    describe('user', function () {
        it('should set the user in the options', function () {
            [ '--user', '-u' ].forEach(function (v) {
                var options = parser.parse(v + ' foo:bar blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.user).toEqual('foo:bar');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-u #{foo}:bar blitz.io');                
            }).toThrow('Unknown variable foo');
            expect(function () {
                parser.parse('-u foo:#{bar} blitz.io');                
            }).toThrow('Unknown variable bar');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [1,2,3] -u #{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.user).toEqual('#{foo}');
        });
    });
    
    describe('request', function () {
        it('should set the request in the options', function () {
            [ '--request', '-X' ].forEach(function (v) {
                var options = parser.parse(v + ' GET blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.request).toEqual('GET');                
            });
        });
        
        it('should check for undefined variables', function () {
            expect(function () {
                parser.parse('-X #{foo} blitz.io');                
            }).toThrow('Unknown variable foo');
        });
        
        it('should support variables', function () {
            var options = parser.parse('-v:foo [GET,POST,HEAD] -X #{foo} blitz.io');
            var step = options.steps[0];
            expect(step.variables.foo).toBeDefined();
            expect(step.request).toEqual('#{foo}');
        });
    });
    
    describe('tlsv1', function () {
        it('should set the ssl in the options', function () {
            [ '--tlsv1', '-1' ].forEach(function (v) {
                var options = parser.parse(v + ' blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.ssl).toEqual('tlsv1');
            });
        });
    });
    
    describe('sslv2', function () {
        it('should set the ssl in the options', function () {
            [ '--sslv2', '-2' ].forEach(function (v) {
                var options = parser.parse(v + ' blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.ssl).toEqual('sslv2');
            });
        });
    });
    
    describe('sslv3', function () {
        it('should set the ssl in the options', function () {
            [ '--sslv3', '-3' ].forEach(function (v) {
                var options = parser.parse(v + ' blitz.io');
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.ssl).toEqual('sslv3');
            });
        });
    });
    
    describe('variables', function () {
        it('should check for alphanumeric names', function () {
            expect(function () {
                parser.parse('-v:_12 [1,2] blitz.io');
            }).toThrow('variable name must be alphanumeric');
        });
        
        it('should check for missing value', function () {
            expect(function () {
                parser.parse('-v:foo');
            }).toThrow('missing value for -v:foo');
        });
        
        it('should add list variables to options', function () {
            [ '[1,2,3]', 'list[1,2,3]' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('list');
                expect(step.variables.foo.entries.length).toEqual(3);
                expect(step.variables.foo.entries[0]).toEqual('1');
                expect(step.variables.foo.entries[1]).toEqual('2');
                expect(step.variables.foo.entries[2]).toEqual('3');
            });
        });
        
        it('should add alpha variables to options', function () {
            [ 'a', 'alpha' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('alpha');
                expect(step.variables.foo.min).toBeUndefined();
                expect(step.variables.foo.max).toBeUndefined();
                expect(step.variables.foo.count).toBeUndefined();
            });            
        });
        
        it('should add alpha variables with min, max, count to options', function () {
            [ 'a[1,2,3]', 'alpha[1,2,3]' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('alpha');
                expect(step.variables.foo.min).toEqual(1);
                expect(step.variables.foo.max).toEqual(2);
                expect(step.variables.foo.count).toEqual(3);
            });
        });        

        it('should add number variables to options', function () {
            [ 'n', 'number' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('number');
                expect(step.variables.foo.min).toBeUndefined();
                expect(step.variables.foo.max).toBeUndefined();
                expect(step.variables.foo.count).toBeUndefined();
            });            
        });
        
        it('should add alpha variables with min, max, count to options', function () {
            [ 'n[1,2,3]', 'number[1,2,3]' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('number');
                expect(step.variables.foo.min).toEqual(1);
                expect(step.variables.foo.max).toEqual(2);
                expect(step.variables.foo.count).toEqual(3);
            });
        });
        
        it('should add number variables to options', function () {
            [ 'u', 'udid' ].forEach(function (v) {
                var options = parser.parse('-v:foo ' + v + ' blitz.io');    
                expect(options.steps.length).toEqual(1);
                var step = options.steps[0];
                expect(step.variables).toBeDefined();
                expect(step.variables.foo).toBeDefined();
                expect(step.variables.foo.type).toEqual('udid');
            });            
        });
    });
    
    describe('steps', function() {
        it('should add multiple steps to the options', function () {
            var options = parser.parse('-X a blitz.io -X b /foo -X c /bar');            
            expect(options.steps.length).toEqual(3);
            expect(options.steps[0].request).toEqual('a');
            expect(options.steps[0].url).toEqual('blitz.io');
            expect(options.steps[1].request).toEqual('b');
            expect(options.steps[1].url).toEqual('/foo');
            expect(options.steps[2].request).toEqual('c');
            expect(options.steps[2].url).toEqual('/bar');
        });
    });
});