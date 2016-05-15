/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                items: '=',
                columns: '='
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {
                console.log('Table component');
                //console.log('scope columns', scope.columns);

                var entityType = 'portfolio';
                var keywords = [];
                scope.keywordsReady = false;

                metaService.getReservedKeys().then(function (data) {
                    keywords = data[entityType];
                    scope.keywordsReady = true;
                    console.log('keywords', keywords);
                    scope.$apply();
                });

                scope.openEntityMenu = function($mdOpenMenu, ev){
                    $mdOpenMenu(ev);
                };

                scope.bindCell = function (groupedItem, column) {
                    if (column.hasOwnProperty('id')) {
                        return groupedItem[column.name];
                    } else {
                        var i;
                        for (i = 0; i < keywords.length; i = i + 1) {
                            if (keywords[i].caption === column.name) {
                                return groupedItem[keywords[i].key];
                            }
                        }
                    }
                }
            }
        }
    }


}());