'use strict';

import baseUrlService from "../../services/baseUrlService";
import logService from '../../../../../core/services/logService';

// var baseUrlService = require('../../services/baseUrlService');

export default function ($scope, $mdDialog, data) {

    var vm = this;

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    vm.data = data;

    vm.baseUrl = 'https://finmars.com/portal/help/';

    vm.helpPage = vm.baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'index.html';

    if (vm.data.helpPageUrl) {
        vm.helpPage = vm.baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + vm.data.helpPageUrl;
    }

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};