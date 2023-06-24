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
                vm.editor.setValue('{}')

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
                    data: vm.editor.getValue()
                }
            });
        };

        vm.init = function () {
            vm.initExpressionEditor();
        }

        vm.init();


    }

}());