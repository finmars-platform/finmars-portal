(function () {

    var render = function (group) {

        return '<div class="g-group-holder level-' + group.___level + '" data-type="group" data-group-hash-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">' + group.group_name + '</div>'

    };

    module.exports = {
        render: render
    }


}());