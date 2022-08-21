"use strict";

import directivesEvent from "../../services/events/directivesEvents";

export default function () {

	const EventService = require("../../services/eventService");
	const directivesEvent = require("../../services/events/directivesEvents");

	return {
		restrict: "E",
		scope: {
			label: "@",
			placeholderText: "@",

			entityType: "@",
			/*entityName: "=",
			userCode: "=",
			shortName: "=",
			publicName: "=",
			valueToShow: "=",*/
			entity: "=",
			valueToShow: "=",
			eventService: "=",

			isDisabled: "=",

			onChange: "&?",
			onValueToShowChange: "&?",
		},
		template: `<div>
			<multiinput-field label="{{label}}"
							  placeholder-text="{{placeholderText}}"
							  indicator-button-icon="new_label"
							  popup-template-url="'views/popups/entity-names-popup-view.html'"
							  popup-data="popupData"
							  popup-classes="entity-names-popup"
							  event-service="multiinputFieldEventService"
							  is-disabled="isDisabled"
							  on-popup-cancel="onPopupCancel()"></multiinput-field>
		</div>`,
		link: {
			pre: function (scope, elem, attr) {

				scope.valueToShow = scope.valueToShow || 'name';

				scope.onPopupCancel = function () {

					let noInvalidFields = true;

					// const noInvalidFields = Object.keys(scope.popupData.fields).find(prop => !!scope.popupData.fields[prop].errorData);
					Object.keys(scope.popupData.fields).forEach(prop => {

						const fieldData = scope.popupData.fields[prop];

						if (fieldData.errorData) {

							if (fieldData.value) {
								fieldData.errorData = null;

							} else {
								noInvalidFields = false;
							}

						}

					});

					if (noInvalidFields) {
						scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_OFF_ERROR_MODE);
					}

				};

				const getErrorData = function (value) {

					let result = {
						key: "error",
						error: "Field should not be empty."
					};

					if (value) result = null;

					if (!result) {

						const noInvalidFields = Object.keys(scope.popupData.fields).find(prop => !!scope.popupData.fields[prop].errorData);

						if (noInvalidFields) {
							scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_OFF_ERROR_MODE);
						}

					}


					return result;

				};
				console.log("testing1 entityNamesField entity", scope.entity);
				scope.popupData = {
					fields: {
						name: {
							set value(name) {

								scope.entity.name = name;

								this.errorData = getErrorData(scope.entity.name);

								if (scope.onChange) scope.onChange();

							},
							get value() {
								return scope.entity.name;
							},

							event: {},
							changeByInput: true,
						},
						short_name: {
							set value(shortName) {

								scope.entity.short_name = shortName;
								if (scope.onChange) scope.onChange();

							},
							get value() {
								return scope.entity.short_name;
							},
							changeByInput: true
						},
						user_code: {
							set value(userCode) {

								scope.entity.user_code = userCode;

								if (scope.entityType !== 'instrument') {
									this.errorData = getErrorData(scope.entity.user_code);
								}

								if (scope.onChange) scope.onChange();

							},
							get value() {
								return scope.entity.user_code;
							},
							invalid: false,
							event: {},
							changeByInput: true
						},

						valueToShow: {
							set value(valueToShow) {

								const changed = scope.valueToShow !== valueToShow;

								scope.valueToShow = valueToShow;
								console.log("testing1 entityNameField valueToShow", changed, scope.onValueToShowChange);
								if (changed && scope.onValueToShowChange) {
									console.log("testing1 entityNameField valueToShow call onValueToShowChange");
									setTimeout(function() {
										scope.onValueToShowChange();
									}, 100);

								}

							},
							get value() {
								return scope.valueToShow || 'name';
							},

							options: [
								{id: 'name', name: 'Name'},
								{id: 'short_name', name: 'Short Name'},
								{id: 'user_code', name: 'User Code'},
							]
						}
					},

				}
				console.log("testing12 entityNameField vts value", scope.popupData.fields.valueToShow.value);

				const placeholdersForNames = {
					'name': 'Report Name (Name)',
					'public_name': 'Name if Hidden (Public Name)',
					'short_name': 'System Name (Short Name)',
					'user_code': 'Unique Code (User Code)',
				};

				if (scope.entityType !== 'currency') {

					scope.popupData.fields.public_name = {
						set value(publicName) {
							scope.entity.public_name = publicName;
						},
						get value() {
							return scope.entity.public_name;
						},
						changeByInput: true,
					};

					scope.popupData.fields.valueToShow.options.splice(1, 0, {id: 'public_name', name: 'Public Name'});

				}

				if (scope.placeholderText === undefined) {
					scope.placeholderText = placeholdersForNames[scope.valueToShow];
				}

				scope.multiinputFieldEventService = new EventService();

			},
			post: function (scope, elem, attrs) {
				console.log("testing1 entityNamesField eventService", scope.eventService);
				if (scope.eventService) {

					scope.eventService.addEventListener(directivesEvent.TURN_ON_ERROR_MODE, function (argumentsObj) {
						console.log("testing1 entityNamesField TURN_ON_ERROR_MODE argumentsObj", argumentsObj);
						if (argumentsObj) {

							for (const prop in argumentsObj) {
								scope.popupData.fields[prop].errorData = argumentsObj[prop];
								// scope.popupData.fields[prop].event = argumentsObj[prop];
							}

						}
						console.log("testing1 entityNamesField TURN_ON_ERROR_MODE scope.popupData.fields", scope.popupData.fields);
						scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_ON_ERROR_MODE);

					});

				}

			}
		}
	}

}