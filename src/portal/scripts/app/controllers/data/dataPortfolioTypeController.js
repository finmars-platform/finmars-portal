'use strict';

import portfolioTypeService from '../../services/portfolioTypeService';

export default function ($scope) {

    var vm = this;

    vm.readyStatus = {content: false};

    vm.entityType = 'portfolio-type'; // deprecated
    vm.contentType = 'portfolios.portfoliotype';
    vm.entityRaw = [];

    vm.entityViewer = {extraFeatures: []};

    vm.getList = function (options) {
        return portfolioTypeService.getListLight(options).then(function (data) {
            return data;
        })
    };

    vm.init = function () {
        vm.readyStatus.content = true
    };

    vm.init()

};