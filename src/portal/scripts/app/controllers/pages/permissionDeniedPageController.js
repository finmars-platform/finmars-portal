/**
 * Created by szhitenev on 28.10.2024
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        $scope.$emit('initialLoadComplete'); // for turning off initial loader

        $scope.previousUrl = localStorage.getItem("previousUrl");

        const rawErrorMessage = localStorage.getItem("errorMessage") || "You do not have permission to access this page.";

        $scope.errorMessage = rawErrorMessage
            .replace(/User: (.*?) is not authorized/, 'User: <b>$1</b> is not authorized')
            .replace(/perform: (.*?) on resource:/, 'perform: <b>$1</b> on resource:')
            .replace(/resource: (.*?) because/, 'resource: <b>$1</b> because')
            .replace(/allows the '(.*?)' action/, "allows the '<b>$1</b>' action");


        $scope.goBack = function () {
            // Navigate back to the previous URL, if available
            if ($scope.previousUrl) {
                window.location.href = $scope.previousUrl
            } else {
                $location.path("/"); // Default to home if no previous URL
            }
        };


        $scope.goHome = function () {
            // Navigate back to the previous URL, if available

            const root = window.location.href.split('/a/#!')[0]
            window.location.href = root + "/a/#!/"

        };

        $scope.goProfile = function () {
            // Navigate back to the previous URL, if available

            window.location.href = window.location.origin + "/v/profile"

        };


    };

}());