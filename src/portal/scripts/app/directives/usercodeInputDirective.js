/**
 * Created by szhitenev on 19.03.2021.
 */
(function () {

    'use strict';

    const metaHelper = require("../helpers/meta.helper");
    const utilsHelper = require("../helpers/utils.helper");

    module.exports = function (configurationService) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/usercode-input-view.html',
            scope: {
                item: '=',
                error: '=',
                occupiedUserCodes: '<',
            },
            link: function (scope, elem, attrs) {

                scope.configuration_code = {
                    value: 'com.finmars.local'
                };

                scope.usercode = {
                    value: ''
                };

                let convertedUserCode = '';

                let errorText = '';

                scope.errorData = {
                    get value() {
                        return errorText;
                    },
                    set value(errorString) {
                        errorText = errorString

                        if (scope.error !== undefined) {
                            scope.error = errorString
                        }
                    }

                }

                scope.errorDescription = '';

                const assembleUserCode = function (userCodeEnd) {

                    let userCode = scope.configuration_code.value + ':';

                    if (scope.item.content_type) {
                        userCode = userCode + scope.item.content_type + ':';
                    }

                    return userCode + userCodeEnd;

                }

                scope.updateUserCode = function (usercode, configuration_code) {

                    console.log('scope.configuration_code', scope.configuration_code.value);
                    console.log('scope.usercode', scope.usercode);

                    scope.usercode.value = usercode
                    scope.configuration_code.value = configuration_code

                    if (scope.usercode.value) {
                        convertedUserCode = replaceSpecialCharsAndSpaces(scope.usercode.value).toLowerCase();
                    }

                    // scope.item.user_code = assembleUserCode(usercode);
                    scope.item.user_code = assembleUserCode(convertedUserCode);

                    scope.item.configuration_code = scope.configuration_code.value;

                }

                function replaceSpecialCharsAndSpaces(str) {
                    return str.replace(/[^A-Za-z0-9]+/g, '_');
                }

                const setErrorDescriptionD = utilsHelper.debounce(function (description) {
                    scope.errorDescription = scope.errorData.value;
                    scope.$apply();
                }, 1000);

                scope.validateUserCode = function (userCodeVal) {

                    scope.errorData.value = metaHelper.validateTextForUserCode(userCodeVal, null, 'User code');

                    const userCode = assembleUserCode(userCodeVal);

                    if ( Array.isArray(scope.occupiedUserCodes) &&
                        scope.occupiedUserCodes.includes(userCode) ) {

                        scope.errorData.value = 'User code should be unique.';

                    }

                    setErrorDescriptionD( scope.errorData.value );

                }

                const parseUserCode = function () {

                    if (!scope.item.user_code) {
                        return;
                    }

                    const parts = scope.item.user_code.split(':');

                    switch ( parts.length ) {

                        case 1:
                            scope.usercode.value = parts[0];
                            break;

                        case 2:
                            scope.configuration_code.value = parts[0]
                            scope.usercode.value = parts[1];
                            break;

                        case 3:
                            scope.configuration_code.value = parts[0]
                            scope.usercode.value = parts[2];
                            break;
                    }

                }

                const init = function () {

                    configurationService.getList().then(function (data) {

                        scope.configuration_codes = data.results.filter(function (item) {
                            return !item.is_package; // TODO Move to backend filtering someday
                        }).map(function (item) {
                            return item.configuration_code
                        });

                        parseUserCode();

                        scope.$apply();

                    })

                }

                init();


            }
        };
    }

}());