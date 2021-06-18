/**
 * Created by mevstratov on 17.06.2021.
 */
(function () {

	'use strict';

	const metaHelper = require('../helpers/meta.helper');
	const directivesEvents = require('../services/events/directivesEvents');

	module.exports = function () {

		return {
			restrict: 'E',
			scope: {
				treeData: '=',
				activeNodeId: '<',
				classifierTreeEventService: '=',
				multiselector: '@',
				onActiveNodesChangeCallback: '&?'
			},
			templateUrl: 'views/directives/classifier-tree-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function СlassifierTreeController ($scope) {

				let vm = this;

				vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));

				vm.treeFilterTerms = '';
				vm.isMultiselector = $scope.multiselector === 'true';

				let activeNode = null;

				const filterNode = (node, filterTerms) => {

					const nodeToFilter = JSON.parse(angular.toJson(node));
					let nodeValuesPassesFilter = false;

					if (nodeToFilter.name) {

						const nodeName = nodeToFilter.name.toLowerCase();
						nodeValuesPassesFilter = nodeName.includes(filterTerms);

					}

					if (nodeToFilter.children && nodeToFilter.children.length) {

						nodeToFilter.children = nodeToFilter.children.map(childNode => {
							return filterNode(childNode, filterTerms);
						})
						.filter(childNode => childNode);

					}

					const childrenOfNodePassFilter = !!(nodeToFilter.children && nodeToFilter.children.length);

					if (nodeValuesPassesFilter || childrenOfNodePassFilter) return nodeToFilter;

					return null;

				};

				vm.filterTree = function (filterTerms) {

					vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));

					if (filterTerms) {

						filterTerms = filterTerms.toLowerCase();

						vm.filteredTree = vm.filteredTree.map(node => {
							return filterNode(node, filterTerms);
						})
						.filter(node => node);

					}

				};

				const selectNode = function (clickedNode) {

					if (activeNode) { // current activeNode

						activeNode.isActive = false;
						// In case tree filter is active, update original tree
						const activeNodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath);
						activeNodeFromOriginalTree.isActive = false;

					}

					clickedNode.isActive = true;
					// In case tree filter is active, update original tree
					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, clickedNode.frontOptions.treePath);
					nodeFromOriginalTree.isActive = true;

					activeNode = clickedNode;

					if ($scope.onActiveNodesChangeCallback) {

						const activeNodesList = nodeFromOriginalTree ? [nodeFromOriginalTree] : [];
						$scope.onActiveNodesChangeCallback({activeNodesList: activeNodesList});

					}

				};

				vm.selectNode = selectNode;

				const init = function () {

					if ($scope.classifierTreeEventService) {

						$scope.classifierTreeEventService.addEventListener(directivesEvents.TREE_CHANGED_FROM_OUTSIDE, function () {

							vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));

							if (vm.treeFilterTerms) vm.filterTree(vm.treeFilterTerms);

						});

					}

				};

				init();

			}]
		};

	}

})();