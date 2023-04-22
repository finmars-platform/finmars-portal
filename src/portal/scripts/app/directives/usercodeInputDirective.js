/**
 * Created by szhitenev on 19.03.2021.
 */
(function () {

    'use strict';

    var configurationService = require('../services/configurationService');


    module.exports = function ($mdDialog, usersService) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/usercode-input-view.html',
            scope: {
                item: '=',
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                scope.configuration_code = 'com.finmars.local';
                scope.usercode = '';
                scope.convertedUserCode = '';

                scope.updateUserCode = function (usercode, configuration_code) {

                    console.log('scope.configuration_code', scope.configuration_code);
                    console.log('scope.usercode', scope.usercode);

                    scope.usercode = usercode
                    scope.configuration_code = configuration_code

                    if (scope.usercode) {
                        scope.convertedUserCode = replaceSpecialCharsAndSpaces(scope.usercode).toLowerCase();
                    }

                    if (scope.item.content_type) {
                        scope.item.user_code = scope.configuration_code + ':' + scope.item.content_type + ':' + scope.convertedUserCode;
                    } else {
                        scope.item.user_code = scope.configuration_code + ':' + scope.convertedUserCode;
                    }

                    scope.item.configuration_code = scope.configuration_code;


                }

                function replaceSpecialCharsAndSpaces(str) {
                    return str.replace(/[^A-Za-z0-9]+/g, '_');
                }


                scope.init = function () {

                    configurationService.getList().then(function (data) {

                        scope.configuration_codes = data.results.filter(function (item) {
                            return !item.is_package; // TODO Move to backend filtering someday
                        }).map(function (item) {
                            return item.configuration_code
                        });

                        scope.$apply();

                    })

                }

                scope.init();


            }
        };
    }

}());