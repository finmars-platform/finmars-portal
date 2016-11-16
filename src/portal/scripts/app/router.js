/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('app', {
            url: '',
            templateUrl: 'views/shell-view.html',
            controller: 'ShellController as vm'
        }).state('app.attributesManager', {
            url: '/attributes/:entityType',
            templateUrl: 'views/attributes-manager-view.html',
            controller: 'AttributesManagerController as vm',
            params: {
                prevState: ''
            }
        });

        $stateProvider.state('app.dashboard', {
            url: '/',
            templateUrl: 'views/dashboard-view.html',
            controller: 'DashboardController as vm'
        });

        $stateProvider.state('app.actions', {
            url: '/actions',
            templateUrl: 'views/actions-view.html',
            controller: 'ActionsController as vm'
        });

        $stateProvider.state('app.data-constructor', {
            url: '/layout/:entityType/:instanceId',
            params: {
                instanceId: null
            },
            templateUrl: 'views/entity-data-constructor-view.html',
            controller: 'EntityDataConstructorController as vm'
        });

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app.data', {
                url: '/data',
                abstract: true,
                template: '<div data-ui-view></div>'
            })
            .state('app.data.portfolio', {
                url: '/portfolios',
                templateUrl: 'views/data/data-portfolio-view.html',
                controller: 'DataPortfolioController as vm'
            })
            .state('app.data.tag', {
                url: '/tags',
                templateUrl: 'views/data/data-tag-view.html',
                controller: 'DataTagController as vm'
            })
            .state('app.data.account', {
                url: '/accounts',
                templateUrl: 'views/data/data-account-view.html',
                controller: 'DataAccountController as vm'
            })
            .state('app.data.account-type', {
                url: '/account-types',
                templateUrl: 'views/data/data-account-type-view.html',
                controller: 'DataAccountTypeController as vm'
            })
            .state('app.data.counterparty-group', {
                url: '/counterparty-group',
                templateUrl: 'views/data/data-counterparty-group-view.html',
                controller: 'DataCounterpartyGroupController as vm'
            })
            .state('app.data.counterparty', {
                url: '/counterparties',
                templateUrl: 'views/data/data-counterparty-view.html',
                controller: 'DataCounterpartyController as vm'
            })
            .state('app.data.responsible-group', {
                url: '/responsible-group',
                templateUrl: 'views/data/data-responsible-group-view.html',
                controller: 'DataResponsibleGroupController as vm'
            })
            .state('app.data.responsible', {
                url: '/responsibles',
                templateUrl: 'views/data/data-responsible-view.html',
                controller: 'DataResponsibleController as vm'
            })
            .state('app.data.instrument', {
                url: '/instruments',
                templateUrl: 'views/data/data-instrument-view.html',
                controller: 'DataInstrumentController as vm'
            })
            .state('app.data.instrument-type', {
                url: '/instrument-types',
                templateUrl: 'views/data/data-instrument-type-view.html',
                controller: 'DataInstrumentTypeController as vm'
            })
            .state('app.data.pricing-policy', {
                url: '/pricing-policy',
                templateUrl: 'views/data/data-pricing-policy-view.html',
                controller: 'DataPricingPolicyController as vm'
            })
            .state('app.data.complex-transaction', {
                url: '/complex-transactions',
                templateUrl: 'views/data/data-complex-transaction-view.html',
                controller: 'DataComplexTransactionController as vm'
            })
            .state('app.data.transaction', {
                url: '/transactions',
                templateUrl: 'views/data/data-transaction-view.html',
                controller: 'DataTransactionController as vm'
            })
            .state('app.data.transaction-type', {
                url: '/transaction-types',
                templateUrl: 'views/data/data-transaction-type-view.html',
                controller: 'DataTransactionTypeController as vm'
            })
            .state('app.data.transaction-type-group', {
                url: '/transaction-type-group',
                templateUrl: 'views/data/data-transaction-type-group-view.html',
                controller: 'DataTransactionTypeGroupController as vm'
            })
            .state('app.data.currency-history', {
                url: '/currencies',
                templateUrl: 'views/data/data-currency-history-view.html',
                controller: 'DataCurrencyHistoryController as vm'
            })
            .state('app.data.price-history', {
                url: '/pricing',
                templateUrl: 'views/data/data-price-history-view.html',
                controller: 'DataPriceHistoryController as vm'
            })
            //.state('app.data.pricing', {
            //    url: '/pricing',
            //    templateUrl: 'views/data/data-pricing-view.html',
            //    controller: 'DataPortfolioController as vm'
            //})
            .state('app.data.currency', {
                url: '/currency',
                templateUrl: 'views/data/data-currency-view.html',
                controller: 'DataCurrencyController as vm'
            })
            .state('app.data.strategy-group', {
                url: '/strategy/:strategyNumber/group',
                templateUrl: 'views/data/data-strategy-group-view.html',
                controller: 'DataStrategyGroupController as vm'
            })
            .state('app.data.strategy-subgroup', {
                url: '/strategy/:strategyNumber/subgroup',
                templateUrl: 'views/data/data-strategy-subgroup-view.html',
                controller: 'DataStrategySubgroupController as vm'
            })
            .state('app.data.strategy', {
                url: '/strategy/:strategyNumber',
                templateUrl: 'views/data/data-strategy-view.html',
                controller: 'DataStrategyController as vm'
            })
            .state('app.reports', {
                url: '/reports',
                abstract: true,
                template: '<div data-ui-view></div>'
            })
            .state('app.reports.balance-report', {
                url: '/balance',
                templateUrl: 'views/reports/reports-balance-view.html',
                controller: 'BalanceReportController as vm'
            })
            .state('app.reports.pnl-report', {
                url: '/profit-and-lost',
                templateUrl: 'views/reports/reports-profit-and-lost-view.html',
                controller: 'ProfitAndLostReportController as vm'
            })
            .state('app.settings', {
                abstract: true,
                url: '/settings',
                template: '<div data-ui-view></div>'
            })
            .state('app.settings.general', {
                abstract: true,
                url: '/general',
                templateUrl: 'views/settings/general-view.html',
                controller: 'SettingsGeneralController as vm'
            })
            .state('app.settings.general.profile', {
                url: '/profile',
                views: {
                    profile: {
                        templateUrl: 'views/settings/profile-settings-view.html',
                        controller: 'SettingsGeneralProfileController as vm'
                    }
                }
            })
            .state('app.settings.general.data-providers', {
                url: '/data-providers',
                views: {
                    'data-providers': {
                        templateUrl: 'views/settings/data-providers-settings-view.html',
                        controller: 'SettingsGeneralDataProvidersController as vm'
                    }
                }
            })
            .state('app.settings.general.data-providers-config', {
                url: '/data-providers/:dataProviderId',
                views: {
                    'data-providers': {
                        templateUrl: 'views/settings/data-providers-config-settings-view.html',
                        controller: 'SettingsGeneralDataProvidersConfigController as vm'
                    }
                }
            })
            .state('app.settings.general.instrument-import', {
                url: '/instrument-import',
                views: {
                    'instrument-import': {
                        templateUrl: 'views/settings/instrument-import-settings-view.html',
                        controller: 'SettingsGeneralInstrumentImportController as vm'
                    }
                }
            })
            .state('app.settings.form-design', {
                url: '/form',
                templateUrl: 'views/settings/form-design-view.html',
                controller: 'SettingsFormDesignController as vm'
            })
            .state('app.settings.users-groups', {
                url: '/users-and-groups',
                templateUrl: 'views/settings/users-and-groups-view.html',
                controller: 'SettingsMembersAndGroupsController as vm'
            })
            .state('app.system', {
                abstract: true,
                url: '/system',
                template: '<div data-ui-view></div>'
            })
            .state('app.system.notifications', {
                url: '/notifications',
                templateUrl: 'views/system/notifications-view.html',
                controller: 'NotificationsController as vm'
            })
            .state('app.system.audit', {
                url: '/audit',
                templateUrl: 'views/system/audit-view.html',
                controller: 'AuditController as vm'
            });

    }


}());