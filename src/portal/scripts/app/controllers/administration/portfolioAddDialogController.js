/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('../../services/portfolioService');

    module.exports = function ($scope, $mdDialog, parentScope) {

        console.log('Portfolio add dialog controller initialized...');
        console.log('parentScope', parentScope);

        var vm = this;
        vm.tabs = parentScope.vm.tabs;

        vm.portfolio = {};

        var originatorEv;

        vm.range = function (rowsCount) {
            var i;
            var rows = [];
            for (i = 1; i <= rowsCount; i = i + 1) {
                rows.push(i);
            }
            return rows;
        };

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

        vm.selectFields = function () {

        };

        vm.save = function () {
            console.log('portfolio!', vm.portfolio);
            portfolioService.create(vm.portfolio).then(function (data) {
                console.log('saved!', data);
                $mdDialog.hide();
            })
        };

    }

}());