/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($templateCache, $compile) {
        return {
            scope: {
                options: '='
            },
            restrict: 'AE',
            link: function (scope, elem, attrs) {

                var tpl = $templateCache.get(scope.options.editorTemplate);
                var ctrl = $compile(tpl)(scope);
                $(elem).append(ctrl);
            }
        }
    }


}());