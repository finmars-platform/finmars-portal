/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "name",
                "name": "Name",
                "value_type": 10
            },
            {
                "key": "short_name",
                "name": "Short name",
                "value_type": 10
            },
            {
                "key": "user_code",
                "name": "User code",
                "value_type": 10
            },
            {
                "key": "account",
                "name": "Account",
                "value_type": "field"
            },
            {
                "key": "instrument",
                "name": "Instrument",
                "value_type": "field"
            },
            {
                "key": "currency",
                "name": "Currency",
                "value_type": "field"
            },
            {
                "key": "portfolio",
                "name": "Portfolio",
                "value_type": "field"
            },
            {
                "key": "strategy-1",
                "name": "Strategy 1",
                "value_type": "field"
            },
            {
                "key": "strategy-2",
                "name": "Strategy 2",
                "value_type": "field"
            },
            {
                "key": "strategy-3",
                "name": "Strategy 3",
                "value_type": "field"
            },
            {
                "key": "position_size",
                "name": "Position size",
                "value_type": "float"
            },
            {
                "key": "market_value",
                "name": "Market value",
                "value_type": "float"
            },
            {
                "key": "exposure",
                "name": "Exposure",
                "value_type": "float"
            },
            {
                "key": "market_value_percent",
                "name": "Market value %",
                "value_type": "float"
            },
            {
                "key": "exposure_percent",
                "name": "Exposure %",
                "value_type": "float"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())