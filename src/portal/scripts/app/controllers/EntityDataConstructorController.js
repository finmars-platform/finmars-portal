/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var demoPortfolioService = require('../services/demo/demoPortfolioService');
    var demoTransactionsService = require('../services/demo/demoTransactionsService');

    var portfolioService = require('../services/portfolioService');
    var metaService = require('../services/metaService');

    var gridHelperService = require('../services/gridHelperService');

    module.exports = function ($scope) {

        console.log('Entity data constructor controller intialized...');
        var vm = this;

        vm.boxColumns = [1,2,3,4,5,6];


        vm.entityType = "portfolio";



        demoPortfolioService.getTabList().then(function (data) {
            vm.tabs = data;
            console.log('vm tabs!', vm.tabs);
            $scope.$apply();
        });

        vm.attrs = [];
        vm.baseAttrs = [];

        portfolioService.getAttributeTypeList().then(function (data) {
            vm.attrs = data.results;

            console.log('vm attrs', vm.attrs);
            metaService.getBaseAttrs().then(function (data) {
                vm.baseAttrs = data;
                $scope.$apply();
            });
        });

        vm.checkColspan = function (tab, row, column) {
            var i, c;

            for(c = 0; c < column; c = c + 1) {
                for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                    if(tab.layout.fields[i].row == row) {
                        if(tab.layout.fields[i].column == c) {
                            if(tab.layout.fields[i].colspan > 1) {
                                c = c + tab.layout.fields[i].colspan - 1;
                            }
                        }
                    }
                }
            }
            if(c > column) {
                return false;
            }
            return true;
        };

        vm.range = gridHelperService.range;


        vm.setLayoutColumns = function (tab, columns) {
            tab.layout.columns = columns;
            console.log('change columns count ', vm.tabs);
        };

        vm.bindField = function (tab, row, column) {
            var i;
            var field;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    if (tab.layout.fields[i].column === column) {
                        field = tab.layout.fields[i];
                    }
                }
            }
            return field;
        };

        vm.bindFlex = function (tab, row, column) {
            var totalColspans = 0;
            var i;
            var field;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    if (tab.layout.fields[i].column === column) {
                        field = tab.layout.fields[i];
                    }

                    totalColspans = totalColspans + tab.layout.fields[i].colspan;
                }
            }
            var flexUnit = 100 / totalColspans;
            if (field) {
                return Math.floor(field.colspan * flexUnit);
            }
            return Math.floor(flexUnit);
        };
    }

}());