/**
 * Created by szhitenev on 14.06.2016.
 */
(function () {

    'use strict';
    var logService = require('../../../../core/services/logService');

    var attributeTypeService = require('../services/attributeTypeService');

    var metaService = require('../services/metaService').default;

    module.exports = function ($scope, $state, $stateParams, $mdDialog) {

        logService.controller('AttributesManagerController', 'initialized');

        var vm = this;

        vm.showHidden = false;

        var choices = metaService.getDynamicAttrsValueTypesCaptions();
        vm.attrs = [];

        vm.entityType = $stateParams.entityType;
        vm.fromEntityType = $stateParams.from;
        vm.isInstanceId = $stateParams.instanceId;

        vm.getList = function () {

            attributeTypeService.getList(vm.entityType, {pageSize: 1000}).then(function (data) {
                vm.attrs = data.results;

                $scope.$apply();
            });
        };

        vm.addAttribute = function (ev) {
            $mdDialog.show({
                controller: 'AttributeTypeDialogController as vm',
                templateUrl: 'views/attribute-type-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.getList();
                }
            });
        };

        vm.bindType = function (item) {
            var i;
            for (i = 0; i < choices.length; i = i + 1) {
                if (item["value_type"] === choices[i].value) {
                    return choices[i]["caption_name"];
                }
            }
        };

        function setName(item) {
            item.name = item.text;
            if (item.id.indexOf('j') !== -1) {
                delete item['li_attr'];
                delete item['state'];
                delete item['icon'];
                delete item['a_attr'];
                delete item['data'];
                delete item['text'];
                delete item['type'];
                delete item.id;
            }
            item.children = item.children.map(setName);
            return item;
        }

        vm.editTreeAttr = function (ev, item) {
            $mdDialog.show({
                controller: 'ClassificationEditorDialogController as vm',
                templateUrl: 'views/classification-editor-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                locals: {
                    data: {
                        classifier: item,
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);

                    res.data.classifier.classifiers = res.data.classifier.children.map(setName);

                    attributeTypeService.update(vm.entityType, res.data.classifier.id, res.data.classifier).then(function () {
                        vm.getList();
                    });
                }
            });
        };

        vm.openClassifierMapping = function ($event, item) {
            console.log("import classifier item", item);
            $mdDialog.show({
                controller: 'EntityTypeClassifierMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-classifier-mapping-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    options: {
                        entityType: vm.entityType,
                        id: item.id
                    }
                }
            })

        };

        vm.importClassifiers = function ($event, item) {

            $mdDialog.show({
                controller: 'ClassifierImportDialogController as vm',
                templateUrl: 'views/dialogs/classifier-import-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        item: item
                    }
                }
            })


        };

        vm.exportClassifiers = function ($event, item) {

            $mdDialog.show({
                controller: 'ClassifierExportDialogController as vm',
                templateUrl: 'views/dialogs/classifier-export-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        item: item
                    }
                }
            })


        };

        vm.editAttr = function (ev, item) {
            $mdDialog.show({
                controller: 'AttributesTypeDialogController as vm',
                templateUrl: 'views/attribute-type-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                locals: {
                    data: {
                        id: item.id,
                        entityType: vm.entityType
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    vm.getList();
                }
            });
        };

        vm.toggleHidden = function () {
            vm.showHidden = !vm.showHidden;
        };

        vm.getReturnSref = function () {

            if (vm.entityType.indexOf('strategy-') !== -1) {

                var strategyNumber = vm.entityType.split('-')[1];
                return 'app.portal.data.strategy({strategyNumber: ' + strategyNumber + '})';

            } else {
                return 'app.portal.data.' + vm.entityType;
            }
            switch (vm.entityType) {
                case '':
                    break;
            }
        };

        vm.checkIsHidden = function (attribute) {
            if (vm.showHidden == false && attribute.is_hidden == true) {
                return false;
            }
            return true;
        };

        vm.editLayout = function () {
            var entityAddress = {entityType: vm.entityType};
            if (vm.fromEntityType) {

                var entityType = vm.entityType;

                if (vm.fromEntityType === 'transaction-type') {
                    entityType = 'complex-transaction';
                }

                entityAddress = {entityType: entityType, from: vm.fromEntityType, instanceId: vm.isInstanceId};
            }
            $state.go('app.portal.data-constructor', entityAddress);
        };

        vm.deleteAttr = function (ev, item) {

            var description = 'Are you sure to delete attribute ' + item.name + ' ?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {
                    attributeTypeService.deleteByKey(vm.entityType, item.id).then(function (data) {
                        if (data.status === 'conflict') {
                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: document.querySelector('.dialog-containers-wrap'),
                                targetEvent: ev,
                                clickOutsideToClose: false,
                                locals: {
                                    info: {
                                        title: 'Notification',
                                        description: "You can not delete attributed that already in use"
                                    }
                                }
                            })
                        } else {
                            vm.getList();
                        }
                    });

                }

            });
        };

        vm.recalculateAttributes = function ($event, item) {

            console.log('attributes recalculate')

            attributeTypeService.getRecalculateAttributeCount(vm.entityType, item.id).then(function (data) {

                var description = 'Are you sure you want to recalculate ' + data.count + ' objects?';

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: description
                        }
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true
                }).then(function (res) {
                    console.log('res', res);
                    if (res.status === 'agree') {

                        attributeTypeService.recalculateAttributes(vm.entityType, item.id).then(function (value) {

                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: document.querySelector('.dialog-containers-wrap'),
                                targetEvent: $event,
                                clickOutsideToClose: false,
                                locals: {
                                    info: {
                                        title: 'Success',
                                        description: "<p>Recalculation in progress.</p> <p>If you would like to check progress, please go to <a href='/#!/processes' target='_blank'>Active Processes Page</a>.</p>"
                                    }
                                }
                            })

                        })

                    }
                })

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    }

}());