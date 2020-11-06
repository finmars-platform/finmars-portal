(function () {

    'use strict';

    module.exports = function () {

        function calculateContentWrapHeight(rootWrapElem, contentWrapElement, evDataService) {

            var splitPanelIsActive = evDataService.isSplitPanelActive();

            if (splitPanelIsActive) {

                var interfaceLayout = evDataService.getInterfaceLayout();
                //var contentWrapElementHeight = document.body.clientHeight - interfaceLayout.headerToolbar.height - interfaceLayout.splitPanel.height;
                var rootWrapElemHeight = rootWrapElem.clientHeight;
                var contentWrapElementHeight = rootWrapElemHeight - interfaceLayout.splitPanel.height;

                contentWrapElement.style.height = contentWrapElementHeight + "px";

            } else {
                contentWrapElement.style.height = "";
            }

        }

        function calculateContentWrapWidth(rootWrapElem, contentWrapElement, evDataService) {

            var vSplitPanelIsActive = evDataService.isVerticalSplitPanelActive();

            if (vSplitPanelIsActive) {

                var interfaceLayout = evDataService.getInterfaceLayout();
                var rootWrapElemWidth = rootWrapElem.clientWidth;
                var contentWrapElementWidth = rootWrapElemWidth - interfaceLayout.verticalSplitPanel.width - 1;

                contentWrapElement.style.width = contentWrapElementWidth + "px"

            } else {
                contentWrapElement.style.width = ""
            }

        }

        function calculateWorkareaWrapWidth (contentWrapElement, workareaWrapElement, evDataService) {

            var components = evDataService.getComponents();
            var contentWrapWidth = contentWrapElement.clientWidth;

            if (components.sidebar) {

                var interfaceLayout = evDataService.getInterfaceLayout();
                workareaWrapElement.style.width = (contentWrapWidth - interfaceLayout.filterArea.width) + 'px'

            } else {
                workareaWrapElement.style.width = contentWrapWidth + 'px'
            }

        }

        return {
            calculateContentWrapHeight: calculateContentWrapHeight,
            calculateContentWrapWidth: calculateContentWrapWidth,

            calculateWorkareaWrapWidth: calculateWorkareaWrapWidth
        };

    }

}());