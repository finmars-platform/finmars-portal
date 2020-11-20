(function () {

    var renderHelper = require('../../helpers/render.helper');
	var stringHelper = require('../../helpers/stringHelper');

	var checkIcon = renderHelper.getIconByKey('checkIcon');

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

        var groupName = group.___group_name;

        if (group.___group_name && typeof group.___group_name === 'string') {

        	groupName = stringHelper.parseAndInsertHyperlinks(groupName, "class='openLinkInNewTab'");

		}

		// to change group row content, subtotal.render.js also needs changes
        return '<div class="' + classes + '" data-type="group" data-group-hash-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' +
            	rowSelection + foldButton + groupName
				+ '</div>'

    };

    module.exports = {
        render: render
    }


}());