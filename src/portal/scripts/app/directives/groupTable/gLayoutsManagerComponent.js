(function () {

    const evEvents = require("../../../services/entityViewerEvents");

    'use strict';

    module.exports = function () {
        return {
            scope: {
                filterKey: '=',
                evDataService: '=',
                evEventService: '=',

                onCancel: '&',
                onSave: '&'
            },
            controllerAs: 'vm',
            templateUrl: 'views/directives/reportViewer/userFilters/!!rv-filter-view.html',
            controller: function() {

                const vm = this;


            }
        };
    }
}());