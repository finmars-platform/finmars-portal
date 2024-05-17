/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService').default;

    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, usersService, usersGroupService,metaContentTypesService, data) {

        var vm = this;

        vm.readyStatus = {attribute: false};

        vm.processing = false;

        vm.attribute = {};

        vm.valueTypes = [
            {
                name: 'Number',
                value: 20
            },
            {
                name: 'Text',
                value: 10
            },
            {
                name: 'Date',
                value: 40
            },
            {
                name: 'Classification',
                value: 30
            }
        ];

        vm.agree = function ($event) {

            console.log('vm.attribute', vm.attribute);

            vm.processing = true;

            if (vm.id) {

                attributeTypeService.update(vm.entityType, vm.attribute.id, vm.attribute).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                }).catch(function (reason) {

                    vm.processing = false;
                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: true,
                        locals: {
                            info: {
                                title: 'Warning',
                                description: reason
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    })
                })

            } else {

                attributeTypeService.create(vm.entityType, vm.attribute).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                }).catch(function (reason) {

                    vm.processing = false;

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: true,
                        locals: {
                            info: {
                                title: 'Warning',
                                description: reason
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    })
                })


            }

        };

        vm.getItem = function () {

            attributeTypeService.getByKey(vm.entityType, vm.id).then(function (data) {

                vm.attribute = data;

                console.log('vm.attribute', vm.attribute);

                vm.readyStatus.attribute = true;

                $scope.$apply();
            });

        }

        vm.makeCopy = function ($event) {

            var attribute = JSON.parse(JSON.stringify(vm.attribute));

            delete attribute.id;
            attribute.user_code = attribute.user_code + '_copy';

            if (attribute.classifiers) {

                delete attribute.classifiers_flat

                attribute.classifiers = attribute.classifiers.map(function (item){

                    delete item.id; // TODO maybe an issue if nested classifiers, refactor later 2023-05-16

                    return item
                })

            }

            var copyPromise = $mdDialog.show({
                controller: 'AttributeTypeDialogController as vm',
                templateUrl: 'views/attribute-type-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        attribute: attribute
                    }
                }
            });

            $mdDialog.hide({status: 'copy', dialogPromise: copyPromise});

        };

        var init = function () {

            vm.entityType = data.entityType;
            vm.id = data.id;

            if (data.attribute) {
                vm.attribute = data.attribute;
            }

            if (vm.id) {

                vm.getItem();

            } else {

                vm.attribute.content_type = metaContentTypesService.findContentTypeByEntity(vm.entityType);

                vm.readyStatus.attribute = true;

            }

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.attrManagerElemToResize');
            }, 100);
        };

        init();

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

    }

}());