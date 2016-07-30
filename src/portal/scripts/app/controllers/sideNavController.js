/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    var logService = require('../../../../core/services/logService');

    var metaService = require('../services/metaService');

    module.exports = function($scope){

        logService.controller('SideNavController', 'initialized');

        var vm = this;
        vm.sections = [];

        metaService.getMenu().then(function (data) {
            vm.sections = data;
            //console.log('vm.sections', vm.sections);
            $scope.$apply();
        });

        vm.isOpen = function isOpen(section) {
            return vm.openedSection === section;
        };
        vm.toggleOpen = function toggleOpen(section) {
            vm.openedSection = (vm.openedSection === section ? null : section);
        };
        vm.autoFocusContent = false;
    }

}());