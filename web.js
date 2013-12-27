/**
 * Module dependencies.
 */

var newrelic = require('newrelic')
  , express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var Blitz = require('blitz');
 
var email = "mayue617@gmail.com",
    apiKey = "f235a911-c1f76406-fd741a3a-636e9253",
    myWebsite = "http://young-citadel-1394.herokuapp.com/",
    blitz= new Blitz(email, apiKey);
 
// Run a sprint
blitz.sprint({
    steps: [{url: myWebsite}],
    region: 'california'
}).on('status', function (data) {
    // do something...
}).on('complete', function (data) {
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    var steps = data.steps;
    for(var i in steps) {
        var step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);    
    console.log("reason: " + response.reason);
});
 
// Run a rush
blitz.rush({
    steps: [{url: myWebsite}],
    region: 'california',
    pattern: { intervals: [{start: 1, end: 10, duration: 30}]}
}).on('status', function (data) {
    // do something...
}).on('complete', function (data) {
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    var steps = data.steps;
    for(var i in steps) {
        var step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);    
    console.log("reason: " + response.reason);
});
 
//Run a sprint or rush using the command parser
blitz.execute('-r ireland http://example.com').on('status', function (data) {
    // do something...
}).on('complete', function (data) {
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    var steps = data.steps;
    for(var i in steps) {
        var step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);	
    console.log("reason: " + response.reason);
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options',{
	layout:false
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
