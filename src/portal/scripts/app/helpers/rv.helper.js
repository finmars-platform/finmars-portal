(function () {

    var noLineGroups = function (evDataService) {

        var groups = evDataService.getGroups();

        var result = true;

        groups.forEach(function (group) {

            if (group.report_settings.subtotal_type === 'line') {
                result = false;
            }

        });

        return result

    };

    var isFirst = function (evDataService, obj) {

        var flatList = evDataService.getFlatList();

        var isFirst = true;

        var len = flatList.length;

        for (var i = 0; i < len; i = i + 1) {

            if (i >= obj.___flat_list_index) {
                break;
            }

            if (flatList[i].___level === obj.___level && flatList[i].___parentId === obj.___parentId) {
                isFirst = false;
            }

        }

        return isFirst;

    };

    var getAreaGroupsBefore = function (evDataService, level) {

        var groups = evDataService.getGroups();

        // console.log('getAreaGroupsBefore.groups', groups);

        var groupsBefore = groups.filter(function (group, index) {
            return index + 1 < level;
        });

        var areaGroupsBefore = [];
        var i;

        // console.log('getAreaGroupsBefore.groupsBefore', groupsBefore);

        for (i = groupsBefore.length - 1; i >= 0; i = i - 1) {

            if (groupsBefore[i].report_settings.subtotal_type === 'line') {
                break;
            }

            if (groupsBefore[i].report_settings.subtotal_type === 'area') {
                areaGroupsBefore.push(i + 1)
            }

        }

        return areaGroupsBefore;

    };


    module.exports = {
        isFirst: isFirst,
        noLineGroups: noLineGroups,
        getAreaGroupsBefore: getAreaGroupsBefore
    }


}());