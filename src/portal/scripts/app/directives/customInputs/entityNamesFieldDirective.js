"use strict";

export default function () {

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
							  is-disabled="isDisabled"></multiinput-field>
		</div>`,
		link: {
			pre: function (scope, elem, attr) {

				scope.valueToShow = scope.valueToShow || 'name';
				console.log("testing1 entityNamesField entity", scope.entity);
				scope.popupData = {
					fields: {
						name: {
							set value(name) {

								scope.entity.name = name;

								if (scope.onChange) {
									scope.onChange();
								}

							},
							get value() {
								return scope.entity.name;
							},
							changeByInput: true
						},
						short_name: {
							set value(shortName) {
								scope.entity.short_name = shortName;
							},
							get value() {
								return scope.entity.short_name;
							},
							changeByInput: true
						},
						user_code: {
							set value(userCode) {
								scope.entity.user_code = userCode;
							},
							get value() {
								return scope.entity.user_code;
							},
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

				const placeholdersForNames = {
					'name': 'Report Name (Name)',
					'public_name': 'Name if Hidden (Public Name)',
					'short_name': 'System Name (Short Name)',
					'user_code': 'Unique Code (User Code)',
				};

				if (scope.placeholderText === undefined) {
					scope.placeholderText = placeholdersForNames[scope.valueToShow];
				}

			},
			post: function (scope, elem, attrs) {}
		}
	}

}