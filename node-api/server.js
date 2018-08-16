var async = require("async");
var request = require("request");
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();

// create request objects
var requests = [{
        url: 'https://gitlab.com/api/v4/projects/7642571/pipelines',
        headers: {
          'PRIVATE-TOKEN': 'K1Hdz5g9SqwuW7btpkzh'
        }
    }  
    // {
    //     url: 'https://gitlab.com/api/v4/projects/7642571',
    //     headers: {
    //       'PRIVATE-TOKEN': 'K1Hdz5g9SqwuW7btpkzh'
    //     }
    // }
];

async.map(requests, function(obj, callback) {
    // iterator function
    request(obj, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // transform data here or pass it on
        data = JSON.parse(body);
        var mdata = [];
        for (var i = 0; i < 10; i++) {
            mdata[i] = [{ 'commit' : data[i].sha, 'build' : { 'id' : data[i].id, 'status' : data[i].status, 'web_url' : data[i].web_url } }, { 'aws' : { 'status' : data[i].status, 'web_url' : data[i].web_url } }, { 'gcp' : { 'status' : data[i].status, 'web_url' : data[i].web_url }}];
            // console.log("length-->", data[i]);
        }
        callback(null, mdata);
      } else {
        callback(error || response.statusCode);
      }
    });
  }, function(err, results) {
    // all requests have been made
    if (err) {
        console.log("error ", err);
    } else {
        router.get('/', function(req, res) {
            res.json(results);	
        });
        app.use('/api', router);
        app.listen(port);
        console.log('server started on port ' + port);
        // for (var i = 0; i < results[0].length; i++) {
        //     // console.log(results[0].length)
        // }
    }
  });

