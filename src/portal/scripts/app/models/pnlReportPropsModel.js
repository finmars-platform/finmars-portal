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
                "name": "Short Name",
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
                "key": "carry",
                "name": "Carry",
                "value_type": "float"
            },
            {
                "key": "carry_closed",
                "name": "Carry closed",
                "value_type": "float"
            },
            {
                "key": "carry_fixed",
                "name": "Carry fixed",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_closed",
                "name": "Carry fixed closed",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_opened",
                "name": "Carry fixed opened",
                "value_type": "float"
            },
            {
                "key": "carry_fx",
                "name": "Carry FX",
                "value_type": "float"
            },
            {
                "key": "carry_fx_closed",
                "name": "Carry FX closed",
                "value_type": "float"
            },
            {
                "key": "carry_fx_opened",
                "name": "Carry FX opened",
                "value_type": "float"
            },
            {
                "key": "carry_opened",
                "name": "Carry opened",
                "value_type": "float"
            },
            {
                "key": "overheads",
                "name": "Overheads",
                "value_type": "float"
            },
            {
                "key": "overheads_closed",
                "name": "Overheads closed",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed",
                "name": "Overheads fixed",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_closed",
                "name": "Overheads fixed closed",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_opened",
                "name": "Overheads fixed opened",
                "value_type": "float"
            },
            {
                "key": "overheads_fx",
                "name": "Overheads FX",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_closed",
                "name": "Overheads FX closed",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_opened",
                "name": "Overheads FX opened",
                "value_type": "float"
            },
            {
                "key": "overheads_opened",
                "name": "Overheads opened",
                "value_type": "float"
            },
            {
                "key": "principal",
                "name": "Principal",
                "value_type": "float"
            },
            {
                "key": "principal_closed",
                "name": "Principal closed",
                "value_type": "float"
            },
            {
                "key": "principal_fixed",
                "name": "Principal fixed",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_closed",
                "name": "Principal fixed closed",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_opened",
                "name": "Principal fixed opened",
                "value_type": "float"
            },
            {
                "key": "principal_fx",
                "name": "Principal FX",
                "value_type": "float"
            },
            {
                "key": "principal_fx_closed",
                "name": "Principal FX closed",
                "value_type": "float"
            },
            {
                "key": "principal_fx_opened",
                "name": "Principal FX opened",
                "value_type": "float"
            },
            {
                "key": "principal_opened",
                "name": "Principal opened",
                "value_type": "float"
            },
            {
                "key": "total",
                "name": "Total",
                "value_type": "float"
            },
            {
                "key": "total_closed",
                "name": "Total closed",
                "value_type": "float"
            },
            {
                "key": "total_fixed",
                "name": "Total fixed",
                "value_type": "float"
            },
            {
                "key": "total_fixed_closed",
                "name": "Total fixed closed",
                "value_type": "float"
            },
            {
                "key": "total_fixed_opened",
                "name": "Total fixed opened",
                "value_type": "float"
            },
            {
                "key": "total_fx",
                "name": "Total FX",
                "value_type": "float"
            },
            {
                "key": "total_fx_closed",
                "name": "Total FX closed",
                "value_type": "float"
            },
            {
                "key": "total_fx_opened",
                "name": "Total FX opened",
                "value_type": "float"
            },
            {
                "key": "total_opened",
                "name": "Total opened",
                "value_type": "float"
            },
            {
                "key": "total_real",
                "name": "Total real",
                "value_type": "float"
            },
            {
                "key": "total_unreal",
                "name": "Total unreal",
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