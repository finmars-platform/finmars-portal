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
app.use('/portal', express.static('dist'));

app.use('/healthcheck', function (req, res) {

    var data = {};

    data['version'] = 1;
    data['checks'] = {};
    data['status'] = 'pass';
    data['notes'] = '';
    data['description'] = '';
    data['output'] = '';

    res.send(data)

});

app.use('/build/:uid/*', function(req, res, next) {

    var uid = req.params.uid;

    path = req.params[0] ? req.params[0] : 'index.html';

    res.sendFile(path, {root: './dist'});

});

app.use(express.static(path.join(__dirname, 'dist')));

// WARNING ONLY FOR DEV PURPOSE
// var pdfProxyOptions = url.parse('http://0.0.0.0:80');
//
// app.use('/services/pdf', proxy(pdfProxyOptions));

// var proxyOptions = url.parse('https://dev.finmars.com');


// proxyOptions.cookieRewrite = true;
// proxyOptions.headers = {Referer: 'https://dev.finmars.com'};

// app.use('/', proxy(proxyOptions));

app.listen(8080, function () {
    console.info('Server started at 8080 port');
});
