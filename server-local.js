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

app.use(function noCacheForRoot(req, res, next) {
    if (req.url === '/') {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
    }
    next();
});



app.use(express.static(path.join(__dirname, 'dist')));



app.use('/space00000/a', express.static('dist'));


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


app.get('/', (request, response) => {
    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache');
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, function () {
    console.info('Server started at '+port+' port');
});
