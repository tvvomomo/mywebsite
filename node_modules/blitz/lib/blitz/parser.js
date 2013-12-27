/*jslint
    onevar: false, undef: true, newcap: true, nomen: false, es5: true,
    regexp: true, plusplus: true, bitwise: true, browser: true, indent: 4 */
/*global require, module, console, process, blitz */
(function () {
    var MAP = {'n': '\n', 'r': '\r', 't': '\t', '\\': '\\', "'": "'", '"': '"'};
    var RE_SLASH = /\\[ntr'"\\]/g;
    var RE_HEX = /\\x[0-9a-fA-F]{1,2}/g;
    var RE_WS = /^\s+/;
    var RE_NOT_WS = /^[^\s]+/;
    var RE_DQ_STRING = /^"[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*"/;
    var RE_SQ_STRING = /^'[^'\\\r\n]*(?:\\.[^'\\\r\n]*)*'/;
    
    function _assert(v, message) {
        if (!v) {
            throw new Error(message);
        }
    }

    function Parser() {
        var self = this;
        
        self._unescape = function (str) {
            return str
                .replace(RE_HEX, function (h) {
                    return String.fromCharCode(parseInt(h.substr(2, 2), 16));
                })
                .replace(RE_SLASH, function (e) {
                    return MAP[e.charAt(1)];
                });            
        };
        
        self._xargs = function (text) {
            var argv = [];
            while (text && text.length !== 0) {
                if (RE_WS.test(text)) {
                    text = RegExp.rightContext;
                } else if (RE_DQ_STRING.test(text)) {
                    var dq_string = RegExp.lastMatch;
                    text = RegExp.rightContext;
                    argv.push(self._unescape(dq_string.substring(1, dq_string.length - 1)));
                } else if (RE_SQ_STRING.test(text)) {
                    var sq_string = RegExp.lastMatch;
                    text = RegExp.rightContext;
                    argv.push(self._unescape(sq_string.substring(1, sq_string.length - 1)));
                } else if (RE_NOT_WS.test(text)) {
                    text = RegExp.rightContext;
                    argv.push(self._unescape(RegExp.lastMatch));
                } else {
                    text = text.substring(1, text.length - 1);
                }
            }
            
            return argv;
        };
        
        self.parse = function (text) {
            var k, v, vn, i, tokens, t, argv = self._xargs(text);
            var test = { steps: [] };

            function vcheck(step, text2) {
                var ret = text2;
                while (text2.length > 0) {
                    if (/#\{([^}]+)\}/.test(text2) === false) {
                        break;
                    }
                    vn = RegExp.$1;
                    if (!step.variables.hasOwnProperty(vn)) {
                        throw new Error('Unknown variable ' + vn);
                    }
                    text2 = RegExp.rightContext;
                }
                return ret;
            }

            while (argv.length > 0) {
                var step = {
                    headers: [],
                    cookies: [],
                    variables: {}
                };

                while (argv.length > 0) {
                    if (argv[0].charAt(0) !== '-') {
                        break;
                    }

                    k = argv.shift();

                    if (k === '--user-agent' || k === '-A') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step['user-agent'] = vcheck(step, v);
                    } else if (k === '--cookie' || k === '-b') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.cookies.push(vcheck(step, v));
                    } else if (k === '--data' || k === '-d') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.content = step.content || {};
                        step.content.data = step.content.data || [];
                        step.content.data.push(vcheck(step, v));
                    } else if (k === '--referer' || k === '-e') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.referer = vcheck(step, v);
                    } else if (k === '--header' || k === '-H') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.headers.push(vcheck(step, v));
                    } else if (k === '--pattern' || k === '-p') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);

                        tokens = v.split(',');
                        test.pattern = {iterations: 1, intervals: []};
                        for (i = 0; i < tokens.length; i += 1) {
                            t = tokens[i];
                            _assert(/^((\d+)\*)?(\d+)-(\d+):(\d+)$/.test(t), 'invalid ramp pattern');
                            test.pattern.intervals.push({
                                iterations: parseInt(RegExp.$1 || 1, 10),
                                start: parseInt(RegExp.$3, 10),
                                end: parseInt(RegExp.$4, 10),
                                duration: parseInt(RegExp.$5, 10)
                            });
                        }

                        _assert(test.pattern.intervals.length > 0, 'invalid ramp pattern');
                    } else if (k === '--region' || k === '-r') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        test.region = v;
                    } else if (k === '--status' || k === '-s') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.status = parseInt(v, 10) || 0;
                    } else if (k === '--timeout' || k === '-T') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.timeout = parseInt(v, 10) || 1000;
                    } else if (k === '--user' || k === '-u') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.user = vcheck(step, v);
                    } else if (k === '--request' || k === '-X') {
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        step.request = vcheck(step, v);
                    } else if (k === '-1' || k === '--tlsv1') {
                        step.ssl = 'tlsv1';
                    } else if (k === '-2' || k === '--sslv2') {
                        step.ssl = 'sslv2';
                    } else if (k === '-3' || k === '--sslv3') {
                        step.ssl = 'sslv3';
                    } else if (/^\-v:([^\s]+)/.test(k)) {
                        vn = RegExp.$1;
                        if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(vn) === false) {
                            throw new Error('variable name must be alphanumeric');
                        }
                        v = argv.shift();
                        _assert(v !== undefined, 'missing value for ' + k);
                        if (/^(list)?\[([^\]]+)\]$/.test(v)) {
                            tokens = RegExp.$2.split(',');
                            step.variables[vn] = {type: 'list', entries: tokens};
                        } else if (/^(a|alpha)$/.test(v)) {
                            step.variables[vn] = {type: 'alpha'};
                        } else if (/^(a|alpha)\[(\d+)(,(\d+)(,(\d+))?)?\]$/.test(v)) {
                            step.variables[vn] = {type: 'alpha'};
                            step.variables[vn].min = parseInt(RegExp.$2, 10);
                            if (RegExp.$4) {
                                step.variables[vn].max = parseInt(RegExp.$4, 10);                        
                            }
                            if (RegExp.$6) {
                                step.variables[vn].count = parseInt(RegExp.$6, 10);
                            }
                        } else if (/^(n|number)$/.test(v)) {
                            step.variables[vn] = {type: 'number'};
                        } else if (/^(n|number)\[(-?\d+),(-?\d+)(,(\d+))?\]$/.test(v)) {
                            step.variables[vn] = { 
                                type: 'number', 
                                min: parseInt(RegExp.$2, 10), 
                                max: parseInt(RegExp.$3, 10), 
                                count: parseInt(RegExp.$5 || 1000, 10)
                            };
                        } else if (/^(u|udid)$/.test(v)) {
                            step.variables[vn] = {type: 'udid'};
                        } else {
                            throw new Error('unknown variable ' + v);
                        }
                    } else {
                        throw new Error('unknown option ' + k);
                    }
                }

                v = argv.shift();
                _assert(v !== undefined, 'no URL specified!');
                step.url = vcheck(step, v);
                test.steps.push(step);
            }
            
            _assert(test.steps.length !== 0, 'no URL specified!');
            return test;            
        };
    }
    
    module.exports = Parser;
}());