/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($templateCache, $compile) {
        return {
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            restrict: 'AE',
            link: function (scope, elem, attrs) {

                var editorTemplateUrl = scope.evDataService.getEditorTemplateUrl();

                var tpl = $templateCache.get(editorTemplateUrl);
                var ctrl = $compile(tpl)(scope);
                $(elem).append(ctrl);

            }
        }
    }


}());