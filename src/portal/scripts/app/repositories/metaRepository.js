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
        return window.fetch('portal/content/json/general-attrs.json').then(function (data) {
            return data.json();
        });
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
        getValueTypes: getValueTypes
    }


}());