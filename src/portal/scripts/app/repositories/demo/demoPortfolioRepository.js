/**
 * Created by sergey on 14.05.16.
 */
(function () {

    'use strict';

    var getTabList = function () {

        var data;

        if (localStorage.getItem('tabs')) {
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
                                id: 6,
                                row: 2,
                                column: 1,
                                colspan: 2
                            }
                        ]
                    },
                    attrs: [
                        {
                            name: "Name",
                            key: "name",
                            value_type: 10
                        },
                        {
                            name: "Short name",
                            key: "short_name",
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
                        rows: 1,
                        fields: [
                            {
                                id: 1,
                                row: 1,
                                column: 1,
                                colspan: 1
                            },
                            {
                                id: 7,
                                row: 1,
                                column: 2,
                                colspan: 1
                            }
                        ]
                    },
                    attrs: [
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
                        rows: 1,
                        fields: [
                            {
                                name: 'Notes',
                                row: 1,
                                column: 1,
                                colspan: 3
                            }
                        ]
                    },
                    attrs: [
                        {
                            name: "Notes",
                            key: "notes",
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
                                id: 9,
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
            ];
            localStorage.setItem('tabs', JSON.stringify(data));
        }

        return new Promise(function (resolve, reject) {
            resolve(data);
        })

    };

    var save = function (tabs) {
        return new Promise(function (resolve, reject) {
            localStorage.setItem('tabs', JSON.stringify(tabs));
            resolve(undefined);
        })

    };

    module.exports = {
        getTabList: getTabList,
        save: save
    }

}());