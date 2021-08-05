/**
 * Created by mevstratov on 17.06.2021.
 */
(function () {

	'use strict';

	const metaHelper = require('../helpers/meta.helper');
	// const utilsHelper = require('../helpers/utils.helper');
	const classifierEvents = require('../services/events/classifierEvents');

	module.exports = function () {

		return {
			restrict: 'E',
			scope: {
				treeData: '=', // tree data that will be send to server
				activeNodeId: '<',
				classifierTreeEventService: '=',
				multiselector: '@',
				onActiveNodesChangeCallback: '&?'
			},
			templateUrl: 'views/directives/classifier-tree-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function СlassifierTreeController ($scope) {

				let vm = this;
				/** Tree data to render classifier tree */
				vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));
				// console.log("testing vm.filteredTree", vm.filteredTree);
				vm.treeFilterTerms = '';
				vm.isMultiselector = $scope.multiselector === 'true';
				vm.editingNode = false;
				vm.editableNode = null;

				let activeNode = null;

				const treeElement = document.querySelector('.classifierTree');

				/* const getNodeByParents = (tree, idsList) => {

					let node = tree.find(node => node.id === idsList[0]);

					idsList.forEach(nodeId => {
						node = node.children.find(childNode => childNode.id === nodeId);
					});

					tree.find(node => node.id === idsList[0]);

				}; */

				const getNode = (tree, idsList) => {
					console.trace();
					// console.log("testing.getNode", idsList);
					const eldestParentId = idsList[0];
					// console.log("testing.getNode eldestParentId", eldestParentId);
					let node = tree.find(childNode => childNode.id == eldestParentId);
					// console.log("testing.getNode eldest node", node);
					const idsListWithoutEldest = idsList.slice(1);
					// console.log("testing.getNode idsListWithoutEldest", idsListWithoutEldest);
					idsListWithoutEldest.forEach(nodeId => {
						node = node.children.find(childNode => childNode.id == nodeId);
					});

					return node;

				};

				const getParentNode = (tree, node) => {

					if (node.level === 0) return null;

					const pathToParent = node.frontOptions.pathToNode.slice(0, -1);
					return getNode(tree, pathToParent);

				};

				const getAllParentsOfNode = (tree, node) => {

					let parents = [];

					let parentNode = getParentNode(tree, node);
					let nodeHasAParent = parentNode && parentNode.frontOptions.pathToNode.length;

					// parents.push(parentNode);

					while (nodeHasAParent) {

						parents.push(parentNode);

						parentNode = getParentNode(tree, parentNode);
						nodeHasAParent = parentNode && parentNode.frontOptions.pathToNode.length;

					}

					return parents;

				};
				/**
				 *
				 * @param tree {Array}
				 * @param node {Object} - Node data
				 * @param index {number=} - Index of node inside its parent node. Required if setting node inside a root.
				 */
				const setNodeInsideTree = (tree, node, index) => {
					// console.log("testing.setNodeInsideTree", node, index);

					if (node.level) {

						const parent = getParentNode(tree, node);

						if (!index && index !== 0) {
							index = parent.children.findIndex(childNode => childNode.id === node.id);
						}
						// console.log("testing.setNodeInsideTree nodeIndex", index);
						parent.children[index] = node;

					} else {

						if (!index && index !== 0) {
							index = tree.findIndex(childNode => childNode.id === node.id);
						}

						tree[index] = node;

					}

				};

				const deleteNodeFromTree = (tree, node) => {
					// console.log("testing.deleteNodeFromTree", node);
					if (node.level > 0) {

						const parent = getParentNode(tree, node);

						const nodeIndex = parent.children.findIndex(childNode => childNode.id === node.id);
						// console.log("testing.deleteNodeFromTree nodeIndex1", parent, nodeIndex);

						if (nodeIndex > -1) {
							parent.children.splice(nodeIndex, 1);

						} else {
							console.error("Node for deletion not found", {node_to_delete: node, delete_inside: parent});
						}

					} else { // delete from root

						const nodeIndex = tree.findIndex(childNode => childNode.id === node.id);
						// console.log("testing.deleteNodeFromTree nodeIndex2", nodeIndex);
						if (nodeIndex > -1) {
							tree.splice(nodeIndex, 1);

						} else {
							console.error("Node for deletion not found", {node_to_delete: node, delete_inside: tree});
						}

					}

				};
				/**
				 * Remove node from original tree and filtered tree.
				 * @param node {Object}
				 */
				const removeNode = function (node) {
					deleteNodeFromTree($scope.treeData, node); // delete node in original tree
					deleteNodeFromTree(vm.filteredTree, node); // delete node inside classifier directive tree
				};
				/**
				 *
				 * @param tree {Object}
				 * @param node {Object} - node with updated pathToNode
				 */
				/* const moveNodeInsideTree = (tree, node, newPathToNode) => {

					node.frontOptions.pathToNode = newPathToNode;

					const newParent = getParentNode(tree, node);

					const nodeIndex = newParent.children.findIndex(childNode => childNode.id === node.id);

				}; */

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

				/* const getNearestParentOfNode = (tree, node) => {

					const parentPath = node.frontOptions.treePath.slice(0, -2);

					return metaHelper.getObjectNestedPropVal(tree, parentPath);

				};

				const getParentsOfNode = (tree, node) => {

					const nodeHasParents = node.frontOptions.treePath.length >= 3;

					if (nodeHasParents) {

						const parent = getNearestParentOfNode(tree, node);

						return [parent, ...getParentsOfNode(tree, parent)];

					}

					return [];

				}; */

				const selectNode = function (clickedNode) {

					if (vm.editingNode) {
						return;
					}

					if (activeNode) { // current activeNode

						activeNode.isActive = false;
						// In case tree filter is active, update original tree
						// const activeNodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath);
						const activeNodeFromOriginalTree = getNode($scope.treeData, activeNode.frontOptions.pathToNode);
						activeNodeFromOriginalTree.isActive = false;

						// const parents = getParentsOfNode(vm.filteredTree, activeNode);
						const parents = getAllParentsOfNode(vm.filteredTree, activeNode);
						parents.forEach(node => {
							node.frontOptions.hasActiveChild = false;
						});

					}

					if (activeNode !== clickedNode) {

						clickedNode.isActive = true;
						// In case tree filter is active, update original tree
						// const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, clickedNode.frontOptions.treePath);
						const nodeFromOriginalTree = getNode($scope.treeData, clickedNode.frontOptions.pathToNode);
						nodeFromOriginalTree.isActive = true;

						activeNode = clickedNode;

						// const parents = getParentsOfNode(vm.filteredTree, activeNode);
						const parents = getAllParentsOfNode(vm.filteredTree, activeNode);
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
				if (currentShadow) {
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
					const tmpNodeId = 'nodeId' + metaHelper.generateUniqueId('classifierNode');

					// const parentNode = parentNodeFromOriginalTree ? metaHelper.getObjectNestedPropVal(vm.filteredTree, parentNodeFromOriginalTree.frontOptions.treePath) : null;
					const parentNode = parentNodeFromOriginalTree ? getNode(vm.filteredTree, parentNodeFromOriginalTree.frontOptions.pathToNode) : null;
					const level = parentNode ? parentNode.level + 1 : 0;
					const order = parentNode ? parentNode.children.length : vm.filteredTree.length;
					// const treePath = parentNode ? parentNode.frontOptions.treePath.concat(['children', order]) : [order];
					const pathToNode = parentNode ? parentNode.frontOptions.pathToNode.concat([tmpNodeId]) : [tmpNodeId];

					const newNode = {
						// id: '',
						name: '',
						level: level,
						children: [],
						order: order,
						frontOptions: {
							// treePath: treePath,
							treePath: pathToNode,
							hasActiveChild: false,
							closed: level > 0,
							editOn: true,
							id: tmpNodeId
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

					vm.editingNode = true;
					vm.editableNode = newNode;

				};

				const onEditNode = () => {

					if (!activeNode) {
						return;
					}

					vm.editableNode = activeNode;
					vm.editableNode.frontOptions.editOn = true;
					vm.editingNode = true;

				};

				const onSaveNode = (newName) => {

					vm.editingNode = false;
					addition = false;
					vm.editableNode.frontOptions.editOn = false;
					// const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, vm.editableNode.frontOptions.treePath);
					const nodeFromOriginalTree = getNode($scope.treeData, vm.editableNode.frontOptions.pathToNode);

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

					// const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData,vm.editableNode.frontOptions.treePath);
					const nodeFromOriginalTree = getNode($scope.treeData,vm.editableNode.frontOptions.pathToNode);

					vm.editableNode.name = nodeFromOriginalTree.name;

					if (addition) {

						/* const parentNodeFromOriginalTree = getNearestParentOfNode($scope.treeData, nodeFromOriginalTree);
						const parent = getNearestParentOfNode(vm.filteredTree, vm.editableNode); */
						const parentNodeFromOriginalTree = getParentNode($scope.treeData, nodeFromOriginalTree);
						const parent = getParentNode(vm.filteredTree, vm.editableNode);

						if (Array.isArray(parentNodeFromOriginalTree.children)) {
							parentNodeFromOriginalTree.children.pop();
							parent.children.pop();
						} else { // root
							parentNodeFromOriginalTree.pop();
							parent.pop();
						}

						addition = false;

					}

					vm.editingNode = false;
					vm.editableNode.frontOptions.editOn = false;
					vm.editableNode = null;
					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CANCEL_EDIT_NODE);

				}

				vm.onCancelEdit = onCancelEdit;

				/**
				 * Update properties "order" and "frontOptions.treePath" of children nodes.
				 *
				 * @param parentNode {Object}
				 */
				/* const updatePathsOfChildrenNodes = function (parentNode) {

					return parentNode.children.map((cNode, index) => {

						cNode.order = index;
						cNode.frontOptions.treePath = parentNode.frontOptions.treePath.concat(['children', cNode.order]);

						if (cNode.children.length) cNode.children = updatePathsOfChildrenNodes(cNode);

						return cNode;

					});

				}; */
				/**
				 * Update properties "order" and "frontOptions.treePath" of all tree nodes.
				 *
				 * @param root
				 * @returns Array<Object> - list of nodes
				 */
				/* const updatePathsOfAllNodes = function (root) {

					return root.map((cNode, index) => {

						cNode.order = index;
						cNode.frontOptions.treePath = [cNode.order];

						if (cNode.children.length) cNode.children = updatePathsOfChildrenNodes(cNode);

						return cNode;

					});

				}; */
				/**
				 * Removes node from original and from directive's tree.
				 *
				 * @param node {Object}
				 */
				/* const removeNode = function (node) {

					let parent = getNearestParentOfNode(vm.filteredTree, node);
					// const parent = getNearestParentOfNode(vm.filteredTree, node);

					metaHelper.deletePropertyByPath($scope.treeData, node.frontOptions.treePath); // delete node in original tree
					metaHelper.deletePropertyByPath(vm.filteredTree, node.frontOptions.treePath);  // delete node inside classifier directive tree

					if (Array.isArray(parent)) {

						if (!parent.length) return;

						$scope.treeData = updatePathsOfAllNodes(parent);
						vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));

					} else {

						if (!parent.children.length) return;

						parent.children = updatePathsOfChildrenNodes(parent);

						metaHelper.setObjectNestedPropVal($scope.treeData, parent.frontOptions.treePath, parent);
						metaHelper.setObjectNestedPropVal(vm.filteredTree, parent.frontOptions.treePath, parent);

					}

					return vm.filteredTree;

				}; */

				const onDeleteNode = () => {

					/* const nodeFromOriginalTree = metaHelper.getObjectNestedPropVal($scope.treeData, activeNode.frontOptions.treePath)
					metaHelper.deletePropertyByPath($scope.treeData, activeNode.frontOptions.treePath); // delete node in original tree
					metaHelper.deletePropertyByPath(vm.filteredTree, activeNode.frontOptions.treePath)  // delete node in filtered tree */
					// vm.filteredTree = removeNode(activeNode);
					removeNode(activeNode);

					activeNode = null;

					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CLASSIFIER_TREE_CHANGED);
				};

				const onTreeChangedFromOutside = () => {

					vm.filteredTree = JSON.parse(angular.toJson($scope.treeData));
					activeNode = getFirstActiveNodeFromTree(vm.filteredTree);

					if (vm.treeFilterTerms) vm.filterTree(vm.treeFilterTerms);

					vm.editingNode = false;
					applyShadow();

					$scope.$apply();

				};

				//region Node drag and drop

				const nodeCanBeMovedToTheLocation = (nodeToMove, moveTo) => {

					if (Array.isArray(moveTo)) return true; // move to a root

					if (nodeToMove.id === moveTo.id) return false;

					const moveToParents = getAllParentsOfNode(vm.filteredTree, moveTo);
					// console.log("testing.nodeCanBeMovedToTheLocation nodeToMove", nodeToMove, moveToParents);
					const parent = moveToParents.find(parent => parent.id === nodeToMove.id);

					if (!!parent) return false; // moveTo is a child of nodeToMove
					// console.log("testing.nodeCanBeMovedToTheLocation true");
					return true;

				}
				/**
				 * Change node position inside tree.
				 *
				 * @param nodeToMove {Object}
				 * @param moveTo {Object|Array} - node or root
				 * @param index {number=} - If index not specified, it will be set to the last index of moveTo.
				 */
				const moveNode = function (nodeToMove, moveTo, index) {
					// console.log("testing.moveNode", nodeToMove, moveTo);

					removeNode(nodeToMove);
					// nodeToMove.id; // actually we are creating copy of node

					if (Array.isArray(moveTo)) { // moved to root

						if (!index && index !== 0) index = moveTo.length;

						nodeToMove.level = 0;
						nodeToMove.frontOptions.pathToNode = [nodeToMove.id];
						// console.log("testing.moveNode index ",index);
						/* if (index >= moveTo.length) {
							moveTo.push(nodeToMove);
							console.log("testing.moveNode moveTo", JSON.parse(JSON.stringify(moveTo)));
						} else {
							moveTo.splice(index, 0, nodeToMove); // moveTo is vm.filteredTree in this case
						} */
						moveTo.splice(index, 0, nodeToMove); // moveTo is vm.filteredTree in this case
						// console.log("testing.moveNode moveTo", JSON.parse(JSON.stringify(moveTo)));

						// setNodeInsideTree($scope.treeData, nodeToMove, index);
						$scope.treeData.splice(index, 0, nodeToMove);

					}
					else { // move to another node

						if (!index && index !== 0) index = moveTo.children.length;

						nodeToMove.level = moveTo.level + 1;
						nodeToMove.frontOptions.pathToNode = moveTo.frontOptions.pathToNode.concat([nodeToMove.id]);

						/*if (index >= moveTo.children.length) {
							moveTo.children.push(nodeToMove);

						} else {
							moveTo.children.splice(index, 0, nodeToMove);
						}*/
						moveTo.children.splice(index, 0, nodeToMove);

						setNodeInsideTree($scope.treeData, moveTo);

					}
					// console.log("testing.moveNode treeData", $scope.treeData);

					$scope.classifierTreeEventService.dispatchEvent(classifierEvents.CLASSIFIER_TREE_CHANGED);

				};

				const insertNodeAfterAnotherNode = function (droppedNode, previousNodePath) {

					// const prevNode = metaHelper.getObjectNestedPropVal(vm.filteredTree, previousNodePath);
					const prevNode = getNode(vm.filteredTree, previousNodePath);
					const parent = getParentNode(vm.filteredTree, prevNode) || vm.filteredTree;

					if (!nodeCanBeMovedToTheLocation(droppedNode, parent)) return;

					let nodesList = (prevNode.level > 0) ? parent.children : vm.filteredTree;
					// console.log("testing.insertNodeAfterAnotherNode nodesList", nodesList);
					const prevNodeIndex = nodesList.findIndex(childNode => childNode.id === prevNode.id);
					const moveToIndex = prevNodeIndex + 1;
					// console.log("testing.insertNodeAfterAnotherNode indexes", prevNodeIndex, moveToIndex);
					moveNode(droppedNode, parent, moveToIndex);

				};

				const onNodeDrop = function (ev) {
					// console.log("testing.onNodeDrop called");
					const droppedNodePath = ev.dataTransfer.getData("pathToNode").split(',');
					// const droppedNode = metaHelper.getObjectNestedPropVal(vm.filteredTree, droppedNodePath);
					const droppedNode = getNode(vm.filteredTree, droppedNodePath);

					if (ev.target.classList.contains('dropAfterNode')) { // dropped between nodes
						// console.log("testing dropAfterNode");
						const prevNodePath = ev.target.dataset.pathToNode.split(',');
						insertNodeAfterAnotherNode(droppedNode, prevNodePath);

					}
					else if (ev.target.classList.contains('dropAtTheBeginning')) {
						// insertNodeAtTheBeginning(droppedNode, droppedToNodePath);
						// let moveTo = getMoveTo(ev);
						let moveToPath = ev.target.dataset.pathToNode;
						let moveTo = vm.filteredTree;

						if (moveToPath) { // not a root level
							moveToPath = moveToPath.split(',');
							moveTo = getNode(vm.filteredTree, moveToPath);
						}
						// console.log("testing.onNodeDrop dropAtTheBeginning", droppedNode, moveTo);
						if (nodeCanBeMovedToTheLocation(droppedNode, moveTo)) {
							moveNode(droppedNode, moveTo, 0);
						}

					}
					else {

						const droppedToNodeElem = ev.target.closest('.classifierNode');
						// console.log("testing.onNodeDrop ev", ev, droppedToNodeElem);

						if (droppedToNodeElem) {

							/* const droppedToNodeId = droppedToNodeElem.dataset.id;

							if (droppedToNodeId !== droppedNode.id) {

								const droppedToNodePath = droppedToNodeElem.dataset.pathToNode.split(',');
								moveNodeInsideAnotherNode(droppedNode, droppedToNodePath);

							} */
							// let moveTo = getMoveTo(ev);
							const moveToPath = droppedToNodeElem.dataset.pathToNode.split(',');
							let moveTo = getNode(vm.filteredTree, moveToPath);

							if (nodeCanBeMovedToTheLocation(droppedNode, moveTo)) {
								moveNode(droppedNode, moveTo);
							}

						} else { // dropped to the root
							// console.log("testing.onNodeDrop move to tree");
							// moveNodeToRoot();
							moveNode(droppedNode, vm.filteredTree);
						}

					}

				};

				vm.onDragStart = function (ev) {

					const targetElem = ev.target;
					// console.log("testing.onDragStart targetElem", targetElem);

					const nodeDndBackdrop = document.createElement('div');

					nodeDndBackdrop.classList.add('classifier-node-dnd-backdrop', 'cNodeDndBackdrop');
					document.body.appendChild(nodeDndBackdrop);

					ev.dataTransfer.setData("id", ev.target.dataset.nodeId);
					ev.dataTransfer.setData("pathToNode", ev.target.dataset.pathToNode);

					treeElement.addEventListener("drop", onNodeDrop, {once: true});

				};
				//endregion

				const init = function () {

					const activeNodeOnInit = getActiveNode(vm.filteredTree);

					if (activeNodeOnInit) {

						selectNode(activeNodeOnInit);

						// const parents = getParentsOfNode(activeNode);
						const parents = getAllParentsOfNode(vm.filteredTree, activeNode);

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