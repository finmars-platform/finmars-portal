/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
var url = require('url');
var proxy = require('proxy-middleware');
var app = express();

app.use(express.static('dist'));
app.use('/portal', express.static('dist'));

// var proxyOptions = url.parse('http://127.0.0.1:8000');
// proxyOptions.cookieRewrite = true;
//
// app.use('/', proxy(proxyOptions));

app.listen(8080, '0.0.0.0', function(){
  console.info('Express server start at 8080 port');
});
