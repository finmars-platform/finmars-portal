(function () {
	"use strict";

	module.exports = function () {
		return {
			restrict: "E",
			scope: {
				fieldTypesData: '=',
				onValueChange: '&?'
			},
			templateUrl: "views/directives/customInputs/multitype-field-view.html",
			link: function (scope, elem, attr) {

				scope.onChangeCallback = function () {
					if (scope.onValueChange) {
						scope.onValueChange();
					}
				};

				scope.switchType = function () {

					let nextTypeIndex = scope.activeType.index + 1;
					if (nextTypeIndex === scope.fieldTypesData.length) nextTypeIndex = 0;

					scope.activeType.model = null;
					scope.activeType.isActive = false;

					scope.activeType = scope.fieldTypesData[nextTypeIndex];
					scope.activeType.isActive = true;

				};

				const init = function () {

					scope.fieldTypesData.forEach((type, index) => type.index = index);

                    scope.activeType = scope.fieldTypesData.find(type => type.isActive);

                    if (!scope.activeType) scope.activeType = scope.fieldTypesData.find(type => type.isDefault) || {};

                };

                init();

			}
		}
	};

}());