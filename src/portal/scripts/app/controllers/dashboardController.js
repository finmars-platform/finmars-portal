/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');

    module.exports = function ($scope) {
        logService.controller('DashboardController', 'initialized');
    }

}());