/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var timeZonesService = require('../services/timeZonesService');
    // var authorizerService = require('../services/authorizerService');

    module.exports = function ($scope, globalDataService) {

        var vm = this;

        // vm.readyStatus = {user: false};

        vm.timeZones = timeZonesService.getList();

        /* authorizerService.getUserByKey(0).then(function (data) {

            vm.user = data;
            vm.readyStatus.user = true;

            $scope.$apply();

        }); */

        vm.user = globalDataService.getUser();

        vm.codeEditorChange = function () {

            vm.codeEditorInExpressionBuilder = !vm.codeEditorInExpressionBuilder;

            if (vm.codeEditorInExpressionBuilder) {
                localStorage.setItem('codeEditorInExpressionBuilder', 'true')
            } else {
                localStorage.removeItem('codeEditorInExpressionBuilder')
            }

        }

        vm.save = function () {

            /* usersService.update(vm.user.id, vm.user).then(function () {
                $scope.$apply();
            }) */
        }

        vm.init = function(){

            if (localStorage.getItem('codeEditorInExpressionBuilder')) {
                vm.codeEditorInExpressionBuilder = true
            }

        }

        vm.init()
    }

}());