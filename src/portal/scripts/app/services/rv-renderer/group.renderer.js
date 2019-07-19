    (function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var render = function (group) {

        var foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button">+</div></div>';


        if (group.___is_open) {
            foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button">-</div></div>';
        }

        var classList = ['g-group-holder'];
        classList.push('level-' + group.___level);

        var rowSelection;

        if (group.___is_activated) {
            classList.push('selected');
            rowSelection = '<div class="g-row-selection">' + checkIcon + '</div>';
        } else {
            rowSelection = '<div class="g-row-selection"></div>';
        }

        if (group.___is_activated) {
            classList.push('activated');
        }

        var classes = classList.join(' ');


        return '<div class="' + classes + '" data-type="group" data-group-hash-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' +
            rowSelection + foldButton + group.___group_name + '</div>'

    };

    module.exports = {
        render: render
    }


}());