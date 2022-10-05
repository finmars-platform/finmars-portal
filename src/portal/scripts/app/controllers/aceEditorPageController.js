/**
 * Created by szhitenev on 29.06.2022.
 */
(function () {

    'use strict';

    var afterLoginEventsService = require('../services/afterLoginEventsService');
    // var usersService = require('../services/usersService');
    var uiService = require('../services/uiService');

    var expressionService = require('../services/expression.service');

    module.exports = function ($scope, $state, $mdDialog) {

        var vm = this;

        vm.item = {
            expression: ''
        }

        vm.execute = function () {

            vm.item.expression = vm.editor.getValue()

            localStorage.setItem("lastCodeEditorQuery", vm.item.expression);

            expressionService.getResultOfExpression({
                expression: vm.item.expression,
                is_eval: true
            }).then(function (data) {

                console.log('data', data);

                if (data.result) {
                    document.querySelector('.ace-editor-page-output').innerHTML = data.result;
                } else {
                    document.querySelector('.ace-editor-page-output').innerHTML = data;
                }

                if (data.log) {
                    document.querySelector('.ace-editor-page-log').innerHTML = data.log;
                }

                $scope.$apply();

            }).catch(function (error) {

                console.log(error)

                error.text().then(function (data) {

                    console.log('data', data);

                    document.querySelector('.ace-editor-page-output').innerHTML = data;

                })
            })

        }

        vm.initExpressionEditor = function () {

            setTimeout(function () {

                vm.editor = ace.edit('aceEditor');
                vm.editor.setTheme("ace/theme/monokai");
                vm.editor.getSession().setMode("ace/mode/python");
                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);

                ace.require("ace/ext/language_tools");
                vm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                });
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);
                vm.editor.setValue(vm.item.expression)

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)


        }

        vm.init = function () {

            vm.item.expression = localStorage.getItem("lastCodeEditorQuery")

            vm.initExpressionEditor();

        }


        vm.init();


    }

}());