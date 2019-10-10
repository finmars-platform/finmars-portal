/**
 * Created by mevstratov on 08.10.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        console.log("attribute selector tableAttributeSelect", data);

        vm.title = "Attribute selector";

        if (data.title) {
            vm.title = data.title;
        };

        vm.activeGroup = [];
        vm.currentLocation = '-';

        var previousGroup = [];
        var openedGroupNames = [];
        var tableAttributes = data.availableAttrs;
        var tableAttrsTree = {
            groupName: '-',
            items: []
        };

        var divideTableAttrsInGroups = function () {

            var a,b;
            for (a = 0; a < tableAttributes.length; a++) {

                var tAttr = JSON.parse(JSON.stringify(tableAttributes[a]));
                var attrPathKeys = tAttr.name.split(". ");
                var attrName = attrPathKeys.pop();
                var attrObjPath = tableAttrsTree.items;

                attrPathKeys.forEach(function (attrPathKey) {

                    var groupExist = false;

                    if (attrObjPath.length > 0) { // if group exist find it

                        for (b = 0; b < attrObjPath.length; b++) {

                            var tAttrGroupName = attrObjPath[b].groupName;

                            if (tAttrGroupName === attrPathKey) {
                                attrObjPath = attrObjPath[b].items;
                                groupExist = true;
                                break;
                            };
                        };

                    };

                    if (!groupExist) { // if there is no such group, create one

                        var newAttrGroup = {
                            groupName: attrPathKey,
                            items: []
                        };

                        attrObjPath.push(newAttrGroup);
                        attrObjPath = attrObjPath[attrObjPath.length - 1].items;

                    };

                });

                var tAttrData = {
                    attributeObject: tAttr,
                    attrName: attrName
                };

                attrObjPath.push(tAttrData);

            };

        };

        var getCurrentLocation = function () {
            var currentLocationPath = '-';

            if (openedGroupNames.length > 0) {

                openedGroupNames.forEach(function (gName) {

                    if (currentLocationPath === '-') {
                        currentLocationPath = gName;
                    } else {
                        currentLocationPath = currentLocationPath + ' > ' + gName;
                    }

                });

            }

            vm.currentLocation = currentLocationPath;
        };

        vm.returnToPrevGroup = function () {
            openedGroupNames.splice(-1, 1);
            vm.activeGroup = previousGroup.pop();

            getCurrentLocation();
        };

        vm.openGroupOrSelectAttr = function (item) {

            if (item.hasOwnProperty('groupName')) {

                var groupData = JSON.parse(JSON.stringify(vm.activeGroup));
                previousGroup.push(groupData);
                vm.activeGroup = item;

                openedGroupNames.push(item.groupName);
                getCurrentLocation();

            } else if (item.hasOwnProperty('attrName')) {

                vm.save(item.attributeObject);

            }
        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.save = function (attr) {
            $mdDialog.hide({status: 'agree', data: attr});
        };

        var init = function () {
            divideTableAttrsInGroups();

            vm.activeGroup = JSON.parse(JSON.stringify(tableAttrsTree));
        };

        init();

    }

}());