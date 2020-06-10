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

    module.exports = {
        isUserInputUsedInTTypeExpr: isUserInputUsedInTTypeExpr
    }

}());