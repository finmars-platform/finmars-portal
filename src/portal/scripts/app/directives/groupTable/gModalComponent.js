/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var portfolioService = require('../../services/portfolioService');

    module.exports = function ($scope, $mdDialog, filters, columns, grouping, callback) {
        console.log('Group table modal controller initialized...');


        var vm = this;
        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        console.log('12323232', $scope);

        var syncGeneralAttrs = function (general) {
            columns.map(function (item) {
                var i;
                for (i = 0; i < general.length; i = i + 1) {
                    if (general[i].key === item) {
                        general[i].columns = true;
                    }
                }
                return item;
            });
            filters.map(function (item) {
                var i;
                for (i = 0; i < general.length; i = i + 1) {
                    if (general[i].key === item) {
                        general[i].filters = true;
                    }
                }
                return item;
            });

            grouping.map(function (item) {
                var i;
                for (i = 0; i < general.length; i = i + 1) {
                    if (general[i].key === item) {
                        general[i].groups = true;
                    }
                }
                return item;
            });

            return general;
        };

        var syncAttrs = function (attrs) {
            columns.map(function (item) {
                var i;
                for (i = 0; i < attrs.length; i = i + 1) {
                    if (attrs[i].name === item) {
                        attrs[i].columns = true;
                    }
                }
                return item;
            });

            filters.map(function (item) {
                var i;
                for (i = 0; i < attrs.length; i = i + 1) {
                    if (attrs[i].name === item) {
                        attrs[i].filters = true;
                    }
                }
                return item;
            });

            grouping.map(function (item) {
                var i;
                for (i = 0; i < attrs.length; i = i + 1) {
                    if (attrs[i].name === item) {
                        attrs[i].groups = true;
                    }
                }
                return item;
            });

            return attrs;
        };

        metaService.getGeneralAttrs().then(function (data) {
            vm.general = data;
            vm.general = syncGeneralAttrs(vm.general);
            console.log('vm.general', vm.general);
            $scope.$apply();
        });

        portfolioService.getAttributeTypeList().then(function(data){
            vm.attrs = data.results;
            vm.attrs = syncAttrs(vm.attrs);
            console.log('vm.attrs', vm.attrs);
            $scope.$apply();
        });

        var updateGeneralAttrs = function(){
            var i, c, g;
            var columnExist, groupExist, filterExist;
            for (i = 0; i < vm.general.length; i = i + 1) {
                columnExist = false;
                for(c = 0; c < columns.length; c = c + 1) {
                    if(vm.general[i].key === columns[c]) {
                        columnExist = true;
                        if(vm.general[i].columns === false) {
                            columns.splice(c, 1);
                            c = c - 1;
                        }
                    }
                }
                if(!columnExist) {
                    if(vm.general[i].columns === true) {
                        columns.push(vm.general[i].key);
                    }
                }

                /////// GROUPING

                for(g = 0; g < grouping.length; g = g + 1) {
                    if(vm.general[i].key === grouping[g]) {
                        groupExist = true;
                        if(vm.general[i].groups === false) {
                            grouping.splice(g, 1);
                            g = g - 1;
                        }
                    }
                }

                if(!groupExist) {
                    if(vm.general[i].groups === true) {
                        grouping.push(vm.general[i].key);
                    }
                }
            }



            console.log(columns);
        };

        var updateAttrs = function(){
            var i, c, g;
            var columnExist, groupExist, filterExist;
            for (i = 0; i < vm.attrs.length; i = i + 1) {
                columnExist = false;
                groupExist = false;
                filterExist = false;
                for(c = 0; c < columns.length; c = c + 1) {
                    if(vm.attrs[i].name === columns[c]) {
                        columnExist = true;
                        if(vm.attrs[i].columns === false) {
                            columns.splice(c, 1);
                            c = c - 1;
                        }
                    }
                }
                if(!columnExist) {
                    if(vm.attrs[i].columns === true) {
                        columns.push(vm.attrs[i].name);
                    }
                }

                /////// GROUPING

                for(g = 0; g < grouping.length; g = g + 1) {
                    if(vm.attrs[i].name === grouping[g]) {
                        groupExist = true;
                        if(vm.attrs[i].groups === false) {
                            grouping.splice(g, 1);
                            g = g - 1;
                        }
                    }
                }
                if(!groupExist) {
                    if(vm.attrs[i].groups === true) {
                        grouping.push(vm.attrs[i].name);
                    }
                }

            }
        };

        vm.updateAttrs = function (item) {
            console.log('item', item);
            updateGeneralAttrs();
            updateAttrs();
            callback();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }


}());