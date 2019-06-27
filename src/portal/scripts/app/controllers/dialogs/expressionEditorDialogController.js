/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var helpService = require('../../services/helpService');
    var expressionService = require('../../services/expression.service');

    module.exports = function ($scope, $mdDialog, item, data) {

        var vm = this;

        vm.item = item;

        vm.showValidation = false;

        if (data) {

            vm.data = data;

            if (vm.data.returnExpressionResult) { // check if expression editor should return expression result
                vm.item.is_eval = true;
            }

        }

        vm.readyStatus = {expressions: false, groups: false};

        vm.expressionsHistory = [];

        vm.searchExpr = '';

        vm.getFilters = function () {

            var result = {};

            result.search_index = vm.searchExpr;
            // result.formula = vm.searchExpr;

            if (vm.selectedHelpGroup && vm.selectedHelpGroup.key !== 'all') {
                result.groups = vm.selectedHelpGroup.key;
            }

            return result;

        };

        helpService.getFunctionsItems().then(function (data) {

            vm.expressions = data;

            vm.readyStatus.expressions = true;

            if (vm.data && vm.data.functions) {

                console.log('data.functions', vm.data.functions);

                vm.data.functions.forEach(function (items) {
                    vm.expressions = vm.expressions.concat(items)
                })

            }

            vm.expressions = vm.expressions.map(function (item) {

                item.search_index = item.name + ' ' + item.func;

                return item;

            });

            console.log('expressions', vm.expressions);

            vm.selectedHelpItem = vm.expressions[0];
            $scope.$apply();
        });

        helpService.getFunctionsGroups().then(function (data) {

            vm.groups = data;

            vm.readyStatus.groups = true;

            vm.selectedHelpGroup = vm.groups[0];

            if (vm.data && vm.data.groups) {

                vm.groups.shift();

                var result = [];

                vm.data.groups.forEach(function (group) {

                    result = result.concat(group)

                });

                result = result.concat(vm.groups);

                result.unshift({
                    "name": "All",
                    "key": "all"
                });

                vm.groups = result;

            }

            $scope.$apply();
        });

        vm.selectHelpItem = function (item) {

            vm.expressions.forEach(function (expr) {
                expr.isSelected = false;
            });

            item.isSelected = true;

            vm.selectedHelpItem = item;
        };

        vm.selectHelpGroup = function (item) {

            vm.groups.forEach(function (expr) {
                expr.isSelected = false;
            });

            item.isSelected = true;

            vm.selectedHelpGroup = item;

            console.log('vm.selectedHelpGroup', vm.selectedHelpGroup);
        };

        vm.undo = function () {

            var result = vm.expressionsHistory.pop();

            if (result !== undefined && result !== null) {
                vm.item.expression = result
            }

        };

        vm.appendFunction = function (item) {

            vm.expressionsHistory.push(vm.item.expression);

            console.log(this);
            var val = $('#editorExpressionInput')[0].value;
            var cursorPosition = val.slice(0, ($('#editorExpressionInput')[0].selectionStart + '')).length;

            if (cursorPosition == 0) {
                vm.item.expression = vm.item.expression + item.func;
            } else {
                vm.item.expression = vm.item.expression.slice(0, cursorPosition) + item.func + vm.item.expression.slice(cursorPosition);

            }


        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        var isBracketsValid = function (expression, leftBracket, rightBracket) {

            var result = true;
            var container = [];
            var indexContainer = [];

            for (var i = 0; i < expression.length; i = i + 1) {

                if (expression[i] === leftBracket) {
                    container.push(leftBracket);
                    indexContainer.push(i)
                } else {

                    if (expression[i] === rightBracket) {

                        if (container.length && container[container.length - 1] === leftBracket) {

                            container.pop();
                            indexContainer.pop()

                        } else {

                            container.push(rightBracket);
                            indexContainer.push(i);

                            result = false;

                            break;

                        }

                    }
                }

            }

            console.log('indexContainer', indexContainer);
            console.log('container', container);

            if (container.length > 0) {
                result = false;
            }

            var resultObj = {
                status: result
            };

            if (result === false) {
                resultObj.errorIndex = indexContainer[container.length - 1]
            }

            return resultObj;

        };

        function isFunction(token, words) {

            if (token.hasDot) {
                return false
            }

            return words.indexOf(token.value) !== -1;

        }

        function isParameter(token, words) {

            return words.indexOf(token.value) !== -1;

        }

        function isInput(token, words) {

            if (token.hasDot) {
                return false
            }

            return words.indexOf(token.value) !== -1;

        }

        function insert(str, index, value) {
            return str.substr(0, index) + value + str.substr(index);
        }

        function getFunctionWords() {
            return vm.expressions
                .filter(function (item) {
                    return item.func.indexOf('(') !== -1;
                })
                .map(function (item) {
                    return item.func.split('(')[0]
                });
        }

        function getInputWords() {

            var result = [];

            vm.data.functions.forEach(function (funcGroup) {

                funcGroup.map(function (item) {
                    result.push(item.func)
                });

            });

            return result;
        }

        function getPropertiesWords() {

            var propertiesWords = [];

            var propertiesWordsTmp = vm.expressions
                .filter(function (item) {
                    return item.func.indexOf(']') !== -1;
                })
                .map(function (item) {
                    return item.func.split('].')[1];
                });


            propertiesWordsTmp.forEach(function (word) {

                if (word) {

                    var pieces = word.split('.');

                    pieces.forEach(function (pieceWord) {

                        if (propertiesWords.indexOf(pieceWord) === -1) {
                            propertiesWords.push(pieceWord)
                        }

                    })

                }

            });

            return propertiesWords;

        }

        function isNumber(currentToken) {

            return /^\d+$/.test(currentToken.value);

        }

        vm.getHtmlExpression = function (expression) {

            var result = '';

            var currentToken = {
                value: '',
                hasDot: false
            };

            var functionWords = getFunctionWords();
            var propertiesWords = getPropertiesWords();
            var inputWords = getInputWords();

            var strContent = false;
            var strType;

            var inputsCounts = 0;
            var isNum;

            for (var i = 0; i < expression.length;) {


                if (expression[i].match(new RegExp(/^[a-zA-Z0-9_]*$/)) && strContent === false) {

                    currentToken.value = currentToken.value + expression[i];

                } else {

                    if (currentToken.value !== '') {

                        result = result + '<span class="eb-highlight-error">' + currentToken.value + '</span>';
                        vm.status = 'inputs-error';
                    }

                    currentToken.value = '';
                    currentToken.hasDot = false;
                    result = result + expression[i]
                }

                if (expression[i] === '.') {
                    currentToken.hasDot = true;
                }

                if (expression[i] === '"' || expression[i] === "'") {

                    if (strContent === false) {

                        strType = expression[i];
                        strContent = true

                    } else {

                        if (strType === expression[i]) {
                            strType = null;
                            strContent = false;
                        } else {
                            strType = expression[i];
                        }

                    }

                }

                if (strContent === false) {

                    if (isFunction(currentToken, functionWords)) {

                        result = result + '<span class="eb-highlight-func">' + currentToken.value + '</span>';
                        currentToken.value = '';
                    }

                    if (isInput(currentToken, inputWords)) {

                        if (i + 1 < expression.length && expression[i + 1].match(new RegExp(/^[a-zA-Z0-9_-]*$/))) {

                            // console.log('expression[i + 1]', expression[i + 1])

                            // if next letter also part of input, then continue to lookup

                        } else {

                            result = result + '<span class="eb-highlight-input">' + currentToken.value + '</span>';
                            currentToken.value = '';

                            inputsCounts = inputsCounts + 1;

                        }

                    }

                    if (isParameter(currentToken, propertiesWords)) {

                        result = result + '<span class="eb-highlight-property">' + currentToken.value + '</span>';

                        currentToken.value = '';
                        currentToken.hasDot = false;

                    }

                    if (isNumber(currentToken)) {
                        result = result + currentToken.value;
                        currentToken.value = '';
                        currentToken.hasDot = false;
                    }

                }

                i = i + 1;

                if (i === expression.length && currentToken.value !== '') {

                    isNum = /^\d+$/.test(currentToken.value);

                    if (!isNum) {

                        // console.log('end', currentToken.value);

                        result = result + '<span class="eb-highlight-error">' + currentToken.value + '</span>';
                        vm.status = 'inputs-error';
                    }
                }


            }

            var parenthesisStatus = isBracketsValid(result, '(', ')');
            var squareBracketsStatus = isBracketsValid(result, '[', ']');

            if (parenthesisStatus.status === false && parenthesisStatus.errorIndex !== undefined) {

                result = insert(result, parenthesisStatus.errorIndex + 1, '</span>');
                result = insert(result, parenthesisStatus.errorIndex, '<span class="eb-error-bracket">')

                vm.status = 'bracket-error';

            } else {

                if (squareBracketsStatus.status === false && squareBracketsStatus.errorIndex !== undefined) {

                    result = insert(result, squareBracketsStatus.errorIndex + 1, '</span>');
                    result = insert(result, squareBracketsStatus.errorIndex, '<span class="eb-error-bracket">')

                    vm.status = 'bracket-error';
                }
            }

            // console.log('inputsCounts', inputsCounts);

            // if (result.length > 0 && inputsCounts === 0) {
            //
            //     vm.status = 'inputs-error';
            //
            // }

            return result

        };

        vm.validate = function () {

            return expressionService.validate(vm.item).then(function (data) { // may be useless

                // console.log('data', data);

                vm.status = 'success';

                vm.htmlExpression = vm.getHtmlExpression(vm.item.expression);

                vm.showValidation = true;

                $scope.$apply();

            }).catch(function (reason) {

                // console.log('reason', reason);

                vm.status = 'error';

                vm.htmlExpression = vm.getHtmlExpression(vm.item.expression);

                vm.showValidation = true;

                $scope.$apply();

            })

        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: {item: vm.item}});

        };

        vm.openHelp = function ($event) {
            $mdDialog.show({
                controller: 'HelpDialogController as vm',
                templateUrl: 'views/dialogs/help-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {}
                },
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            })
        }
    }

}());