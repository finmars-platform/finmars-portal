(function () {

    'use strict';

    var rvDataHelper = require('../../helpers/rv-data.helper');

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function (d3) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/reportViewer/report-viewer-bars-chart-view.html',
            scope: {
                rvChartsSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                scope.readyStatus = false;

                scope.showBarTooltip = false;

                var chartData = [];

                var mainElem = elem[0].querySelector('.report-viewer-charts');
                var chartHolderElem = elem[0].querySelector('.report-viewer-chart-holder');

                var componentHeight = mainElem.clientHeight;
                var componentWidth = mainElem.offsetWidth;

                var chartMargin = 40;


                var getDataForChartsFromFlatList = function () {

                    chartData = [];

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    var itemList = flatList.filter(function (item) {
                        return item.___type === 'object'
                    });

                    var nameKey = scope.rvChartsSettings.abscissa;
                    var numberKey = scope.rvChartsSettings.ordinate;

                    var savedFields = {};

                    itemList.forEach(function (item) {

                        var nameValue = null;
                        var numberValue = 0;

                        if (item[nameKey]) {

                            nameValue = item[nameKey];
                            numberValue = item[numberKey] || 0;

                            var savedNames = Object.keys(savedFields);

                            if (savedNames.indexOf(nameValue) === -1) {

                                chartData.push({name: nameValue, numericValue: numberValue});
                                var dataIndex = chartData.length - 1;
                                savedFields[nameValue] = dataIndex;

                            } else { // if the field was already saved, add number to it

                                var matchingDataIndex = savedFields[nameValue];

                                chartData[matchingDataIndex].numericValue += numberValue;

                            };
                        };

                        /*if (nameValue && numberValue) {
                            chartData.push({name: nameValue, numericValue: numberValue});
                            var dataIndex = chartData.length - 1;
                            savedFields[nameValue] = dataIndex;
                        };*/

                    });

                };

                var formatThousands = d3.format("~s");

                // helping functions
                var returnNumericValue = function (d) {
                    return d.numericValue;
                };

                // < helping functions >

                var drawBarsChart = function () {


                    var radius = Math.min(componentWidth, componentHeight) / 2 - chartMargin;

                    var svg = d3.select(".report-viewer-chart-holder")
                        .append("svg")
                        .attr("width", componentWidth)
                        .attr("height", componentHeight)
                        .append("g")
                        .attr("transform", "translate(" + componentWidth / 2 + "," + componentHeight / 2 + ")");

// Create dummy data
                    var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}

                    // set the color scale
                    var color = d3.scaleOrdinal()
                        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
                        .range(d3.schemeDark2);

                    // Compute the position of each group on the pie:
                    var pie = d3.pie()
                        .sort(null) // Do not sort group by size
                        .value(function(d) {return d.numericValue; });

                    var data_ready = pie(d3.entries(data));

                    // The arc generator
                    var arc = d3.arc()
                        .innerRadius(radius * 0.5)
                        .outerRadius(radius * 0.8);

                    // Another arc that won't be drawn. Just for labels positioning
                    var outerArc = d3.arc()
                        .innerRadius(radius * 0.9)
                        .outerRadius(radius * 0.9);

                    svg
                        .selectAll('allSlices')
                        .data(data_ready)
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function(d){ return(color(d.data.key)) })
                        .attr("stroke", "white")
                        .style("stroke-width", "2px")
                        .style("opacity", 0.7)

// Add the polylines between chart and labels:
                    svg
                        .selectAll('allPolylines')
                        .data(data_ready)
                        .enter()
                        .append('polyline')
                        .attr("stroke", "black")
                        .style("fill", "none")
                        .attr("stroke-width", 1)
                        .attr('points', function(d) {
                            var posA = arc.centroid(d) // line insertion in the slice
                            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                            var posC = outerArc.centroid(d); // Label position = almost the same as posB
                            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                            return [posA, posB, posC]
                        })

                    // Add the polylines between chart and labels:
                    svg
                        .selectAll('allLabels')
                        .data(data_ready)
                        .enter()
                        .append('text')
                        .text( function(d) { console.log(d.data.key) ; return d.data.key } )
                        .attr('transform', function(d) {
                            var pos = outerArc.centroid(d);
                            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                            return 'translate(' + pos + ')';
                        })
                        .style('text-anchor', function(d) {
                            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            return (midangle < Math.PI ? 'start' : 'end')
                        });

                    chartHolderElem.appendChild(svg.node());

                };

                var init = function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        getDataForChartsFromFlatList();
                        drawBarsChart();
                        scope.readyStatus = true;

                    });
                };

                init();

            }
        }
    }
}());