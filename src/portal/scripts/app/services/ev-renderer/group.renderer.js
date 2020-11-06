(function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getIconByKey('checkIcon');

    var render = function (group, groupTypes) {

        var groupType = groupTypes[group.___level - 1];

        var foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">+</div></div>';


        if (group.___is_open) {
            foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">-</div></div>';
        }

        var classList = ['g-group-holder', 'g-row'];
        classList.push('level-' + group.___level);

        var rowSelection;

        if (group.___is_activated) {
            classList.push('selected');
            rowSelection = '<div class="g-row-selection">' + checkIcon + '</div>';
        } else {
            rowSelection = '<div class="g-row-selection"></div>';
        }

        var classes = classList.join(' ');

        var additionalText = '';

        if(groupType.value_type === 'field') {
            additionalText = additionalText + ' (' + group.___group_identifier + ')'
        }

        return '<div class="' + classes + '" data-type="group" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' +
            rowSelection + foldButton + group.___group_name + additionalText +'</div>'

    };

    module.exports = {
        render: render
    }


}());