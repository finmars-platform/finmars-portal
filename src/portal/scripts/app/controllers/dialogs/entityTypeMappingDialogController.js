/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entityTypeMappingResolveService = require('../../services/entityTypeMappingResolveService');
    var entityResolverService = require('../../services/entityResolverService');
    var instrumentAttributeTypeService = require('../../services/instrument/instrumentAttributeTypeService');

    module.exports = function ($scope, $mdDialog, mapItem) {

        logService.controller('EntityTypeMappingDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};
        vm.entityItems = [];
        vm.entityItemsCount = null;
        vm.mapItem = mapItem;
        vm.mapEntityType = mapItem.complexExpressionEntity;

        var entitiesWithoutCount = ['periodicity',
            'accrual-calculation-model',
            'daily-pricing-model',
            'payment-size-detail'];

        var page = 1;
        vm.pageSize = 40;

        var lastPageReached = false;

        var formatEntityForMapping = function () {
            vm.mapEntityType = vm.mapEntityType.replace(/_/g, '-')
        };

        formatEntityForMapping();

        if (entitiesWithoutCount.indexOf(vm.mapEntityType) !== -1) {
            vm.pageSize = 1000
        }

        vm.itemsProvider = {
            // ui scroll parameters
            // index - position of first item in list of scrolled items
            // count - amount of items to scroll before load more
            get: function (index, count, callback) {

                var result = [];

                var startItem = index;
                var endItem = index + count;
                if (startItem < 0 || startItem === 0) {
                    startItem = 0;
                }

                if (vm.entityItemsCount === vm.entityItems.length) {
                    lastPageReached = true;
                }

                // if scroll reached last item, load more
                if (index + count >= vm.entityItems.length && !lastPageReached) {
                    page = page + 1;

                    vm.getDataEntity().then(function (value) {

                        result = vm.entityItems.slice(startItem, endItem);

                        callback(result);

                    }).catch(function (reason) {

                        result = vm.entityItems.slice(startItem, endItem);

                        callback(result);

                    })

                } else {

                    result = vm.entityItems.slice(startItem, endItem);

                    callback(result);

                    console.log('mapping ui scroll result', result, startItem, endItem);
                }

            }
        };

        console.log('mapEntityType', vm.mapEntityType);

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.bindEntityName = function (item) {

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('user_code')) {
                return item.name + ' (' + item.user_code + ')'
            }

            return item.name;

        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.addMapping = function (item, index) {
            item.mapping.splice(index, 0, {value: ''});
        };

        vm.removeMapping = function (item, mappingItem, index) {

            if (mappingItem.hasOwnProperty('id')) {
                mappingItem.isDeleted = true;
            } else {
                item.mapping.splice(index, 1);
            }

        };

        function addChilds(classifier, item) {

            // console.log('item', item);

            vm.entityItems.push({
                value_type: classifier.value_type,
                classifier: classifier.id,
                name: item.name,
                id: item.id,
                level: item.level
            });

            if (item.children && item.children.length > 0) {
                item.children.forEach(function (childItem) {
                    addChilds(classifier, childItem);
                })
            }
        }

        vm.getDataClassifier = function () {

            instrumentAttributeTypeService.getByKey(vm.mapItem.attribute_type).then(function (data) {

                console.log('classifier data', data);

                [data].forEach(function (classifier) {

                    console.log('classifier', classifier);

                    classifier.classifiers.forEach(function (item) {

                        addChilds(classifier, item);

                    })
                });

                entityTypeMappingResolveService.getList(vm.mapEntityType).then(function (data) {
                    if (data.hasOwnProperty('results')) {
                        vm.items = data.results;
                    } else {
                        vm.items = data
                    }

                    console.log('vm.items', vm.items);

                    var i, e;
                    for (e = 0; e < vm.entityItems.length; e = e + 1) {
                        for (i = 0; i < vm.items.length; i = i + 1) {

                            if (vm.items[i].classifier == vm.entityItems[e].id) {

                                if (!vm.entityItems[e].hasOwnProperty('mapping')) {
                                    vm.entityItems[e].mapping = [];
                                }

                                vm.entityItems[e].mapping.push(vm.items[i])

                            }
                        }
                    }

                    vm.entityItems.forEach(function (entityItem) {
                        if (!entityItem.hasOwnProperty('mapping')) {
                            entityItem.mapping = [{value: ''}];
                        }
                    });

                    vm.readyStatus.content = true;
                    $scope.$apply();
                });
            })

        };

        vm.getDataEntity = function () {

            return new Promise(function (resolve, reject) {

                var options = {
                    page: page,
                    pageSize: vm.pageSize
                };

                entityResolverService.getList(vm.mapEntityType, options).then(function (data, error) {

                    if (entitiesWithoutCount.indexOf(vm.mapEntityType) === -1) {
                        console.log('mapping data to concat', data.results, vm.entityItems);
                        vm.entityItems = vm.entityItems.concat(data.results);
                    } else {
                        vm.entityItems = vm.entityItems.concat(data);
                        lastPageReached = true;
                    }

                    if (data.count) {
                        vm.entityItemsCount = data.count;
                    }

                    // TODO entityTypeMappingResolveService load all mappings in its first use. Prevent repeated invocation of it when using vm.getDataEntity.
                    entityTypeMappingResolveService.getList(vm.mapEntityType).then(function (data) {

                        vm.items = data.results;

                        var i, e;
                        for (e = 0; e < vm.entityItems.length; e = e + 1) {
                            for (i = 0; i < vm.items.length; i = i + 1) {

                                if (vm.items[i].content_object === vm.entityItems[e].id) {

                                    if (!vm.entityItems[e].hasOwnProperty('mapping')) {
                                        vm.entityItems[e].mapping = [];
                                        vm.entityItems[e].mapping.push(vm.items[i])
                                    }
                                    else {
                                        // check if there is same item in mapping array
                                        var alreadyMapped = false;
                                        vm.entityItems[e].mapping.forEach(function (mappingItem) {
                                            if (mappingItem.id === vm.items[i].id) {
                                                alreadyMapped = true;
                                            }
                                        });

                                        if (!alreadyMapped) {
                                            vm.entityItems[e].mapping.push(vm.items[i]);
                                        }
                                    }
                                }
                            }
                        }

                        vm.entityItems.forEach(function (entityItem) {
                            if (!entityItem.hasOwnProperty('mapping')) {
                                entityItem.mapping = [{value: ''}];
                            }
                        });

                        vm.readyStatus.content = true;
                        resolve($scope.$apply());

                    });
                }, function (error) {
                    lastPageReached = true;
                    page = page - 1;
                    reject($scope.$apply());
                });

            });

        };

        vm.cancel = function () {
            $mdDialog.hide();
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

                    if (vm.entityItems[i].mapping.length) {

                        vm.entityItems[i].mapping.forEach(function (mapItem) {

                            if (!mapItem.hasOwnProperty('id')) {
                                mapItem.provider = 1; //TODO FIND PROVIDER ID?
                                if (vm.mapEntityType == 'classifier') {

                                    mapItem['attribute_type'] = vm.entityItems[i].classifier;

                                    if (vm.entityItems[i].value_type == 30) {
                                        mapItem.classifier = vm.entityItems[i].id
                                    }
                                    mapItem.content_object = mapItem.attribute_type;

                                } else {
                                    //vm.entityItems[i].mapping[vm.mapEntityType] = vm.entityItems[i].id;
                                    mapItem.content_object = vm.entityItems[i].id;
                                }

                                if (mapItem.value !== '') {

                                    return entityTypeMappingResolveService.create(vm.mapEntityType, mapItem).then(function () {
                                        i = i + 1;
                                        updateRow();
                                        return false;
                                    })

                                } else {
                                    i = i + 1;
                                    updateRow();
                                    return false;
                                }
                            }

                            if (mapItem.isDeleted === true) {
                                return entityTypeMappingResolveService.deleteByKey(vm.mapEntityType, mapItem.id).then(function () {
                                    i = i + 1;
                                    updateRow();
                                    return false;
                                })
                            }

                            return entityTypeMappingResolveService.update(vm.mapEntityType, mapItem.id, mapItem).then(function () {
                                i = i + 1;
                                updateRow();
                                return false;
                            })
                        })
                    }
                }
            }

            updateRow();

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            if (vm.mapEntityType === 'classifier') {
                vm.getDataClassifier();
            } else {
                vm.getDataEntity();
            }

        };

        vm.init();
    }

}());