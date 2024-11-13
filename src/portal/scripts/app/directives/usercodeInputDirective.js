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
                /* Exaple of object structor for item
                 * {
                 *      configuration_code: String,
                 *      content_type: String,
                 *      user_code: String, // 'configuration_code' + ':' + content_type + ':' + user_code_editable_string
                 * }
                 */
                item: '=', // legacy

                label: '@',
                contentType: '<',
                userCode: '=',

                isDisabled: '=',
                error: '=',
                occupiedUserCodes: '<',
                
                onConfigurationCodeChangeCallback: '&?'
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

                scope.onConfigCodeChange = function(changedValue) {

                    // scope.configurationCode = scope.configuration_code.value;
                    scope.configuration_code.value = changedValue.id;

                    if (scope.usercodeEnd.value) {
                        scope.updateUserCode(scope.usercodeEnd.value, scope.configuration_code.value);
                    }

                    if (scope.onConfigurationCodeChangeCallback) {
                        scope.onConfigurationCodeChangeCallback({changedValue: scope.configuration_code.value});
                    }

                }

                let ucTextInputElem = null;

                const assembleUserCode = function (userCodeEnd, configurationCode) {

                    let userCode = configurationCode + ':';

                    const contentType = scope.item ? scope.item.content_type : scope.contentType;

                    if (contentType) {
                        userCode = userCode + contentType + ':';
                    }

                    return userCode + userCodeEnd;

                }

                scope.updateUserCode = function (usercodeEnd) {

                    let convertedUserCode = '';
                    // scope.usercodeEnd.value = usercodeEnd

                    if (usercodeEnd) {
                        convertedUserCode = replaceSpecialCharsAndSpaces(usercodeEnd).toLowerCase();
                    }

                    scope.usercodeEnd.value = convertedUserCode;

                    if (!ucTextInputElem) {
                        ucTextInputElem = elem[0].querySelector(".userCodeEndInput .textInputElem");
                    }

                    ucTextInputElem.value = scope.usercodeEnd.value;

                    // scope.item.user_code = assembleUserCode(usercode);
                    if (scope.item) { // Legacy

                        if (usercodeEnd) {
                            scope.item.user_code = assembleUserCode(convertedUserCode, scope.configuration_code.value);

                        } else {
                            scope.item.user_code = null;
                        }

                        scope.item.configuration_code = scope.configuration_code.value;

                    }
                    else {

                        if (usercodeEnd) {
                            scope.userCode = assembleUserCode(convertedUserCode, scope.configuration_code.value);

                        } else {
                            scope.userCode = null;
                        }

                    }

                }

                function replaceSpecialCharsAndSpaces(str) {
                    return str.replace(/[^A-Za-z0-9]+/g, '_');
                }

                const setErrorDescriptionD = utilsHelper.debounce(function (description) {
                    scope.errorDescription = scope.errorData.value;
                    scope.$apply();
                }, 1000);

                const validateUserCode = function (userCodeVal) {

                    scope.errorData.value = metaHelper.validateTextForUserCode(userCodeVal, null, 'User code');

                    const userCode = assembleUserCode(userCodeVal, scope.configuration_code.value);

                    if (Array.isArray(scope.occupiedUserCodes) &&
                        scope.occupiedUserCodes.includes(userCode)) {

                        scope.errorData.value = 'User code should be unique.';

                    }

                    // setErrorDescriptionD(scope.errorData.value);
                    scope.errorDescription = scope.errorData.value;
                    scope.$apply();

                }

                scope.onUserCodeChangeD = utilsHelper.debounce(function (usercodeEnd, configuration_code) {

                    scope.updateUserCode(usercodeEnd, configuration_code);

                    // `scope.usercodeEnd.value` changed inside `scope.updateUserCode()`
                    validateUserCode(scope.usercodeEnd.value);

                }, 600);

                const parseUserCode = function () {

                    const uc = scope.item ? scope.item.user_code : scope.userCode;

                    if (!uc) {
                        return [scope.configuration_code.value, scope.usercodeEnd.value];
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

                    return [scope.configuration_code.value, scope.usercodeEnd.value];

                }

                const init = function () {

                    const ucParts = parseUserCode();

                    scope.configuration_code.value = ucParts[0];
                    scope.usercodeEnd.value = ucParts[1];

                    // show selector of config codes empty in case of deprecated or invalid configurationCode
                    if (!scope.configuration_code.value) {
                        scope.configSelEventSignal.key = 'error';
                        scope.configSelEventSignal.error = "Invalid configuration code";
                    }

                    configurationService.getList().then(function (data) {

                        scope.configuration_codes = data.results.filter(function (item) {
                            return !item.is_package; // TODO Use backend filter after release of the PLAT-514 task
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