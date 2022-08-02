/**
 * Created by szhitenev on 11.07.2022.
 */
(function () {

    'use strict';

    var downloadFileHelper = require('../../helpers/downloadFileHelper');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        console.log('filePreviewDialogController data', data);

        vm.data = data;

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

        vm.formatContent = function () {

            if (vm.data.info.file_report_object.name.indexOf('.csv') !== -1) {

                vm.data.content_formatted = vm.formatCSV()

            } else if (vm.data.info.file_report_object.name.indexOf('.json') !== -1) {

                vm.data.content_formatted = JSON.stringify(vm.data.content, null, 4)

            } else {
                vm.data.content_formatted = vm.data.content
            }

        }

        vm.init = function () {

            vm.formatContent()

        }

        vm.init()
    }

}());