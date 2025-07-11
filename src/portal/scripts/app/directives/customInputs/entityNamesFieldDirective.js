/**
 *
 * @param {String} userCode
 * @return {{configuration_code: string, userCodeEnd: string}}
 */
const splitUserCode = function (userCode) {

	let result = {
		configuration_code: "",
		userCodeEnd: "",
	}

	if (!userCode) {
		return result;
	}

	const parts = userCode.split(':');

	switch (parts.length) {

		case 1:
			result.userCodeEnd = parts[0];
			break;

		case 2:
			result.configuration_code = parts[0]
			result.userCodeEnd = parts[1];
			break;

		case 3:
			result.configuration_code = parts[0]
			result.userCodeEnd = parts[2];
			break;
	}

	return result;

}

const metaHelper = require("../../helpers/meta.helper");

export default function (metaContentTypesService, globalDataService) {

	const EventService = require("../../services/eventService");
	const metaService = require("../../services/metaService").default;
	const directivesEvent = require("../../services/events/directivesEvents");

	const utilsHelper = require("../../helpers/utils.helper");

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
			useUserCodeInput: "=", // boolean
			userCodeDisabled: "=", // boolean
			valueToShow: "=",
			eventService: "=",

			editing: "@",
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
							  base-input-change-fn="baseInputChange(newVal, prevVal)"
							  on-popup-cancel="onPopupCancel()"></multiinput-field>
		</div>`,
		link: {
			pre: function (scope, elem, attr) {

				scope.valueToShow = scope.valueToShow || 'name';
				scope.editingOn = scope.editing === 'true';
				const reqAttrs = metaService.getRequiredEntityAttrs(scope.entityType);
				const contentType = metaContentTypesService.findContentTypeByEntity(scope.entityType);
				const defConfigCode = globalDataService.getDefaultConfigurationCode();

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

				scope.onPopupCancel = function () {

					let noInvalidFields = true;

					// const noInvalidFields = Object.keys(scope.popupData.fields).find(prop => !!scope.popupData.fields[prop].errorData);
					Object.keys(scope.popupData.fields).forEach(prop => {

						const fieldData = scope.popupData.fields[prop];
						const fieldVal = fieldData.value;

						if (reqAttrs.includes(prop)) {

							if (fieldVal) {
								fieldData.errorData = null;

							} else {
								fieldData.errorData = getErrorData(fieldVal);
								noInvalidFields = false;
							}

						}

					});

					if (noInvalidFields) {
						scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_OFF_ERROR_MODE);

					} else {
						scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_ON_ERROR_MODE);
					}

				};
				console.log("testiong499.entityNamesField entity.user_code", scope.entity.user_code);
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

								if (scope.useUserCodeInput) {

									const ucParts = splitUserCode(userCode);

									if (userCode) {
										scope.entity.configuration_code = ucParts.configuration_code || defConfigCode;
									}

								}

								if ( reqAttrs.includes('user_code') ) {
									this.errorData = getErrorData(scope.entity.user_code);
								}

								if (scope.onChange) scope.onChange();

							},
							get value() {
								return scope.entity.user_code;
							},

							// configuration_code:
							isDisabled: !!scope.userCodeDisabled,

							smallOptions: {notNull: reqAttrs.includes('user_code')},
							event: {},
							changeByInput: true,
							locked: scope.editingOn ? 'true' : 'false',
						},

						valueToShow: {
							set value(valueToShow) {

								const changed = scope.valueToShow !== valueToShow;

								scope.valueToShow = valueToShow;

								if (changed && scope.onValueToShowChange) {

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
								// {id: 'user_code', name: 'User Code'},
							]
						}
					},
					get useUserCodeInput() { return scope.useUserCodeInput; },
				}

				const placeholdersForNames = {
					/*'name': 'Full Name (Name)',
					'public_name': 'Name if Hidden (Public Name)',
					'short_name': 'System Name (Short Name)',
					'user_code': 'Unique Code (User Code)',*/
					'name': 'Full Name',
					'public_name': 'Public Name',
					'short_name': 'Short Name',
					'user_code': 'User Code',
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

					// scope.popupData.fields.valueToShow.options.splice(1, 0, {id: 'public_name', name: 'Public Name'});

				}

				if (scope.placeholderText === undefined) {
					scope.placeholderText = placeholdersForNames[scope.valueToShow];
				}

				scope.multiinputFieldEventService = new EventService();

			},
			post: function (scope, elem, attrs) {

				// const contentType = metaContentTypesService.findContentTypeByEntity(scope.entityType);
				const defConfigCode = globalDataService.getDefaultConfigurationCode();

				const updateName = function (propName, newValue, oldValue) {

					const value = scope.popupData.fields[propName].value;

					/*
					 * change field inside popup if:
					 * 1) it is empty
					 * 2) its value equaled to value of base input (oldValue)
					 */
					if (!value || value === oldValue) {

						scope.popupData.fields[propName].value = newValue;

					}

				};

				const updateUserCode = function(newValue, oldValue) {

					oldValue = metaHelper.replaceCharsForUserCode(oldValue);
					const ucParts = splitUserCode(scope.popupData.fields.user_code.value);

					const value = metaHelper.replaceCharsForUserCode(ucParts.userCodeEnd);
					const configCode = ucParts.configuration_code || defConfigCode;
					const contentType = scope.popupData.fields.user_code.content_type;

					/*
					 * change field inside popup if:
					 * 1) it is empty
					 * 2) its value equaled to value of base input (oldValue)
					 */
					if (value && value !== oldValue) {
						return;
					}

					newValue = metaHelper.replaceCharsForUserCode(newValue);

					scope.popupData.fields.user_code.value = `${configCode}:${contentType}:${newValue}`;

				};

				function baseInputChangeFn (newVal, prevVal) {

					updateName('name', newVal, prevVal);
					updateName('short_name', newVal, prevVal);

					if (!scope.editingOn) {

						if (scope.useUserCodeInput) {
							updateUserCode(newVal, prevVal);

						} else {
							updateName('user_code', newVal, prevVal);
						}

					}

					updateName('public_name', newVal, prevVal);

				}

				/*
				 * Debounce prevents changing unintended names when deleting text inside base input
				 * e.g. Deleting 'Bank AAA' would also delete 'Bank A' without debounce
				 */
				scope.baseInputChange = utilsHelper.debounce(baseInputChangeFn, 300);

				if (scope.eventService) {

					scope.eventService.addEventListener(directivesEvent.TURN_ON_ERROR_MODE, function (argumentsObj) {

						if (argumentsObj) {

							for (const prop in argumentsObj) {
								scope.popupData.fields[prop].errorData = argumentsObj[prop];
								// scope.popupData.fields[prop].event = argumentsObj[prop];
							}

						}

						scope.multiinputFieldEventService.dispatchEvent(directivesEvent.TURN_ON_ERROR_MODE);

					});

				}

			}
		}
	}

}