/**
 * Created by szhitenev on 08.06.2016.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    var logService = require('../../../../../core/services/logService');
	// var baseUrlService = require('../../services/baseUrlService');

    module.exports = function ($scope, $mdDialog, data) {

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
    }

}());