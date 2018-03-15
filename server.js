/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
  var url = require('url');
var proxy = require('proxy-middleware');
var app = express();

app.use(express.static('dist'));

var proxyOptions = url.parse('http://ec2-18-196-215-43.eu-central-1.compute.amazonaws.com/');
proxyOptions.cookieRewrite = true;

app.use('/', proxy(proxyOptions));

// app.use(function(req, res){
//   console.info(req);
//   console.info('123');
// });

app.listen(3000, '0.0.0.0', function(){
  console.info('Express server start at 3000 port');
});
