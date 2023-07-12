/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    const uiService = require('../../services/uiService');
    const toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, configurationService, globalDataService) {

        var vm = this;

        vm.configuration_code = globalDataService.getDefaultConfigurationCode();

        vm.configurationCodeUpdated = function (code) {

            vm.configuration_code = code

            vm.getData()

        }

        vm.initData = function () {
            var defaultComplexTransactionTextFields = [{
                "key": "user_text_1", "name": "User Text 1"
            }, {
                "key": "user_text_2", "name": "User Text 2"
            }, {
                "key": "user_text_3", "name": "User Text 3"
            }, {
                "key": "user_text_4", "name": "User Text 4"
            }, {
                "key": "user_text_5", "name": "User Text 5"
            }, {
                "key": "user_text_6", "name": "User Text 6"
            }, {
                "key": "user_text_7", "name": "User Text 7"
            }, {
                "key": "user_text_8", "name": "User Text 8"
            }, {
                "key": "user_text_9", "name": "User Text 9"
            }, {
                "key": "user_text_10", "name": "User Text 10"
            }, {
                "key": "user_text_11", "name": "User Text 11"
            }, {
                "key": "user_text_12", "name": "User Text 12"
            }, {
                "key": "user_text_13", "name": "User Text 13"
            }, {
                "key": "user_text_14", "name": "User Text 14"
            }, {
                "key": "user_text_15", "name": "User Text 15"
            }, {
                "key": "user_text_16", "name": "User Text 16"
            }, {
                "key": "user_text_17", "name": "User Text 17"
            }, {
                "key": "user_text_18", "name": "User Text 18"
            }, {
                "key": "user_text_19", "name": "User Text 19"
            }, {
                "key": "user_text_20", "name": "User Text 20"
            }, {
                "key": "user_text_21", "name": "User Text 21"
            }, {
                "key": "user_text_22", "name": "User Text 22"
            }, {
                "key": "user_text_23", "name": "User Text 23"
            }, {
                "key": "user_text_24", "name": "User Text 24"
            }, {
                "key": "user_text_25", "name": "User Text 25"
            }, {
                "key": "user_text_26", "name": "User Text 26"
            }, {
                "key": "user_text_27", "name": "User Text 27"
            }, {
                "key": "user_text_28", "name": "User Text 28"
            }, {
                "key": "user_text_29", "name": "User Text 29"
            }, {
                "key": "user_text_30", "name": "User Text 30"
            }];

            var defaultComplexTransactionNumberFields = [{
                "key": "user_number_1", "name": "User Number 1"
            }, {
                "key": "user_number_2", "name": "User Number 2"
            }, {
                "key": "user_number_3", "name": "User Number 3"
            }, {
                "key": "user_number_4", "name": "User Number 4"
            }, {
                "key": "user_number_5", "name": "User Number 5"
            }, {
                "key": "user_number_6", "name": "User Number 6"
            }, {
                "key": "user_number_7", "name": "User Number 7"
            }, {
                "key": "user_number_8", "name": "User Number 8"
            }, {
                "key": "user_number_9", "name": "User Number 9"
            }, {
                "key": "user_number_10", "name": "User Number 10"
            }, {
                "key": "user_number_11", "name": "User Number 11"
            }, {
                "key": "user_number_12", "name": "User Number 12"
            }, {
                "key": "user_number_13", "name": "User Number 13"
            }, {
                "key": "user_number_14", "name": "User Number 14"
            }, {
                "key": "user_number_15", "name": "User Number 15"
            }, {
                "key": "user_number_16", "name": "User Number 16"
            }, {
                "key": "user_number_17", "name": "User Number 17"
            }, {
                "key": "user_number_18", "name": "User Number 18"
            }, {
                "key": "user_number_19", "name": "User Number 19"
            }, {
                "key": "user_number_20", "name": "User Number 20"
            }];

            var defaultComplexTransactionDateFields = [{
                "key": "user_date_1", "name": "User Date 1"
            }, {
                "key": "user_date_2", "name": "User Date 2"
            }, {
                "key": "user_date_3", "name": "User Date 3"
            }, {
                "key": "user_date_4", "name": "User Date 4"
            }, {
                "key": "user_date_5", "name": "User Date 5"
            }];

            vm.complexTransactionTextFields = defaultComplexTransactionTextFields.concat();
            vm.complexTransactionNumberFields = defaultComplexTransactionNumberFields.concat();
            vm.complexTransactionDateFields = defaultComplexTransactionDateFields.concat();

            var defaultTransactionTextFields = [{
                "key": "user_text_1", "name": "User Text 1"
            }, {
                "key": "user_text_2", "name": "User Text 2"
            }, {
                "key": "user_text_3", "name": "User Text 3"
            }];

            var defaultTransactionNumberFields = [{
                "key": "user_number_1", "name": "User Number 1"
            }, {
                "key": "user_number_2", "name": "User Number 2"
            }, {
                "key": "user_number_3", "name": "User Number 3"
            }];

            var defaultTransactionDateFields = [{
                "key": "user_date_1", "name": "User Date 1"
            }, {
                "key": "user_date_2", "name": "User Date 2"
            }, {
                "key": "user_date_3", "name": "User Date 3"
            }];

            vm.transactionTextFields = defaultTransactionTextFields.concat();
            vm.transactionNumberFields = defaultTransactionNumberFields.concat();
            vm.transactionDateFields = defaultTransactionDateFields.concat();

            var defaultInstrumentTextFields = [{
                "key": "user_text_1", "name": "User Text 1"
            }, {
                "key": "user_text_2", "name": "User Text 2"
            }, {
                "key": "user_text_3", "name": "User Text 3"
            }];

            vm.instrumentTextFields = defaultInstrumentTextFields.concat();
        }

        vm.readyStatus = {
            content: false,
            complexTransactionProcessing: false,
            transactionProcessing: false,
            instrumentProcessing: false
        };

        vm.getData = function () {

            vm.initData();

            vm.readyStatus.content = false;

            var promises = [];

            const getComplexTransactionProm = new Promise((resolve, reject) => {

                uiService.getComplexTransactionFieldList({
                    pageSize: 1000,
                    filters: {
                        configuration_code: vm.configuration_code
                    }

                }).then(function (data) {

                    data.results.forEach(function (field) {

                        vm.complexTransactionTextFields.forEach(function (textField) {

                            if (textField.key === field.key) {
                                textField.is_active = field.is_active;
                                textField.name = field.name;
                                textField.id = field.id;
                            }

                        });

                        vm.complexTransactionNumberFields.forEach(function (numberField) {

                            if (numberField.key === field.key) {
                                numberField.is_active = field.is_active;
                                numberField.name = field.name;
                                numberField.id = field.id;
                            }

                        });

                        vm.complexTransactionDateFields.forEach(function (dateField) {

                            if (dateField.key === field.key) {
                                dateField.is_active = field.is_active;
                                dateField.name = field.name;
                                dateField.id = field.id;
                            }

                        })

                    });

                    console.log('here?123123', vm.textFields);
                    resolve();

                }).catch(error => reject(error));

            });

            promises.push(getComplexTransactionProm);

            const getTransactionProm = new Promise((resolve, reject) => {

                uiService.getTransactionFieldList({
                    pageSize: 1000,
                    filters: {
                        configuration_code: vm.configuration_code
                    }
                }).then(function (data) {

                    data.results.forEach(function (field) {

                        vm.transactionTextFields.forEach(function (textField) {

                            if (textField.key === field.key) {
                                textField.is_active = field.is_active;
                                textField.name = field.name;
                                textField.id = field.id;
                            }

                        });

                        vm.transactionNumberFields.forEach(function (numberField) {

                            if (numberField.key === field.key) {
                                numberField.is_active = field.is_active;
                                numberField.name = field.name;
                                numberField.id = field.id;
                            }

                        });

                        vm.transactionDateFields.forEach(function (dateField) {

                            if (dateField.key === field.key) {
                                dateField.is_active = field.is_active;
                                dateField.name = field.name;
                                dateField.id = field.id;
                            }

                        })

                    });

                    resolve();

                }).catch(error => reject(error));

            });

            promises.push(getTransactionProm);

            const getInstrumentProm = new Promise((resolve, reject) => {

                uiService.getInstrumentFieldList({
                    filters: {
                        configuration_code: vm.configuration_code
                    }
                }).then(function (data) {

                    data.results.forEach(function (field) {

                        vm.instrumentTextFields.forEach(function (textField) {

                            if (textField.key === field.key) {
                                // textField.is_active = field.is_active;
                                textField.name = field.name;
                                textField.id = field.id;
                            }

                        });

                    });

                    resolve();

                }).catch(error => reject(error));

            });


            promises.push(getInstrumentProm);

            return new Promise(resolve => {

                Promise.allSettled(promises).then(function () {

                    vm.readyStatus.content = true;
                    $scope.$apply();

                    resolve();

                });

            });

        };

        const updateOrCreateField = (item, updateFn, saveFn) => {

            // TODO maybe need refactor

            item.configuration_code = vm.configuration_code;
            item.user_code = vm.configuration_code + ":" + item.key

            return new Promise(async (resolve, reject) => {

                let promise;

                if (item.id) { // update field if it is already exist
                    promise = updateFn(item.id, item);

                } else { // or create new one
                    promise = saveFn(item);
                }

                try {
                    await promise;
                    resolve(null);

                } catch (error) {
                    reject(error);
                }

            });

        };

        vm.createOrUpdateComplexTransactionFields = item => {

            return updateOrCreateField(item, uiService.updateComplexTransactionField, uiService.createComplexTransactionField);

        };

        vm.createOrUpdateTransactionFields = item => {

            return updateOrCreateField(item, uiService.updateTransactionField, uiService.createTransactionField);

        };

        vm.createOrUpdateInstrumentFields = item => {

            return updateOrCreateField(item, uiService.updateInstrumentField, uiService.createInstrumentField);

        };

        const afterAllFieldsSavePromisesSettled = function (fieldsSavePromisesList) {

            return new Promise(resolve => {

                // const fieldsSavePromisesList = await
                Promise.allSettled(fieldsSavePromisesList).then(async (promisesList) => {

                    const rejectedPromiseIndex = promisesList.findIndex(promise => promise.status === "rejected");

                    if (rejectedPromiseIndex === -1) {

                        await vm.getData();
                        toastNotificationService.success('Changes have been saved');

                    } else {
                        toastNotificationService.error('Error occurred while trying to save fields');
                    }

                    resolve();

                });

            });

        };

        vm.saveComplexTransactionFields = async function () {

            if (!vm.readyStatus.complexTransactionProcessing) { // if there is no unresolved ttype fields promises

                const promises = [];

                vm.readyStatus.complexTransactionProcessing = true;

                vm.complexTransactionTextFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateComplexTransactionFields(field));
                });

                vm.complexTransactionNumberFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateComplexTransactionFields(field));
                });

                vm.complexTransactionDateFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateComplexTransactionFields(field));
                });

                await afterAllFieldsSavePromisesSettled(promises);


                vm.readyStatus.complexTransactionProcessing = false;
                $scope.$apply();

            }

        };


        vm.saveTransactionFields = async function () {

            if (!vm.readyStatus.transactionProcessing) { // if there is no unresolved ttype fields promises

                const promises = [];

                vm.readyStatus.transactionProcessing = true;

                vm.transactionTextFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateTransactionFields(field));
                });

                vm.transactionNumberFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateTransactionFields(field));
                });

                vm.transactionDateFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateTransactionFields(field));
                });

                await afterAllFieldsSavePromisesSettled(promises);


                vm.readyStatus.transactionProcessing = false;
                $scope.$apply();

            }

        };

        vm.saveInstrumentFields = async function () {

            if (!vm.readyStatus.instrumentProcessing) { // if there is no unresolved instrument fields promises

                vm.readyStatus.instrumentProcessing = true;

                const promises = [];

                vm.instrumentTextFields.forEach(function (field) {
                    promises.push(vm.createOrUpdateInstrumentFields(field));
                });

                await afterAllFieldsSavePromisesSettled(promises);

                vm.readyStatus.instrumentProcessing = false;

                $scope.$apply();

            }

        };

        vm.getConfigurations = function () {
            configurationService.getList().then(function (data) {

                vm.configuration_codes = data.results.filter(function (item) {
                    return !item.is_package; // TODO Move to backend filtering someday
                }).map(function (item) {
                    return item.configuration_code;
                })

                $scope.$apply();

            })
        }

        vm.init = function () {

            vm.readyStatus.content = false;

            vm.getConfigurations();

            vm.getData();

        };


        vm.init();
    }

}());