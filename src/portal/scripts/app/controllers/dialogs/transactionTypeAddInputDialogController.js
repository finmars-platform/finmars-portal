(function(){

    'use strict';

    module.exports = function($scope, $mdDialog, data) {

        var vm = this;

        vm.name = ''
        vm.valueType = data.valueType
        vm.contentType = data.contentType

        vm.valueTypeOptions = data.valueTypeOptions
        vm.contentTypeOptions = []
        vm.textEventSignal = {}
        vm.valueTypeSignal = {}
        vm.contentTypeSignal = {}

        vm.onValueTypeChange = function () {

            vm.contentType = null
            vm.contentTypeSignal = {}
            vm.contentTypeOptions = []

            if (vm.valueType === 110) {
                vm.contentTypeOptions = data.contentTypeOptions.selector

            } else if (vm.valueType === 100) {
                vm.contentTypeOptions = data.contentTypeOptions.relation
            }

        };

        vm.validateInputName = function () {

            var errorText = "";

            if (!vm.name) {
                errorText += "Input name should not be empty.";
            }

            else if (vm.name.match('[^1-9a-zA-Z_]')) {
                errorText = "Only english letters and 1-9 numbers allowed for input name.";
            }

            else if (vm.name.match('^[0-9]')) {

                if (errorText) {
                    errorText += "\n";
                }

                errorText += "Input name should not start with number.";

            } else {

                for (var i = 0; i < data.inputs.length; i++) {

                    if (data.inputs[i].name === vm.name) {

                        errorText = "Name should be unique.";
                        break;

                    }

                }

            }

            if (errorText) {

                vm.textEventSignal = {key: 'error', error: errorText}
                $scope.$apply();
                return false;

            }

            return true;

        }

        var validateRequiredFields = function () {

            var fieldsAreValid = vm.validateInputName();

            if (!vm.valueType) {

                vm.valueTypeSignal = {key: 'error', error: "Value type should not be empty."}
                fieldsAreValid = false;

            } else if ((vm.valueType === 100 || vm.valueType === 110) && !vm.contentType) {

                vm.contentTypeSignal = {key: 'error', error: "Content type should not be empty."}
                fieldsAreValid = false;

            }

            return fieldsAreValid;

        }

        vm.contentTypeDisabled = function () {
            if (vm.valueType === 100 || vm.valueType === 110) {
                return false;
            }

            return true;
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            var fieldsAreValid = validateRequiredFields();

            if (fieldsAreValid) {

                var responseData = {
                    name: vm.name,
                    valueType: vm.valueType,
                    contentType: vm.contentType
                };

                $mdDialog.hide({status: 'agree', data: responseData});

            }

        };

        setTimeout(function () {
            vm.dialogElemToResize = document.querySelector('.ttypeAddInputElemToResize');
            $scope.$apply();
        }, 100);

    }

}());