/**
 * Created by mevstratov on 08.03.2019
 */
(function () {

    'use strict';

    var data = {
        newEntityViewerLayoutName: false,
        newSplitPanelLayoutName: false,
        warnOnLayoutChangeFn: false,
        masterUserChangeEvents: [],
        logOutEvents: []
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

    function onMasterUserChanged (callback) {

        if (callback) {
            data.masterUserChangeEvents.push(callback);
        };

    };

    function masterUserChanged () {

        data.masterUserChangeEvents.forEach(function (callback) {
            callback();
        });

    };

    function onLogOut (callback) {

        if (callback) {
            data.logOutEvents.push(callback);
        };

    };

    function initLogOut () {

        data.logOutEvents.forEach(function (callback) {
            callback();
        });

    };

    function clearEvents () {
        data.masterUserChangeEvents = [];
        data.logOutEvents = [];
    }

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

        onMasterUserChanged: onMasterUserChanged,
        masterUserChanged: masterUserChanged,

        onLogOut: onLogOut,
        initLogOut: initLogOut,

        clearEvents: clearEvents,
        resetData: resetData
    }

}());