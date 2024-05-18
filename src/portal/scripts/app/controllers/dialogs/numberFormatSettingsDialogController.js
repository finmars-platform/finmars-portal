/**
 * Created by vzubr on 01.06.2021.
 */
(function () {

    'use strict';

    const metaHelper = require('../../helpers/meta.helper');
    module.exports = function ($scope, $element, $mdDialog, data) {

        const vm = this;
        vm.readyStatus = false;
        vm.iframeId = metaHelper.generateUniqueId("attributeSelector");

        vm.iframeSrc = `${urlBeginning}/${base_api_url}realm03va3/space027ho/v/external/components/number_format_wrapper?iframeId=${vm.iframeId}`;
        // vm.iframeSrc = `http://localhost:3000/realm03va3/space027ho/v/external/components/number_format_wrapper?iframeId=${vm.iframeId}`; // for development
        let iframeElem;
        let iframeWindow;
        const windowOrigin = window.origin;
        // const windowOrigin = 'http://localhost:3000'; // for development

        const defaultReportSettings = {
            zero_format_id: 0,
            negative_format_id: 0,
            negative_color_format_id: 0,
            round_format_id: 0,
            thousands_separator_format_id: 0,
            percentage_format_id: 0,
            number_multiplier: null,
            number_suffix: '',
            number_prefix: '',
        };

        if (data.settings) {
            const report_settings = JSON.parse(JSON.stringify(data.settings));
            vm.settings = {...defaultReportSettings, ...report_settings}
        } else {
            vm.settings = {...defaultReportSettings};
        }

        function processMessagesFromIframe(event) {
            if (!event.data || event.data.iframeId !== vm.iframeId) {
                return;
            }
            switch (event.data.action) {
                case 'SAVE_DIALOG':
                    vm.settings = { ...event.data.payload.selectedAttributes };
                    $mdDialog.hide({status: 'agree', data: vm.settings});
                    break;
                case 'CANCEL_DIALOG':
                    window.removeEventListener( "message", processMessagesFromIframe );
                    $mdDialog.hide( {status: 'disagree'} );
                    break;
            }
        }

        const initializationSettingsTransmission = () => {
            iframeElem = document.querySelector("#id_" + vm.iframeId);
            iframeWindow = iframeElem.contentWindow;
            adjustIframeHeight()
            iframeWindow.postMessage({ action: 'INITIALIZATION_SETTINGS_TRANSMISSION', payload: {selectedAttributes: vm.settings} }, windowOrigin );
        }

        const adjustIframeHeight = () => {
            iframeElem = document.querySelector("#id_" + vm.iframeId);
            iframeElem.style.height = document.body.scrollHeight * 0.6 + 'px';
        }
        const iframeReadyHandler = (event) => {
            if (event.data &&
              event.data.iframeId === vm.iframeId &&
              event.data.action === 'IFRAME_READY') {
                vm.readyStatus = true;
                $scope.$apply();
                window.addEventListener("message", processMessagesFromIframe);
                initializationSettingsTransmission();
                window.addEventListener('resize', adjustIframeHeight);
                window.removeEventListener("message", iframeReadyHandler);
            }
        }
        window.addEventListener("message", iframeReadyHandler);
    }
}());