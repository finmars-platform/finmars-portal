/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            //{
            //    "key": "instrument_principal",
            //    "name": "Opened Principal",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_accrued",
            //    "name": "Opened Carry",
            //    "value_type": "float"
            //},
            {
                "key": "net_position_return",
                "name": "Net position return",
                "value_type": "float"
            },
            {
                "key": "net_position_return_loc",
                "name": "Net position return (LOC)",
                "value_type": "float"
            },
            {
                "key": "position_return",
                "name": "Position return",
                "value_type": "float"
            },
            {
                "key": "position_return_loc",
                "name": "Position return (LOC)",
                "value_type": "float"
            },
            {
                "key": "daily_price_change",
                "name": "Daily price change",
                "value_type": "float"
            },
            {
                "key": "mtd_price_change",
                "name": "MTD price change",
                "value_type": "float"
            },
            {
                "key": "principal_fx",
                "name": "Principal FX",
                "value_type": "float"
            },
            {
                "key": "principal_fx_loc",
                "name": "Principal FX (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_fx_opened",
                "name": "Principal FX opened",
                "value_type": "float"
            },
            {
                "key": "principal_fx_opened_loc",
                "name": "Principal FX opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_fixed",
                "name": "Principal fixed",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_loc",
                "name": "Principal fixed (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_opened",
                "name": "Principal fixed opened",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_opened_loc",
                "name": "Principal fixed opened (LOC)",
                "value_type": "float"
            },

            {
                "key": "carry_fx",
                "name": "Carry FX",
                "value_type": "float"
            },
            {
                "key": "carry_fx_loc",
                "name": "Carry FX (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_fx_opened",
                "name": "Carry FX opened",
                "value_type": "float"
            },
            {
                "key": "carry_fx_opened_loc",
                "name": "Carry FX opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_fixed",
                "name": "Carry fixed",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_loc",
                "name": "Carry fixed (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_opened",
                "name": "Carry fixed opened",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_opened_loc",
                "name": "Carry fixed opened (LOC)",
                "value_type": "float"
            },

            {
                "key": "overheads_fx",
                "name": "Overheads FX",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_loc",
                "name": "Overheads FX (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_opened",
                "name": "Overheads FX opened",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_opened_loc",
                "name": "Overheads FX opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed",
                "name": "Overheads fixed",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_loc",
                "name": "Overheads fixed (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_opened",
                "name": "Overheads fixed opened",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_opened_loc",
                "name": "Overheads fixed opened (LOC)",
                "value_type": "float"
            }

        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())