(function () {

    "use strict";

    const stringHelper = require('../../helpers/stringHelper');
    const metaHelper = require('../../helpers/meta.helper');

    module.exports = function () {
        return {
            restrict: "E",
            scope: {
                label: "@",
                placeholderText: "@",
                indicatorButtonIcon: "@",
                model: "=",
                isDisabled: "=",
                onChangeCallback: "&?",
                onBlurCallback: "&?",
                onIndicatorButtonClick: "&?",
            },
            templateUrl: "views/directives/customInputs/base-input-view.html",
            link: function (scope, elem, attr) {

                scope.indicatorBtn = {
                    value: scope.indicatorButtonIcon || 'edit'
                }

                scope.inputValue = {
                    value: ''
                }

                scope.onIndBtnClick = function () {
                    if (scope.onIndicatorButtonClick) {
                        scope.onIndicatorButtonClick();
                    }
                }

            }
        }
    }

}());