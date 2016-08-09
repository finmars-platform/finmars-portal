/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    var metaService = require('../services/metaService');

    module.exports = function ($scope) {

        logService.controller('SideNavController', 'initialized');

        var vm = this;
        vm.sections = [];

        metaService.getMenu().then(function (data) {
            vm.sections = data;
            //console.log('vm.sections', vm.sections);
            $scope.$apply();
        });

        vm.isOpen = function isOpen(section) {
            //console.log('section', section);
            var isParent = false;
            if (vm.openedSection && section.hasOwnProperty("pages")) {
                section.pages.forEach(function (item) {
                    if (item.title === vm.openedSection.title) {
                        isParent = true;
                    }
                })
            }
            if (isParent) {
                return true;
            } else {
                return vm.openedSection === section;
            }
            //return true;
        };
        vm.toggleOpen = function toggleOpen(section) {
            vm.openedSection = (vm.openedSection === section ? null : section);
        };
        vm.autoFocusContent = false;
    }

}());