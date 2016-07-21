/**
 * Created by szhitenev on 28.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../services/logService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports =  function($scope, $mdDialog, data){

        var vm = this;

        attributeTypeService.getByKey(data.entityType, data.classifier.id).then(function (data) {

            function setText(item) {
                item.text = item.name;
                item.type = 'default';
                if (item.children.length) {
                    item.type = 'folder';
                }
                item.children = item.children.map(setText);
                return item
            }

            var tree = data.classifiers.map(setText);

            console.log('atatatata');

            $('#jstree_demo').jstree({
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
            $('#jstree_demo').jstree(true).show_dots();
            $scope.$apply();

        });


        vm.agree = function(){
            var item = $('#jstree_demo').jstree(true).get_selected();
            //console.log('item', item);
            $mdDialog.hide({status: 'agree', data: {item: item[0]}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };



    };

}());