/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var entityTypeClassifierMappingResolveService = require('../../services/entityTypeClassifierMappingResolveService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('EntityTypeClassifierMappingDialogController', 'initialized');

        var vm = this;

        vm.init = function () {

            vm.readyStatus = {content: false};
            vm.items = [];
            vm.options = options;


            vm.getClassifier();

        };

        vm.contentTypeToEntity = function (contentType) {

            var entity = '';

            if (contentType.indexOf('.') === -1) {
                entity = contentType;
            } else {
                entity = contentType.split('.')[1];
            }

            return entity;

        };

        vm.getClassifier = function () {

            var entity = vm.contentTypeToEntity(vm.options.entity);

            attributeTypeService.getByKey(entity, vm.options.attribute_type_id).then(function (data) {

                vm.classifier = data;

                vm.items = data.classifiers_flat;

                entityTypeClassifierMappingResolveService.getList(entity, vm.options.attribute_type_id).then(function (data) {

                    var mappingItems = data.results;

                    vm.items = vm.items.map(function (item) {

                        item.mapping = [];

                        mappingItems.forEach(function (mapItem) {

                            if (mapItem.content_object === item.id) {
                                item.mapping.push(mapItem);
                            }

                        });

                        return item;

                    });

                    vm.readyStatus.content = true;

                    $scope.$apply();

                });


            });

        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
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

        vm.fancyEntity = function () {

            var entity = vm.contentTypeToEntity(vm.options.entity);

            return entity.replace('_', ' ');
        };


        vm.getAction = function (mapItem) {

            if (!mapItem.hasOwnProperty('id')) {
                return 'create';
            }

            if (mapItem.isDeleted === true) {
                return 'delete';
            }

            return 'update'

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            var entity = vm.contentTypeToEntity(vm.options.entity);

            vm.items.forEach(function (item) {

                item.mapping.forEach(function (mapItem) {

                    var action = vm.getAction(mapItem);

                    mapItem.provider = 1; //TODO fix it later?
                    mapItem.content_object = item.id;
                    mapItem.attribute_type = vm.classifier.id;

                    if (action === 'create') {
                        entityTypeClassifierMappingResolveService.create(entity, mapItem);
                    }

                    if (action === 'update') {
                        entityTypeClassifierMappingResolveService.update(entity, mapItem.id, mapItem);
                    }

                    if (action === 'delete') {
                        entityTypeClassifierMappingResolveService.deleteByKey(entity, mapItem.id);
                    }

                })

            });


            $mdDialog.hide({status: 'agree'});
        };

        vm.init();
    }

}());