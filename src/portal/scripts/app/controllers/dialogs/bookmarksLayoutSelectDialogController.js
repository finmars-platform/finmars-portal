/**
 * Created by szhitenev on 06.02.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        function contentTypeToState(contentType) {

            var result = '';

            metaContentTypesService.getListForUi().forEach(function (item) {

                if (item.key == contentType) {

                    if (contentType.indexOf('reports') == 0) {
                        result = 'app.reports.' + item.entity;
                    } else {
                        result = 'app.data.' + item.entity;
                    }
                }

            });

            return result;
        }

        logService.controller('BookmarksLayoutSelectDialogController', 'initialized');

        vm.readyStatus = {content: false};

        var sortLayoutsBy = {
            sort: {
                key: 'content_type',
                direction: 'DSC'
            }
        };

        uiService.getListLayout('all', sortLayoutsBy).then(function (data) {
            vm.items = data.results;

            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.selectedLayoutId = null;

        vm.selectLayout = function (item) {
            vm.selectedLayoutId = item.id;
            vm.selectedContentType = item.content_type;
        };

        vm.agree = function () {
            $mdDialog.hide({
                status: 'agree',
                data: {listLayoutId: vm.selectedLayoutId, state: contentTypeToState(vm.selectedContentType)}
            });
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());