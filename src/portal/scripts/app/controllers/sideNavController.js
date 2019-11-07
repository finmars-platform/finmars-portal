/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var usersService = require('../services/usersService');
    var uiService = require('../services/uiService');

    module.exports = function ($scope, $mdDialog, $transition) {

        var vm = this;
        vm.sections = [];

        vm.readyStatus = {
            access: false
        };

        vm.accessSectionTable = {
            history: true,
            journal: true,
            import: true,

            settings_data: true,
            settings_import_from_providers: true,
            settings_import_from_files: true,

            settings_administration: true

        };

        vm.accessTable = {

            data_portfolio: true,
            data_account: true,
            data_instrument: true,
            data_responsible: true,
            data_counterparty: true,
            data_currency: true,
            data_strategies: true,
            data_transaction: true,
            data_price_history: true,
            data_fx_history: true,
            data_simple_import: true,
            data_transaction_import: true,
            data_complex_import: true,
            data_instrument_download: true,
            data_prices_download: true,

            report_balance: true,
            report_pl: true,
            report_transaction: true,
            report_performance: true,
            report_cash_flow: true,
            report_dashboard: true,
            report_event: true,
            report_bookmark: true,
            report_instrument_audit: true,
            report_transaction_audit: true,
            report_base_transaction: true,
            report_activity_log: true,
            report_forum: true,

            configuration_account_type: true,
            configuration_instrument_type: true,
            configuration_transaction_type: true,
            configuration_pricing_policy: true,
            configuration_price_download_scheme: true,
            configuration_instrument_download_scheme: true,
            configuration_automated_price_downloads: true,
            configuration_simple_import_scheme: true,
            configuration_transaction_import_scheme: true,
            configuration_complex_import_scheme: true,
            configuration_mapping_tables: true,
            configuration_user_attributes: true,
            configuration_aliases: true,
            configuration_template: true,
            configuration_reference_table: true,

            settings_notification: true,
            settings_export_configuration: true,
            settings_import_configuration: true,
            settings_export_mapping: true,
            settings_import_mapping: true,
            settings_provider: true,
            settings_init_configuration: true,
            settings_users_groups_permission: true,
            settings_new_objects_permission: true,
            settings_timezone: true,
            settings_ecosystem_default: true,

            account_settings: true,
            account_personal_data: true,
            account_ecosystem_management: true

        };

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

                window.dispatchEvent(new Event('resize'));

            } else {

                $('body').removeClass('sidenav-expanded');
                $('body').addClass('sidenav-collapsed');

                window.dispatchEvent(new Event('resize'));

            }

        };

        var sideMenuSettingsMenuOpened = false;
        vm.toggleSettingsSideMenu = function () {

            if (!sideMenuSettingsMenuOpened) {

                $('.side-menu-settings-menu').addClass('settings-menu-opened');
                $('.sidenav-settings-toggle-btn').addClass('settings-menu-opened');

                setTimeout(function () {
                    $('.side-menu-settings-menu').addClass('overflow-visible');

                    window.addEventListener('click', vm.settingsSideMenuOnClickOutside);
                    window.addEventListener('contextmenu', vm.settingsSideMenuOnClickOutside);
                }, 250);

            } else {

                $('.sidenav-settings-toggle-btn').removeClass('settings-menu-opened');
                $('.side-menu-settings-menu').removeClass('overflow-visible');
                $('.side-menu-settings-menu').removeClass('settings-menu-opened');

                window.removeEventListener('click', vm.settingsSideMenuOnClickOutside);
                window.removeEventListener('contextmenu', vm.settingsSideMenuOnClickOutside);

            }

            sideMenuSettingsMenuOpened = !sideMenuSettingsMenuOpened;
        };

        vm.settingsSideMenuOnClickOutside = function (event) {

            var clickedOutside = true;
            var elem = event.target;

            for (var i = 0; i < 15; i++) {

                if (elem.classList.contains('side-menu-settings-menu')) {
                    clickedOutside = false;
                    break;
                } else if (elem.tagName === 'BODY') {
                    break;
                } else {
                    elem = elem.parentNode;
                }

            }

            if (clickedOutside) {
                vm.toggleSettingsSideMenu();
            }

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

        $transition.onExit({}, function () {

            if (sideMenuSettingsMenuOpened) {
                vm.toggleSettingsSideMenu();
            }

        });

        vm.syncInterfaceAccess = function () {

            Object.keys(vm.accessTable).forEach(function (key) {

                vm.accessTable[key] = false;

            });

            vm.interfaceAccess.forEach(function (item) {

                if (item.value <= vm.member.interface_level) {
                    vm.accessTable[item.system_code] = true;
                }


            });

            vm.accessSectionTable.history =
                vm.accessTable.data_transaction ||
                vm.accessTable.data_price_history ||
                vm.accessTable.data_fx_history;


            vm.accessSectionTable.journal =
                vm.accessTable.report_instrument_audit ||
                vm.accessTable.report_transaction_audit ||
                vm.accessTable.report_base_transaction;

            vm.accessSectionTable.import =
                vm.accessTable.data_simple_import ||
                vm.accessTable.data_transaction_import ||
                vm.accessTable.data_complex_import ||
                vm.accessTable.data_instrument_download ||
                vm.accessTable.data_prices_download ||
                vm.accessTable.configuration_mapping_tables;

            vm.accessSectionTable.settings_data =
                vm.accessTable.configuration_account_type ||
                vm.accessTable.configuration_instrument_type ||
                vm.accessTable.configuration_transaction_type ||
                vm.accessTable.configuration_pricing_policy ||
                vm.accessTable.configuration_user_attributes ||
                vm.accessTable.configuration_reference_table;

            vm.accessSectionTable.settings_import_from_providers =
                vm.accessTable.configuration_price_download_scheme ||
                vm.accessTable.configuration_instrument_download_scheme ||
                vm.accessTable.configuration_automated_price_downloads;

            vm.accessSectionTable.settings_import_from_files =
                vm.accessTable.configuration_simple_import_scheme ||
                vm.accessTable.configuration_transaction_import_scheme ||
                vm.accessTable.configuration_complex_import_scheme;



            vm.accessSectionTable.settings_administration =
                vm.accessTable.settings_provider ||
                vm.accessTable.settings_init_configuration ||
                vm.accessTable.settings_users_groups_permission ||
                vm.accessTable.settings_ecosystem_default

        };

        vm.getInterfaceAccess = function () {

            uiService.getPortalInterfaceAccess().then(function (data) {

                // console.log('vm.getInterfaceAccess', data);

                vm.interfaceAccess = data;

                vm.syncInterfaceAccess();

                vm.readyStatus.access = true;

                $scope.$apply();

            })

        };

        vm.getMember = function () {

            usersService.getOwnMemberSettings().then(function (data) {

                console.log('vm.getMember.data', data);

                vm.member = data.results[0];

                vm.getInterfaceAccess();

            })

        };

        vm.init = function () {

            vm.getMember();

        };

        vm.init();
    }

}());