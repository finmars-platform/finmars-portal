/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            //{
            //    "key": "name",
            //    "name": "Name",
            //    "value_type": 10
            //},
            //{
            //    "key": "short_name",
            //    "name": "Short name",
            //    "value_type": 10
            //},
            //{
            //    "key": "user_code",
            //    "name": "User code",
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
                "key": "return_pl",
                "name": "Return (P&L), %",
                "value_type": "float"
            },
            {
                "key": "return_nav",
                "name": "Return (NAV chng ex CF), %",
                "value_type": "float"
            },
            {
                "key": "pl_in_period",
                "name": "P&L in Period",
                "value_type": "float"
            },
            {
                "key": "nav_change",
                "name": "NAV change ex Cash Flows",
                "value_type": "float"
            },
            {
                "key": "nav_period_end",
                "name": "NAV - period start",
                "value_type": "float"
            },
            {
                "key": "nav_period_start",
                "name": "NAV - period end",
                "value_type": "float"
            },
            {
                "key": "cash_inflows",
                "name": "Cash Inflows",
                "value_type": "float"
            },
            {
                "key": "cash_outflows",
                "name": "Cash Outflows",
                "value_type": "float"
            },
            {
                "key": "time_weighted_cash_inflows",
                "name": "Time-Weighted Cash Inflows",
                "value_type": "float"
            },
            {
                "key": "time_weighted_cash_outflows",
                "name": "Time-Weighted Cash Outflows",
                "value_type": "float"
            },
            {
                "key": "avg_nav_in_period",
                "name": "Average NAV in Period",
                "value_type": "float"
            },
            {
                "key": "cumulative_return_pl",
                "name": "Cummulative Return (P&L), %",
                "value_type": "float"
            },
            {
                "key": "cumulative_return_nav",
                "name": "Cummulative Return (NAV chng ex CF), %",
                "value_type": "float"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())