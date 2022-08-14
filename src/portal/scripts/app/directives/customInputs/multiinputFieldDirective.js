"use strict";

import EventService from "../../services/eventService";

export default function () {

    const EventService = require("../../services/eventService");

    return {
        restrict: "E",
        scope: {
            label: "@",
            placeholderText: "@",
            popupTemplateUrl: "@",
            popupData: "=",
            isDisabled: "=",

            onChangeCallback: "&?",
            onBlurCallback: "&?",
            onPopupSave: "&?",
            onPopupCancel: "&?",
        },
        templateUrl: "views/directives/customInputs/multiinput-field-view.html",
        link: function (scope, elem, attr) {

            scope.popupData = {
                fields: {
                    name: {},
                    short_name: {},
                    user_code: {},
                    public_name: {},
                    showByDefault: {}
                }
            };

            scope.onPopupSaveCallback = function () {
                if (scope.onPopupSave) {
                    scope.onPopupSave();
                }
            }

            scope.onPopupCancelCallback = function () {
                if (scope.onPopupCancel) {
                    scope.onPopupCancel();
                }
            }

            const init = function () {
                scope.popupEventService = new EventService();
            };

            init();

        }
    }

};