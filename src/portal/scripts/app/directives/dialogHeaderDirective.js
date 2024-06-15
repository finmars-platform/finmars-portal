'use strict';

export default function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            tooltip: '@',
            processing: '=',
            cancelDialog: '&',
        },
        templateUrl: 'views/directives/dialog-header-view.html',
        link: function (scope, elem, attrs) {



        }
    }
}
