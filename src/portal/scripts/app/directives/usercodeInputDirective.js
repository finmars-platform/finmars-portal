/**
 * Created by szhitenev on 19.03.2021.
 */
(function () {

    'use strict';

    const metaHelper = require("../helpers/meta.helper");
    const utilsHelper = require("../helpers/utils.helper");

    module.exports = function (configurationService, globalDataService) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/usercode-input-view.html',
            scope: {
                /* Exaple of object structor for item
                 * {
                 *      configuration_code: String,
                 *      content_type: String,
                 *      user_code: String, // 'configuration_code' + ':' + content_type + ':' + user_code_editable_string
                 * }
                 */
                item: '=', // legacy

                label: '@',
                configurationCode: '=',
                contentType: '<',
                userCode: '=',

                isDisabled: '=',
                error: '=',
                occupiedUserCodes: '<',
            },
            link: function (scope, elem, attrs) {

                scope.readyStatus = false;
                scope.configuration_code = {
                    value: null,
                };

                scope.userCodeLabel = scope.label || 'User code';

                scope.configuration_codes = [
                    {
                        id: scope.configuration_code.value,
                        name: scope.configuration_code.value,
                    }
                ];

                scope.configSelEventSignal = {};

                scope.usercodeEnd = {
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

                scope.selSmallOpts = {
                    noIndicatorBtn: true,
                    popupWidth: 'content',
                    popupMinWidth: 'element',
                }

                scope.uciSmallOpts = {
                    noIndicatorBtn: true,
                    tooltipText: 'Allowed symbols: Numbers: 0-9, Letters: a-z (lowercase) Special Symbols: _, - (underscore, dash)'
                }

                const assembleUserCode = function (userCodeEnd) {

                    let userCode = scope.configuration_code.value + ':';

                    const contentType = scope.item ? scope.item.content_type : scope.contentType;

                    if (contentType) {
                        userCode = userCode + contentType + ':';
                    }

                    return userCode + userCodeEnd;

                }

                scope.updateUserCode = function (usercodeEnd, configuration_code) {

                    console.log('scope.configuration_code', scope.configuration_code.value);
                    console.log('scope.usercodeEnd', scope.usercodeEnd);

                    scope.usercodeEnd.value = usercodeEnd
                    scope.configuration_code.value = configuration_code

                    if (scope.usercodeEnd.value) {
                        convertedUserCode = replaceSpecialCharsAndSpaces(scope.usercodeEnd.value).toLowerCase();
                    }

                    // scope.item.user_code = assembleUserCode(usercode);
                    if (scope.item) {
                        scope.item.user_code = assembleUserCode(convertedUserCode);
                        scope.item.configuration_code = scope.configuration_code.value;

                    }
                    else {

                        scope.userCode = assembleUserCode(convertedUserCode);

                        scope.configurationCode = scope.configuration_code.value;
                        // if (typeof scope.configurationCode === 'string') {
                        //     scope.configurationCode = scope.configuration_code.value;
                        // }

                    }


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

                    if (Array.isArray(scope.occupiedUserCodes) &&
                        scope.occupiedUserCodes.includes(userCode)) {

                        scope.errorData.value = 'User code should be unique.';

                    }

                    setErrorDescriptionD(scope.errorData.value);

                }

                scope.onUserCodeChange = function (usercodeEnd, configuration_code) {

                    scope.validateUserCode(usercodeEnd);

                    scope.updateUserCode(usercodeEnd, configuration_code);

                }

                const parseUserCode = function () {

                    const uc = scope.item ? scope.item.user_code : scope.userCode;

                    if (!uc) {
                        return;
                    }

                    if (typeof uc !== 'string') {
                        throw new Error(`Expected 'string' as user_code, got: ${typeof uc}`)
                    }

                    const parts = uc.split(':');

                    switch (parts.length) {

                        case 1:
                            scope.usercodeEnd.value = parts[0];
                            break;

                        case 2:
                            scope.configuration_code.value = parts[0]
                            scope.usercodeEnd.value = parts[1];
                            break;

                        case 3:
                            scope.configuration_code.value = parts[0]
                            scope.usercodeEnd.value = parts[2];
                            break;
                    }

                }

                const init = function () {

                    parseUserCode();

                    // show selector of config codes empty in case of deprecated or invalid configurationCode
                    if (!scope.configuration_code.value) {
                        scope.configSelEventSignal.key = 'error';
                        scope.configSelEventSignal.error = "Invalid configuration code";
                    }

                    configurationService.getList().then(function (data) {

                        scope.configuration_codes = data.results.filter(function (item) {
                            return !item.is_package; // TODO Move to backend filtering someday
                        }).map(function (item) {
                            return {
                                id: item.configuration_code,
                                name: item.configuration_code,
                            }
                        });

                        scope.readyStatus = true;

                        scope.$apply();

                    })

                }

                init();


            }
        };
    }

}());