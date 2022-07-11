/**
 * Created by szhitenev on 11.07.2022.
 */
(function () {

    'use strict';

    var downloadFileHelper = require('../../helpers/downloadFileHelper');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.data = data;

        vm.download = function () {

            downloadFileHelper.downloadFile(vm.data.content, "application/force-download", vm.data.info.file_report_object.name);

        }

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.formatCSV = function () {

            var result = ""

            console.log('content', content);

            var lines = content.split(/\r?\n/);

            result = "<table><tbody>"

            lines.forEach(function (line) {

                var pieces = line.split(",")

                result = result + "<tr>"

                pieces.forEach(function (piece){

                    result = result + "<td>" + piece + "</td>"

                })

                result = result + "</tr>"


            })


            result = result + "</tbody></table>"


            return result


        }

        vm.formatContent = function () {

            if (vm.data.info.file_report_object.name.indexOf('.csv')) {

                vm.data.content_formatted = vm.formatCSV()

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