/**
 * Created by mevstratov on 16.06.2021.
 */
(function () {

	'use strict';

	module.exports = function () {

		return {
			require: '^^classifierTree',
			restrict: 'E',
			scope: {
				parent: '=',
				node: '='
			},
			templateUrl: 'views/directives/classifier-tree-node-view.html',
			link: function (scope, elem, attrs, cTreeVm) {

				scope.selectNode = cTreeVm.selectNode;
				scope.focusInput = () => {
					const inputElement = elem[0].querySelector('input.classifier-name');
					inputElement.focus();
				}

			}
		}

	}

})();