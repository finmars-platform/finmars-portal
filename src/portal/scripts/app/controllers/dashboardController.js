/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.init = function () {

            console.log('layout', layout)

        };

        vm.init();

    }

}());

var layout = {
    "id":1,
    "member":1,
    "data": {
        id: '',
        fixed_area: {

        },
        tabs: [
            {
                "$$hashKey":"object:12751",
                "id":1,
                "layout":{
                    "columns":3,
                    "fields":[
                        {
                            "attribute":{
                                "key":"name",
                                "name":"Name",
                                "value_type":10
                            },
                            "colspan":"1",
                            "column":1,
                            "disabled":false,
                            "editMode":false,
                            "id":null,
                            "key":null,
                            "name":"Name",
                            "options":{
                                "notNull":true
                            },
                            "row":1,
                            "type":"field"
                        },
                        {
                            "attribute":{
                                "key":"type",
                                "name":"Type",
                                "value_type":"field"
                            },
                            "attribute_class":"entityAttr",
                            "colspan":1,
                            "column":1,
                            "disabled":false,
                            "editMode":false,
                            "id":null,
                            "key":null,
                            "name":"Type",
                            "options":null,
                            "row":2,
                            "type":"field"
                        },
                        {
                            "attribute":{
                                "key":"short_name",
                                "name":"Short name",
                                "value_type":10
                            },
                            "attribute_class":"baseAttr",
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "name":"Short name",
                            "row":1,
                            "type":"field"
                        },
                        {
                            "attribute":null,
                            "attribute_class":null,
                            "colspan":1,
                            "column":2,
                            "disabled":false,
                            "editMode":false,
                            "id":null,
                            "key":null,
                            "name":"Country",
                            "options":null,
                            "row":2,
                            "type":"empty"
                        },
                        {
                            "attribute":{
                                "key":"user_code",
                                "name":"User code",
                                "value_type":10
                            },
                            "attribute_class":"entityAttr",
                            "colspan":1,
                            "column":3,
                            "disabled":false,
                            "editMode":false,
                            "id":null,
                            "key":null,
                            "name":"User code",
                            "options":null,
                            "row":1,
                            "type":"field"
                        },
                        {
                            "attribute":{
                                "key":"public_name",
                                "name":"Public name",
                                "value_type":10
                            },
                            "attribute_class":"entityAttr",
                            "colspan":1,
                            "column":3,
                            "disabled":false,
                            "editMode":false,
                            "id":null,
                            "key":null,
                            "name":"Public name",
                            "options":null,
                            "row":2,
                            "type":"field"
                        },
                        {
                            "attribute":{
                                "$$hashKey":"object:23238",
                                "$$mdSelectId":83,
                                "key":"layoutLine",
                                "name":"Line",
                                "value_type":"decoration"
                            },
                            "attribute_class":"decorationAttr",
                            "colspan":"3",
                            "column":1,
                            "editMode":false,
                            "name":"Line",
                            "row":3,
                            "type":"field"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "row":3,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "editMode":false,
                            "row":3,
                            "type":"empty"
                        },
                        {
                            "attribute":{
                                "key":"notes",
                                "name":"Notes",
                                "value_type":10
                            },
                            "attribute_class":"entityAttr",
                            "colspan":"3",
                            "column":1,
                            "editMode":false,
                            "name":"Notes",
                            "row":4,
                            "type":"field"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "row":4,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "editMode":false,
                            "row":4,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":1,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":1,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":1,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "editMode":false,
                            "row":5,
                            "type":"empty"
                        },
                        {
                            "attribute":null,
                            "attribute_class":null,
                            "colspan":1,
                            "column":1,
                            "id":null,
                            "name":"Custodian Country",
                            "row":6,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":2,
                            "row":6,
                            "type":"empty"
                        },
                        {
                            "colspan":1,
                            "column":3,
                            "row":6,
                            "type":"empty"
                        }
                    ],
                    "rows":6
                },
                "name":"General"
            }
        ]
    }
};