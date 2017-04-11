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
            //{
            //    "key": "last_notes",
            //    "name": "Last notes",
            //    "value_type": 10
            //},
            //{
            //    "key": "account",
            //    "name": "Account",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument",
            //    "name": "Instrument",
            //    "value_type": "field"
            //},
            //{
            //    "key": "currency",
            //    "name": "Currency",
            //    "value_type": "field"
            //},
            //{
            //    "key": "portfolio",
            //    "name": "Portfolio",
            //    "value_type": "field"
            //},
            //{
            //    "key": "strategy-1",
            //    "name": "Strategy 1",
            //    "value_type": "field"
            //},
            //{
            //    "key": "strategy-2",
            //    "name": "Strategy 2",
            //    "value_type": "field"
            //},
            //{
            //    "key": "strategy-3",
            //    "name": "Strategy 3",
            //    "value_type": "field"
            //},
            {
                "key": "item_type_name",
                "name": "Item Type",
                "value_type": 10
            },
            {
                "key": "position_size",
                "name": "Position size",
                "value_type": "float"
            },
            {
                "key": "pricing_currency",
                "name": "Pricing Currency",
                "value_type": "field"
            },
            //{
            //    "key": "instrument_principal",
            //    "name": "Current Price",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_accrued",
            //    "name": "Current Accrued",
            //    "value_type": "float"
            //},
            {
                "key": "instrument_pricing_currency_fx_rate",
                "name": "Pricing currency fx rate",
                "value_type": "float"
            },
            {
                "key": "instrument_accrued_currency_fx_rate",
                "name": "Accrued currency FX rate",
                "value_type": "float"
            },

            {
                "key": "instrument_accrual_object_accrual_size",
                "name": "Current Payment Size",
                "value_type": "float"
            },
            {
                "key": "instrument_accrual_object_periodicity_object_name",
                "name": "Current Payment Frequency",
                "value_type": "float"
            },
            {
                "key": "instrument_accrual_object_periodicity_n",
                "name": "Current Payment Periodicity N",
                "value_type": "float"
            },


            //{
            //    "key": "report_currency_fx_rate",
            //    "name": "Report currency fx rate",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_price_history_principal_price",
            //    "name": "Instrument price history principal price",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_price_history_accrued_price",
            //    "name": "Instrument price history accrued price",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_pricing_currency_fx_rate",
            //    "name": "Instrument pricing currency fx rate",
            //    "value_type": "float"
            //},
            //{
            //    "key": "instrument_accrued_currency_fx_rate",
            //    "name": "Instrument accrued currency fx rate",
            //    "value_type": "float"
            //},
            //{
            //    "key": "currency_fx_rate",
            //    "name": "Currency fx rate",
            //    "value_type": "float"
            //},


            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            },
            {
                "key": "ytm",
                "name": "YTM",
                "value_type": "float"
            },
            {
                "key": "modified_duration",
                "name": "Modified duration",
                "value_type": "float"
            },

            {
                "key": "last_notes",
                "name": "Last notes",
                "value_type": 10
            },
            //{
            //    "key": "gross_cost_price",
            //    "name": "Gross cost price",
            //    "value_type": "float"
            //},
            {
                "key": "gross_cost_price_loc",
                "name": "Gross cost price (LOC)",
                "value_type": "float"
            },
            {
                "key": "ytm_at_cost",
                "name": "YTM at cost",
                "value_type": "float"
            },
            {
                "key": "time_invested",
                "name": "Time invested",
                "value_type": "float"
            },
            //{
            //    "key": "net_cost_price",
            //    "name": "Net cost price",
            //    "value_type": "float"
            //},
            {
                "key": "net_cost_price_loc",
                "name": "Net cost price (LOC)",
                "value_type": "float"
            },
            {
                "key": "currency",
                "name": "Currency",
                "value_type": "field"
            },
            //{
            //    "key": "report_currency_history",
            //    "name": "Report currency history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument_price_history",
            //    "name": "Instrument price history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument_pricing_currency_history",
            //    "name": "Instrument pricing currency history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument_accrued_currency_history",
            //    "name": "Instrument accrued currency history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "currency_history",
            //    "name": "Currency history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "pricing_currency_history",
            //    "name": "Pricing currency history",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument_accrual",
            //    "name": "Instrument accrual",
            //    "value_type": "field"
            //},
            //{
            //    "key": "instrument_accrual_accrued_price",
            //    "name": "Instrument accrual accrued price",
            //    "value_type": "field"
            //},

            {
                "key": "principal_invested",
                "name": "Principal invested",
                "value_type": "float"
            },
            {
                "key": "principal_invested_loc",
                "name": "Principal invested (LOC)",
                "value_type": "float"
            },
            {
                "key": "amount_invested",
                "name": "Amount invested",
                "value_type": "float"
            },
            {
                "key": "amount_invested_loc",
                "name": "Amount invested (LOC)",
                "value_type": "float"
            },

            {
                "key": "market_value",
                "name": "Market value",
                "value_type": "float"
            },
            {
                "key": "market_value_loc",
                "name": "Market value (LOC)",
                "value_type": "float"
            },
            {
                "key": "market_value_percent",
                "name": "Market value %",
                "value_type": "float"
            },
            {
                "key": "exposure",
                "name": "Exposure",
                "value_type": "float"
            },
            {
                "key": "exposure_percent",
                "name": "Exposure %",
                "value_type": "float"
            },
            {
                "key": "exposure_loc",
                "name": "Exposure (LOC)",
                "value_type": "float"
            },
            {
                "key": "instrument_principal_price",
                "name": "Current Price",
                "value_type": "float"
            },
            {
                "key": "instrument_accrued_price",
                "name": "Current Accrued",
                "value_type": "float"
            },
            {
                "key": "pricing_currency_fx_rate",
                "name": "Pricing Ccy FX rate",
                "value_type": "float"
            },
            {
                "key": "instrument_accrued_currency_fx_rate",
                "name": "Accrued currency FX rate",
                "value_type": "float"
            }
            //{
            //    "key": "allocation_balance",
            //    "name": "Allocation Balance",
            //    "value_type": "field"
            //}
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())