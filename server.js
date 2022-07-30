/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
var path = require('path');
var url = require('url');
var proxy = require('proxy-middleware');
var app = express();

var port = process.env.PORT || 8080;


app.use('/build/:uid/*', function(req, res, next) {

    console.info(req.originalUrl);

    var uid = req.params.uid;

    path = req.params[0] ? req.params[0] : 'index.html';

    res.sendFile(path, {root: './dist'});

});


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


app.use(express.static(path.join(__dirname, 'dist')));

app.use(function noCacheForRoot(req, res, next) {
    if (req.url === '/') {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
    }
    next();
});

// WARNING ONLY FOR DEV PURPOSE
// var pdfProxyOptions = url.parse('http://0.0.0.0:80');
//
// app.use('/services/pdf', proxy(pdfProxyOptions));

// var proxyOptions = url.parse('https://dev.finmars.com');


// proxyOptions.cookieRewrite = true;
// proxyOptions.headers = {Referer: 'https://dev.finmars.com'};

// app.use('/', proxy(proxyOptions));

app.listen(port, function () {
    console.info('Server started at '+port+' port');
});
