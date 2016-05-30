/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('app', {
            url: '',
            templateUrl: 'views/shell-view.html',
            controller: 'ShellController as vm'
        });

        $stateProvider.state('app.dashboard', {
            url: '/',
            templateUrl: 'views/dashboard-view.html',
            controller: 'DashboardController as vm'
        });

        $stateProvider.state('app.administration', {
            url: '',
            abstract: true,
            template: '<div data-ui-view></div>'
        }).state('app.portfolio', {
            url: '/portfolio',
            templateUrl: 'views/administration/portfolio-view.html',
            controller: 'PortfolioController as vm'
        });

        $stateProvider.state('app.data-constructor', {
            url: '/layout/:entityName',
            templateUrl: 'views/entity-data-constructor-view.html',
            controller: 'EntityDataConstructorController as vm'
        });

        $urlRouterProvider.otherwise('/');

    }


}());