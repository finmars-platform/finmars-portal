/**
 * Created by mevstratov on 11.09.2019.
 */
(function () {

    'use strict';

    module.exports = function () {

        var data = {
            checkForSplitPanelLayoutChangesFn: null
        };

        function setSplitPanelLayoutChangesCheckFn(callbackFn) {
            data.checkForSplitPanelLayoutChangesFn = callbackFn;
        }

        function getSplitPanelChangedLayout() {
            if (!data.checkForSplitPanelLayoutChangesFn) {
                return null;
            }

            return data.checkForSplitPanelLayoutChangesFn();
        }

        return {
            setSplitPanelLayoutChangesCheckFn: setSplitPanelLayoutChangesCheckFn,
            getSplitPanelChangedLayout: getSplitPanelChangedLayout
        };
    };

}());