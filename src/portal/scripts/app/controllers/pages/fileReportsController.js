'use strict';

import baseUrlService from "../../services/baseUrlService";
import fileReportsService from '../../services/fileReportsService';

// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();


export default function ($scope, $mdDialog) {


    var vm = this;

    vm.readyStatus = {content: false};


    vm.getData = function(){

        fileReportsService.getList().then(function (data) {

            vm.items = data.results;

            vm.readyStatus.content = true;

            console.log('vm.items', vm.items);

            $scope.$apply();


        })

    };

    vm.getFileUrl = function(item) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'file-reports/file-report/' + item.id + '/view/';

    };


    vm.init = function () {

        vm.getData();

    };

    vm.init();


};