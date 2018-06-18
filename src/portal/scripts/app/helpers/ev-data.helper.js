(function () {

    var stringHelper = require('./stringHelper');

    var getGroupNameFromParent = function (id, parentId, evDataService) {

        var parent = evDataService.getData(parentId);

        var result = parent.results.find(function (item) {

            return item.___id === id;

        });

        console.log('result', result);

        return result.group_name

    };

    var getParent = function (parentId, evDataService, results) {

        var item = evDataService.getData(parentId);

        console.log('getParent item', item);

        results.push(item);

        if (item.___parentId !== null) {

            getParent(item.___parentId, evDataService, results);

        } else {

            return results;
        }

    };

    var getParents = function (parentId, evDataService) {

        var results = [];

        results = getParent(parentId, evDataService, results);

        return results;

    };

    var getGroupId = function (group) {

        var pattern = [group.___parentId, stringHelper.toHash(group.group_name)].join('');

        return stringHelper.toHash(pattern)

    };

    var getGroupTypes = function (id, parentId, evDataService) {

        var result = [];

        var groups = evDataService.getGroups();

        var parentsCount = getParents(parentId, evDataService).length;

        var groupsCount = parentsCount + 1; // where 1 is requesting group

        for (var i = 0; i < groupsCount; i = i + 1) {

            if (groups[i].key) {
                result.push(groups[i].key)
            }

            if (groups[i].id) {
                result.push(groups[i].id)
            }
        }

        console.log('group_types', result);

        return result;

    };

    var getGroupValues = function (id, parentId, evDataService) {

        var parents = getParents(parentId, evDataService).reverse();

        var result = [];

        for (var i = 0; i < parents.length; i = i + 1) {

            if (parents.___parentId) {

                result.push(parents[i].group_name)

            }

        }

        var activatedGroupName = getGroupNameFromParent(id, parentId, evDataService);

        result.push(activatedGroupName);

        console.log('group_values', result);

        return result;

    };

    module.exports = {

        getParents: getParents,
        getGroupNameFromParent: getGroupNameFromParent,

        getGroupId: getGroupId,
        getGroupTypes: getGroupTypes,
        getGroupValues: getGroupValues
    }


}());