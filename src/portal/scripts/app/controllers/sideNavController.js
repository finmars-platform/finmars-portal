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

        vm.sideNavStatus = 'expand';

        vm.resizeSideNav = function (status) {
            vm.sideNavStatus = status;
            if (status == 'expand') {
                $('body').removeClass('sidenav-collapsed');
                $('body').addClass('sidenav-expanded');
                $('.sidenav-wrapper').unbind('mouseenter');
                $('.sidenav-wrapper').unbind('mouseleave');
                $(window).trigger('resize');
            } else {

                $('body').removeClass('sidenav-expanded');
                $('body').addClass('sidenav-collapsed');

                $('.sidenav-wrapper').bind('mouseenter', function () {
                    $('.sidenav-wrapper').width(200);
                    $('.menu-toggle-list').show();
                });

                setTimeout(function () {
                    $('.sidenav-wrapper').width(55);
                }, 0);
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 300);

                $('.sidenav-wrapper').bind('mouseleave', function () {
                    $('.sidenav-wrapper').width(55);
                    $('.menu-toggle-list').hide();
                });


            }


        };

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
        vm.toggleOpen = function toggleOpen(event, section) {
            vm.openedSection = (vm.openedSection === section ? null : section);
        };
        vm.autoFocusContent = false;
    }

}());