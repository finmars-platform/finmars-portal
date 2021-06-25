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
				if(scope.node && scope.node.frontOptions.hasActiveChilds) {
					console.log('# hasActiveChilds', scope.node)
				}

				scope.selectNode = cTreeVm.selectNode;

			}
		}

	}

})();