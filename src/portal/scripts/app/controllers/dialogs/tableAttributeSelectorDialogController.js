/**
 * Created by mevstratov on 08.10.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.title = "Attribute selector";

        if (data.title) {
            vm.title = data.title;
        };

        vm.activeGroup = [];
        vm.currentLocation = '-';

        vm.searchTerms = '';

        var previousGroup = [];
        var openedGroupNames = [];
        var tableAttributes = data.availableAttrs;
        var tableAttrsTree = {
            name: '-',
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

                            var tAttrGroupName = attrObjPath[b].name;

                            if (tAttrGroupName === attrPathKey) {
                                attrObjPath = attrObjPath[b].items;
                                groupExist = true;
                                break;
                            };
                        };

                    };

                    if (!groupExist) { // if there is no such group, create one

                        var newAttrGroup = {
                            name: attrPathKey,
                            isGroup: true,
                            order: 0,
                            items: []
                        };

                        attrObjPath.push(newAttrGroup);
                        attrObjPath = attrObjPath[attrObjPath.length - 1].items;

                    };

                });

                var tAttrData = {
                    attributeObject: tAttr,
                    isGroup: false,
                    order: 1,
                    name: attrName
                };

                attrObjPath.push(tAttrData);

            };

            console.log("selector tableAttrsTree", tableAttrsTree);

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
            if (previousGroup.length > 0) {
                openedGroupNames.splice(-1, 1);
                vm.activeGroup = previousGroup.pop();

                getCurrentLocation();
            }
        };

        vm.openGroupOrSelectAttr = function (item) {

            vm.searchTerms = '';

            if (item.isGroup) {

                var groupData = JSON.parse(JSON.stringify(vm.activeGroup));
                previousGroup.push(groupData);
                vm.activeGroup = item;

                openedGroupNames.push(item.name);
                getCurrentLocation();

            } else {
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