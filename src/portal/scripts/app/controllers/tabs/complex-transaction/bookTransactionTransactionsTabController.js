/**
 * Created by szhitenev on 29.11.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope) {

        var vm = this;

        vm.transactions = $scope.$parent.vm.entity.transactions_object;

    }

}());