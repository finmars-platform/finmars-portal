/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var gridHelperService = require('../../services/gridHelperService');

    module.exports = function ($scope, $mdDialog, parentScope, portfolio) {

        console.log('Portfolio add dialog controller initialized...');
        console.log('parentScope', portfolio);

        var vm = this;
        vm.tabs = parentScope.tabs;

        vm.portfolio = portfolio;

        var originatorEv;

        vm.range = gridHelperService.range;

        vm.bindFlex = function (tab, row, field) {
            var totalColspans = 0;
            var i;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
            var flexUnit = 100 / totalColspans;
            return Math.floor(field.colspan * flexUnit);

        };

        vm.bindField = function (tab, field) {
            var i;
            if (field.hasOwnProperty('id')) {
                for (i = 0; i < tab.attrs.length; i = i + 1) {
                    if (field.id === tab.attrs[i].id) {
                        return tab.attrs[i];
                    }
                }
            } else {
                for (i = 0; i < tab.attrs.length; i = i + 1) {
                    if (field.name === tab.attrs[i].name) {
                        return tab.attrs[i];
                    }
                }
            }
        };

        vm.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.editLayout = function(ev){
            $mdDialog.show({
                controller: 'EntityDataConstructorController as vm',
                templateUrl: 'views/entity-data-constructor-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    parentScope: $scope
                }
            });
        };

        vm.save = function () {
            console.log('saved!', vm.portfolio);
            $mdDialog.hide();
        };

    }

}());