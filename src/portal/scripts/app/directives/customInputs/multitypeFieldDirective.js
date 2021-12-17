(function () {
	"use strict";

	module.exports = function () {
		return {
			restrict: "E",
			scope: {
				label: "@",
				fieldTypesData: '=',
				enteredValue: '<', // object {model: "entered into field value", type: "selected type"}
				typeSwitch: '@', // 'button', 'selector'. Default - button.

				onTypeChange: '&?',
				onValueChange: '&?',
			},
			templateUrl: "views/directives/customInputs/multitype-field-view.html",
			link: function (scope, elem, attr) {

				if (!scope.typeSwitch) scope.typeSwitch = 'button';

				scope.getLabel = function () {

					if (scope.activeType.hasOwnProperty('label')) {
						return scope.activeType.label;
					}

					return scope.label || null;

				};

				scope.onChangeCallback = function () {
					if (scope.onValueChange) {
						scope.onValueChange();
					}
				};

				const activateType = function (type) {

					// previous activeType
					scope.activeType.model = null;
					scope.activeType.isActive = false;

					// current activeType
					scope.activeType = type;
					scope.activeType.model = null;
					scope.activeType.isActive = true;

					if (scope.onTypeChange) scope.onTypeChange({activeType: scope.activeType});

				};

				/* const openPopupSelector = function () {



				};

				scope.switchType = (scope.fieldTypesData.length > 2) ? cycleTypes : ; */
				scope.switchType = function () {

					let nextTypeIndex = scope.activeType.index + 1;
					if (nextTypeIndex === scope.fieldTypesData.length) nextTypeIndex = 0;

					/* // previous activeType
					scope.activeType.model = null;
					scope.activeType.isActive = false;

					// current activeType
					scope.activeType = scope.fieldTypesData[nextTypeIndex];
					scope.activeType.model = null;
					scope.activeType.isActive = true;

					if (scope.onTypeChange) scope.onTypeChange({activeType: scope.activeType}); */
					activateType(scope.fieldTypesData[nextTypeIndex]);

				};

				scope.typeSelPopupData = {
					typesList: scope.fieldTypesData,
					selectType: function (type, _$popup) {
						_$popup.cancel();
						activateType(type);
					}
				};

				scope.typeSelPopupTpl = `<div class="multitype-field-type-selector-popup">
					<div ng-repeat="type in popupData.typesList" class="field-type-option" ng-click="popupData.selectType(type, _$popup)">
						<div class="material-icons" ng-class="{'visibility-hidden': !type.isActive}">done</div>
						<div class="flex-row fc-space-between fi-center width-100">
							<div class="field-type-name" ng-bind="type.name"></div>
							<div ng-bind-html="type.sign"></div>
						</div>
					</div>
				</div>`;

				const init = function () {

					scope.fieldTypesData.forEach((type, index) => type.index = index);

                    scope.activeType = scope.fieldTypesData.find(type => type.isActive);

                    if (!scope.activeType) {

                    	scope.activeType = scope.fieldTypesData.find(type => type.isDefault) || {};
						scope.activeType.isActive = true;

					}

				};

                init();

			}
		}
	};

}());