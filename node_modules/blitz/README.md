### ![blitz.io](http://blitz.io/images/logo2.png)

### Make load and performance a fun sport.

* Run a sprint from around the world
* Rush your API and website to scale it out
* Condition your site around the clock

## Getting started

Login to [blitz.io](http://blitz.io) and in the blitz bar type:
    
    --api-key

Now

    npm install blitz

Then

**Sprint**

```javascript
var Blitz = require('blitz-node');

console.log('Starting Sprint...');
new Blitz('<email>','<api-key>').sprint({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.ap/page1'}
    ],
	region: 'california'
}).on('status', function (data) {
    process.stdout.write('.');
}).on('complete', function (data) {
    var steps, i, step;
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    steps = data.steps;
    for(i in steps) {
        step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);	
    console.log("reason: " + response.reason);
});
```

**Rush**

```javascript
var Blitz = require('blitz');

console.log('Starting Rush...');
new Blitz('<email>','<api-key>').rush({
    steps: [
        {url: 'http://your.cool.app'},
        {url: 'http://your.cool.app/page1'}
    ],
    region: 'california',
    pattern: { intervals: [{start: 1, end: 10, duration: 30}]}
}).on('status', function (data) {
    process.stdout.write('.');
}).on('complete', function (data) {
    var steps, i, step;
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    steps = data.steps;
    for(i in steps) {
        step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);	
    console.log("reason: " + response.reason);
});
```

**or using the API parser**

The parser expects a text and will recognize the type of test at runtime.

```javascript
var Blitz = require('blitz');

console.log('Starting Test...');
new Blitz('<email>','<api-key>').execute('-p 1-100:60 http://your.cool.app').on('status', function (data) {
    process.stdout.write('.');
}).on('complete', function (data) {
    var steps, i, step;
    console.log('region: ' + data.region);
    console.log('duration: ' + data.duration);
    steps = data.steps;
    for(i in steps) {
        step = steps[i];
        console.log("> Step " + i);
        console.log("\tstatus: " + step.response.status);
        console.log("\tduration: " + step.duration);
        console.log("\tconnect: " + step.connect);
    }
}).on('error', function (response) {
    console.log("error: " + response.error);    
    console.log("reason: " + response.reason);
});
```




