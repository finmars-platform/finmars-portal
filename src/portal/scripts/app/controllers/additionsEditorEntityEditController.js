/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    var attributeTypeService = require('../services/attributeTypeService');
    var entityResolverService = require('../services/entityResolverService');

    var uiService = require('../services/uiService');

    var gridHelperService = require('../services/gridHelperService');
    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');


    // codemonkey

    module.exports = function ($scope, $state, $mdDialog) {

        logService.controller('AdditionsEditorEntityEditController', 'initialized');

        //console.log('scope', $scope);

        var vm = this;

        vm.readyStatus = {content: false};
        vm.entityType = $scope.$parent.entityType;
        vm.entity = {attributes: []};
        vm.entityId = '';

        vm.readyStatus.entityId = false;

        $scope.$parent.$watch('itemId', function (newItemId) {
            vm.readyStatus.entityId = false;
            setTimeout(function () {
                vm.entityId = newItemId;
                if (vm.entityId !== undefined) {
                    vm.readyStatus.entityId = true;
                }
                $scope.$apply();
            }, 100)

        });

        vm.editLayout = function () {
            $state.go('app.data-constructor', {entityType: vm.entityType});
        };

        vm.save = function () {
            vm.saveCallback().then(function (options) {

                entityResolverService.update(options.entityType, options.entityId, options.entity).then(function () {
                    $mdDialog.hide({res: 'agree'});
                });
            })
        };

    }

}());