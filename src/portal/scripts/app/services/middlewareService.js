/**
 * Created by mevstratov on 08.03.2019
 */
(function () {

    'use strict';

    var data = {
        newEntityViewerLayoutName: false,
        newSplitPanelLayoutName: false,
        warnOnLayoutChangeFn: false
    };

    function setNewEntityViewerLayoutName(layoutName) {
        data.newEntityViewerLayoutName = layoutName;
    };

    function getNewEntityViewerLayoutName() {

        var newLayout = data.newEntityViewerLayoutName;
        data.newEntityViewerLayoutName = false;

        return newLayout;

    };

    function setNewSplitPanelLayoutName(layoutName) {
        data.newSplitPanelLayoutName = layoutName;
    };

    function getNewSplitPanelLayoutName() {
        return data.newSplitPanelLayoutName;
    };

    function setWarningOnLayoutChangeFn(callbackFn) {
        data.warnOnLayoutChangeFn = callbackFn;
    };

    function getWarningOnLayoutChangeFn() {
        var callbackFn = data.warnOnLayoutChangeFn;
        data.warnOnLayoutChangeFn = false;
        return callbackFn;
    };

    function resetData() {
        data = {
            entityViewerLayouts: {
                newLayoutName: false,
                newSplitPanelLayoutName: false,
                checkForLayoutChangesFn: false
            }
        };
    };

    module.exports = {
        setNewEntityViewerLayoutName: setNewEntityViewerLayoutName,
        getNewEntityViewerLayoutName: getNewEntityViewerLayoutName,
        setNewSplitPanelLayoutName: setNewSplitPanelLayoutName,
        getNewSplitPanelLayoutName: getNewSplitPanelLayoutName,

        setWarningOnLayoutChangeFn: setWarningOnLayoutChangeFn,
        getWarningOnLayoutChangeFn: getWarningOnLayoutChangeFn,

        resetData: resetData
    }

}());