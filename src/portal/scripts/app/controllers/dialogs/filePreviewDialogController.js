/**
 * Created by szhitenev on 11.07.2022.
 */
(function () {

    'use strict';

    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var metaHelper = require('../../helpers/meta.helper');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        console.log('filePreviewDialogController data', data);

        vm.data = data;

        vm.contentType = 'json'

        vm.download = function () {

            var content = vm.data.content

            if (typeof vm.data.content === 'object') {
                content = JSON.stringify(vm.data.content, null, 4);
            }

            downloadFileHelper.downloadFile(content, "application/force-download", vm.data.info.file_report_object.name);

        }

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.initJsonEditor = function (){

            setTimeout(function () {

                vm.editor = ace.edit('filePreviewAceEditor');
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
                vm.editor.setValue(vm.data.content_formatted)

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)

        }

        vm.formatCSV = function () {

            var result = ""

            var lines = vm.data.content.split(/\r?\n/);

            result = "<table><tbody>"

            lines.forEach(function (line) {

                var pieces = line.split(",")

                result = result + "<tr>"

                pieces.forEach(function (piece) {

                    result = result + "<td>" + piece + "</td>"

                })

                result = result + "</tr>"


            })


            result = result + "</tbody></table>"


            return result


        }

        vm.copyContent = function (content){

            metaHelper.copyToBuffer(content)

        }

        vm.formatContent = function () {

            if (vm.data.info.file_report_object.name.indexOf('.csv') !== -1) {

                vm.contentType = 'csv'

                vm.data.content_formatted = vm.formatCSV()

            } else if (vm.data.info.file_report_object.name.indexOf('.json') !== -1) {

                vm.contentType = 'json'

                vm.data.content_formatted = JSON.stringify(vm.data.content, null, 4)

                vm.initJsonEditor()

            } else {

                vm.contentType = 'text'

                vm.data.content_formatted = vm.data.content
            }

        }

        vm.init = function () {

            vm.formatContent()

        }

        vm.init()
    }

}());