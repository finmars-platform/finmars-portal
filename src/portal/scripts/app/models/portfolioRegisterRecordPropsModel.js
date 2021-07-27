/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "portfolio",
                "name": "Portfolio",
                "value_content_type": "portfolios.portfolio",
                "value_entity": "portfolio",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "instrument",
                "name": "Instrument",
                "value_content_type": "instruments.instrument",
                "value_entity": "instrument",
                "code": "user_code",
                "value_type": "field"
            }

        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}());