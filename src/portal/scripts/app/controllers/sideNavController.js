/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;
        vm.sections = [];

        vm.sideNavStatus = 'expand';

        /* Old sidemenu */
        /*vm.resizeSideNav = function (status) {
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
                    $(".md-button.md-raised.side-nav-btn ").show();
                    $('.menu-toggle-list').show();
                });

                setTimeout(function () {
                    $('.sidenav-wrapper').width(55);
                }, 0);
                var interval = setInterval(function () {
                    $(window).trigger('resize');
                }, 50);

                setTimeout(function () {
                    clearInterval(interval)
                }, 300);

                $('.sidenav-wrapper').bind('mouseleave', function () {
                    $('.sidenav-wrapper').width(55);
                    $(".md-button.md-raised.side-nav-btn ").hide();
                    $('.menu-toggle-list').hide();
                });


            }


        };*/
        /* < Old sidemenu > */

        vm.resizeSideNav = function (status) {
            vm.sideNavStatus = status;
            if (status == 'expand') {

                $('body').removeClass('sidenav-collapsed');
                $('body').addClass('sidenav-expanded');

                $(window).trigger('resize');

            } else {

                $('body').removeClass('sidenav-expanded');
                $('body').addClass('sidenav-collapsed');

                $(window).trigger('resize');

            }

        };

        var sideMenuSettingsMenuOpened = false;
        vm.showSettingsSideMenu = function () {

            if (!sideMenuSettingsMenuOpened) {


                $('.side-menu-settings-menu').addClass('settings-menu-opened');
                $('.sidenav-settings-toggle-btn').addClass('settings-menu-opened');

                setTimeout(function () {
                    $('.side-menu-settings-menu').addClass('overflow-visible');
                }, 250);

            } else {

                $('.sidenav-settings-toggle-btn').removeClass('settings-menu-opened');
                $('.side-menu-settings-menu').removeClass('overflow-visible');
                $('.side-menu-settings-menu').removeClass('settings-menu-opened');

            }

            sideMenuSettingsMenuOpened = !sideMenuSettingsMenuOpened;
        };

        metaService.getMenu().then(function (data) {
            vm.sections = data;
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

        vm.openHelp = function ($event) {
            $mdDialog.show({
                controller: 'HelpDialogController as vm',
                templateUrl: 'views/dialogs/help-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {}
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            })
        }
    }

}());