(function () {
    'use strict';

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

                    userInput.tooltip = ttype.inputs[i].tooltip;
                    userInput.verbose_name = ttype.inputs[i].verbose_name;
                    userInput.reference_table = ttype.inputs[i].reference_table;

                }

            }

        });

    };
    // < updating user inputs from input form editor layout using user inputs inside transaction type >

    var removeDeletedUserInputs = function (inputsList, actualUserInputs) {

        inputsList.forEach(function (inputName, index) { // remove deleted inputs from list for recalculation

            let inputDeleted = true;

            for (let i = 0; i < actualUserInputs.length; i++) {

                if (inputName === actualUserInputs[i].name) {

                    inputDeleted = false;
                    break;

                }

            }

            if (inputDeleted) {
                inputsList.splice(index, 1);
            }

        });

        // return inputsList;

    }

    module.exports = {
        isUserInputUsedInTTypeExpr: isUserInputUsedInTTypeExpr,
        updateTransactionUserInputs: updateTransactionUserInputs,
        removeDeletedUserInputs: removeDeletedUserInputs
    }

}());