(function(){

	var metaHelper = require('../../helpers/meta.helper').default;

    'use strict';

    module.exports = function($scope, $mdDialog, data) {

        var vm = this;

        vm.name = '';
        vm.valueType = data.valueType;
        vm.contentType = data.contentType;
        vm.defaultValue = data.defaultValue;
        vm.relationItems = data.relationItems;
        vm.valueTypeOptions = data.valueTypeOptions;
        vm.contentTypeOptions = [];
        vm.textEventSignal = {};
        vm.valueTypeSignal = {};
        vm.contentTypeSignal = {};
        vm.contextProperties = [];
        vm.defaultValuesItems = [];
        vm.valueExpression = null;
        vm.linkedInputsNames = [];

        vm.inputsForMultiselector = data.inputsForMultiselector;

        const getLiOptsCheckboxes = function () {

            if (vm.valueType === 120) {
                return null;

            } else {

                return {
                    selectedOptions: true,
                };

            }

        }

        vm.liOptsStrictOrder = true;
        vm.liOptsCheckboxes = getLiOptsCheckboxes();

        vm.expressionData = data.expressionData;

        vm.onValueTypeChange = function () {

            vm.contentType = null
            vm.contentTypeSignal = {}
            vm.contentTypeOptions = []

            vm.liOptsCheckboxes = getLiOptsCheckboxes();
            vm.liOptsStrictOrder = vm.valueType !== 120;

            if (vm.valueType === 110) {
                vm.contentTypeOptions = data.contentTypeOptions.selector

            } else if (vm.valueType === 100) {
                vm.contentTypeOptions = data.contentTypeOptions.relation
            }

            vm.onContentTypeChange();

        };

        /* var relationItemsResolver = function (contentType) {
            return data.relationItemsResolver(contentType)
        } */

		var loadRelation = function (fieldKey) {
			return data.loadRelationCallback(fieldKey);
		};

		var resolveRelation = function (contentType) {
			return data.resolveRelationCallback(contentType);
		};

        vm.onContentTypeChange = function () {
            vm.contextProperties = []
            vm.defaultValuesItems = []

            var contextProps = data.contextProperties[vm.contentType]
            if (contextProps) {
                vm.contextProperties = contextProps
            }

            if (!vm.contentType) {
                return;
            }

			/* var loadRelationRes = relationItemsResolver(vm.contentType);

			if (loadRelationRes && loadRelationRes.status === 'item_exist') {

				vm.defaultValuesItems = vm.relationItems[loadRelationRes.field]

			} else {

				loadRelationRes.then(function (relItem) {

					vm.defaultValuesItems = relItem
					$scope.$apply();

				});

			} */
			let fieldKey = resolveRelation(vm.contentType);
			// fieldKey = fieldKey.replace(/-/g, "_");

			if (data.loadedRelationsList.includes(fieldKey)) {
				vm.defaultValuesItems = vm.relationItems[fieldKey];

			} else if (fieldKey) {

				loadRelation(fieldKey).then(function (relItem) {

					vm.defaultValuesItems = relItem;
					$scope.$apply();

				});

			}

        };

        vm.isFillFromContentDisabled = function () {

            if (vm.contextProperties.length > 0) {
                return false;
            }

            return true;

        };

        vm.validateInputName = function () {

            /* var errorText = "";

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

            } */
            var occupiedInputNames = data.inputs.map(input => input.name);
			var errorText = metaHelper.validateTextForUserCode(vm.name, occupiedInputNames, "Input name");

            if (errorText) {

                vm.textEventSignal = {key: 'error', error: errorText}
                // $scope.$apply();
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
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            var fieldsAreValid = validateRequiredFields();

            if (fieldsAreValid) {

                var responseData = {
                    name: vm.name,
                    verbose_name: vm.verbose_name,
                    tooltip: vm.tooltip,
                    valueType: vm.valueType,
                    contentType: vm.contentType,
                    value: vm.defaultValue,
                    value_expr: vm.valueExpression,
                    linked_inputs_names: vm.linkedInputsNames,
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