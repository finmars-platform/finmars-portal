import baseUrlService from "../../../../../shell/scripts/app/services/baseUrlService";

const metaHelper = require('../../helpers/meta.helper');

export default function ($scope, $mdDialog, toastNotificationService, usersService, globalDataService, data) {

    const vm = this;

    vm.iframeId = metaHelper.generateUniqueId("attributeSelector");

    const urlBeginning = baseUrlService.resolve();
    const base_api_url = baseUrlService.getMasterUserPrefix();

    vm.iframeSrc = `${urlBeginning}/${base_api_url}/v/external/components/modal_add_columns?iframeId=${vm.iframeId}`;

    const windowOrigin = window.origin;
    let iframeElem;
    let iframeWindow; // iframeElem.contentWindow;

    const initSettings = {
        attributes: data.attributes || [],
        selectedAttributes: data.selectedAttributes || [],
        favoriteAttributes: data.favoriteAttributes || [],
    };

    const saveFavAttrs = function (favAttrsData) {

        if ( !Array.isArray(favAttrsData) ) {
            const errorData = new Error(`Expected array. Got an '${typeof favAttrsData}'.`);
            errorData.___recievedParameter = favAttrsData;
            throw errorData;
        }

        const member = globalDataService.getMember();
        member.data.favorites.attributes = favAttrsData;

        usersService.updateMember(member.id, member).then(() => {
            toastNotificationService.success('Favorite attributes updated.')
        });

    }

    const saveDialog = function (payload) {

        const alreadySelAttrKey = payload.selectedAttributes.find(attrKey => {
            return initSettings.selectedAttributes.find( selAttr => selAttr.key === attrKey )
        });

        if (alreadySelAttrKey) {
            throw new Error(`Attribute '${alreadySelAttrKey}' already selected.`);
        }

        let resItems = [];

        payload.selectedAttributes.forEach(attrKey => {

            const attrData = initSettings.attributes.find( attr => attr.key === attrKey );

            if (!attrData) {
                return;
            }

            let selAttr = {
                key: attrData.key,
                name: attrData.name,
                value_type: attrData.value_type,
            }

            const favAttr = initSettings.favoriteAttributes.find( attr => attr.key === attrKey );

            if ( favAttr && favAttr.customName ) selAttr.layout_name = favAttr.customName;

            resItems.push(selAttr);

        });

        window.removeEventListener( "message", processMessagesFromIframe );

        $mdDialog.hide({
            status: 'agree',
            data: {items: resItems}
        });

    };

    function processMessagesFromIframe(event) {

        if (!event.data || event.data.iframeId !== vm.iframeId) {
            return;
        }

        // This 'if' is separate to signal about message that contains the same event.data.iframeId but a different origin
        if (event.origin !== windowOrigin) {
            console.error('Received message from a different origin', event.origin);
            return;
        }

        switch (event.data.action) {

            case 'SAVE_FAVORITE_ATTRIBUTES':
                saveFavAttrs(event.data.payload);
                break;

            case 'SAVE_DIALOG':
                saveDialog(event.data.payload);
                break;

            case 'CANCEL_DIALOG':
                window.removeEventListener( "message", processMessagesFromIframe );
                $mdDialog.hide( {status: 'disagree'} );
                break;

        }

    }

    function iframeReadyHandler (event) {

        if (event.data &&
            event.data.iframeId === vm.iframeId &&
            event.data.action === 'IFRAME_READY') {

            iframeElem = document.querySelector("#id_" + vm.iframeId);

            iframeWindow = iframeElem.contentWindow;

            window.addEventListener("message", processMessagesFromIframe);
            window.removeEventListener("message", iframeReadyHandler);

            iframeWindow.postMessage({ action: 'INITIALIZATION_SETTINGS_TRANSMISSION', payload: initSettings }, windowOrigin );

        }

    }

    window.addEventListener("message", iframeReadyHandler);

}