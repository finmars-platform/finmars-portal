/**
 * Created by mevstratov on 18.01.2020.
 */
(function () {

    'use strict';

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var attributeTypeService = require('../../services/attributeTypeService');

    var uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog, inputFormTabs, data) {

        var vm = this;

        vm.entityType = data.entityType;

        vm.entity = {$_isValid: true};

        vm.tabs = inputFormTabs;

        vm.readyStatus = {attrs: false, userFields: false};


        vm.attrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.range = gridHelperService.range;

        vm.attributesLayout = [];

        vm.generateAttributesFromLayoutFields = function () {

            vm.attributesLayout = [];

            var tabResult;
            var fieldResult;
            var i, l, e;

            vm.tabs.forEach(function (tab) {

                tabResult = [];

                tab.layout.fields.forEach(function (field) {

                    fieldResult = {};

                    if (field && field.type === 'field') {

                        if (field.attribute_class === 'attr') {

                            for (i = 0; i < vm.attrs.length; i = i + 1) {

                                if (field.key) {

                                    if (field.key === vm.attrs[i].user_code) {
                                        vm.attrs[i].options = field.options;
                                        fieldResult = vm.attrs[i];
                                    }

                                } else {

                                    if (field.attribute.user_code) {

                                        if (field.attribute.user_code === vm.attrs[i].user_code) {
                                            vm.attrs[i].options = field.options;
                                            fieldResult = vm.attrs[i];
                                        }

                                    }

                                }


                            }

                        } else {

                            var attrFound = false;

                            for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                                if (field.name === vm.layoutAttrs[l].name) {
                                    vm.layoutAttrs[l].options = field.options;
                                    fieldResult = vm.layoutAttrs[l];

                                    attrFound = true;
                                    break;
                                }
                            }

                            if (!attrFound) {
                                for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                    if (field.name === vm.entityAttrs[e].name) {
                                        vm.entityAttrs[e].options = field.options;
                                        fieldResult = vm.entityAttrs[e];
                                        break;
                                    }
                                }
                            }

                        }

                        if (field.backgroundColor) {
                            fieldResult.backgroundColor = field.backgroundColor;
                        }

                    }

                    tabResult.push(fieldResult)


                });

                vm.attributesLayout.push(tabResult);

            });

        };

        /*vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.entity.object_permissions.forEach(function (perm) {

                    if (perm.permission === "change_" + vm.entityType.split('-').join('')) {

                        if (vm.currentMember.groups.indexOf(perm.group) !== -1) {
                            vm.hasEditPermission = true;
                        }

                    }

                });

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.hasEditPermission = true;
                    vm.canManagePermissions = true;
                }

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.checkPermissions = function () {

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }

            if (vm.currentMember && vm.currentMember.is_admin) {
                return true
            }

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var haveAccess = false;

            vm.entity.object_permissions.forEach(function (item) {

                if (item.permission === permission_code && vm.currentMember.groups.indexOf(item.group) !== -1) {
                    haveAccess = true;
                }

            });

            return haveAccess;
        };*/

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.getFormLayoutFields = function () {

            vm.tabs = vm.tabs.map(function (item, index) {

                item.index = index;

                return item

            });

            vm.getAttributeTypes().then(function () {

                entityViewerHelperService.transformItem(vm.entity, vm.attrs);

                vm.generateAttributesFromLayoutFields();

                vm.readyStatus.attrs = true;

                if (vm.entityType === 'instrument') {
                    vm.getInstrumentUserFields();
                } else {
                    vm.readyStatus.userFields = true;
                }

                $scope.$apply();

            });

        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.attrs && vm.readyStatus.userFields;
        };

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

        vm.checkFieldRender = function (tab, row, field) {

            if (field.row === row) {
                if (field.type === 'field') {
                    return true;
                } else {

                    var spannedCols = [];
                    var itemsInRow = tab.layout.fields.filter(function (item) {
                        return item.row === row
                    });

                    itemsInRow.forEach(function (item) {

                        if (item.type === 'field' && item.colspan > 1) {
                            var columnsToSpan = item.column + item.colspan - 1;

                            for (var i = item.column; i <= columnsToSpan; i = i + 1) {
                                spannedCols.push(i);
                            }

                        }

                    });

                    if (spannedCols.indexOf(field.column) !== -1) {
                        return false
                    }

                    return true;
                }
            }
            return false;

        };

        vm.getInstrumentUserFields = function () {

            uiService.getInstrumentFieldList().then(function (data) {

                data.results.forEach(function (userField) {

                    vm.tabs.forEach(function (tab) {

                        tab.layout.fields.forEach(function (field) {

                            if (field.attribute && field.attribute.key) {

                                if (field.attribute.key === userField.key) {

                                    if (!field.options) {
                                        field.options = {};
                                    }

                                    field.options.fieldName = userField.name;
                                }

                            }

                        })

                    })

                });

                vm.readyStatus.userFields = true;

                $scope.$apply();

            })

        };

        var init = function () {
            vm.getAttributeTypes();

            vm.getFormLayoutFields();
        };

        init();

    }

}());