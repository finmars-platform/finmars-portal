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

var proxyOptions = url.parse('https://dev.finmars.com');


proxyOptions.cookieRewrite = true;
proxyOptions.headers = {Referer: 'https://dev.finmars.com'};

app.use('/', proxy(proxyOptions));

app.listen(8080, function () {
    console.info('Express server with proxy start at 8080 port');
});
