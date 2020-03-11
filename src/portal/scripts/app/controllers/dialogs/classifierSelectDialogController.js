/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.classifierId = data.classifier.id;
        vm.classifierValue = data.classifierId;


        vm.getTree = function () {

            $('#js-tree-select-wrapper').remove();

            attributeTypeService.getByKey(vm.entityType, vm.classifierId).then(function (data) {

                console.log('DATA', data);

                $('.js-tree-holder-dialog-select').append('<div id="js-tree-select-wrapper" class="js-tree-select" style="width: 100%; overflow: hidden"></div>');

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
                });

            });
        };

        vm.getTree();

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
                    $('#js-tree-select-wrapper').jstree(true).destroy();
                    attributeTypeService.update(vm.entityType, res.data.classifier.id, res.data.classifier).then(function () {
                        vm.getTree();
                    });
                }
            });
        };

        vm.agree = function () {
            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.classifierSelectorElemToDrag');
            }, 100);

            var item = $('#js-tree-select-wrapper').jstree(true).get_selected();
            console.log('ite---------------m', item);
            $mdDialog.hide({status: 'agree', data: {item: item[0]}});
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


    };

}());