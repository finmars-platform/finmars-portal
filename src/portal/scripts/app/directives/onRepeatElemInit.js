(function () {

	'use strict';

	module.exports = function () {
		return {
			restrict: "A",
			scope: {
				onInit: "&?",
				onLastInit: "&?",
				elemToTrack: "@",
				isLast: "="
			},
			link: function (scope, elem, attr) {
				console.log("testing onRepeatElem elem", elem, scope.isLast);
				if (scope.onInit) {

					// if onLastInit declared dont call onInit for last element
					if (!scope.onLastInit || !scope.isLast) {
						scope.onInit();
					}

				}

				if (scope.isLast && scope.onLastInit) {
					scope.onLastInit();
				}

			}

		}
	};

}());