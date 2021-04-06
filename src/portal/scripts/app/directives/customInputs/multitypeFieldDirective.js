(function () {
	"use strict";

	module.exports = function () {
		return {
			restrict: "E",
			scope: {
				label: "@",
				fieldTypesData: '=',
				enteredValue: '<', // object {model: "entered into field value", type: "selected type"}
				testVal: '=',
				onValueChange: '&?'
			},
			templateUrl: "views/directives/customInputs/multitype-field-view.html",
			link: function (scope, elem, attr) {

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

				scope.switchType = function () {

					let nextTypeIndex = scope.activeType.index + 1;
					if (nextTypeIndex === scope.fieldTypesData.length) nextTypeIndex = 0;

					// previous activeType
					scope.activeType.model = null;
					scope.activeType.isActive = false;

					// current activeType
					scope.activeType = scope.fieldTypesData[nextTypeIndex];
					scope.activeType.model = null;
					scope.activeType.isActive = true;

				};

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