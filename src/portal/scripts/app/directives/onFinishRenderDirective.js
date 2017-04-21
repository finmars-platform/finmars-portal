(function () {

    'use strict';

    var renderEventService = require('../services/renderEventService');

    module.exports = function () {
        return {
            restrict: 'A',

            link: function (scope, element, attr) {

                if (scope.$last === true) {

                    setTimeout(function () {

                        renderEventService.emit(attr.onFinishRender + ':ng-repeat:finished');

                        scope.$apply();

                    }, 0);
                }
            }
        }
    }

}());