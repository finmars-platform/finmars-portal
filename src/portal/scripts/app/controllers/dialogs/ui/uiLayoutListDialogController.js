/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var uiService = require('../../../services/uiService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var bookmarkService = require('../../../services/bookmarkService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('UiLayoutListDialogController', 'initalized');

        var vm = this;

        vm.readyStatus = {items: false};

        //var contentType = metaContentTypesService.getContentTypeUIByEntity(options.entityType);

        //console.log('contentType', contentType);

        vm.getList = function () {

            uiService.getListLayout(options.entityType).then(function (data) {
                vm.items = data.results;
                vm.readyStatus.items = true;
                $scope.$apply();
            });

        };

        var deleteLayout = function (layoutId) {

            bookmarkService.getList().then(function (data){
               if (data.results) {

                   var bookmarks = data.results;
                   var deleteBookmarksPromise = [];

                   bookmarks.forEach(function (bookmark){

                       if (bookmark.list_layout === layoutId) {
                           deleteBookmarksPromise.push(bookmarkService.deleteByKey(bookmark.id));
                       }

                   });

                   Promise.all(deleteBookmarksPromise).then(function (delBookmarksData) {

                       uiService.deleteListLayoutByKey(layoutId).then(function (data) {
                           vm.getList();

                       });
                   });
               };
            });
        };

        vm.getList();

        vm.deleteItem = function (ev, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure to delete layout? All bookmarks related to it will be deleted as well.'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    // uiService.deleteListLayoutByKey(item.id).then(function (data) {
                    //     vm.getList();
                    // });
                    deleteLayout(item.id);
                }
            })
        };

        vm.selectLayout = function (item) {
            vm.items.forEach(function (item) {
                item.is_default = false;
            });

            item.is_default = true;
        };


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            var promises = [];

            vm.items.forEach(function (item) {

                promises.push(uiService.updateListLayout(item.id, item));

            });

            Promise.all(promises).then(function () {

                $mdDialog.hide({status: 'agree'});

            });
        };

    }

}());