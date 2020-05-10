var http = require('http');
var async = require('async');
var request = require('request');

console.log('node.js application starting...');



var svr = http.createServer(function(req, resp) {

var apiCall = function(api){
    var randomNum = randomNumber(1,150);
    console.log(randomNum);
    return new Promise((resolve, reject) => setTimeout(resolve, randomNum, 'data of' + api + 'api'));
};


function randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
}


Promise.delay = function(t, val) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, val), t);
    });
}

Promise.raceAll = function(promises, timeoutTime, timeoutVal) {
    return Promise.all(promises.map(p => {
        return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
    }));
}

var getParallel = async function() {
    //transform requests into Promises, await all
    var apiReqArr = [
        apiCall('first'),
        apiCall('second'),
        apiCall('third')
    ];
  var result =  await Promise.raceAll(apiReqArr,100,null).catch(err => {
    console.log(err);
  });
  var resultAfterFilter = result.filter(item => !!item);
  return  new Promise((resolve, reject) =>  {resolve(resultAfterFilter)});
}



var getFirstParallelMethod = async function(){
    var first =   getParallel();
    var second =  getParallel();
    var third =   getParallel();
    var arrayOfReq = [first,second,third];
    console.log(arrayOfReq);
    Promise.race(arrayOfReq).then(data => {
        console.log(data,'dataaaaa');
        if(data){
            resp.writeHead(200, {"Content-Type": "application/json"});
            console.log(data);
            resp.end(JSON.stringify(data));
        }
    }).catch(err => {
        console.log('err',err);
    });
};

getFirstParallelMethod();


});



svr.listen(9000, function() {
  console.log('Node HTTP server is listening');
});

