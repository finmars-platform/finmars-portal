/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');
    var fieldResolverService = require('../services/fieldResolverService');

    module.exports = function ($scope) {

        return {
            scope: {
                item: '=',
                entity: '='
            },
            templateUrl: 'views/entity-viewer/field-resolver-view.html',
            link: function (scope, elem, attrs) {

                logService.component('EntityViewerFieldResolverController', 'initialized');

                scope.readyStatus = {content: false};

                logService.property('field scope', scope.item);

                fieldResolverService.getFields(scope.item.key).then(function (data) {
                    logService.collection('DATA', data);
                    scope.fields = data;
                    scope.readyStatus.content = true;
                    scope.$apply();
                });


                scope.getModelKey = scope.$parent.getModelKey;
            }

        }
    }
}());