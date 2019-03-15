/**
 * Created by mevstratov on 14.03.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('BookmarksEditSelectedDialogController', 'initialized');

        var vm = this;

        var bookmarkData = data;
        var bookmarkCurrentLayoutId = bookmarkData.original.list_layout;

        vm.readyStatus = false;
        vm.itemIsFolder = true;
        vm.bookmarkName = bookmarkData.text;
        vm.bookmarkLayoutName = "";

        vm.getBookmarkLayoutName = function (layoutName, layoutContentType) {
            vm.bookmarkLayoutName = layoutName + " " + "(" + layoutContentType + ")";
        };

        if (bookmarkData.children.length === 0) {
            vm.itemIsFolder = false;

            var sortLayoutsBy = {
                sort: {
                    key: 'content_type',
                    direction: 'DSC'
                }
            };

            uiService.getListLayout('all', sortLayoutsBy).then(function (data) {
                var layouts = data.results;

                if (bookmarkCurrentLayoutId) {
                    // find bookmark's current layout name
                    var i;
                    for (i = 0; i < layouts.length; i++) {
                        if (layouts[i].id === bookmarkCurrentLayoutId) {
                            vm.getBookmarkLayoutName(layouts[i].name, layouts[i].content_type);
                            break;
                        }
                    }

                }

                vm.readyStatus = true;

            });

        } else {
            vm.readyStatus = true;
        }

        vm.editBookmarkLayout = function ($event) {

            $mdDialog.show({
                controller: 'BookmarksLayoutSelectDialogController as vm',
                templateUrl: 'views/dialogs/bookmarks-layout-select-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                autoWrap: true,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {

                    if (res.data.listLayoutId && bookmarkCurrentLayoutId !== res.data.listLayoutId) {
                        bookmarkData.a_attr.state = res.data.state;
                        bookmarkData.a_attr.list_layout = res.data.listLayoutId;

                        var newLayoutName = res.data.name;
                        var newLayoutContentType = res.data.content_type;

                        vm.getBookmarkLayoutName(newLayoutName, newLayoutContentType);
                    }

                }
            });


        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
           bookmarkData.text = vm.bookmarkName;

          $mdDialog.hide({
              status: 'agree',
              item: bookmarkData
          });
        }

    }

}());