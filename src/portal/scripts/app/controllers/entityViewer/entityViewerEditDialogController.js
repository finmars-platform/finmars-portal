/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';
    var logService = require('../../services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var entityResolverService = require('../../services/entityResolverService');

    var uiService = require('../../services/uiService');

    var gridHelperService = require('../../services/gridHelperService');
    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    module.exports = function ($scope, $mdDialog, parentScope, entity, $state) {

        logService.controller('EntityViewerEditDialogController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};
        vm.entityType = parentScope.entityType;

        logService.property('entity', entity);
        logService.property('entityType', vm.entityType);

        uiService.getEditLayout(vm.entityType).then(function (data) {
            vm.tabs = data.results[0].data;
            logService.collection('vm.tabs', vm.tabs);
            $scope.$apply();
        });

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        attributeTypeService.getList(vm.entityType).then(function (data) {
            vm.attrs = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        vm.entity = entity;

        var originatorEv;

        vm.range = gridHelperService.range;

        vm.bindFlex = function (tab, row, field) {
            var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
            var flexUnit = 100 / tab.layout.columns;
            return Math.floor(field.colspan * flexUnit);

        };

        vm.bindField = function (tab, field) {
            var i, l, e;
            //console.log('FIELD', field);
            if (field.type === 'field') {
                if (field.hasOwnProperty('id')) {
                    for (i = 0; i < vm.attrs.length; i = i + 1) {
                        if (field.id === vm.attrs[i].id) {
                            return vm.attrs[i];
                        }
                    }
                } else {
                    for (i = 0; i < vm.baseAttrs.length; i = i + 1) {
                        if (field.name === vm.baseAttrs[i].name) {
                            return vm.baseAttrs[i];
                        }
                    }
                    for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                        if (field.name === vm.entityAttrs[e].name) {
                            return vm.entityAttrs[e];
                        }
                    }
                    for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                        if (field.name === vm.layoutAttrs[l].name) {
                            return vm.layoutAttrs[l];
                        }
                    }
                }
            }
        };

        vm.checkFieldRender = function (tab, row, field) {
            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {
                    var i, c, x;
                    var spannedCols = [];
                    for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                        if (tab.layout.fields[i].row === row) {

                            if (tab.layout.fields[i].type === 'field') {
                                for(c = tab.layout.fields[i].column; c <= (tab.layout.fields[i].column + tab.layout.fields[i].colspan - 1); c = c + 1) {
                                    spannedCols.push(c);
                                }
                            }
                        }
                    }
                    for(x = 0; x < spannedCols.length; x = x + 1) {
                        if(spannedCols[x] === field.column) {
                            return false;
                        }
                    }

                    return true;
                }
            }
            return false;
        };

        vm.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.editLayout = function(ev){
            $state.go('app.data-constructor', {entityType: vm.entityType});
            $mdDialog.hide();
        };

        vm.save = function () {
            logService.property('vm.entity', vm.entity);
            console.log(entityResolverService);
            entityResolverService.update(vm.entityType, vm.entity.id, vm.entity).then(function (data) {
                console.log('saved!', data);
                $mdDialog.hide();
            })
        };

    }

}());