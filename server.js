/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
var url = require('url');
var proxy = require('proxy-middleware');
var app = express();

app.use(express.static('dist'));

var proxyOptions = url.parse('https://dev.finmars.com');
proxyOptions.cookieRewrite = true;

app.use('/', proxy(proxyOptions));

app.listen(3000, function(){
  console.info('Express server start at 3000 port');
});
