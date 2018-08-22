/**
 * Created by szhitenev on 06.02.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var bookmarkService = require('../../services/bookmarkService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        logService.controller('BookmarksWizardDialogController', 'initialized');

        vm.deletedNodes = [];


        bookmarkService.getList().then(function (data) {

            function setText(item) {
                item.text = item.name;
                item.type = 'default';
                if (item.children.length) {
                    item.type = 'folder';
                }
                item.children = item.children.map(setText);
                return item
            }

            var items = data.results.map(setText);

            $('#jstree_demo').jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": {"stripes": true},
                    'data': [
                        {
                            'text': 'Bookmark panel',
                            'state': {'opened': true, 'selected': true},
                            'children': items
                        }
                    ]
                },
                "types": {
                    "#": {
                        "valid_children": ["Bookmark panel"]
                    },
                    "Bookmark panel": {
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
            $scope.$apply();
        });


        vm.createNode = function ($event) {
            var ref = $('#jstree_demo').jstree(true),
                sel = ref.get_selected();

            $mdDialog.show({
                controller: 'BookmarksLayoutSelectDialogController as vm',
                templateUrl: 'views/dialogs/bookmarks-layout-select-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {}
            }).then(function (res) {
                if (res.status === 'agree') {
                    ref.set_type(sel, 'folder');
                    sel = sel[0];

                    sel = ref.create_node(sel, {
                        "type": "default",
                    });

                    $('#jstree_demo').jstree(true).get_node(sel).a_attr.state = res.data.state;
                    $('#jstree_demo').jstree(true).get_node(sel).a_attr.list_layout = res.data.listLayoutId;


                    //"list_layout": res.data.listLayoutId,
                    //    "state": res.data.state

                    if (sel) {
                        ref.edit(sel);
                    }
                }
            });


        };


        vm.renameNode = function () {
            var ref = $('#jstree_demo').jstree(true),
                sel = ref.get_selected();
            if (!sel.length) {
                return false;
            }
            sel = sel[0];
            ref.edit(sel);
        };

        vm.deleteNode = function () {
            var ref = $('#jstree_demo').jstree(true),
                sel = ref.get_selected();
            if (!sel.length) {
                return false;
            }

            vm.deletedNodes.push(sel);

            ref.delete_node(sel);
        };

        vm.agree = function () {

            var ref = $('#jstree_demo').jstree(true);
            var data = ref.get_json('#');
            console.log('ref', data);


            var promisesDel = [];

            vm.deletedNodes.forEach(function (itemId) {

                promisesDel.push(bookmarkService.deleteByKey(itemId))

            });

            Promise.all(promisesDel).then(function () {

                var promises = [];

                data[0].children.forEach(function (item) {

                    item.name = item.text;

                    if (!item.hasOwnProperty('children')) {
                        item.children = [];
                    }

                    item.children.forEach(function (subItem) {
                        subItem.name = subItem.text;
                    });

                    if (isNaN(parseInt(item.id, 10))) {
                        item.list_layout = item.a_attr.list_layout;
                        item.data.state = item.a_attr.state;
                        delete item.id;

                        item.children.forEach(function(subItem){

                            console.log('subItem CREATE', subItem);

                            if (isNaN(parseInt(subItem.id, 10))) {
                                subItem.list_layout = subItem.a_attr.list_layout;
                                subItem.data.state = subItem.a_attr.state;
                                delete subItem.id;
                            }
                        });

                        promises.push(bookmarkService.create(item));

                    } else {

                        item.children.forEach(function(subItem){

                            if (isNaN(parseInt(subItem.id, 10))) {

                                subItem.list_layout = subItem.a_attr.list_layout;
                                subItem.data.state = subItem.a_attr.state;
                                delete subItem.id;
                            }

                        });

                        promises.push(bookmarkService.update(item.id, item));
                    }
                });

                Promise.all(promises).then(function () {
                    $mdDialog.hide({status: 'agree', data: {}});
                });
            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());