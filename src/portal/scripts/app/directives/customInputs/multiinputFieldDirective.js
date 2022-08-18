"use strict";

import EventService from "../../services/eventService";

export default function () {

    const EventService = require("../../services/eventService");
	const popupEvents = require("../../services/events/popupEvents");

    return {
        restrict: "E",
        scope: {
            label: "@",
            placeholderText: "@",
			indicatorButtonIcon: "@",

			popupTemplateUrl: "@",
			popupData: "=",
			popupClasses: "@",

            isDisabled: "=",

            onChange: "&?",
			onValueToShowChange: "&?",
            onBlurCallback: "&?",
            // onPopupSave: "&?",
            onPopupCancel: "&?",
        },
        templateUrl: "views/directives/customInputs/multiinput-field-view.html",
		link: {
			pre: function (scope, elem, attrs) {

				scope.inputModel = {
					value: ''
				}

				scope.popupEventService = new EventService();
				console.log("testing12 multiinput pre called");
			},
			post: function (scope, elem, attrs) {

				scope.popupClasses = scope.popupClasses || '';
				console.log("testing12 multiinput popupData", scope.popupData);

				let currentVts = scope.popupData.fields.valueToShow.value;
				console.log("testing12 multiinput currentVts", currentVts);
				scope.openPopup = function () {
					scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});
				};

				const getVal = function () {
					const fieldProp = scope.popupData.fields.valueToShow.value;
					console.log("testing12 multiinput getVal fieldProp", fieldProp);
					scope.inputModel.value = scope.popupData.fields[fieldProp].value;
					return scope.inputModel.value;
				};

				const checkVtsForChanges = function () {

					const vts = scope.popupData.fields.valueToShow.value;
					console.log("testing12 multiinput checkVtsForChanges", vts);
					if (currentVts !== vts && scope.onValueToShowChange) {
						scope.onValueToShowChange();
					}

					currentVts = vts;

				};

				/* scope.onPopupSaveCallback = function () {

					checkVtsForChanges();
					scope.inputModel.value = getVal();

					if (scope.onPopupSave) {
						scope.onPopupSave();
					}

				}; */

				scope.onPopupCancelCallback = function () {

					checkVtsForChanges();
					scope.inputModel.value = getVal();

					if (scope.onPopupCancel) {
						scope.onPopupCancel();
					}

				};

				scope.onInputChange = function () {

					console.log("testing1 onInputChange", scope.inputModel.value);
					for (const prop in scope.popupData.fields) {

						const fieldData = scope.popupData.fields[prop];

						if (fieldData.changeByInput) {

							fieldData.value = scope.inputModel.value;

						}

					}

				};

				const init = function () {
					scope.inputModel.value = getVal();
					console.log("testing1 valueToShow value", scope.inputModel.value);
				};

				init();

			}
		}
    }

};