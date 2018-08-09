(function () {

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    var sortItems = function (items, options) {

        console.log('sortItems.options', options);

        if (options.hasOwnProperty('ordering')) {

            // var ordering_parts = options.ordering.split('-');
            // var ordering_direction;
            // var ordering_field;
            //
            // if (ordering_parts.length === 2) {
            //     ordering_direction = 'DESC';
            //     ordering_field = ordering_parts[1];
            // } else {
            //     ordering_direction = 'ASC';
            //     ordering_field = ordering_parts[0];
            // }
            //
            // console.log('sortItems.ordering_direction', ordering_direction);
            // console.log('sortItems.ordering_field', ordering_field);

            items = items.sort(dynamicSort(options.ordering))


        }

        return items;

    };

    module.exports = {
        sortItems: sortItems

    }

}());
