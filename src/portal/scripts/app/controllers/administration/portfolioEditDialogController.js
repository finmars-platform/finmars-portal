/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var gridHelperService = require('../../services/gridHelperService');
    var portfolioService = require('../../services/portfolioService');
    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    module.exports = function ($scope, $mdDialog, parentScope, portfolio, $state) {

        console.log('Portfolio add dialog controller initialized...');
        console.log('parentScope', portfolio);

        var vm = this;
        vm.entityType = 'portfolio';
        vm.tabs = parentScope.tabs;

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.layoutAttrs = layoutService.getLayoutAttrs();

        portfolioService.getAttributeTypeList().then(function(data){
            vm.attrs = data.results;
            console.log('vm.attrs', vm.attrs);
            $scope.$apply();
        });

        metaService.getBaseAttrs().then(function(data){
            vm.baseAttrs = data[vm.entityType];
            console.log('vm.baseAttrs', vm.baseAttrs);
            $scope.$apply();
        });

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
            var flexUnit = 100 / tab.layout.columns;
            return Math.floor(field.colspan * flexUnit);

        };

        vm.bindField = function (tab, field) {
            var i, l;
            if (field.hasOwnProperty('id')) {
                for (i = 0; i < vm.attrs.length; i = i + 1) {
                    if (field.id === vm.attrs[i].id) {
                        return vm.attrs[i];
                    }
                }
            } else {
                for (i = 0; i < vm.baseAttrs.length; i = i + 1) {
                    if (field.name === vm.baseAttrs[i].name) {
                        return vm.baseAttrs[i];
                    }
                }
                for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
                    if (field.name === vm.layoutAttrs[l].name) {
                        return vm.layoutAttrs[l];
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
            $state.go('app.data-constructor', {entityName: 'portfolio'});
            $mdDialog.hide();
        };

        vm.save = function () {
            console.log('saved!', vm.portfolio);
            $mdDialog.hide();
        };

    }

}());