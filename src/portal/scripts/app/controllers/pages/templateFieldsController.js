/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog) {

        console.log('here?');

        var vm = this;

        var defaultTransactionTypeTextFields = [
            {
                "key": "user_text_1",
                "name": "User Text 1"
            },
            {
                "key": "user_text_2",
                "name": "User Text 2"
            },
            {
                "key": "user_text_3",
                "name": "User Text 3"
            },
            {
                "key": "user_text_4",
                "name": "User Text 4"
            },
            {
                "key": "user_text_5",
                "name": "User Text 5"
            },
            {
                "key": "user_text_6",
                "name": "User Text 6"
            },
            {
                "key": "user_text_7",
                "name": "User Text 7"
            },
            {
                "key": "user_text_8",
                "name": "User Text 8"
            },
            {
                "key": "user_text_9",
                "name": "User Text 9"
            },
            {
                "key": "user_text_10",
                "name": "User Text 10"
            }
        ];

        var defaultTransactionTypeNumberFields = [
            {
                "key": "user_number_1",
                "name": "User Number 1"
            },
            {
                "key": "user_number_2",
                "name": "User Number 2"
            },
            {
                "key": "user_number_3",
                "name": "User Number 3"
            },
            {
                "key": "user_number_4",
                "name": "User Number 4"
            },
            {
                "key": "user_number_5",
                "name": "User Number 5"
            },
            {
                "key": "user_number_6",
                "name": "User Number 6"
            },
            {
                "key": "user_number_7",
                "name": "User Number 7"
            },
            {
                "key": "user_number_8",
                "name": "User Number 8"
            },
            {
                "key": "user_number_9",
                "name": "User Number 9"
            },
            {
                "key": "user_number_10",
                "name": "User Number 10"
            }
        ];

        var defaultTransactionTypeDateFields = [
            {
                "key": "user_date_1",
                "name": "User Date 1"
            },
            {
                "key": "user_date_2",
                "name": "User Date 2"
            },
            {
                "key": "user_date_3",
                "name": "User Date 3"
            },
            {
                "key": "user_date_4",
                "name": "User Date 4"
            },
            {
                "key": "user_date_5",
                "name": "User Date 5"
            }
        ];

        vm.transactionTypeTextFields = defaultTransactionTypeTextFields.concat();
        vm.transactionTypeNumberFields = defaultTransactionTypeNumberFields.concat();
        vm.transactionTypeDateFields = defaultTransactionTypeDateFields.concat();

        var defaultInstrumentTextFields = [
            {
                "key": "user_text_1",
                "name": "User Text 1"
            },
            {
                "key": "user_text_2",
                "name": "User Text 2"
            },
            {
                "key": "user_text_3",
                "name": "User Text 3"
            }
        ];

        vm.instrumentTextFields = defaultInstrumentTextFields.concat();

        vm.readyStatus = {
            content: false,
            transactionTypeProcessing: false,
            instrumentProcessing: false
        }

        vm.getData = function () {

            var promises = [];

            var getTransactionTypeFields = function() {

                return uiService.getTransactionFieldList().then(function (data) {

                    data.results.forEach(function (field) {

                        vm.transactionTypeTextFields.forEach(function (textField) {

                            if (textField.key === field.key) {
                                textField.name = field.name;
                                textField.id = field.id;
                            }

                        });

                        vm.transactionTypeNumberFields.forEach(function (numberField) {

                            if (numberField.key === field.key) {
                                numberField.name = field.name;
                                numberField.id = field.id;
                            }

                        });

                        vm.transactionTypeDateFields.forEach(function (dateField) {

                            if (dateField.key === field.key) {
                                dateField.name = field.name;
                                dateField.id = field.id;
                            }

                        })

                    });

                    console.log('here?123123', vm.textFields);

                });
            };

            promises.push(getTransactionTypeFields());

            var getInstrumentFields = function () {

                return uiService.getInstrumentFieldList().then(function (data) {

                    data.results.forEach(function (field) {

                        vm.instrumentTextFields.forEach(function (textField) {

                            if (textField.key === field.key) {
                                textField.name = field.name;
                                textField.id = field.id;
                            }

                        });

                    });

                });
            };

            promises.push(getInstrumentFields());

            Promise.all(promises).then(function () {
                vm.readyStatus.content = true;
                $scope.$apply();
            });

        };

        vm.createOrUpdateTransactionTypeFields = function (item) {

            return new Promise(function (resolve, reject) {

                if (item.id) {
                    uiService.updateTransactionField(item.id, item).then(function (data) {
                        resolve(data)
                    })
                } else {
                    uiService.createTransactionField(item).then(function (data) {
                        resolve(data)
                    })
                }

            })

        };

        vm.createOrUpdateInstrumentFields = function (item) {

            return new Promise(function (resolve, reject) {

                if (item.id) {
                    uiService.updateTransactionField(item.id, item).then(function (data) {
                        resolve(data)
                    })
                } else {
                    uiService.createTransactionField(item).then(function (data) {
                        resolve(data)
                    })
                }

            })

        };

        vm.saveTransactionTypeFields = function () {

            vm.readyStatus.transactionTypeProcessing = true;

            vm.transactionTypeTextFields.forEach(function (field) {
                promises.push(vm.createOrUpdateTransactionTypeFields(field));
            });

            vm.transactionTypeNumberFields.forEach(function (field) {
                promises.push(vm.createOrUpdateTransactionTypeFields(field));
            });

            vm.transactionTypeDateFields.forEach(function (field) {
                promises.push(vm.createOrUpdateTransactionTypeFields(field));
            });

            Promise.all(promises).then(function (data) {

                vm.getData();

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    locals: {
                        success: {
                            title: 'Success',
                            description: 'Changes have been saved'
                        }
                    },
                    autoWrap: true,
                    skipHide: true
                });

            }).catch(function (error) {

                $mdDialog({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Error',
                            description: 'Error occured while trying to save fields'
                        }
                    }
                });

            });

            vm.readyStatus.transactionTypeProcessing = false;

        };

        vm.saveInstrumentFields = function () {

            vm.readyStatus.instrumentProcessing = true;

            var promises = [];

            vm.instrumentTextFields.forEach(function (field) {
                promises.push(vm.createOrUpdateInstrumentFields(field));
            });

            Promise.all(promises).then(function (data) {

                vm.getData();

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    locals: {
                        success: {
                            title: 'Success',
                            description: 'Changes have been saved'
                        }
                    },
                    autoWrap: true,
                    skipHide: true
                });

            }).catch(function (error) {

                $mdDialog({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Error',
                            description: 'Error occured while trying to save fields'
                        }
                    }
                });

            });

            vm.readyStatus.instrumentProcessing = false;

        };

        vm.init = function () {

            vm.readyStatus.content = false;

            vm.getData();

        };


        vm.init();
    }

}());