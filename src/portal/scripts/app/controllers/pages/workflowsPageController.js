/**
 * Created by szhitenev on 24.01.2023.
 */
(function () {

    'use strict';

    var baseUrlService = require('../../services/baseUrlService');
    var explorerService = require('../../services/explorerService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function workflowsPageController($scope, $sce, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.iframeUrl = 'http://0.0.0.0:8001/'

        vm.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }


        vm.init = function (){



            if (window.location.href.indexOf('finmars') !== -1) {
                vm.iframeUrl = window.location.protocol + '//' + window.location.host + '/' + baseUrlService.getMasterUserPrefix() + '/workflows'
            }

        }

        vm.init();

    };

}());