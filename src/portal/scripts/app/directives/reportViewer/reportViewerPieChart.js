(function () {

    'use strict';

    var rvDataHelper = require('../../helpers/rv-data.helper');
    var rvChartsHelper = require('../../helpers/rv-charts.helper');

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

                var nameKey = scope.rvChartsSettings.group_attr;
                var numberKey = scope.rvChartsSettings.number_attr;
                var fieldValueCalcFormulaId = parseInt(scope.rvChartsSettings.group_number_calc_formula);

                var getDataForCharts = function () {

                    chartData = [];

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    var itemList = flatList.filter(function (item) {
                        return item.___type === 'object'
                    });

                    chartData = rvChartsHelper.getDataForChartsFromFlatList(itemList, nameKey, numberKey, fieldValueCalcFormulaId);

                    /*var fieldsKeys = scope.rvChartsSettings.fieldsKeys;

                    var f;
                    for (f = 0; f < fieldsKeys.length; f++) {

                        var fieldData = {};
                        var key = fieldsKeys[f];

                        fieldData.name = key;
                        fieldData.numericValue = 0;

                        var i;
                        for (i = 0; i < itemList.length; i++) {
                            var item = itemList[i];

                            if (item[key]) {
                                fieldData.numericValue += item[key];
                            };
                        };

                        chartData.push(fieldData);

                    };*/

                };

                // < helping functions >

                /*var colorsList = [
                    '#ab3939', '#70ab39', '#ab6039', '#3972ab', '#ab9039', '#a739ab', '#95ab39', '#6739ab', '#39ab99', '#623879',
                    '#3946ab', '#39ab3d', '#7c39ab', '#5e0c0c', '#3992ab', '#ab3979', '#ab3939', '#60c877', '#3015f7', '#ffcf00',
                    '#4c334d'
                ];*/

                var drawChart = function () {

                    var radius;

                    if (componentHeight < componentWidth) {
                        radius = componentHeight / 2;
                    } else {
                        radius = componentWidth / 2;
                    };

                    var svgSize = radius * 2;

                    var getPartColor = d3.scaleOrdinal()
                        .domain(d3.map(chartData, function (d) {return d.name}))
                        .range(d3.schemeCategory10);

                    var arc = d3.arc()
                        .innerRadius(radius * 0.8)
                        .outerRadius(radius);

                    var pie = d3.pie()
                        .sort(null)
                        .value(function (d) {
                            return d.numericValue;
                        });

                    var svg = d3.select(chartHolderElem)
                        .append('svg')
                            .attr('width', svgSize + 'px')
                            .attr('height', svgSize + 'px');

                    var chartWrapingG = svg.append('g')
                        .attr('transform', 'translate(' + radius + ',' + radius + ')');

                    chartWrapingG.selectAll('g')
                        .data(pie(chartData))
                        .enter()
                        .append('g');

                    chartWrapingG.selectAll('g')
                        .append('path')
                            .attr('d', arc)
                            .style("stroke-width", "2px")
                            .attr('fill', function (d) {
                                return getPartColor(d.data.name)
                            });

                    chartWrapingG.selectAll('path')
                        .on("mouseover", function () {

                            d3.select(this)
                                .style('opacity', 0.5);

                            var barTooltipElem = document.createElement("div");
                            barTooltipElem.classList.add("chart-tooltip1", "dashboard-bar-chart-tooltip");
                            document.body.appendChild(barTooltipElem);

                        })
                        .on("mousemove", function (d) {

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");

                            barTooltipElem.innerText = "Name: " + d.data.name + ";" + "\n" + "Number: " + d.data.numericValue + ";";
                            var tElemWidth = barTooltipElem.offsetWidth;
                            barTooltipElem.style.top = (d3.event.pageY - 10) + "px";
                            barTooltipElem.style.left = (d3.event.pageX - tElemWidth - 5) + "px"; // subtractions applied to place tooltip to the left of cursor

                        })
                        .on("mouseout", function () {
                            d3.select(this)
                                .style('opacity', 1);

                            var barTooltipElem = document.querySelector(".dashboard-bar-chart-tooltip");
                            document.body.removeChild(barTooltipElem);
                        });

                };

                var init = function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        getDataForCharts();
                        drawChart();
                        scope.readyStatus = true;

                    });
                };

                init();

            }
        }
    }
}());