(function () {

    'use strict';
    var explorerService = require('../../services/explorerService');
    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;
        vm.alreadyMadeRequests = [];
        vm.path = '';
        var options = {}

        vm.listFiles = function (path) {
            if (!path) {
                options = {
                    path: '',
                    page: 1,
                    pageSize: 100
                }
            } else {
                options.path = path;
            }
            return explorerService.listFiles(options).then(function (dataResult) {

                const itemsData = dataResult.results.filter(function (item) {
                    return !(item.name[0] === '.' && !vm.showHiddenFiles);
                });
                return vm.buildTreeData(itemsData, path);
            });
        };

        vm.buildTreeData = function (data, nodePath) {
            return data.map(function (item) {
                return {
                    path: nodePath,
                    text: item.name,
                    type: item.type === 'dir' ? 'folder' : 'file',
                    children: item.type === 'dir' ? [] : null
                };
            });
        };

        vm.listFiles(vm.path).then(function (treeData) {
            $('#jstree_explorer').jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": { "stripes": true },
                    'data': [
                        {
                            'text': 'Root',
                            'state': { 'opened': true, 'selected': true },
                            'children': treeData
                        }
                    ]
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

            $('#jstree_explorer').on('changed.jstree', function (e, data) {
                var node = data.node;
                vm.path = "";
                if(node) {
                    let nodeParents = [...node.parents];
                    nodeParents.sort((a, b) => {
                        // Always move '#' to the end
                        if (a === "#") return 1;
                        if (b === "#") return -1;

                        // Sort the remaining strings alphabetically
                        return a.localeCompare(b);
                    });

                    nodeParents.forEach((parent) => {
                        if (parent !== "#" && document.getElementById(parent + '_anchor').text === "Root") {
                            return;
                        }
                        if (parent === "#") {
                            vm.path = vm.path + node.text;
                        } else {
                            vm.path = vm.path  + document.getElementById(parent + '_anchor').text + '/';
                        }
                    })
                    if (vm.path === "Root") {
                        vm.path = "";
                    }
                    if(!vm.alreadyMadeRequests.includes(vm.path)) {
                        vm.listFiles(vm.path).then(function (treeDataChild) {
                            if (treeDataChild.length) {
                                treeDataChild.forEach(function (childData) {
                                    $('#jstree_explorer').jstree(
                                      'create_node',
                                      $('#'+ node.id),        // Parent node selector
                                      childData,             // Node data to be added
                                      'last',                // Position in parent
                                      false,                 // Do not select node after creation
                                      false                  // Do not open node after creation
                                    );
                                });
                            }
                        });
                        vm.alreadyMadeRequests.push(vm.path);
                    }

                }

            });
            $scope.$apply();

        });
        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {path: vm.path}});
        };
        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };
    };

})();
