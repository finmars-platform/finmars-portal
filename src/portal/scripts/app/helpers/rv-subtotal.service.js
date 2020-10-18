/**
 * Created by szhitenev on 23.11.2016.
 */
(function () {

    'use strict';

    function sum(items, column) {

        var result = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (!isNaN(parseFloat(items[i][column.key]))) {

                result = result + parseFloat(items[i][column.key]);

            }

        }

        return result

    }

    function weightedMarketValue(items, column) {

        var result = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i].hasOwnProperty("market_value") && !isNaN(parseFloat(items[i]["market_value"]))) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    result = result + parseFloat(items[i][column.key]) * parseFloat(items[i]["market_value"]);

                }

            } else if (items[i]["market_value"] !== 0) {
                // throw Error("market_value is not set");
                console.log("market_value is not set", items[i]);
            }

        }

        return result;

    }

    function weightedMarketValuePercent(items, column) {

        var result = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i]["market_value_percent"] && !isNaN(parseFloat(items[i]["market_value_percent"]))) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    result = result + parseFloat(items[i][column.key]) * parseFloat(items[i]["market_value_percent"]);

                }

            } else if (items[i]["market_value_percent"] !== 0) {
                // throw Error("market_value_percent is not set")
                console.log("market_value_percent is not set", items[i]);
            }

        }

        return result;
    }

    function weightedExposure(items, column) {

        var result = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i].hasOwnProperty("exposure") && !isNaN(parseFloat(items[i]["exposure"]))) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    result = result + parseFloat(items[i][column.key]) * parseFloat(items[i]["exposure"]);

                }

            } else if (items[i]["exposure"] !== 0) {
                // throw Error('exposure is not set')
                console.log('exposure is not set', items[i]);
            }

        }

        return result;

    }

    function weightedExposurePercent(items, column) {

        var result = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i]["exposure_percent"] && !isNaN(parseFloat(items[i]["exposure_percent"]))) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    result = result + parseFloat(items[i][column.key]) * parseFloat(items[i]["exposure_percent"]);

                }

            } else if (items[i]["exposure_percent"] !== 0) {
                // throw Error("exposure_percent is not set");
                console.log("exposure_percent is not set", items[i]);
            }

        }

        return result

    }

    function weightedAverageMarketValue(items, column) {

        var result = 0;
        var total = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i].hasOwnProperty("market_value") && !isNaN(parseFloat(items[i]["market_value"]))) {
                total = total + parseFloat(items[i]["market_value"]);

            } else if (items[i]["market_value"] !== 0) {
                // throw Error("market_value is not set");
                console.log("market_value is not set", items[i]);
            }

        }

        if (total) {

            for (i = 0; i < items.length; i = i + 1) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    var average = parseFloat(items[i]["market_value"]) / total;

                    result = result + parseFloat(items[i][column.key]) * average;

                }

            }

        }

        return result;

    }

    function weightedAverageMarketValuePercent(items, column) {

        var result = 0;
        var total = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i]["market_value_percent"] && !isNaN(parseFloat(items[i]["market_value_percent"]))) {
                total = total + parseFloat(items[i]["market_value_percent"]);

            } else if (items[i]["market_value_percent"] !== 0) {
                // throw Error("market_value_percent is not set");
                console.log("market_value_percent is not set", items[i]);
            }

        }

        if (total) {

            for (i = 0; i < items.length; i = i + 1) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    var average = parseFloat(items[i]["market_value_percent"]) / total;

                    result = result + parseFloat(items[i][column.key]) * average;

                }

            }

        }

        return result;

    }

    function weightedAverageExposure(items, column) {

        var result = 0;
        var total = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i].hasOwnProperty("exposure") && !isNaN(parseFloat(items[i]["exposure"]))) {
                total = total + parseFloat(items[i]["exposure"]);

            } else if (items[i]["exposure"] !== 0) {
                // throw Error("exposure is not set");
                console.log("exposure is not set", items[i]);
            }

        }

        if (total) {

            for (i = 0; i < items.length; i = i + 1) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    var average = parseFloat(items[i]["exposure"]) / total;

                    result = result + parseFloat(items[i][column.key]) * average;

                }

            }

        }


        return result;

    }

    function weightedAverageExposurePercent(items, column) {

        var result = 0;
        var total = 0;

        var i;

        for (i = 0; i < items.length; i = i + 1) {

            if (items[i]["exposure_percent"] && !isNaN(parseFloat(items[i]["exposure_percent"]))) {
                total = total + parseFloat(items[i]["exposure_percent"]);

            } else if (items[i]["exposure_percent"] !== 0) {
                // throw Error("exposure_percent is not set");
                console.log("exposure_percent is not set", items[i]);
            }

        }

        if (total) {

            for (i = 0; i < items.length; i = i + 1) {

                if (!isNaN(parseFloat(items[i][column.key]))) {

                    var average = parseFloat(items[i]["exposure_percent"]) / total;

                    result = result + parseFloat(items[i][column.key]) * average;

                }

            }

        }


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

    var calculateColumn = function(items, column){

        var result = {};

        result[column.key] = resolveSubtotalFunction(items, column);

        return result;

    };

    module.exports = {
        calculate: calculate,
        calculateColumn: calculateColumn
    }

}());