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
                                name: 'Notes',
                                row: 1,
                                column: 2,
                                colspan: 3
                            },
                            {
                                id: 6,
                                row: 2,
                                column: 3,
                                colspan: 2
                            }
                        ]
                    }
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
                    }
                },
                {
                    id: 3,
                    name: 'Custom',
                    layout: {
                        columns: 1,
                        rows: 1,
                        fields: [
                            {
                                name: 'Short name',
                                row: 1,
                                column: 1,
                                colspan: 1
                            }
                        ]
                    }
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