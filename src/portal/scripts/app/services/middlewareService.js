/**
 * Created by mevstratov on 08.03.2019
 */
(function () {

    'use strict';

    var data = {
        newEntityViewerLayoutName: false,
        newSplitPanelLayoutName: false,
        warnOnLayoutChangeFn: false,
        masterUserChanged: false
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

    function setWarningOfLayoutChangesLossFn(callbackFn) {
        data.warnOnLayoutChangeFn = callbackFn;
    };

    function getWarningOfLayoutChangesLossFn() {
        var callbackFn = data.warnOnLayoutChangeFn;
        data.warnOnLayoutChangeFn = false;
        return callbackFn;
    };

    function didMasterUserChange () {
        return data.masterUserChanged;
    };

    function masterUserChanged (status) {
        data.masterUserChanged = status;
    };

    function resetData() {
        data = {
            newEntityViewerLayoutName: false,
            newSplitPanelLayoutName: false,
            warnOnLayoutChangeFn: false,
            masterUserChanged: false
        };
    };

    module.exports = {
        setNewEntityViewerLayoutName: setNewEntityViewerLayoutName,
        getNewEntityViewerLayoutName: getNewEntityViewerLayoutName,
        setNewSplitPanelLayoutName: setNewSplitPanelLayoutName,
        getNewSplitPanelLayoutName: getNewSplitPanelLayoutName,

        setWarningOfLayoutChangesLossFn: setWarningOfLayoutChangesLossFn,
        getWarningOfLayoutChangesLossFn: getWarningOfLayoutChangesLossFn,

        didMasterUserChange: didMasterUserChange,
        masterUserChanged: masterUserChanged,

        resetData: resetData
    }

}());