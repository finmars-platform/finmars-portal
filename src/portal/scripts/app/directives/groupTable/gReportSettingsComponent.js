'use strict';

export default function() {
    return {
        restrict: 'AE',
        templateUrl: 'views/directives/groupTable/report-settings-view.html',
        link: function(scope, elem, attrs) {
            console.log('Report settings component');
        }
    }
};