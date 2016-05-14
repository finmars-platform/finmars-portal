/**
 * Created by sergey on 14.05.16.
 */
(function () {

    'use strict';

    var getTabList = function () {

        var data = [
            {
                id: 1,
                name: 'General',
                attrs: [
                    {
                        name: "Name",
                        notes: "",
                        order: 0,
                        is_hidden: false,
                        short_name: "Name",
                        value_type: 10
                    },
                    {
                        name: "Short name",
                        notes: "",
                        order: 0,
                        is_hidden: false,
                        short_name: "short name",
                        value_type: 10
                    }
                ]
            },
            {
                id: 2,
                name: 'Attributes',
                attrs: [
                    {
                        classifier_root: null,
                        id: 6,
                        is_hidden: false,
                        name: "Account",
                        notes: "",
                        order: 0,
                        short_name: "Account",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/6/",
                        user_code: "T3",
                        value_type: 10
                    },
                    {
                        classifier_root: null,
                        id: 5,
                        is_hidden: false,
                        name: "Country",
                        notes: "",
                        order: 0,
                        short_name: "Country",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/5/",
                        user_code: "T2",
                        value_type: 10
                    },
                    {
                        classifier_root: null,
                        id: 1,
                        is_hidden: false,
                        name: "Industry",
                        notes: "",
                        order: 0,
                        short_name: "Industry",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/1/",
                        user_code: "T1",
                        value_type: 10
                    },
                    {
                        classifier_root: null,
                        id: 7,
                        is_hidden: false,
                        name: "Strategy",
                        notes: "",
                        order: 0,
                        short_name: "Strategy",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/7/",
                        user_code: "T4",
                        value_type: 10
                    }
                ]
            },
            {
                id: 3,
                name: 'Custom',
                attrs: [
                    {
                        name: "Notes",
                        notes: "",
                        order: 0,
                        is_hidden: false,
                        short_name: "notes",
                        value_type: 10
                    },
                    {
                        classifier_root: null,
                        id: 8,
                        is_hidden: false,
                        name: "Influence",
                        notes: "",
                        order: 0,
                        short_name: "Influence",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/8/",
                        user_code: "T4",
                        value_type: 10
                    }
                ]
            },
            {
                id: 4,
                name: 'Any',
                attrs: [
                    {
                        classifier_root: null,
                        id: 9,
                        is_hidden: false,
                        name: "Stagnation",
                        notes: "",
                        order: 0,
                        short_name: "Stagnation",
                        url: "https://dev.finmars.com/api/v1/portfolios/portfolio-attribute-type/9/",
                        user_code: "T4",
                        value_type: 10
                    }
                ]
            }
        ]

        return new Promise(function(resolve, reject){
            resolve(data);
        })

    };

    module.exports = {
        getTabList: getTabList
    }

}());