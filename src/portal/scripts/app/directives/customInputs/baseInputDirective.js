"use strict";

export default function () {

	return {
		restrict: "E",
		scope: {
			label: "@",
			placeholderText: "@",
			indicatorButtonIcon: "@",
			model: "=",
			isDisabled: "=",
			onChange: "&?",
			onBlurCallback: "&?",
			onIndicatorButtonClick: "&?",
		},
		templateUrl: "views/directives/customInputs/base-input-view.html",
		link: function (scope, elem, attr) {

			scope.indicatorBtn = scope.indicatorButtonIcon || 'edit';

			/*scope.inputModel = {
				value: ''
			}*/

			scope.onInputChange = function () {
				console.log("testing1 baseInputChange", scope.model);
				if (scope.onChange) {

					setTimeout(function () {
						scope.onChange();
					}, 100);

				}
			};

			scope.onIndBtnClick = function () {
				if (scope.onIndicatorButtonClick) {
					scope.onIndicatorButtonClick();
				}
			}

		}
	}

}
