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
            },
            {
                "key": "principal",
                "name": "Principal",
                "value_type": "float"
            },
            {
                "key": "carry",
                "name": "Carry",
                "value_type": "float"
            },
            {
                "key": "overheads",
                "name": "Overheads",
                "value_type": "float"
            },
            {
                "key": "total",
                "name": "Total",
                "value_type": "float"
            },
            {
                "key": "principal_loc",
                "name": "Pricnipal (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_loc",
                "name": "Carry (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_loc",
                "name": "Overheads (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_loc",
                "name": "Total (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_closed",
                "name": "Principal closed",
                "value_type": "float"
            },
            {
                "key": "carry_closed",
                "name": "Carry closed",
                "value_type": "float"
            },
            {
                "key": "overheads_closed",
                "name": "Overheads closed",
                "value_type": "float"
            },
            {
                "key": "total_closed",
                "name": "Total closed",
                "value_type": "float"
            },
            {
                "key": "principal_closed_loc",
                "name": "Principal closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_closed_loc",
                "name": "Carry closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_closed_loc",
                "name": "Overheads closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_closed_loc",
                "name": "Total closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_opened",
                "name": "Principal opened",
                "value_type": "float"
            },
            {
                "key": "carry_opened",
                "name": "Carry opened",
                "value_type": "float"
            },
            {
                "key": "overheads_opened",
                "name": "Overheads opened",
                "value_type": "float"
            },
            {
                "key": "total_opened",
                "name": "Total opened",
                "value_type": "float"
            },
            {
                "key": "principal_opened_loc",
                "name": "Principal opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_opened_loc",
                "name": "Carry opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_opened_loc",
                "name": "Overheads opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_opened_loc",
                "name": "Total opened (LOC)",
                "value_type": "float"
            },

            {
                "key": "total_fx",
                "name": "Total FX",
                "value_type": "float"
            },
            {
                "key": "total_fx_loc",
                "name": "Total FX (LOC)",
                "value_type": "float"
            },

            {
                "key": "principal_fx_closed",
                "name": "Principal FX closed",
                "value_type": "float"
            },
            {
                "key": "carry_fx_closed",
                "name": "Carry FX closed",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_closed",
                "name": "Overheads FX closed",
                "value_type": "float"
            },
            {
                "key": "total_fx_closed",
                "name": "Total FX closed",
                "value_type": "float"
            },
            {
                "key": "principal_fx_closed_loc",
                "name": "Principal FX closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_fx_closed_loc",
                "name": "Carry FX closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_fx_closed_loc",
                "name": "Overheads FX closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_fx_closed_loc",
                "name": "Total FX closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_fx_opened",
                "name": "Total FX opened",
                "value_type": "float"
            },
            {
                "key": "total_fx_opened_loc",
                "name": "Total FX opened (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_fixed",
                "name": "Total fixed",
                "value_type": "float"
            },
            {
                "key": "total_fixed_loc",
                "name": "Total fixed (LOC)",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_closed",
                "name": "Principal fixed closed",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_closed",
                "name": "Carry fixed closed",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_closed",
                "name": "Overheads fixed closed",
                "value_type": "float"
            },
            {
                "key": "total_fixed_closed",
                "name": "Total fixed closed",
                "value_type": "float"
            },
            {
                "key": "principal_fixed_closed_loc",
                "name": "Principal fixed closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "carry_fixed_closed_loc",
                "name": "Carry fixed closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "overheads_fixed_closed_loc",
                "name": "Overheads fixed closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_fixed_closed_loc",
                "name": "Total fixed closed (LOC)",
                "value_type": "float"
            },
            {
                "key": "total_fixed_opened",
                "name": "Total fixed opened",
                "value_type": "float"
            },
            {
                "key": "total_fixed_opened_loc",
                "name": "Total fixed opened (LOC)",
                "value_type": "float"
            }

        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())