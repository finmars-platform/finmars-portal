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

                var horizontalColumns = true;

                var chartData = [];

                var mainElem = elem[0].querySelector('.report-viewer-charts');
                var chartHolderElem = elem[0].querySelector('.report-viewer-chart-holder');

                var componentHeight = mainElem.clientHeight;
                var componentWidth = mainElem.offsetWidth;
                var barsMinWidth = scope.rvChartsSettings.min_bar_width;
                var barsMaxWidth = scope.rvChartsSettings.max_bar_width;
                var barWidth; // used for words wrap function

                var chartMargin = {
                    top: 20,
                    right: 10,
                    bottom: 60,
                    left: 40
                };

                if (horizontalColumns) {
                    chartMargin.top = 40;
                    chartMargin.bottom = 20;
                }
                var bandPadding = 0.2;

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

                    });

                };

                var formatThousands = d3.format("~s");

                // helping functions
                var returnNumericValue = function (d) {
                    return d.numericValue;
                };

                var getMinValueForAxis = function () {
                    return Math.min(0, d3.min(chartData, returnNumericValue));
                };

                var wrapWords = function (textElems, width) {
                    console.log("d3 service textElems", textElems);
                    textElems.each(function() {

                        var text = d3.select(this),
                            words = text.text().split(/\s+/).reverse(),
                            word,
                            line = [],
                            lineNumber = 0,
                            lineHeight = 1.1,
                            y = text.attr("y"),
                            dy = parseFloat(text.attr("dy")),
                            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));

                            if (line.length > 1 && tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                lineNumber += 1;
                                var tSpanDY = lineNumber * lineHeight + dy;
                                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", tSpanDY + "em").text(word);
                            }

                        }

                    });
                };


                // < helping functions >

                var drawChartWithVerticalCols = function () {

                    var chartWidth = componentWidth - chartMargin.right - chartMargin.left;
                    var barPaddingInPx;

                    // check if chart has enough width
                    if (chartData.length > 0 && barsMinWidth && barsMaxWidth) {
                        barPaddingInPx = (chartWidth / chartData.length) * bandPadding;
                        barWidth = chartWidth / chartData.length - barPaddingInPx;

                        if (barWidth < barsMinWidth) {

                            chartWidth = (barsMinWidth + barPaddingInPx) * chartData.length;
                            componentWidth = chartWidth + chartMargin.right + chartMargin.left;

                        } else if (barWidth > barsMaxWidth) {

                            chartWidth = (barsMaxWidth + barPaddingInPx) * chartData.length;
                            componentWidth = chartWidth + chartMargin.right + chartMargin.left;

                        };
                    }
                    // < check if chart has enough >

                    // declare height here because margin bottom can change higher
                    var chartHeight = componentHeight - chartMargin.bottom - chartMargin.top;

                    chartHolderElem.style.width = componentWidth + 'px';

                    var xScale = d3.scaleBand()
                        .domain(chartData.map(function (d) {
                            return d.name;
                        }))
                        .range([chartMargin.left, chartWidth])
                        .padding(bandPadding);

                    var yScale = d3.scaleLinear()
                            .domain([getMinValueForAxis(), d3.max(chartData, returnNumericValue)]).nice()
                            .range([chartHeight, chartMargin.top]);

                    var leftAxis = d3.axisLeft(yScale).tickFormat(formatThousands);  // if we change ticks amount

                    // check if ticks are located too close to each other
                    var ticksNumber = yScale.ticks().length;

                    if (ticksNumber && ticksNumber > 0) {
                        if (Math.floor(chartHeight / ticksNumber) < 15) { // if tick height less that 15 pixels

                            var halfOfTicks = Math.floor(ticksNumber / 2);
                            leftAxis = leftAxis.ticks(halfOfTicks).tickFormat(formatThousands);

                            /*chartHeight = ticksNumber * 15;
                            componentHeight = chartHeight + chartMargin.top + chartMargin.bottom;

                            chartHolderElem.style.height = componentHeight + 'px';

                            yScale = d3.scaleLinear()
                                .domain([getMinValueForAxis(), d3.max(chartData, returnNumericValue)]).nice()
                                .range([chartHeight, chartMargin.top]);*/

                        };
                    };
                    // < check if ticks are located too close to each other >

                    //var leftAxis = d3.axisLeft(yScale).tickFormat(formatThousands); // if we change chart height

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

                    var svg = d3.select(chartHolderElem)
                        .append("svg")
                            .attr("width", componentWidth + "px")
                            .attr("height", componentHeight + "px")
                            .attr("viewBox", [0, 0, componentWidth, componentHeight]);

                    svg.append("g")
                        .attr("fill", "steelblue")
                        .selectAll("rect")
                        .data(chartData)
                        .join("rect")
                            .attr("class", "dashboard-rv-chart-bar")
                            .attr("x", function (d) {return xScale(d.name)})
                            .attr("y", function (d) {return yScale(Math.max(0, d.numericValue))})
                            .attr("height", getBarHeight)
                            .attr("width", xScale.bandwidth());

                    svg.selectAll('rect.dashboard-rv-chart-bar')
                        .on("mouseover", function () {

                            d3.select(this)
                                .attr("fill", "#f4af8b");

                            var barTooltipElem = document.createElement("div");
                            barTooltipElem.classList.add("chart-tooltip1", "dashboard-bar-chart-tooltip");
                            document.body.appendChild(barTooltipElem);

                        })
                        .on("mousemove", function (d) {

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");

                            barTooltipElem.innerText = "Name: " + d.name + ";" + "\n" + "Number: " + d.numericValue + ";";
                            var tElemWidth = barTooltipElem.offsetWidth;
                            barTooltipElem.style.top = (d3.event.pageY - 10) + "px";
                            barTooltipElem.style.left = (d3.event.pageX - tElemWidth - 5) + "px"; // subtractions applied to place tooltip to the left of cursor

                        })
                        .on("mouseout", function () {
                            d3.select(this)
                                .attr("fill", "steelblue");

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");
                            document.body.removeChild(barTooltipElem);
                        });

                    svg.append("g")
                        .call(xAxis)
                        .selectAll("text")
                            .attr("class", "svg-text-to-wrap");

                    svg.append("g")
                        .call(yAxis);

                    //chartHolderElem.appendChild(svg.node());

                };

                var drawChartWithHorizontalCols = function () {

                    var chartHeight = componentHeight - chartMargin.top - chartMargin.bottom;
                    var barPaddingInPx;

                    // check if chart has enough width
                    if (chartData.length > 0 && barsMinWidth && barsMaxWidth) {
                        barPaddingInPx = (chartHeight / chartData.length) * bandPadding;
                        barWidth = chartHeight / chartData.length - barPaddingInPx;

                        if (barWidth < barsMinWidth) {

                            chartHeight = (barsMinWidth + barPaddingInPx) * chartData.length;
                            componentHeight = chartHeight + chartMargin.top + chartMargin.bottom;

                        } else if (barWidth > barsMaxWidth) {

                            chartHeight = (barsMaxWidth + barPaddingInPx) * chartData.length;
                            componentHeight = chartHeight + chartMargin.top + chartMargin.bottom;

                        };
                    }
                    // < check if chart has enough >

                    chartHolderElem.style.height = componentHeight + 'px';
                    var chartWidth = componentWidth - chartMargin.left - chartMargin.right;

                    console.log("d3 service drawHorChart sizes", componentHeight, componentWidth, chartHeight, chartWidth);
                    chartHolderElem.style.width = componentWidth + 'px';
                    console.log("d3 service xScale data", getMinValueForAxis(), d3.max(chartData, returnNumericValue), chartWidth);
                    var xScale = d3.scaleLinear()
                        .domain([getMinValueForAxis(), d3.max(chartData, returnNumericValue)]).nice()
                        .range([chartMargin.left, chartWidth]);

                    var yScale = d3.scaleBand()
                        .domain(chartData.map(function (d) {
                            return d.name;
                        }))
                        .range([chartMargin.top, chartHeight])
                        .padding(bandPadding);


                    var bottomAxis = d3.axisBottom(xScale).tickFormat(formatThousands);  // if we change ticks amount

                    // check if ticks are located too close to each other
                    var ticksNumber = xScale.ticks().length;

                    /*if (ticksNumber && ticksNumber > 0) {
                        if (Math.floor(chartHeight / ticksNumber) < 15) { // if tick height less that 15 pixels

                            var halfOfTicks = Math.floor(ticksNumber / 2);
                            bottomAxis = bottomAxis.ticks(halfOfTicks).tickFormat(formatThousands);

                            /!*chartHeight = ticksNumber * 15;
                            componentWidth = chartWidth + chartMargin.left + chartMargin.right;

                            chartHolderElem.style.height = componentWidth + 'px';

                            var xScale = d3.scaleBand()
                                .domain([getMinValueForAxis(), d3.max(chartData, returnNumericValue)]).nice()
                                .range([chartMargin.left, chartWidth]);*!/

                        };
                    };*/
                    // < check if ticks are located too close to each other >

                    //var bottomAxis = d3.axisBottom(xScale).tickFormat(formatThousands);  // if we change chart width

                    // move abscissa line behind margin
                    var xAxis = function (g) {
                        g
                            .attr("transform", "translate(0,0)")
                            .call(bottomAxis)
                            .call(function (g) {g.select(".domain").remove()});
                    };

                    // move ordinate line behind margin
                    var yAxis = function (g) {
                        g
                            .attr("transform", "translate(0,0")
                            .call(d3.axisLeft(yScale).tickSizeOuter(0));
                    };

                    var getBarWidth = function (d) {
                        return Math.abs(xScale(0) - xScale(d.numericValue));
                    };

                    var svg = d3.select(chartHolderElem)
                        .append("svg")
                        .attr("width", componentWidth + "px")
                        .attr("height", componentHeight + "px")
                        .attr("viewBox", [0, 0, chartWidth, componentHeight]);

                    svg.append("g")
                        .attr("fill", "steelblue")
                        .selectAll("rect")
                        .data(chartData)
                        .join("rect")
                            .attr("class", "dashboard-rv-chart-bar")
                            .attr("x", function (d) {return xScale(Math.min(0, d.numericValue))})
                            .attr("y", function (d) {return yScale(d.name)})
                            .attr("height", yScale.bandwidth())
                            .attr("width", getBarWidth);

                    svg.selectAll('rect.dashboard-rv-chart-bar')
                        .on("mouseover", function () {

                            d3.select(this)
                                .attr("fill", "#f4af8b");

                            var barTooltipElem = document.createElement("div");
                            barTooltipElem.classList.add("chart-tooltip1", "dashboard-bar-chart-tooltip");
                            document.body.appendChild(barTooltipElem);

                        })
                        .on("mousemove", function (d) {

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");

                            barTooltipElem.innerText = "Name: " + d.name + ";" + "\n" + "Number: " + d.numericValue + ";";
                            var tElemWidth = barTooltipElem.offsetWidth;
                            barTooltipElem.style.top = (d3.event.pageY - 10) + "px";
                            barTooltipElem.style.left = (d3.event.pageX - tElemWidth - 5) + "px"; // subtractions applied to place tooltip to the left of cursor

                        })
                        .on("mouseout", function () {
                            d3.select(this)
                                .attr("fill", "steelblue");

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");
                            document.body.removeChild(barTooltipElem);
                        });

                    svg.append("g")
                        .call(xAxis);

                    svg.append("g")
                        .call(yAxis)
                        .selectAll("text")
                        .attr("class", "svg-text-to-wrap");

                    //chartHolderElem.appendChild(svg.node());

                };

                var init = function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        getDataForChartsFromFlatList();
                        if (horizontalColumns) {
                            drawChartWithHorizontalCols();
                        } else {
                            drawChartWithVerticalCols();
                        };

                        scope.readyStatus = true;
                        scope.$apply();
                        d3.select(chartHolderElem)
                            .selectAll('.svg-text-to-wrap')
                            .call(wrapWords, barWidth);

                    });
                };

                init();

            }
        }
    }
}());