/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "item_group_name",
                "name": "Group Name",
                "value_type": 10
            },
            {
                "key": "item_subtype_name",
                "name": "Subtype Name",
                "value_type": 10
            },
            //{
            ////    "key": "instrument_principal",
            ////    "name": "Opened Principal",
            ////    "value_type": 20
            ////},
            //{
            ////    "key": "instrument_accrued",
            ////    "name": "Opened Carry",
            ////    "value_type": 20
            ////},

			// This models needed to facilitate linking to report dates
			{
				"key": "pl_first_date",
				"name": "Date-from",
				"value_type": 40
			},
			{
				"key": "report_date",
				"name": "Date-to",
				"value_type": 40
			},
			// < This models needed to facilitate linking to report dates >
			{
                "key": "net_position_return",
                "name": "Net position return",
                "value_type": 20
            },
            {
                "key": "net_position_return_loc",
                "name": "Net position return (Pricing Currency)",
                "value_type": 20
            },
            {
                "key": "time_invested",
                "name": "Time invested",
                "value_type": 20
            },
            {
                "key": "position_return",
                "name": "Position return",
                "value_type": 20
            },
            {
                "key": "position_return_loc",
                "name": "Position return (Pricing Currency)",
                "value_type": 20
            },
            {
                "key": "daily_price_change",
                "name": "Daily price change",
                "value_type": 20
            },
            {
                "key": "mtd_price_change",
                "name": "MTD price change",
                "value_type": 20
            },
            {
                "key": "principal_fx",
                "name": "Principal FX",
                "value_type": 20
            },
            {
                "key": "principal_fx_loc",
                "name": "Principal FX (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "principal_fx_opened",
            //    "name": "Principal FX opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_fx_opened_loc",
            //    "name": "Principal FX opened (Pricing Currency)",
            //    "value_type": 20
            //},
            {
                "key": "principal_fixed",
                "name": "Principal fixed",
                "value_type": 20
            },
            {
                "key": "principal_fixed_loc",
                "name": "Principal fixed (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "principal_fixed_opened",
            //    "name": "Principal fixed opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_fixed_opened_loc",
            //    "name": "Principal fixed opened (Pricing Currency)",
            //    "value_type": 20
            //},

            {
                "key": "carry_fx",
                "name": "Carry FX",
                "value_type": 20
            },
            {
                "key": "carry_fx_loc",
                "name": "Carry FX (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "carry_fx_opened",
            //    "name": "Carry FX opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fx_opened_loc",
            //    "name": "Carry FX opened (Pricing Currency)",
            //    "value_type": 20
            //},
            {
                "key": "carry_fixed",
                "name": "Carry fixed",
                "value_type": 20
            },
            {
                "key": "carry_fixed_loc",
                "name": "Carry fixed (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "carry_fixed_opened",
            //    "name": "Carry fixed opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fixed_opened_loc",
            //    "name": "Carry fixed opened (Pricing Currency)",
            //    "value_type": 20
            //},

            {
                "key": "overheads_fx",
                "name": "Overheads FX",
                "value_type": 20
            },
            {
                "key": "overheads_fx_loc",
                "name": "Overheads FX (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "overheads_fx_opened",
            //    "name": "Overheads FX opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fx_opened_loc",
            //    "name": "Overheads FX opened (Pricing Currency)",
            //    "value_type": 20
            //},
            {
                "key": "overheads_fixed",
                "name": "Overheads fixed",
                "value_type": 20
            },
            {
                "key": "overheads_fixed_loc",
                "name": "Overheads fixed (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "overheads_fixed_opened",
            //    "name": "Overheads fixed opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fixed_opened_loc",
            //    "name": "Overheads fixed opened (Pricing Currency)",
            //    "value_type": 20
            //},
            {
                "key": "principal",
                "name": "Principal",
                "value_type": 20
            },
            {
                "key": "carry",
                "name": "Carry",
                "value_type": 20
            },
            {
                "key": "overheads",
                "name": "Overheads",
                "value_type": 20
            },
            {
                "key": "total",
                "name": "Total",
                "value_type": 20
            },
            {
                "key": "principal_loc",
                "name": "Principal (Pricing Currency)",
                "value_type": 20
            },
            {
                "key": "carry_loc",
                "name": "Carry (Pricing Currency)",
                "value_type": 20
            },
            {
                "key": "overheads_loc",
                "name": "Overheads (Pricing Currency)",
                "value_type": 20
            },
            {
                "key": "total_loc",
                "name": "Total (Pricing Currency)",
                "value_type": 20
            },
            //{
            //    "key": "principal_closed",
            //    "name": "Principal closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_closed",
            //    "name": "Carry closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_closed",
            //    "name": "Overheads closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_closed",
            //    "name": "Total closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_closed_loc",
            //    "name": "Principal closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_closed_loc",
            //    "name": "Carry closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_closed_loc",
            //    "name": "Overheads closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_closed_loc",
            //    "name": "Total closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_opened",
            //    "name": "Principal opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_opened",
            //    "name": "Carry opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_opened",
            //    "name": "Overheads opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_opened",
            //    "name": "Total opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_opened_loc",
            //    "name": "Principal opened (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_opened_loc",
            //    "name": "Carry opened (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_opened_loc",
            //    "name": "Overheads opened (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_opened_loc",
            //    "name": "Total opened (Pricing Currency)",
            //    "value_type": 20
            //},

            {
                "key": "total_fx",
                "name": "Total FX",
                "value_type": 20
            },
            {
                "key": "total_fx_loc",
                "name": "Total FX (Pricing Currency)",
                "value_type": 20
            },

            //{
            //    "key": "principal_fx_closed",
            //    "name": "Principal FX closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fx_closed",
            //    "name": "Carry FX closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fx_closed",
            //    "name": "Overheads FX closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fx_closed",
            //    "name": "Total FX closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_fx_closed_loc",
            //    "name": "Principal FX closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fx_closed_loc",
            //    "name": "Carry FX closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fx_closed_loc",
            //    "name": "Overheads FX closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fx_closed_loc",
            //    "name": "Total FX closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fx_opened",
            //    "name": "Total FX opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fx_opened_loc",
            //    "name": "Total FX opened (Pricing Currency)",
            //    "value_type": 20
            //},
            {
                "key": "total_fixed",
                "name": "Total fixed",
                "value_type": 20
            },
            {
                "key": "total_fixed_loc",
                "name": "Total fixed (Pricing Currency)",
                "value_type": 20
            }
            //{
            //    "key": "principal_fixed_closed",
            //    "name": "Principal fixed closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fixed_closed",
            //    "name": "Carry fixed closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fixed_closed",
            //    "name": "Overheads fixed closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fixed_closed",
            //    "name": "Total fixed closed",
            //    "value_type": 20
            //},
            //{
            //    "key": "principal_fixed_closed_loc",
            //    "name": "Principal fixed closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "carry_fixed_closed_loc",
            //    "name": "Carry fixed closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "overheads_fixed_closed_loc",
            //    "name": "Overheads fixed closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fixed_closed_loc",
            //    "name": "Total fixed closed (Pricing Currency)",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fixed_opened",
            //    "name": "Total fixed opened",
            //    "value_type": 20
            //},
            //{
            //    "key": "total_fixed_opened_loc",
            //    "name": "Total fixed opened (Pricing Currency)",
            //    "value_type": 20
            //}


        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}());