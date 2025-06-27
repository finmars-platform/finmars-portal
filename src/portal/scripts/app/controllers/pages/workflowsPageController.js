/**
 * Created by szhitenev on 24.01.2023.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    // var baseUrlService = require('../../services/baseUrlService');
    var explorerService = require('../../services/explorerService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

    var baseUrl = baseUrlService.resolve();


    module.exports = function workflowsPageController($scope, $sce, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        vm.resolveWorkflowIframeUrl = function (){

            vm.iframeUrl = 'http://0.0.0.0:3004/realm00000/space00000/w/workflow'

            if (window.location.href.indexOf('finmars') !== -1 || window.location.protocol === 'https:') {
                vm.iframeUrl = window.location.protocol + '//' + window.location.host + '/' + baseUrlService.getMasterUserPrefix() + '/w/home'
            }

        }


        vm.init = function (){

            vm.resolveWorkflowIframeUrl();

        }

        vm.init();

    };

}());