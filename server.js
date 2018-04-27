/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
var path = require('path');
var url = require('url');
var proxy = require('proxy-middleware');
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
// app.use('/portal', express.static('dist'));

// var proxyOptions = url.parse('http://127.0.0.1:8000');
// proxyOptions.cookieRewrite = true;
//
// app.use('/', proxy(proxyOptions));

app.get('/', function(req, res) {

    console.log('Send index page');

    res.sendFile(path.join(__dirname, 'dist/' + "index.html"));
});

app.listen(8080, '0.0.0.0', function(){
  console.info('Express server start at 8080 port');
});
