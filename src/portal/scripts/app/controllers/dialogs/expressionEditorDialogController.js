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

        vm.error = false;

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

            for (var i = 0; i < expression.length; i = i + 1) {

                if (expression[i] === leftBracket) {
                    container.push(leftBracket)
                } else {

                    if (expression[i] === rightBracket) {

                        if (container.length && container[container.length - 1] === leftBracket) {

                            container.pop()

                        } else {

                            result = false;
                            break;

                        }

                    }
                }

            }

            if (container.length > 0) {
                result = false;
            }

            return result

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

        vm.getHtmlExpression = function (expression) {

            var result = '';

            var currentToken = {
                value: '',
                hasDot: false
            };

            var functionWords = vm.expressions
                .filter(function (item) {
                    return item.func.indexOf('(') !== -1;
                })
                .map(function (item) {
                    return item.func.split('(')[0]
                });

            var propertiesWordsTmp = vm.expressions
                .filter(function (item) {
                    return item.func.indexOf(']') !== -1;
                })
                .map(function (item) {
                    return item.func.split('].')[1];
                });

            var propertiesWords = []

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

            var inputWords = vm.data.functions[0].map(function (item) {
                return item.func
            });

            for (var i = 0; i < expression.length;) {

                if (expression[i].match(new RegExp(/^[a-zA-Z0-9_-]*$/))) {
                    currentToken.value = currentToken.value + expression[i];
                } else {
                    result = result + currentToken.value;
                    currentToken.value = '';
                    currentToken.hasDot = false;
                    result = result + expression[i]
                }

                if (expression[i] === '.') {
                    currentToken.hasDot = true;
                }

                if (isFunction(currentToken, functionWords)) {

                    result = result + '<span class="eb-highlight-func">' + currentToken.value + '</span>';
                    currentToken.value = '';
                }

                if (isInput(currentToken, inputWords)) {

                    result = result + '<span class="eb-highlight-input">' + currentToken.value + '</span>';
                    currentToken.value = '';

                }

                if (isParameter(currentToken, propertiesWords)) {

                    result = result + '<span class="eb-highlight-property">' + currentToken.value + '</span>';

                    currentToken.value = '';
                    currentToken.hasDot = false;

                }

                i = i + 1;


            }

            console.log('result', result);


            // if (vm.data.functions) {
            //
            //
            //     var words = vm.data.functions[0].map(function (item) {
            //         return item.func
            //     });
            //
            //     console.log('words inputs', words);
            //
            //     result = wrapWords(result, words, 'span', 'eb-highlight-input')
            //
            //
            // }
            //
            // if (isBracketsValid(expression, '(', ')')) {
            //
            //     console.log('vm.data.functions', vm.expressions);
            //
            //     var words = vm.expressions.filter(function (item) {
            //         return item.func.indexOf('(') !== -1;
            //     });
            //
            //     words = words.map(function (item) {
            //         return item.func
            //     });
            //
            //     words = words.map(function (item) {
            //         return item.split('(')[0] + '('; // trick to change only function keywords
            //     });
            //
            //     console.log('words functions', words);
            //
            //     result = wrapWords(result, words, 'span', 'eb-highlight-func');
            // }
            //
            // if (isBracketsValid(expression, '[', ']')) {
            //
            //     var words = vm.expressions.filter(function (item) {
            //         return item.func.indexOf(']') !== -1;
            //     });
            //
            //     words = words.map(function (item) {
            //         return item.func
            //     });
            //
            //     words = words.map(function (item) {
            //         return item.split('].')[1];
            //     });
            //
            //     console.log('words properties', words);
            //
            //     result = wrapWords(result, words, 'span', 'eb-highlight-property')
            //
            // }
            //

            return result

        };

        vm.validate = function () {

            vm.htmlExpression = vm.getHtmlExpression(vm.item.expression);

            return expressionService.validate(vm.item).then(function (data) {

                // console.log('data', data);

                vm.error = false;
                vm.success = true;

                vm.showValidation = true;

                $scope.$apply();

            }).catch(function (reason) {

                // console.log('reason', reason);

                vm.error = true;
                vm.success = false;

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