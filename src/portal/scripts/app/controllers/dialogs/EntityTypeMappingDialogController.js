/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entityTypeMappingResolveService = require('../../services/entityTypeMappingResolveService');
    var entityResolverService = require('../../services/entityResolverService');
    var instrumentAttributeTypeService = require('../../services/instrument/instrumentAttributeTypeService');

    module.exports = function ($scope, $mdDialog, mapEntityType) {

        logService.controller('EntityTypeMappingDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};
        vm.entityItems = [];
        vm.mapEntityType = mapEntityType;

        console.log('mapEntityType', mapEntityType);

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.fancyEntity = function () {
            return mapEntityType.replace('_', ' ');
        };

        console.log(entityResolverService.getList(mapEntityType));

        var classifier_value_type = 30;

        function addChilds(classifier, item) {

            vm.entityItems.push({
                value_type: classifier.value_type,
                classifier: classifier.id,
                name: item.name,
                id: item.id,
                level: item.level
            });

            if (item.children && item.children.length) {
                addChilds(item.children);
            }
        }

        if (mapEntityType == 'classifier') {
            instrumentAttributeTypeService.getListByAttributeType([classifier_value_type]).then(function (data) {

                data.results.forEach(function (classifier) {
                    classifier.classifiers.forEach(function (item) {

                        addChilds(classifier, item);

                    })
                });

                entityTypeMappingResolveService.getList(mapEntityType).then(function (data) {
                    if (data.hasOwnProperty('results')) {
                        vm.items = data.results;
                    } else {
                        vm.items = data

                    }
                    var i, e;
                    for (e = 0; e < vm.entityItems.length; e = e + 1) {
                        for (i = 0; i < vm.items.length; i = i + 1) {
                            if (vm.items[i][mapEntityType] == vm.entityItems[e].id) {
                                vm.entityItems[e].mapping = vm.items[i]
                            }
                        }
                    }

                    console.log('!!!!!!!!!!!!!!!', vm.entityItems);

                    vm.readyStatus.content = true;
                    $scope.$apply();
                });
            })
        } else {

            entityResolverService.getList(mapEntityType).then(function (data) {
                if (data.hasOwnProperty('results')) {
                    vm.entityItems = data.results;
                } else {
                    vm.entityItems = data;
                }
                entityTypeMappingResolveService.getList(mapEntityType).then(function (data) {
                    if (data.hasOwnProperty('results')) {
                        vm.items = data.results;
                    } else {
                        vm.items = data
                    }
                    var i, e;
                    for (e = 0; e < vm.entityItems.length; e = e + 1) {
                        for (i = 0; i < vm.items.length; i = i + 1) {
                            if (vm.items[i][mapEntityType] == vm.entityItems[e].id) {
                                vm.entityItems[e].mapping = vm.items[i]
                            }
                        }
                    }

                    console.log('!!!!!!!!!!!!!!!', vm.entityItems);

                    vm.readyStatus.content = true;
                    $scope.$apply();
                });
            });
        }


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            var i = 0;

            function updateRow() {
                console.log('i', i);
                console.log(vm.entityItems[i]);
                if (i < vm.entityItems.length) {
                    if (!vm.entityItems[i].hasOwnProperty('mapping')) {
                        i = i + 1;
                        updateRow();
                        return false;
                    }
                    if (vm.entityItems[i].hasOwnProperty('mapping') && !vm.entityItems[i].mapping.hasOwnProperty('id')) {
                        vm.entityItems[i].mapping.provider = 1; //TODO FIND PROVIDER ID?
                        if (mapEntityType == 'classifier') {

                            vm.entityItems[i].mapping['attribute_type'] = vm.entityItems[i].classifier;

                            if (vm.entityItems[i].value_type == 30) {
                                vm.entityItems[i].mapping.classifier = vm.entityItems[i].id
                            }

                        } else {
                            vm.entityItems[i].mapping[mapEntityType] = vm.entityItems[i].id;
                        }

                        return entityTypeMappingResolveService.create(mapEntityType, vm.entityItems[i].mapping).then(function () {
                            i = i + 1;
                            updateRow();
                            return false;
                        })
                    }
                    return entityTypeMappingResolveService.update(mapEntityType, vm.entityItems[i].mapping.id, vm.entityItems[i].mapping).then(function () {
                        i = i + 1;
                        updateRow();
                        return false;
                    })
                }
            }

            updateRow();

            $mdDialog.hide({status: 'agree'});
        };
    }

}());