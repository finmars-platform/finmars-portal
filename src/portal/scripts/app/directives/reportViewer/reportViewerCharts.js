(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents')

    module.exports = function (d3) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/report-viewer-matrix-view.html',
            scope: {
                matrixSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.activeItem = null;
                console.log("d3 service", d3);
                var columns = [12, 24, 30, 9];

                d3.select(".report-viewer-chart-container")
                    .selectAll("div")
                    .data(columns)
                    .enter()
                    .append('div')
                    .style("width", function (c) { return c + "px";});

            }
        }
    }
}());