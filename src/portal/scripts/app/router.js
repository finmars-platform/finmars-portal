/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('app', {
            url: '',
            templateUrl: 'views/shell-view.html',
            controller: 'ShellController as vm'
        }).state('app.notifications', {
            url: '/notifications',
            templateUrl: 'views/notifications-view.html',
            controller: 'NotificationsController as vm'
        }).state('app.attributesManager', {
            url: '/attributes/:entityType',
            templateUrl: 'views/attributes-manager-view.html',
            controller: 'AttributesManagerController as vm'
        });

        $stateProvider.state('app.dashboard', {
            url: '/',
            templateUrl: 'views/dashboard-view.html',
            controller: 'DashboardController as vm'
        });

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
            .state('app.data.account', {
                url: '/accounts',
                templateUrl: 'views/data/data-account-view.html',
                controller: 'DataAccountController as vm'
            })
            .state('app.data.counterparty', {
                url: '/counterparties',
                templateUrl: 'views/data/data-counterparty-view.html',
                controller: 'DataCounterpartyController as vm'
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
            .state('app.data.transaction', {
                url: '/transactions',
                templateUrl: 'views/data/data-transaction-view.html',
                controller: 'DataTransactionController as vm'
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
            .state('app.data.pricing', {
                url: '/pricing',
                templateUrl: 'views/data/data-pricing-view.html',
                controller: 'DataPortfolioController as vm'
            });

        $stateProvider.state('app.data-constructor', {
            url: '/layout/:entityType',
            templateUrl: 'views/entity-data-constructor-view.html',
            controller: 'EntityDataConstructorController as vm'
        });

        $urlRouterProvider.otherwise('/');

    }


}());