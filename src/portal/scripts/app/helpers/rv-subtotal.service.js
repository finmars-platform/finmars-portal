/**
 * Created by szhitenev on 23.11.2016.
 */
(function () {

    'use strict';

    function sum(items, column) {

        var result = 0;

        items.forEach(function (item) {

            result = result + parseFloat(item[column.key]);

        });

        // console.log('sum.result', result);

        return result

    }

    function weightedMarketValue(items, column) {

        var result = 0;

        items.forEach(function (item) {

            if (item.hasOwnProperty("market_value")) {

                result = result + parseFloat(item[column.key]) * parseFloat(item["market_value"]);
            } else {

                throw Error("market_value is not set");
            }

        });

        return result;

    }

    function weightedMarketValuePercent(items, column) {

        var result = 0;

        items.forEach(function (item) {

            if (item["market_value_percent"]) {

                result = result + parseFloat(groupedItem[column.key]) * parseFloat(groupedItem["market_value_percent"]);
            } else {

                throw Error("market_value_percent is not set")
            }

        });
    }

    function weightedExposure(items, column) {

        var result = 0;

        items.forEach(function (item) {

            if (item.hasOwnProperty("exposure")) {

                result = result + parseFloat(groupedItem[column.key]) * parseFloat(groupedItem["exposure"]);

            } else {

                throw Error('exposure is not set')
            }

        });

        return result

    }

    function weightedExposurePercent(items, column) {

        var result = 0;

        items.forEach(function (item) {

            if (item["exposure_percent"]) {

                result = result + parseFloat(item[column.key]) * parseFloat(item["exposure_percent"]);

            } else {

                throw Error("exposure_percent is not set");
            }

        });

        return result

    }

    function weightedAverageMarketValue(items, column) {

        var result = 0;
        var total = 0;

        items.forEach(function (item) {

            if (item.hasOwnProperty("market_value")) {
                total = total + parseFloat(item["market_value"]);
            } else {
                throw Error("market_value is not set");
            }

        });

        items.forEach(function (item) {

            var average = parseFloat(item["market_value"]) / total;

            result = result + parseFloat(item[column.key]) * average;

        });

        return result;

    }

    function weightedAverageMarketValuePercent(items, column) {

        var result = 0;
        var total = 0;

        items.forEach(function (item) {

            if (item["market_value_percent"]) {
                total = total + parseFloat(item["market_value_percent"]);
            } else {
                throw Error("market_value_percent is not set");
            }

        });

        items.forEach(function (item) {

            var average = parseFloat(item["market_value_percent"]) / total;

            result = result + parseFloat(item[column.key]) * average;


        });

        return result;

    }

    function weightedAverageExposure(items, column) {

        var result = 0;
        var total = 0;

        items.forEach(function (item) {

            if (item.hasOwnProperty("exposure")) {
                total = total + parseFloat(item["exposure"]);
            } else {
                throw Error("exposure is not set");
            }

        });

        items.forEach(function (item) {

            var average = parseFloat(item["exposure"]) / total;

            result = result + parseFloat(item[column.key]) * average;

        });

        return result;

    }

    function weightedAverageExposurePercent(items, column) {

        var result = 0;
        var total = 0;

        items.forEach(function (item) {

            if (item["exposure_percent"]) {
                total = total + parseFloat(item["exposure_percent"]);
            } else {
                throw Error("exposure_percent is not set");
            }

        });

        items.forEach(function (item) {

            var average = parseFloat(item["exposure_percent"]) / total;

            result = result + parseFloat(item[column.key]) * average;

        });

        return result;

    }

    function resolveSubtotalFunction(items, column) {

        // console.log('resolveSubtotalFunction.column', column);

        if (column.report_settings && column.report_settings.subtotal_formula_id) {

            switch (column.report_settings.subtotal_formula_id) {
                case 1:
                    return sum(items, column);
                case 2:
                    return weightedMarketValue(items, column);
                case 3:
                    return weightedMarketValuePercent(items, column);
                case 4:
                    return weightedExposure(items, column);
                case 5:
                    return weightedExposurePercent(items, column);
                case 6:
                    return weightedAverageMarketValue(items, column);
                case 7:
                    return weightedAverageMarketValuePercent(items, column);
                case 8:
                    return weightedAverageExposure(items, column);
                case 9:
                    return weightedAverageExposurePercent(items, column);

            }
        }


    }


    var calculate = function (items, columns) {

        var result = {};

        // console.log('calculate.columns', columns);

        columns.forEach(function (column) {

            if (column.value_type === 20) {

                result[column.key] = resolveSubtotalFunction(items, column);
            }

        });

        return result;
    };

    module.exports = {
        calculate: calculate
    }

}());