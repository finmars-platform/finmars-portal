/**
 * Created by mevstratov on 17.06.2021.
 */
(function () {

	'use strict';

	const metaHelper = require('../helpers/meta.helper');
	const utilsHelper = require('../helpers/utils.helper');
	const classifierEvents = require('../services/events/classifierEvents');

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

				vm.emptyLast = utilsHelper.emptyLastComparator;

				const treeElement = document.querySelector('.classifier-tree');

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
				vm.editableNode = null;

				const getShadowClass = (elem) => {

					const noScroll = (elem.scrollHeight - elem.clientHeight) <= -1;
					if (noScroll) {
						return '';
					}

					if (elem.scrollTop === 0) {
						return 'bottom-shadow';
					}

					const scrollBottom = elem.scrollHeight - elem.clientHeight - elem.scrollTop;
					if (scrollBottom <= 0) {
						return 'top-shadow';
					}

					return 'shadow';
				}

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

				const getNearestParentOfNode = (tree, node) => {

					const parentPath = node.frontOptions.treePath.slice(0, -2);

					return metaHelper.getObjectNestedPropVal(tree, parentPath);

				};

				const getParentsOfNode = (tree, node) => {

					const isNodeHaveParents = node.frontOptions.treePath.length >= 3;

					if (isNodeHaveParents) {

						const parent = getNearestParentOfNode(tree, node);

						return [parent, ...getParentsOfNode(tree, parent)];

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

						const parents = getParentsOfNode(vm.filteredTree, activeNode);
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

						const parents = getParentsOfNode(vm.filteredTree, activeNode);
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

				let currentShadow = getShadowClass(treeElement);
				if(currentShadow) {
					treeElement.classList.add(currentShadow);
				}

				const applyShadow = () => {
					const shadow = getShadowClass(treeElement);

					if (currentShadow !== shadow) {
						currentShadow && treeElement.classList.remove(currentShadow);
						shadow && treeElement.classList.add(shadow);
						currentShadow = shadow;
					}

				};

				const closeStatusChange = function (clickedNode) {
					clickedNode.frontOptions.closed = !clickedNode.frontOptions.closed;
					setTimeout(() => applyShadow());
				};

				vm.closeStatusChange = closeStatusChange;

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

				let addition = false;

				const onAddNode = (data) => {
					addition = true;

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
					vm.editableNode = newNode;

				};

				const onEditNode = () => {

					if (!activeNode) {
						return;
					}

					vm.editableNode = activeNode;
					vm.editableNode.frontOptions.editOn = true;
					vm.isEdit = true;

				};

				const onSaveNode = (newName) => {

					vm.isEdit = false;
					addition = false;
					vm.editableNode.frontOptions.editOn = false;
					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData,vm.editableNode.frontOptions.treePath);

					if (nodeFromOriginalTree.name !== newName) {

						nodeFromOriginalTree.name = newName;
						vm.editableNode.name = newName;
						$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CLASSIFIER_TREE_CHANGED);

					}

					vm.editableNode = null;
					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CANCEL_EDIT_NODE);
				};

				vm.onSaveNode = onSaveNode;

				const onCancelEdit = () => {

					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData,vm.editableNode.frontOptions.treePath);
					vm.editableNode.name = nodeFromOriginalTree.name;

					if (addition) {

						const parentNodeFromOriginalTree = getNearestParentOfNode($scope.treeData, nodeFromOriginalTree);
						const parent = getNearestParentOfNode(vm.filteredTree, vm.editableNode);

						if (Array.isArray(parentNodeFromOriginalTree.children)) {
							parentNodeFromOriginalTree.children.pop();
							parent.children.pop();
						} else { // root
							parentNodeFromOriginalTree.pop();
							parent.pop();
						}

						addition = false;

					}

					vm.isEdit = false;
					vm.editableNode.frontOptions.editOn = false;
					vm.editableNode = null;
					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CANCEL_EDIT_NODE);

				}

				vm.onCancelEdit = onCancelEdit;

				const onDeleteNode = () => {

					const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath)
					metaHelper.deletePropertyByPath($scope.treeData, nodeFromOriginalTree.frontOptions.treePath); // delete node in original tree
					metaHelper.deletePropertyByPath(vm.filteredTree, activeNode.frontOptions.treePath)  // delete node in filtered tree

					activeNode = null;

					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CLASSIFIER_TREE_CHANGED);
				};

				const onTreeChangedFromOutside = () => {

					vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));
					activeNode = getFirstActiveNodeFromTree(vm.filteredTree);

					if (vm.treeFilterTerms) vm.filterTree(vm.treeFilterTerms);

					vm.isEdit = false;
					applyShadow();

					$scope.$apply();

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

						const treeChangedFromOutsideId = $scope.classifierTreeEventService.addEventListener(classifierEvents.TREE_CHANGED_FROM_OUTSIDE, onTreeChangedFromOutside);

						const editNodeId = $scope.classifierTreeEventService.addEventListener(classifierEvents.EDIT_NODE, onEditNode);

						const deleteNodeId = $scope.classifierTreeEventService.addEventListener(classifierEvents.DELETE_NODE, onDeleteNode);

						const addNodeId = $scope.classifierTreeEventService.addEventListener(classifierEvents.ADD_NODE, onAddNode);

						$scope.$on("$destroy", function () {
							$scope.classifierTreeEventService.removeEventListener(classifierEvents.TREE_CHANGED_FROM_OUTSIDE, treeChangedFromOutsideId);
							$scope.classifierTreeEventService.removeEventListener(classifierEvents.EDIT_NODE, editNodeId);
							$scope.classifierTreeEventService.removeEventListener(classifierEvents.ADD_NODE, addNodeId);
							$scope.classifierTreeEventService.removeEventListener(classifierEvents.DELETE_NODE, deleteNodeId);
						});

					}

					treeElement.addEventListener('scroll', () => {
						applyShadow();
					});

				};

				init();

			}]
		};

	}

})();