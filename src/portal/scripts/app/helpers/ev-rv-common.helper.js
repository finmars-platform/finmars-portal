(function () {

    var stringHelper = require('./stringHelper');

    var _getParent = function (parentId, evDataService, results) {

        var item = evDataService.getData(parentId);

        results.push(item);

        if (item.___parentId !== null) {

            _getParent(item.___parentId, evDataService, results);

        }

        return results;

    };

    var getParents = function (parentId, evDataService) {

        var results = [];

        results = _getParent(parentId, evDataService, results);

        return results;

    };

    var getId = function (item) {

        var pattern;

        if (item.___type === 'group' || item.___type === 'placeholder_group') {

            pattern = [item.___parentId, stringHelper.toHash(item.___group_name + item.___group_identifier)].join('');

        }

        if (item.___type === 'object' || item.___type === 'placeholder_object') {

            pattern = [item.___parentId, stringHelper.toHash(item.id), item.id, item.___index].join('');

        }

        if (item.___type === 'subtotal') {

            if (item.___subtotal_subtype) {
                pattern = [item.___parentId, stringHelper.toHash(item.___type + '_' + item.___subtotal_type + '_' + item.___subtotal_subtype)].join('');

                // console.log('pattern', pattern);

            } else {
                pattern = [item.___parentId, stringHelper.toHash(item.___type + '_' + item.___subtotal_type)].join('');
            }

        }

        if (item.___type === 'blankline') {
            pattern = [item.___parentId, stringHelper.toHash(item.___type + '_' + item.___blankline_type)].join('');
        }

        if (item.___type === 'control') {
            pattern = [item.___parentId, stringHelper.toHash(item.___type)].join('');
        }

        return stringHelper.toHash(pattern)

    };

    module.exports = {
        getId: getId,
        getParents: getParents
    }


}());