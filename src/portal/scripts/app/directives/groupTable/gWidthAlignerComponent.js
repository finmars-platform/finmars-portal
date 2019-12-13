/**
 * Created by szhitenev on 20.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '=',
                rootWrapElem: '=',
                contentWrapElem: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();


                scope.defaultWidths = function(){

                    console.log('Width Aligner - Set Default Width');

                    var rootWidth = $(scope.rootWrapElem).width();

                    $(scope.contentWrapElem)[0].style.width = Math.floor(rootWidth / 2) + 'px';

                };

                scope.init = function () {

                    scope.defaultWidths();
                };

                scope.init()
            }
        }
    }

}());