/**
 * Created by szhitenev on 29.03.2023.
 */
(function () {

    'use strict';

    const toastNotificationService = require('../../../../../core/services/toastNotificationService').default;


    module.exports = function ($scope, $mdDialog, utilsService, data) {

        var vm = this;

        vm.data = data;

        vm.init = function () {
            setTimeout(function () {

                vm.editor = ace.edit('aceEditor');
                vm.editor.setTheme("ace/theme/monokai");
                vm.editor.getSession().setMode("ace/mode/json");
                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);
                ace.require("ace/ext/language_tools");
                vm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true
                });
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);
                // vm.editor.setValue(vm.item.expression)

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)

        }

        vm.init()


        vm.applyFile = function (file) {

            console.log('file, ', file);



            var reader = new FileReader();

            reader.readAsText(vm.file);

            reader.onload = function (evt) {

                console.log('evt.target', evt.target);

                var fileContent = evt.target.result;

                console.log('fileContent', fileContent);

                vm.editor.setValue(fileContent);

            }



        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.processing = true;

            utilsService.universalInput(vm.editor.getValue()).then(function (data) {

                toastNotificationService.success("Imported Initialized. Please, check Task status.")

                vm.processing = false;

                $mdDialog.hide({status: 'agree', data: {}});

            })

        };
    }

}());