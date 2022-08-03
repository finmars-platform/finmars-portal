(function () {
    'use strict'

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                menuOptions: '=',
                isDisabled: '=',
                onChangeCallback: '&?',
            },
            template: `<div class="dropdown-select-2">
                    <dropdown-select model="model"
                                     menu-options="menuOptions"
                                     small-options="{noIndicatorBtn: true}"
                                     is-disabled="isDisabled"
                                     on-change-callback="onChangeCallback()"></dropdown-select>
            
                    <span class="material-icons sel-2-icon selIcon">arrow_drop_down</span>
            </div>`,
            link: function (scope, elem, attr) {

                let dropdownSelectElem = elem[0].querySelector(".dropdownSelectInputContainer div[popup]");
                const selIconElem = elem[0].querySelector(".selIcon");

                // using addEventListener instead of ngClick to prevent $digest error
                selIconElem.addEventListener("click", function () {

                    if (!dropdownSelectElem) {
                        dropdownSelectElem = elem[0].querySelector(".dropdownSelectInputContainer div[popup]");
                    }

                    dropdownSelectElem.click();

                });

            }
        }
    }
}());