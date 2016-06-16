/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var getMenu = function () {
        return window.fetch('portal/content/json/menu.json').then(function (data) {
            return data.json();
        });
    };

    var getBaseAttrs = function () {
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
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            }
        ];
    };

    var getEntityAttrs = function(entity) {
        var entityAttrs =  {
            "portfolio": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "account": [],
            "counterparty": [],
            "responsible": [],
            "instrument": [],
            "currency": [],
            "transaction": [
                {
                    "key": "transaction_class",
                    "name": "Class",
                    "value_type": 10
                },
                {
                    "key": "transaction_currency",
                    "name": "Currency",
                    "value_type": 10
                }
            ]
        };

        return entityAttrs[entity];
    };

    var getValueTypes = function () {
        return [{
            "value": 20,
            "display_name": "Number"
        }, {
            "value": 10,
            "display_name": "String"
        }, {
            "value": 40,
            "display_name": "Date"
        }, {
            "value": 30,
            "display_name": "Classifier"
        }, {
            "value": 'decoration',
            "display_name": "Decoration"
        }
        ];
    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes
    }


}());