'use strict';

export default function (globalDataService) {
    return {
        restrict: 'E',
        scope: {
            showUsername: '@'
        },
        templateUrl: 'views/directives/user-profile-view.html',
        link: function (scope, elem) {

            if (scope.showUsername == undefined) { // probably nothing passed, then show by default
                scope.showUsername = true
            }


            scope.user = globalDataService.getUser();
            

        }
    }
};