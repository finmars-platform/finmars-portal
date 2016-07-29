/**
 * Created by sergey on 29.07.16.
 */
'use strict';

(function () {

    var app = angular.module('forum', []);

    app.config(['$stateProvider',  require('./app/router.js')]);

    app.run(function () {
        console.log('Forum initialized');
    });

}());