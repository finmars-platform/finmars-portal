(function () {

    'use strict';

    var rvDataHelper = require('../../helpers/rv-data.helper');

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function (d3) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/reportViewer/report-viewer-charts-view.html',
            scope: {
                rvChartsSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                scope.readyStatus = false;

                var chartData = [];

                var mainElem = elem[0].querySelector('.report-viewer-charts');
                var chartHolderElem = elem[0].querySelector('.report-viewer-chart-holder');

                var componentHeight = mainElem.clientHeight;
                var componentWidth = mainElem.offsetWidth;
                var barsMinWidth = scope.rvChartsSettings.min_bar_width;
                var barsMaxWidth = scope.rvChartsSettings.max_bar_width;

                var chartMargin = {
                    top: 20,
                    right: 0,
                    bottom: 30,
                    left: 40
                };

                var getDataForChartsFromFlatList = function () {

                    chartData = [];

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    var itemList = flatList.filter(function (item) {
                        return item.___type === 'object'
                    });

                    var nameKey = scope.rvChartsSettings.abscissa;
                    var numberKey = scope.rvChartsSettings.ordinate;

                    var savedValues = [];

                    itemList.forEach(function (item) {

                        var nameValue = null;
                        var numberValue = null;

                        if (item[nameKey]) {
                            if (savedValues.indexOf(item[nameKey]) === -1) {
                                nameValue = item[nameKey];
                            };
                        };

                        if (item[numberKey] || item[numberKey] === 0) {
                            numberValue = item[numberKey];
                        };

                        if (nameValue && numberValue) {
                            savedValues.push(nameValue);
                            chartData.push({name: nameValue, numericValue: numberValue});
                        };

                    });

                };

                scope.readyStatus = true;

                var drawBarsChart = function () {

                    var chartWidth = componentWidth - chartMargin.right - chartMargin.left;

                    // check if chart has enough width
                    if (chartData.length > 0 && barsMinWidth && barsMaxWidth) {
                        var barWidth = chartWidth / chartData.length;

                        if (barWidth < barsMinWidth) {

                            var newChartWidth = (barsMinWidth + 7) * chartData.length; // adding 7 to take into account paddings between bars
                            componentWidth = newChartWidth + chartMargin.right + chartMargin.left;
                            chartMargin.bottom = 40;

                        } else if (barWidth > barsMaxWidth) {

                            var newChartWidth = barsMaxWidth * chartData.length; // adding 7 to take into account paddings between bars
                            componentWidth = newChartWidth + chartMargin.right + chartMargin.left;
                            chartMargin.bottom = 40;

                        };
                    }
                    // < check if chart has enough >

                    // declare height here because margin bottom can change higher
                    var chartHeight = componentHeight - chartMargin.bottom - chartMargin.top;

                    var returnNumericValue = function (d) {
                        return d.numericValue;
                    };

                    chartHolderElem.style.width = componentWidth + 'px';

                    var xScale = d3.scaleBand()
                        .domain(chartData.map(function (d) {
                            return d.name;
                        }))
                        .range([chartMargin.left, chartWidth])
                        .padding(0.1);

                    var yScale = d3.scaleLinear()
                            .domain(d3.extent(chartData, returnNumericValue))
                            .range([chartHeight, chartMargin.top]);

                    // check if ticks are located too close to each other
                    var ticksNumber = yScale.ticks().length;

                    if (ticksNumber && ticksNumber > 0) {
                        if (Math.floor(chartHeight / ticksNumber) < 15) { // if tick height less that 15 pixels

                            /*var halfOfTicks = Math.floor(ticksNumber / 2);
                            leftAxis = leftAxis.ticks(halfOfTicks);*/

                            chartHeight = ticksNumber * 15;
                            componentHeight = chartHeight + chartMargin.top + chartMargin.bottom;

                            chartHolderElem.style.height = componentHeight + 'px';

                            yScale = d3.scaleLinear()
                                .domain(d3.extent(chartData, returnNumericValue))
                                .range([chartHeight, chartMargin.top]);

                        };
                    };
                    // < check if ticks are located too close to each other >

                    var leftAxis = d3.axisLeft(yScale);

                    // move abscissa line behind margin
                    var xAxis = function (g) {
                        g
                            .attr("transform", "translate(0," + (chartHeight + chartMargin.top) + ")")
                            .call(d3.axisBottom(xScale).tickSizeOuter(0));
                    };

                    // move ordinate line behind margin
                    var yAxis = function (g) {
                        g
                            .attr("transform", "translate(" + chartMargin.left + ",0)")
                            .call(leftAxis)
                            .call(function (g) {g.select(".domain").remove()});
                    };

                    var getBarHeight = function (d) {
                        return Math.abs(yScale(0) - yScale(d.numericValue));
                    };

                    var svg = d3.create("svg")
                        .attr("viewBox", [0, 0, componentWidth, componentHeight]);

                    svg.append("g")
                        .attr("fill", "steelblue")
                        .selectAll("rect")
                        .data(chartData)
                        .join("rect")
                        .attr("x", function (d) {return xScale(d.name)})
                        .attr("y", function (d) {return yScale(Math.max(0, d.numericValue))})
                        .attr("height", getBarHeight)
                        .attr("width", xScale.bandwidth());

                    svg.append("g")
                        .call(xAxis);

                    svg.append("g")
                        .call(yAxis);

                    chartHolderElem.appendChild(svg.node());

                };

                var init = function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        getDataForChartsFromFlatList();
                        drawBarsChart();

                    });
                };

                init();

            }
        }
    }
}());