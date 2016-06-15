/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    /*
     sort: {
     column: "name",
     direction: "DESC"
     }
     */

    var groupSort = function (items, sort) {

        var i, g, valA, valB;
        if (items[0].groups) {
            //console.log('sort ID', sort);
            items = items.sort(function (a, b) {
                for (i = 0; i < b.groups.length; i = i + 1) {
                    for (g = 0; g < a.groups.length; g = g + 1) {
                        if (b.groups[i].key === sort.key || b.groups[i].key === sort.name
                            && a.groups[g].key === sort.key || a.groups[g].key === sort.name) {
                            valA = a.groups[g].value.toLowerCase();
                            valB = b.groups[i].value.toLowerCase();
                            if (sort.sort === 'DESC') {
                                if (valA < valB) {
                                    return -1;
                                }
                                if (valA > valB) {
                                    return 1;
                                }

                                // names must be equal
                                return 0;
                            }

                            if (sort.sort === 'ASC') {
                                if (valA > valB) {
                                    return -1;
                                }
                                if (valA < valB) {
                                    return 1;
                                }

                                // names must be equal
                                return 0;
                            }
                        }
                    }
                }
            });
        }

        //console.log("SORTED GROUPS", items);
        return items;

    };

    /*
     sort: {
     column: "name",
     direction: "DESC"
     }

     */

    function sortBasedOnId(items, sort) {
        return items.sort(function (a, b) {
            var nameA = a[sort.name].toLowerCase();
            var nameB = b[sort.name].toLowerCase();

            if (sort.sort === 'DESC') {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }

            if (sort.sort === 'ASC') {
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
                return 0;
            }
        })

    }

    function sortBaseOnKey(items, sort) {
        return items.sort(function (a, b) {
            var nameA;
            var nameB;
            if (typeof a === 'number') {
                nameA = a[sort.key];
                nameB = b[sort.key];
            }
            if (typeof a === 'string') {
                nameA = a[sort.key].toLowerCase();
                nameB = b[sort.key].toLowerCase();
            }


            if (sort.sort === 'DESC') {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            }

            if (sort.sort === 'ASC') {
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            }


        })
    }


    var columnAdditionsSort = function (items, sort) {
        var g;
        if (sort.id) {
            //console.log('sort ID', sort);
            items = sortBasedOnId(items, sort)
        }
        if (sort.key) {
            items = sortBaseOnKey(items, sort)
        }
        //console.log('items', items);
        //console.log('sort', sort);

        return items;
    };

    var columnSort = function (items, sort) {
        //console.log('items', items);
        var g;
        if (items[0].groups) {
            if (sort.id) {
                //console.log('sort ID', sort);
                for (g = 0; g < items.length; g = g + 1) {
                    items[g].items = sortBasedOnId(items[g].items, sort)
                }
            }
            if (sort.key) {

                for (g = 0; g < items.length; g = g + 1) {
                    items[g].items = sortBaseOnKey(items[g].items, sort)
                }
            }
        } else {
            if (sort.id) {
                //console.log('sort ID', sort);
                items = sortBasedOnId(items, sort)
            }
            if (sort.key) {
                items = sortBaseOnKey(items, sort)
            }
        }

        //console.log('items', items);
        //console.log('sort', sort);

        return items;
    };

    module.exports = {
        group: {
            sort: groupSort
        },
        column: {
            additions: {
                sort: columnAdditionsSort
            },
            sort: columnSort
        }
    }

}());