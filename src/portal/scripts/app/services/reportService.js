/**
 * Created by szhitenev on 16.11.2016.
 */
(function () {

    'use strict';

    var reportRepository = require('../repositories/reportRepository');

    var getList = function (options) {
        return reportRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }

}());