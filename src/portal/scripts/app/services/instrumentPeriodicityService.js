/**
 * Created by szhitenev on 26.08.2016.
 */
(function () {

    'use strict';

    var instrumentPeriodicityRepository = require('../repositories/instrumentPeriodicityRepository');

    var getList = function (options) {
        return instrumentPeriodicityRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }

}());