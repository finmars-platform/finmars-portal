/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.item = data.item;

        console.log('vm.item', vm.item);

        vm.readyStatus = {content: false};

        vm.file = null;
        vm.mode = 'skip';

        vm.checkExtension = function (file, extension, $event) {
            console.log('file', file);

            if (file) {

                var ext = file.name.split('.').at(-1);

                if (ext !== extension) {

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        parent: document.querySelector(".dialog-containers-wrap"),
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "Warning!",
                                description: 'You are trying to load incorrect file'
                            }
                        },
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function () {

                        vm.file = null;
                    });

                }

            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            var reader = new FileReader();

            reader.readAsText(vm.file);

            reader.onload = function (evt) {

                try {

                    console.log('evt.target', evt.target);

                    var file = evt.target.result;

                    console.log('file', file);

                    var lines = file.split(/\r\n|\n|\r/);

                    console.log('lines', lines);

                    lines.splice(0, 1);

                    console.log('lines', lines);


                    if (vm.mode === 'skip') {

                        var itemsExists = [];

                        vm.classifier.classifiers.forEach(function (item) {
                            itemsExists.push(item.name);
                        });

                        lines.forEach(function (line) {

                            if (itemsExists.indexOf(line) === -1) {

                                vm.classifier.classifiers.push({
                                    name: line
                                })

                            }

                        });

                        attributeTypeService.update(vm.entityType, vm.classifier.id, vm.classifier).then(function () {

                            $mdDialog.show({
                                controller: 'SuccessDialogController as vm',
                                templateUrl: 'views/dialogs/success-dialog-view.html',
                                parent: document.querySelector(".dialog-containers-wrap"),
                                targetEvent: $event,
                                locals: {
                                    success: {
                                        title: "Success!",
                                        description: 'You are successfully import classifiers'
                                    }
                                },
                                multiple: true,
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true
                            }).then(function (value) {

                                $mdDialog.hide({status: 'agree'});

                            })

                        });


                    }

                    if (vm.mode === 'overwrite') {

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/dialogs/warning-dialog-view.html',
                            parent: document.querySelector('.dialog-containers-wrap'),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            locals: {
                                warning: {
                                    title: 'Warning',
                                    description: 'The current classifications will be permanently deleted and all the assigned classification for this User Attribute will be lost.<br/> Do you want to proceed?',
                                    actionsButtons: [
                                        {
                                            name: "CANCEL",
                                            response: {}
                                        },
                                        {
                                            name: "OK, PROCEED",
                                            response: {status: 'agree'}
                                        }
                                    ]
                                }
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true
                        }).then(function (res) {
                            console.log('res', res);
                            if (res.status === 'agree') {


                                vm.classifier.classifiers = [];
                                vm.classifier.classifiers_flat = [];

                                attributeTypeService.update(vm.entityType, vm.classifier.id, vm.classifier).then(function () {

                                    vm.classifier.classifiers = lines.map(function (line) {
                                        return {
                                            name: line
                                        }
                                    });

                                    vm.classifier.classifiers_flat = [];

                                    attributeTypeService.update(vm.entityType, vm.classifier.id, vm.classifier).then(function () {

                                        $mdDialog.show({
                                            controller: 'SuccessDialogController as vm',
                                            templateUrl: 'views/dialogs/success-dialog-view.html',
                                            parent: document.querySelector(".dialog-containers-wrap"),
                                            targetEvent: $event,
                                            locals: {
                                                success: {
                                                    title: "Success!",
                                                    description: 'You are successfully import classifiers'
                                                }
                                            },
                                            multiple: true,
                                            preserveScope: true,
                                            autoWrap: true,
                                            skipHide: true
                                        }).then(function (value) {
                                            $mdDialog.hide({status: 'agree'});
                                        });

                                    })

                                })

                            }
                        });
                    }


                } catch (error) {

                    console.log('error', error);

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Error',
                                description: 'Unable to read it. This file is corrupted.'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    });

                    vm.file = null;


                }

            }


        };

        vm.getClassifier = function () {

            vm.readyStatus.content = false;

            attributeTypeService.getByKey(vm.entityType, vm.item.id).then(function (data) {

                vm.classifier = data;

                vm.readyStatus.content = true;

                $scope.$apply();

            })
        };

        vm.init = function () {
            vm.getClassifier()
        };

        vm.init();
    }

}());