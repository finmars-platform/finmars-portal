/**
 * Created by szhitenev on 03.02.2024.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "user_code",
                "name": "User code",
                "value_type": 10
            },
            {
                "key": "error_message",
                "name": "Error Message",
                "value_type": 10
            },
            {
                "key": "verbose_result",
                "name": "Verbose Result",
                "value_type": 10
            },
            {
                "key": "status",
                "name": "Status",
                "value_type": 10
            },
            {
                "key": "portfolio_reconcile_group",
                "name": "Portfolio Reconcile Group",
                "value_content_type": "portfolios.portfolioreconcilegroup",
                "value_entity": "portfolio-reconcile-group",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}());