/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var entityResolverService = require('../../services/entityResolverService');

    var usersService = require('../../services/usersService');

    var uiService = require('../../services/uiService');

    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    var metaPermissionsService = require('../../services/metaPermissionsService');

    module.exports = function ($scope, $mdDialog, parentScope, $state) {

        logService.controller('EntityViewerAddDialogController', 'initialized');

        logService.property('parentScope', parentScope);

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = parentScope.vm.entityType;
        vm.evAction = 'create';

        vm.cancel = function () {
            localStorage.setItem('entityIsChanged', false);
            $mdDialog.cancel();
        };

        vm.editLayout = function () {
            $state.go('app.data-constructor', {entityType: vm.entityType});
            $mdDialog.hide();
        };

        vm.save = function () {
            vm.saveCallback().then(function (options) {

                entityResolverService.create(options.entityType, options.entity).then(function () {
                    $mdDialog.hide({res: 'agree'});
                });

            })
        };

    }

}());