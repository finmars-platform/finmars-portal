"use strict";

import directivesEvents from "../../services/events/directivesEvents";
import directivesEvent from "../../services/events/directivesEvents";

export default function () {

    const EventService = require("../../services/eventService");
	const directivesEvents = require("../../services/events/directivesEvents");
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

            eventService: "=",
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
				scope.biEventObj = {
					event: {}
				};

			},
			post: function (scope, elem, attrs) {

				scope.popupClasses = scope.popupClasses || '';
				console.log("testing12 multiinput popupData", scope.popupData);

				let currentVts = scope.popupData.fields.valueToShow.value;
				console.log("testing12 multiinput currentVts", currentVts);
				scope.openPopup = function () {

					// have to use property 'errorData' because custom inputs reset property 'event' after turning on error mode
					Object.keys(scope.popupData.fields).forEach(prop => {

						const fieldData = scope.popupData.fields[prop];

						if (fieldData.errorData) {
							fieldData.event = {...{}, ...fieldData.errorData};
						}

					});

					scope.popupData.fields;
					console.log("testing1 multiinput openPopup", scope.popupData);
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
					console.log("testing1 multiinput onPopupCancelCallback", scope.popupData);
					if (scope.onPopupCancel) {
						scope.onPopupCancel();
					}

				};

				scope.onInputChange = function () {

					console.log("testing1 onInputChange", scope.inputModel.value);
					Object.keys(scope.popupData.fields).forEach(prop => {

						const fieldData = scope.popupData.fields[prop];

						if (fieldData.changeByInput) {

							fieldData.value = scope.inputModel.value;

						}

					});

				};

				const init = function () {
					scope.inputModel.value = getVal();
					console.log("testing1 valueToShow value", scope.inputModel.value);
					if (scope.eventService) {

						scope.eventService.addEventListener(directivesEvents.TURN_ON_ERROR_MODE, function () {
							scope.biEventObj.event = {key: "error", error: "There are fields with errors inside"};
						});

						scope.eventService.addEventListener(directivesEvents.TURN_OFF_ERROR_MODE, function () {
							scope.biEventObj.event = {key: "reset"};
						});

					}

				};

				init();

			}
		}
    }

};