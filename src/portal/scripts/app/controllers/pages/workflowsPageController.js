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

            vm.iframeUrl = 'http://0.0.0.0:8084/space00000/workflow/'

            if (window.location.href.indexOf('finmars') !== -1) {
                vm.iframeUrl = window.location.protocol + '//' + window.location.host + '/' + baseUrlService.getMasterUserPrefix() + '/workflow/'
            }

        }


        vm.init = function (){

            vm.resolveWorkflowIframeUrl();

        }

        vm.init();

    };

}());