/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, parentScope) {

        console.log('Entity data constructor controller intialized...');
        console.log('parentScope', parentScope);
        var vm = this;
        vm.tabs = parentScope.vm.tabs;


    }

}());