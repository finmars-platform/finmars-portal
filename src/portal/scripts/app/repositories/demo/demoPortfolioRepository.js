/**
 * Created by sergey on 14.05.16.
 */
(function () {

    'use strict';

    var getTabList = function () {

        var data;

        if(localStorage.getItem('tabs')) {
            data = JSON.parse(localStorage.getItem('tabs'));
        } else {
            data = [
                {
                    id: 1,
                    name: 'General',
                    layout: {
                        columns: 2,
                        rows: 2,
                        fields: [
                            {
                                name: 'Name',
                                row: 1,
                                column: 1,
                                colspan: 1
                            },
                            {
                                name: 'Short name',
                                row: 1,
                                column: 2,
                                colspan: 1
                            },
                            {
                                fieldId: 6,
                                row: 2,
                                column: 1,
                                colspan: 2
                            }
                        ]
                    },
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
                        },
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
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Attributes',
                    layout: {
                        columns: 2,
                        rows: 2,
                        fields: [
                            {
                                fieldId: 5,
                                row: 1,
                                column: 2,
                                colspan: 1
                            },
                            {
                                fieldId: 1,
                                row: 2,
                                column: 1,
                                colspan: 1
                            },
                            {
                                fieldId: 7,
                                row: 2,
                                column: 2,
                                colspan: 1
                            }
                        ]
                    },
                    attrs: [
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
                    layout: {
                        columns: 1,
                        rows: 2,
                        fields: [
                            {
                                name: 'Notes',
                                row: 1,
                                column: 1,
                                colspan: 3
                            },
                            {
                                fieldId: 8,
                                row: 2,
                                column: 1,
                                colspan: 1
                            }
                        ]
                    },
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
                    layout: {
                        columns: 1,
                        rows: 1,
                        fields: [
                            {
                                fieldId: 9,
                                row: 1,
                                column: 1,
                                colspan: 3
                            }
                        ]
                    },
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
            localStorage.setItem('tabs', JSON.stringify(data));
        }

        return new Promise(function (resolve, reject) {
            resolve(data);
        })

    };

    module.exports = {
        getTabList: getTabList
    }

}());