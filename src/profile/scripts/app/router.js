/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider) {

        $stateProvider.state('app.profile', {
            url: '/profile',
            templateUrl: 'views/profile-shell-view.html',
            // abstract: true,
            controller: 'ProfileController as vm'

        });

        $stateProvider.state('app.new-database', {
            url: '/new-database',
            templateUrl: 'views/new-database-view.html',
            // abstract: true,
            controller: 'NewDatabaseController as vm'

        })

    }


}());