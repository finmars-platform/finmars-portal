/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var attributeTypeService = require('../../services/attributeTypeService');
    var EventService = require('../../services/eventService');
	var directivesEvents = require('../../services/events/directivesEvents');
    const metaHelper = require('../../helpers/meta.helper');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.classifier = data.classifier;
        vm.classifierId = data.classifier.id;
        vm.classifierValue = data.classifierId;
		// vm.label = data.label || 'Select classifier';
		vm.label = data.classifier.name ? `Select ${data.classifier.name}` : 'Select classifier';

		vm.isLock = true;
		vm.isEdit = false;

		vm.readyStatus = false;

		vm.activeNodes = [];
		let activeNodesIdsBeforeUpdate = [];

		vm.onEdit = () => {

		    if(!vm.activeNodes.length) {
                return;
            }

            vm.isEdit = true;
            vm.classifierTreeEventService.dispatchEvent(directivesEvents.EDIT_NODE);

        }

        vm.onCancelEdit = () => {
		    vm.isEdit = false;
            vm.classifierTreeEventService.dispatchEvent(directivesEvents.TREE_CHANGED_FROM_OUTSIDE); // original tree will render without changes
        };

        vm.onSaveEdit = () => {
            vm.isEdit = false;
            vm.classifierTreeEventService.dispatchEvent(directivesEvents.SAVE_NODE);
        };

        vm.onDelete = () => {

            if(!vm.activeNodes.length) {
                return;
            }

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                // targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure you want to delete classifier ' + vm.activeNodes[0].name + '?'
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.isLock = true;
                    vm.classifierTreeEventService.dispatchEvent(directivesEvents.DELETE_NODE, {activeNodes: vm.activeNodes});
                }
            });

        }

        vm.onAdd = () => {
            vm.isEdit = true;
            vm.classifierTreeEventService.dispatchEvent(directivesEvents.ADD_NODE, {activeNodes: vm.activeNodes});
        };

        vm.isActiveNodes = () => !!vm.activeNodes.length;

		var setUpTreeNodes = function (treeLevel, levelNumber, parentNode) {

		    if (!levelNumber && levelNumber !== 0) levelNumber = 0;

		    treeLevel.forEach((node, index) => {

		        node.level = levelNumber;
                node.order = index;
                node.isActive = activeNodesIdsBeforeUpdate.includes(node.id);

				node.frontOptions = {};
                node.frontOptions.treePath = [index];
				node.frontOptions.closed = node.level > 0;
				node.frontOptions.hasActiveChild = false;

                if (parentNode) node.frontOptions.treePath = parentNode.frontOptions.treePath.concat(['children', index]);

                if (node.children.length) {

                    var nextLevel = levelNumber + 1;
                    setUpTreeNodes(node.children, nextLevel, node);

                }

                if(node.isActive) {
                    vm.activeNodes.push(node);
                }

            });

		    return treeLevel;

        };

        vm.getTree = function () {

            // $('#js-tree-select-wrapper').remove();
			vm.readyStatus = false;

            attributeTypeService.getByKey(vm.entityType, vm.classifierId).then(function (data) {

                console.log('DATA', data);

				vm.tree = setUpTreeNodes(data.classifiers);
				vm.readyStatus = true;

				$scope.$apply();

				/* $('.js-tree-holder-dialog-select').append('<div id="js-tree-select-wrapper" class="js-tree-select" style="width: 100%; overflow: hidden"></div>');

				function setText(item) {
					item.text = item.name;
					item.type = 'default';
					if (item.children.length) {
						item.type = 'folder';
					}
					item.children = item.children.map(setText);
					return item
				}

				vm.tree = data.classifiers;

				var tree = data.classifiers.map(setText);

				$('#js-tree-select-wrapper').jstree({
					"core": {
						"animation": 0,
						"check_callback": true,
						"themes": {"stripes": true, "dots": true},
						'data': [
							{
								'text': 'Root',
								'state': {'opened': true, 'selected': true},
								'children': tree
							}
						]
					},
					"dnd": {
						"is_draggable": function (node) {
							return false
						}
					},
					"types": {
						"#": {
							"valid_children": ["root"]
						},
						"root": {
							"icon": "portal/content/img/ic_folder_black_1x.png",
							"valid_children": ["default"]
						},
						"default": {
							"icon": "portal/content/img/ic_label_outline_black_1x.png",
							"valid_children": ["default", "folder"]
						},
						"folder": {
							"icon": "portal/content/img/ic_folder_black_1x.png",
							"valid_children": ["default", "folder"]
						}
					},
					"plugins": [
						"contextmenu", "dnd", "search",
						"state", "types", "wholerow"
					]
				});
				$('#js-tree-select-wrapper').jstree(true).show_dots();
				$scope.$apply(function () {
					setTimeout(function () {
						$('#js-tree-select-wrapper').jstree("deselect_all");
					}, 300); // idk, wtf is this
					setTimeout(function () {
						console.log('vm.classifierId', vm.classifierValue);
						$('#js-tree-select-wrapper').jstree("select_node", "#" + vm.classifierValue);
					}, 301); // idk, wtf is this
				}); */

            });
        };

        const getClearTree = (tree) => {
            return tree.map(node => {
                delete node.frontOptions;
                if(node.children.length) {
                    node.children = getClearTree(node.children)
                }

                return node;
            })
        }

        vm.onActiveNodesChange = function (activeNodesList) {vm.activeNodes = activeNodesList;};

        const updateClassifier = () => {

            vm.readyStatus = false;
            const classifiers = getClearTree(vm.tree);
            vm.classifier.classifiers = classifiers;
            activeNodesIdsBeforeUpdate = vm.activeNodes.map(({id}) => id);

            attributeTypeService.update(vm.entityType, vm.classifierId, vm.classifier).then(function () {
                vm.activeNodes = [];
                vm.getTree();
            });
        }


		/* Old code
		function setName(item) {
            item.name = item.text;
            if (item.id.indexOf('j') !== -1) {
                delete item['li_attr'];
                delete item['state'];
                delete item['icon'];
                delete item['a_attr'];
                delete item['data'];
                delete item['text'];
                delete item['type'];
                delete item.id;
            }
            item.children = item.children.map(setName);
            return item
        }

        vm.edit = function (ev) {
            $mdDialog.show({
                controller: 'ClassificationEditorDialogController as vm',
                templateUrl: 'views/classification-editor-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        classifier: data.classifier,
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);

                    res.data.classifier.classifiers = res.data.classifier.children.map(setName);
                    // $('#js-tree-select-wrapper').jstree(true).destroy();
                    attributeTypeService.update(vm.entityType, res.data.classifier.id, res.data.classifier).then(function () {
                        vm.getTree();
                    });
                }
            });
        }; */

        vm.agree = function () {
            /* setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.classifierSelectorElemToDrag');
            }, 100);

            var item = $('#js-tree-select-wrapper').jstree(true).get_selected();
            console.log('ite---------------m', item);
            $mdDialog.hide({status: 'agree', data: {item: item[0]}}); */

			$mdDialog.hide({status: 'agree', data: {item: vm.activeNodes[0].id}});
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        var init = function () {

        	vm.classifierTreeEventService = new EventService();

			vm.getTree();

			vm.classifierTreeEventService.addEventListener(directivesEvents.CLASSIFIER_TREE_CHANGED, () => {
                updateClassifier()
            })

		};

		init();

    };

})();