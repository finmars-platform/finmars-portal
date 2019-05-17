/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope) {

        console.log('here?');

        var vm = this;

        var defaultTextFields = [
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

        var defaultNumberFields = [
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

        var defaultDateFields = [
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

        vm.textFields = defaultTextFields.concat();
        vm.numberFields = defaultNumberFields.concat();
        vm.dateFields = defaultDateFields.concat();

        vm.readyStatus = {content: false, processing: false};

        vm.getData = function () {

            uiService.getTransactionFieldList().then(function (data) {

                data.results.forEach(function (field) {

                    vm.textFields.forEach(function (textField) {

                        if (textField.key === field.key) {
                            textField.name = field.name;
                            textField.id = field.id;
                        }

                    });

                    vm.numberFields.forEach(function (numberField) {

                        if (numberField.key === field.key) {
                            numberField.name = field.name
                            numberField.id = field.id
                        }

                    });

                    vm.dateFields.forEach(function (dateField) {

                        if (dateField.key === field.key) {
                            dateField.name = field.name
                            dateField.id = field.id
                        }

                    })

                });

                console.log('here?123123', vm.textFields);

                vm.readyStatus.content = true;
                $scope.$apply();

            });

        };

        vm.createOrUpdate = function (item) {

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

        vm.save = function () {

            vm.readyStatus.processing = true;

            var promises = [];

            vm.textFields.forEach(function (field) {
                promises.push(vm.createOrUpdate(field));
            });

            vm.numberFields.forEach(function (field) {
                promises.push(vm.createOrUpdate(field));
            });

            vm.dateFields.forEach(function (field) {
                promises.push(vm.createOrUpdate(field));
            });

            Promise.all(promises).then(function (data) {

                vm.readyStatus.processing = false;

                vm.getData();

            });


        };

        vm.init = function () {

            vm.readyStatus.content = false;

            vm.getData();

        };

        vm.init();
    }

}());