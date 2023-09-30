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
var proxyApiHost = process.env.API_HOST || 'https://stage.finmars.com';
var proxyDatabaseId = process.env.DATABASE_ID || 'space00000';

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/portal', express.static('dist'));
app.use('/' + proxyDatabaseId + '/a', express.static('dist'));

var proxyOptions = url.parse(proxyApiHost);


proxyOptions.cookieRewrite = true;
proxyOptions.headers = {Referer: proxyApiHost};

app.use('/', proxy(proxyOptions));

app.listen(port, function () {
    console.info('Express server with proxy start at ' + port + ' port');
});
