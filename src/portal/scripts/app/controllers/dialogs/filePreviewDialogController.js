/**
 * Created by szhitenev on 11.07.2022.
 */
(function(){

    'use strict';

    var downloadFileHelper = require('../../helpers/downloadFileHelper');

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.data = data;

        vm.download = function (){

            downloadFileHelper.downloadFile(vm.data.content, "application/force-download", vm.data.info.file_report_object.name);

        }

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());