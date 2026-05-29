'use strict';

import baseUrlService from "../../services/baseUrlService";

// var baseUrlService = require('../../services/baseUrlService');
import explorerService from '../../services/explorerService';

import downloadFileHelper from '../../helpers/downloadFileHelper';
import toastNotificationService from '../../../../../core/services/toastNotificationService';

var baseUrl = baseUrlService.resolve();


export default function workflowsPageController($scope, $sce, authorizerService, globalDataService, $mdDialog) {

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