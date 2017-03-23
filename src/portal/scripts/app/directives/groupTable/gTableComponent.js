/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                items: '=',
                options: '=',
                reportOptions: '='
            },
            link: function (scope, elem, attrs) {

                logService.component('groupTable', 'initialized');

                console.log('Group Table shell', scope.options);

                scope.findSelectedFeature = function () {
                    var selected = {isOpened: false, templateUrl: ''};
                    //console.log('additionsStatus', scope.additionsStatus);
                    scope.options.additionsStatus.extraFeatures.forEach(function (item) {
                        if (item.isOpened == true) {
                            selected = item;
                        }
                    });
                    //console.log(selected);

                    return selected;
                };

                scope.triggerResize = function () {

                };

                if (scope.options.isRootEntityViewer == true) {

                    scope.$watch('options.editorEntityId', function (event, data) {

                        scope.$broadcast('rootEditorEntityIdDown', {
                            editorEntityId: scope.options.editorEntityId,
                            entityType: scope.options.entityType
                        });
                    });
                }

                scope.checkAdditions = function () {
                    if (scope.options.additionsState == true && scope.options.isRootEntityViewer == true && scope.options.components.splitPanel == true) {
                        return true;
                    }
                    return false;
                }

            }
        }
    }

}());