(function () {
    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                item: '=',
                itemName: '@',
                selectorOptions: '=',
                idProp: '@',
                nameProp: '@',
                smallOptions: '='
            },
            templateUrl: 'views/directives/customInputs/entity-search-select-view.html',
            link: function (scope, elem, attr) {

                // TIPS
                // scope.smallOptions probable properties
                // tooltipText: custom tolltip text
                // notNull: turn on error mode if field is not filled

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }
                }

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.error) {
                        classes = 'custom-input-error';

                    } else if (stylePreset) {
                        classes = 'custom-input-preset' + stylePreset;

                    } else if (scope.valueIsValid) {
                        classes = 'custom-input-is-valid';

                    }

                    return classes;
                };

            }
        }

    }

}());