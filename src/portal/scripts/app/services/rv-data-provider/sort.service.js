(function () {

    function orderSort(property, sortOrder) {

        return function (a, b) {

            if (a[property] === null || a[property] === undefined) {
                return 1 * sortOrder;
            }
            if (b[property] === null || b[property] === undefined) {
                return -1 * sortOrder;
            }

            if (a[property] < b[property]) {
                return -1 * sortOrder
            }

            if (a[property] > b[property]) {
                return 1 * sortOrder
            }

        }

    }

    var sortItems = function (items, property) {

        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return items.sort(orderSort(property, sortOrder))

    };


    var sortItemsManual = function (items, property, columnSortData) {

        var result = []
        var missedItems = [];

        var orderedItems = {}

        var key;

        if (property[0] === '-') {
            key = property.split('-')[1];
        } else {
            key =  property;
        }

        var item_value;
        var manual_sort_value;
        var manual_sort_order;
        var matched;

        for (var i = 0; i < items.length; i= i + 1) {

            item_value = items[i][key]

            matched = false

            for (var x = 0; x < columnSortData.items.length; x = x + 1) {

                manual_sort_value = columnSortData.items[x].value
                manual_sort_order = columnSortData.items[x].order

                if (item_value === manual_sort_value) {

                    matched = true;
                    orderedItems[manual_sort_order] = items[i]

                }

                if (matched === false) {
                    missedItems.push(items[i])
                }


            }

        }

        Object.keys(orderedItems).forEach(function (orderKey){
            result.push(orderedItems[orderKey])
        })

        result.concat(missedItems);

        return result

    };


    module.exports = {
        sortItems: sortItems,
        sortItemsManual: sortItemsManual

    }

}());
