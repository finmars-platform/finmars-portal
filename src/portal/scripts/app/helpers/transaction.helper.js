(function () {
    'use strict';

    var metaService = require('../services/metaService');
    var entityEditorHelper = require('./entity-editor.helper');

    var isUserInputUsedInTTypeExpr = function (userInput, transactionsTypeActions) {

        var i, a, b;
        for (i = 0; i < transactionsTypeActions.length; i++) {

            var action = transactionsTypeActions[i];
            var actionKeys = Object.keys(action);

            for (a = 0; a < actionKeys.length; a++) {

                var aKey = actionKeys[a];

                if (action[aKey] && typeof action[aKey] === 'object') {

                    var actionItem = action[aKey];
                    var actionItemKeys = Object.keys(actionItem);

                    for (b = 0; b < actionItemKeys.length; b++) {
                        var aItemKey = actionItemKeys[b];

                        if (aItemKey.indexOf('_input') &&
                            actionItem[aItemKey] === userInput.name) {

                            return true;

                        } else if (aItemKey.indexOf('_object') < 0 &&
                                   aItemKey !== 'action_notes') {

                            if ((aItemKey === 'notes' || !actionItem.hasOwnProperty(aItemKey + '_input')) &&
                                actionItem[aItemKey] && typeof actionItem[aItemKey] === 'string') {

                                var middleOfExpr = '[^A-Za-z_.]' + userInput.name + '(?![A-Za-z1-9_])';
                                var beginningOfExpr = '^' + userInput.name + '(?![A-Za-z1-9_])';

                                var inputRegExpObj = new RegExp(beginningOfExpr + '|' + middleOfExpr, 'g');

                                if (actionItem[aItemKey].match(inputRegExpObj)) {
                                    return true;

                                }

                            }

                        }

                    }

                }

            }

        }

        return false;

    };

    var getTransactionUserInputsNotPlacedInTheForm = function (userInputs, ttype) {
        const formFieldsNames = userInputs.map(input => input.name)
        return ttype.inputs.filter(input => !formFieldsNames.includes(input.name));
    };

    // updating user inputs from input form editor layout using user inputs inside transaction type
    var updateTransactionUserInputs = function (userInputs, tabs, fixedArea, ttype) {

        tabs.forEach(function (tab) {
            tab.layout.fields.forEach(function (field) {
                if (field.attribute_class === 'userInput') {
                    userInputs.push(field.attribute);
                }
            });
        });

        if (fixedArea && fixedArea.isActive) {
            fixedArea.layout.fields.forEach(function (field) {
                if (field.attribute_class === 'userInput') {
                    userInputs.push(field.attribute);
                }
            });
        }

        if (tabs.length && !tabs[0].hasOwnProperty('tabOrder')) {
            tabs.forEach(function (tab, index) {
                tab.tabOrder = index;
            });
        }


        userInputs.forEach(function (userInput) {

            if (!userInput.frontOptions) {
                userInput.frontOptions = {};
            }

            if (isUserInputUsedInTTypeExpr(userInput, ttype.actions)) {
                userInput.frontOptions.usedInExpr = true;
            }

            for (var i = 0; i < ttype.inputs.length; i++) {

                if (ttype.inputs[i].name === userInput.name) {

                	userInput.key = ttype.inputs[i].name; // needed for work of add / edit entity viewer
                    userInput.tooltip = ttype.inputs[i].tooltip;
                    userInput.verbose_name = ttype.inputs[i].verbose_name;
                    userInput.reference_table = ttype.inputs[i].reference_table;

                }

            }

        });

    };
    // < updating user inputs from input form editor layout using user inputs inside transaction type >

    var removeUserInputsInvalidForRecalculation = function (inputsList, actualUserInputs) {

        inputsList.forEach(function (inputName, index) { // remove deleted inputs from list for recalculation

            let inputInvalid = true;

            for (let i = 0; i < actualUserInputs.length; i++) {

                if (inputName === actualUserInputs[i].name) { // whether input actually exist

                	if (actualUserInputs[i].value_expr) { // whether input has expression for recalculation

                		inputInvalid = false;

					}


                    break;

                }

            }

            if (inputInvalid) {
                inputsList.splice(index, 1);
            }

        });

        // return inputsList;

    };

    var fillMissingFieldsByDefaultValues = function (entity, userInputsNotPlacedInTheForm) {
        userInputsNotPlacedInTheForm.forEach(input => {
            console.log('entity[input.name] before filling', entity[input.name], input.value)
            if (input.value === null) {
                return;
            }
            entity[input.name] = input.value;
            console.log('entity[input.name] after filling', entity[input.name])
        })

    }

    var updateEntityBeforeSave = function (viewModel) {
        console.log('updateEntityBeforeSave')
        const vm = viewModel

        if (metaService.getEntitiesWithoutDynAttrsList().indexOf(vm.entityType) === -1) {
            vm.entity.attributes = [];
        }

        if (vm.entity.attributes) {
            var i, a, c;
            var keys = Object.keys(vm.entity), attrExist;
            for (i = 0; i < vm.attrs.length; i = i + 1) {
                for (a = 0; a < keys.length; a = a + 1) {
                    if (vm.attrs[i].name === keys[a]) {
                        attrExist = false;
                        for (c = 0; c < vm.entity.attributes.length; c = c + 1) {
                            if (vm.entity.attributes[c]['attribute_type'] === vm.attrs[i].id) {
                                attrExist = true;
                                vm.entity.attributes[c] = entityEditorHelper.updateValue(vm.entity.attributes[c], vm.attrs[i], vm.entity[keys[a]]);
                            }
                        }
                        if (!attrExist) {
                            vm.entity.attributes.push(entityEditorHelper.appendAttribute(vm.attrs[i], vm.entity[keys[a]]));
                        }
                    }
                }
            }
        }

        if (vm.entity.attributes) {
            vm.entity = entityEditorHelper.checkEntityAttrTypes(vm.entity, vm.entityAttrs);
            vm.entity.attributes = entityEditorHelper.clearUnusedAttributeValues(vm.entity.attributes);
        }

        vm.entity.object_permissions = [];

        if (vm.groups) {
            vm.groups.forEach(function (group) {

                if (group.objectPermissions && group.objectPermissions.manage === true) {
                    vm.entity.object_permissions.push({
                        member: null,
                        group: group.id,
                        permission: "manage_" + vm.entityType.split('-').join('')
                    })
                }

                if (group.objectPermissions && group.objectPermissions.change === true) {
                    vm.entity.object_permissions.push({
                        member: null,
                        group: group.id,
                        permission: "change_" + vm.entityType.split('-').join('')
                    })
                }

            });
        }

        fillMissingFieldsByDefaultValues(vm.entity, vm.userInputsNotPlacedInTheForm);

    };

    module.exports = {
        isUserInputUsedInTTypeExpr: isUserInputUsedInTTypeExpr,
        updateTransactionUserInputs: updateTransactionUserInputs,
		removeUserInputsInvalidForRecalculation: removeUserInputsInvalidForRecalculation,
        getTransactionUserInputsNotPlacedInTheForm: getTransactionUserInputsNotPlacedInTheForm,
        updateEntityBeforeSave: updateEntityBeforeSave
    }

}());
