/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

    var usersGroupService = require('../../services/usersGroupService');
    var usersService = require('../../services/usersService');

    var layoutService = require('../../services/layoutService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaPermissionsService = require('../../services/metaPermissionsService');

    var uiService = require('../../services/uiService');

    var entityEditorHelper = require('../../helpers/entity-editor.helper');

    module.exports = function ($scope, $mdDialog, $state, entityType, entity) {

        console.log('EntityViewerAddDialog entityType, entity', entityType, entity);

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = entityType;

        vm.entity = {$_isValid: true};

        if (Object.keys(entity).length) { // make copy option
            vm.entity = entity;
        }

        vm.entityTabs = metaService.getEntityTabs(vm.entityType);

        vm.attrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();
        vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

        vm.formIsValid = true;
        vm.range = gridHelperService.range;

        vm.attributesLayout = [];

        vm.generateAttributesFromLayoutFields = function () {

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

                            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                                if (field.name === vm.entityAttrs[e].name) {
                                    vm.entityAttrs[e].options = field.options;
                                    fieldResult = vm.entityAttrs[e];
                                }
                            }

                            for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                                if (field.name === vm.layoutAttrs[l].name) {
                                    vm.layoutAttrs[l].options = field.options;
                                    fieldResult = vm.layoutAttrs[l];
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

            console.log('vm.attributesLayout', vm.attributesLayout);

        };

        vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.readyStatus.permissions = true;

                vm.setPermissionsDefaults();

                $scope.$apply();

            });

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.getGroupList = function () {

            return usersGroupService.getList().then(function (data) {

                vm.groups = data.results.filter(function (item) {

                    return item.role === 2;

                });


                // vm.groups.forEach(function (group) {
                //
                //     if (vm.entity.object_permissions) {
                //         vm.entity.object_permissions.forEach(function (permission) {
                //
                //             if (permission.group === group.id) {
                //                 if (!group.hasOwnProperty('objectPermissions')) {
                //                     group.objectPermissions = {};
                //                 }
                //                 if (permission.permission === "manage_" + vm.entityType.split('-').join('')) {
                //                     group.objectPermissions.manage = true;
                //                 }
                //                 if (permission.permission === "change_" + vm.entityType.split('-').join('')) {
                //                     group.objectPermissions.change = true;
                //                 }
                //                 if (permission.permission === "view_" + vm.entityType.split('-').join('')) {
                //                     group.objectPermissions.view = true;
                //                 }
                //             }
                //         })
                //     }
                //
                // });

            });

        };

        vm.setPermissionsDefaults = function () {

            var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType);
            var table;
            var isCreator;

            // console.log('vm.groups', vm.groups);
            // console.log('vm.currentMember.groups', vm.currentMember.groups);

            vm.groups.forEach(function (group) {

                if (group.permission_table && group.permission_table.data) {

                    table = group.permission_table.data.find(function (item) {
                       return item.content_type === contentType
                    }).data;

                    isCreator = vm.currentMember.groups.indexOf(group.id) !== -1;

                    group.objectPermissions = {};

                    if (isCreator) {

                        if (table.creator_manage) {
                            group.objectPermissions.manage = true;
                        }

                        if (table.creator_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.creator_view) {
                            group.objectPermissions.view = true;
                        }


                    } else {

                        if (table.other_manage) {
                            group.objectPermissions.manage = true;
                        }

                        if (table.other_change) {
                            group.objectPermissions.change = true;
                        }

                        if (table.other_view) {
                            group.objectPermissions.view = true;
                        }


                    }

                }


            });

        };

        vm.entityTypeSlug = function () {
            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.editLayout = function (ev) {

            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: ev,
                preserveScope: true,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    // vm.readyStatus.entity = false;
                    vm.readyStatus.content = false;

                    vm.init();

                    vm.layoutAttrs = layoutService.getLayoutAttrs();
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

                }

            });

        };

        vm.manageAttrs = function (ev) {

            var entityAddress = {entityType: vm.entityType};
            $state.go('app.attributesManager', entityAddress);
            $mdDialog.hide();

        };


        vm.getFormLayout = function () {

            uiService.getEditLayout(vm.entityType).then(function (data) {

                if (data.results.length && data.results.length > 0 && data.results[0].data) {
                    vm.tabs = data.results[0].data;
                } else {
                    vm.tabs = uiService.getDefaultEditLayout(vm.entityType)[0].data;
                }

                vm.tabs = vm.tabs.map(function (item, index) {

                    item.index = index;

                    return item

                });

                vm.getAttributeTypes().then(function (value) {

                    entityViewerHelperService.transformItem(vm.entity, vm.attrs);

                    vm.generateAttributesFromLayoutFields();

                    vm.readyStatus.content = true;
                    vm.readyStatus.entity = true;
                    // vm.readyStatus.permissions = true;

                    $scope.$apply();

                });

            });
        };

        vm.getAttributeTypes = function () {
            return attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.content && vm.readyStatus.entity && vm.readyStatus.permissions
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

                            for (var i = item.column; i < columnsToSpan; i = i + 1) {
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

        vm.checkViewState = function (tab) {

            if (tab.hasOwnProperty('enabled')) {
                if (tab.enabled.indexOf(vm.evAction) == -1) {
                    return false;
                }
            }

            return true;
        };

        vm.updateEntityBeforeSave = function () {

            console.log('updateEntityBeforeSave vm.entity', vm.entity);


            if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) === -1) {

                vm.entity.attributes = [];

                vm.attrs.forEach(function (attributeType) {

                    var value = vm.entity[attributeType.user_code];

                    vm.entity.attributes.push(entityEditorHelper.appendAttribute(attributeType, value));

                });
            }

            vm.entity.object_permissions = [];
            console.log('vm.groups', vm.groups);

            if (vm.groups) {
                vm.groups.forEach(function (group) {

                    if (group.objectPermissions && group.objectPermissions.manage === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "manage_" + vm.entityType.split('-').join('')
                        })
                    }

                    if (group.objectPermissions && group.objectPermissions.change === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "change_" + vm.entityType.split('-').join('')
                        })
                    }
                    if (group.objectPermissions && group.objectPermissions.view === true) {
                        vm.entity.object_permissions.push({
                            member: null,
                            group: group.id,
                            permission: "view_" + vm.entityType.split('-').join('')
                        })
                    }

                });
            }

        };

        vm.save = function ($event) {

            vm.updateEntityBeforeSave();

            vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(vm.entity, vm.entityAttrs, vm.attrs);

            console.log('vm.entity before save', vm.entity);

            if (vm.entity.$_isValid) {

                var resultEntity = entityEditorHelper.removeNullFields(vm.entity);

                console.log('resultEntity', resultEntity);

                entityResolverService.create(vm.entityType, resultEntity).then(function (data) {

                    $mdDialog.hide({res: 'agree', data: data});

                }).catch(function (data) {

                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        parent: angular.element(document.body),
                        locals: {
                            validationData: data
                        },
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true
                    })

                })

            }

        };

        vm.init = function () {

            vm.getFormLayout();

            vm.loadPermissions();


        };

        vm.init();

    }

}());