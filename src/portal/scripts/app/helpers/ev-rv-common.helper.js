(function () {

    var stringHelper = require('./stringHelper');

    var getId = function (item) {

        var pattern;

        if (item.___type === 'group' || item.___type === 'placeholder_group') {

            pattern = [item.___parentId, stringHelper.toHash(item.group_name)].join('');

        }

        if (item.___type === 'object' || item.___type === 'placeholder_object') {

            pattern = [item.___parentId, stringHelper.toHash(item.id)].join('');

        }

        if (item.___type === 'subtotal') {
            pattern = [item.___parentId, stringHelper.toHash('subtotal')].join('');
        }

        return stringHelper.toHash(pattern)

    };

    module.exports = {
        getId: getId
    }


}());