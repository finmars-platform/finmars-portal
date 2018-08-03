(function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var render = function (group) {

        var foldButton = '<div class="ev-fold-button">+</div>';


        if (group.___is_open) {
            foldButton = '<div class="ev-fold-button">-</div>';
        }

        var classList = ['g-group-holder'];
        classList.push('level-' + group.___level);

        var rowSelection;

        if (group.___is_selected) {
            classList.push('selected');
            rowSelection = '<div class="g-row-selection">' + checkIcon + '</div>';
        } else {
            rowSelection = '<div class="g-row-selection"></div>';
        }

        var classes = classList.join(' ');


        return '<div class="' + classes + '" data-type="group" data-group-hash-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' +
            rowSelection + foldButton + group.group_name + '</div>'

    };

    module.exports = {
        render: render
    }


}());