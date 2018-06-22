(function () {

    var getValue = function (obj, column) {

        if (obj[column.key]) {

            if (typeof obj[column.key] === 'string') {
                return obj[column.key]
            }

            if (typeof obj[column.key] === 'number') {
                return obj[column.key]
            }

        }

        if (column.id) {

            var result = '';

            obj.attributes.forEach(function (item) {

                if (item.attribute_type === column.id) {

                    if (column.value_type === 20) {

                        result = item.value_float;

                    }

                    if (column.value_type === 10) {

                        result = item.value_string;

                    }

                    if (column.value_type === 40) {

                        result = item.value_date;

                    }
                }

            });

            return result;

        }

        return '';

    };

    var render = function (obj, columns) {

        var result = '<div class="g-row">';
        var cell;

        result = result + '<div class="g-row-selection"></div>';

        columns.forEach(function (column) {

            cell = '<div class="g-cell-wrap"><div class="g-cell">' + getValue(obj, column) + '</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());