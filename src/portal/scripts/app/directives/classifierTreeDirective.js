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
				vm.isEdit = false;

				const getActiveNode = (tree) => {

					for (let node of tree) {
						if (node.isActive) {
							return node;
						}

						if (node.children.length > 0) {
							const activeNode = getActiveNode(node.children);
							if (activeNode) {
								return activeNode;
							}
						}
					}

					return null;
				}

				let activeNode = null;
				let editableNode = null;

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

				const getParentsOfNode = (node) => {
					const isNodeHaveParents = node.frontOptions.treePath.length >= 3;

					if (isNodeHaveParents) {
						const parentPath = node.frontOptions.treePath.slice(0, -2);
						const parent = metaHelper.getObjectNestedPropVal(vm.filteredTree, parentPath);

						return [parent, ...getParentsOfNode(parent)];
					}

					return [];
				};

				const selectNode = function (clickedNode) {

					if (vm.isEdit) {
						return;
					}

					if (activeNode) { // current activeNode

						activeNode.isActive = false;
						// In case tree filter is active, update original tree
						const activeNodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath);
						activeNodeFromOriginalTree.isActive = false;

						const parents = getParentsOfNode(activeNode);
						parents.forEach(node => {
							node.frontOptions.hasActiveChild = false;
						});

					}

					if (activeNode !== clickedNode) {

						clickedNode.isActive = true;
						// In case tree filter is active, update original tree
						const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, clickedNode.frontOptions.treePath);
						nodeFromOriginalTree.isActive = true;

						activeNode = clickedNode;

						const parents = getParentsOfNode(activeNode);
						parents.forEach(node => {
							node.frontOptions.hasActiveChild = true;
						});

						if ($scope.onActiveNodesChangeCallback) {

							const activeNodesList = nodeFromOriginalTree ? [nodeFromOriginalTree] : [];
							$scope.onActiveNodesChangeCallback({activeNodesList: activeNodesList});

						}

					} else {

						activeNode = null;
						if ($scope.onActiveNodesChangeCallback) {

							const activeNodesList = [];
							$scope.onActiveNodesChangeCallback({activeNodesList: activeNodesList});

						}
					}

				};

				vm.selectNode = selectNode;

				const getFirstActiveNodeFromTree = (tree) => {
					for (const node of tree) {
						if(node.isActive) {
							return node;
						}
						if(node.children.length) {
							const activeChild = getFirstActiveNodeFromTree(node.children);
							if(activeChild) {
								return activeChild;
							}
						}
					}
					return null;
				}

				const onAddNode = (data) => {

					const parentNodeFromOriginalTree = data.activeNodes[0];

					const parentNode = parentNodeFromOriginalTree ? metaHelper.getObjectNestedPropVal(vm.filteredTree, parentNodeFromOriginalTree.frontOptions.treePath) : null;
					const level = parentNode ? parentNode.level + 1 : 0;
					const order = parentNode ? parentNode.children.length : vm.filteredTree.length;
					const treePath = parentNode ? parentNode.frontOptions.treePath.concat(['children', order]) : [order];

					const newNode = {
						// id: '',
						name: '',
						level: level,
						children: [],
						order: order,
						frontOptions: {
							treePath: treePath,
							hasActiveChild: false,
							closed: level > 0,
							editOn: true
						}
					};
					const newNodeForOriginalTree = metaHelper.recursiveDeepCopy(newNode);

					if (parentNode) {
						parentNode.children.push(newNode);
						parentNode.frontOptions.closed = false;

						parentNodeFromOriginalTree.children.push(newNodeForOriginalTree);
						parentNodeFromOriginalTree.frontOptions.closed = false;
					} else {

						vm.filteredTree.push(newNode);
						$scope.treeData.push(newNodeForOriginalTree);
					}

					vm.isEdit = true;
					editableNode = newNode;

				};

				const onEditNode = () => {

					vm.isEdit = true;

					if (!activeNode) {
						return;
					}
					editableNode = activeNode;
					editableNode.frontOptions.editOn = true;
				};

				const onSaveNode = () => {

					vm.isEdit = false;
					editableNode.frontOptions.editOn = false;
					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, editableNode.frontOptions.treePath);

					if (nodeFromOriginalTree.name !== editableNode.name) {

						nodeFromOriginalTree.name = editableNode.name;
						$scope.classifierTreeEventService.dispatchEvent(directivesEvents.CLASSIFIER_TREE_CHANGED);

					}

					editableNode = null;
				};

				const onDeleteNode = () => {

					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath)
					metaHelper.deletePropertyByPath($scope.treeData, nodeFromOriginalTree.frontOptions.treePath); // delete node in original tree
					metaHelper.deletePropertyByPath(vm.filteredTree, activeNode.frontOptions.treePath)  // delete node in filtered tree

					activeNode = null;

					$scope.classifierTreeEventService.dispatchEvent(directivesEvents.CLASSIFIER_TREE_CHANGED);
				};

				const onTreeChangedFromOutside = () => {

					vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));
					activeNode = getFirstActiveNodeFromTree(vm.filteredTree);

					if (vm.treeFilterTerms) vm.filterTree(vm.treeFilterTerms);

					vm.isEdit = false;

				};

				const init = function () {

					const activeNodeOnInit = getActiveNode(vm.filteredTree);
					if (activeNodeOnInit) {
						selectNode(activeNodeOnInit);
						const parents = getParentsOfNode(activeNode);
						parents.forEach(node => {
							node.frontOptions.closed = false;
						});
					}

					if ($scope.classifierTreeEventService) {

						const treeChangedFromOutsideId = $scope.classifierTreeEventService.addEventListener(directivesEvents.TREE_CHANGED_FROM_OUTSIDE, onTreeChangedFromOutside);

						const editNodeId = $scope.classifierTreeEventService.addEventListener(directivesEvents.EDIT_NODE, onEditNode);

						const saveNodeId = $scope.classifierTreeEventService.addEventListener(directivesEvents.SAVE_NODE, onSaveNode);

						const deleteNodeId = $scope.classifierTreeEventService.addEventListener(directivesEvents.DELETE_NODE, onDeleteNode);

						const addNodeId = $scope.classifierTreeEventService.addEventListener(directivesEvents.ADD_NODE, onAddNode);

						$scope.$on("$destroy", function () {
							$scope.classifierTreeEventService.removeEventListener(directivesEvents.TREE_CHANGED_FROM_OUTSIDE, treeChangedFromOutsideId);
							$scope.classifierTreeEventService.removeEventListener(directivesEvents.EDIT_NODE, editNodeId);
							$scope.classifierTreeEventService.removeEventListener(directivesEvents.SAVE_NODE, saveNodeId);
							$scope.classifierTreeEventService.removeEventListener(directivesEvents.ADD_NODE, addNodeId);
							$scope.classifierTreeEventService.removeEventListener(directivesEvents.DELETE_NODE, deleteNodeId);
						});
					}

				};

				init();

			}]
		};

	}

})();