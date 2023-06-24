/**
 * Created by szhitenev on 24.06.2023.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data

        vm.initExpressionEditor = function () {

            setTimeout(function () {

                vm.editor = ace.edit('aceEditor');
                vm.editor.setTheme("ace/theme/monokai");
                vm.editor.getSession().setMode("ace/mode/json");
                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);

                vm.editor.setOptions({});
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);

                if (vm.data.data) {
                    vm.editor.setValue(JSON.stringify(vm.data.data, null, 4))
                } else {
                    vm.editor.setValue('{}')
                }

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)


        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.data.name = vm.name;

            $mdDialog.hide({
                status: 'agree', data: {
                    engine_name: vm.data.engine_name,
                    path: vm.data.path,
                    data: JSON.parse(vm.editor.getValue())
                }
            });
        };

        function convertToAsterisks(str) {
            return '*'.repeat(str.length);
        }

        vm.init = function () {

            if (vm.data.data) {

                vm.items = [];

                Object.keys(vm.data.data).forEach(function (key) {

                    vm.items.push({
                        key: key,
                        value: vm.data.data[key],
                        maskedValue: convertToAsterisks(vm.data.data[key])
                    })


                })


            }

            vm.initExpressionEditor();
        }

        vm.init();


    }

}());