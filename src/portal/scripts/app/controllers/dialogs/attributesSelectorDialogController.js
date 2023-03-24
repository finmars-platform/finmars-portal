const metaHelper = require('../../helpers/meta.helper');

export default function ($scope, $mdDialog, toastNotificationService, usersService, globalDataService, data) {

    const vm = this;

    vm.iframeId = metaHelper.generateUniqueId("attributeSelector");
    vm.iframeSrc = 'http://localhost:3000/space0ni5k/v/external/components/modal_add_columns?iframeId=' + vm.iframeId;

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

        if ( payload.favoriteAttributes ) {
            saveFavAttrs(payload.favoriteAttributes);
        }

        const resItems = payload.selectedAttributes.map(attrData => {

            const data = {
                key: attrData.key,
                name: attrData.name,
                value_type: attrData.value_type,
            };

            if (attrData.layout_name) data.layout_name = attrData.layout_name;

            return data;

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

        switch (event.data.action) {

            /*case 'IFRAME_READY':
                iframeWindow.postMessage({ action: 'INITIALIZATION_SETTINGS_TRANSMISSION', payload: initSettings }, iframeWindow.origin );
                break;*/

            case 'SAVE_FAVORITE_ATTRIBUTES':
                saveFavAttrs(event.data.payload.favoriteAttributes);
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

            iframeWindow.postMessage({ action: 'INITIALIZATION_SETTINGS_TRANSMISSION', payload: initSettings }, vm.iframeSrc );

        }

    }

    window.addEventListener("message", iframeReadyHandler);

}