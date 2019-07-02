(function () {

    function getRandomNumber(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    var render = function (obj, columns) {

        var rowSelection;

        rowSelection = '<div class="g-row-selection"></div>';

        var result = '<div class="placeholder-row">';
        var cell;

        result = result + rowSelection;

        var width = [30, 40, 60, 80, 100];

        columns.forEach(function (column) {

            var index = getRandomNumber(0, 4);

            var widthClass = 'width-' + width[index];

            cell = '<div class="g-cell-wrap" style="width: ' + column.style.width + '"><div class="g-cell"><div class="g-cell-content-wrap"><span class="placeholder-text ' + widthClass + '"></span></div></div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());