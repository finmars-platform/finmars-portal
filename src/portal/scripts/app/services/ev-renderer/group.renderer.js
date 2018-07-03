(function () {

    var render = function (group) {

        var foldButton = '<div class="ev-fold-button">+</div>';


        if(group.is_open) {
            foldButton = '<div class="ev-fold-button">-</div>';
        }


        return '<div class="g-group-holder level-' + group.___level + '" data-type="group" data-group-hash-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' +
            foldButton + group.group_name + '</div>'

    };

    module.exports = {
        render: render
    }


}());