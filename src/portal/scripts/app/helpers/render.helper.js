/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>';

    var getCheckIcon = function () {
        return checkIcon;
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

    var anyLineGroupsBefore = function (evDataService, level) {

        var lineGroupExist = false;
        var groups = evDataService.getGroups();

        var groupsBefore = groups.filter(function (group) {
            return group.___level < level;
        });

        // console.log('anyLineGroupsBefore.level', level);
        // console.log('anyLineGroupsBefore.groupsBefore', groupsBefore);

        groupsBefore.forEach(function (group) {

            if (group.___subtotal_type === 'line') {
                lineGroupExist = true;
            }

        });

        return lineGroupExist;


    };

    module.exports = {
        getCheckIcon: getCheckIcon,
        anyLineGroupsBefore: anyLineGroupsBefore,
        getAreaGroupsBefore: getAreaGroupsBefore
    }

}());