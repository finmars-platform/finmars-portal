/**
 * Created by mevstratov on 16.06.2021.
 */
(function () {

	'use strict';

	const utilsHelper = require('../helpers/utils.helper');

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
				scope.closeStatusChange = cTreeVm.closeStatusChange;
				scope.onCancelEdit = cTreeVm.onCancelEdit;
				scope.onSaveNode = cTreeVm.onSaveNode;
				scope.editableNode = cTreeVm.editableNode;
				scope.currentEdit = {
					name: ''
				}

				const classifierNodeRowElem = elem[0].querySelector('.classifierNodeRow');

				const focusInput = () => {
					const inputElement = elem[0].querySelector('input.classifier-name');
					inputElement.focus();
				}

				scope.onInputInit = () => {
					scope.currentEdit.name = scope.node.name;
					focusInput();
				}

				scope.isSaveDisabled = () => {
					return !scope.currentEdit.name.trim();
				}

				classifierNodeRowElem.addEventListener('dragstart', cTreeVm.onNodeDragStart);
				classifierNodeRowElem.addEventListener('dragend', cTreeVm.onNodeDragEnd);

				scope.getPathToNodeAsString = function () {
					return scope.node.frontOptions.treePath.join(',');
				};

			}
		}

	}

})();