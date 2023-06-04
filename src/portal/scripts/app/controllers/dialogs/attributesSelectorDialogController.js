import baseUrlService from "../../../../../shell/scripts/app/services/baseUrlService";

const metaHelper = require('../../helpers/meta.helper');

/** @module attributesSelectorDialogController **/
export default function ($scope, $mdDialog, toastNotificationService, uiService, globalDataService, data) {

    const vm = this;

    vm.readyStatus = false;
    vm.iframeId = metaHelper.generateUniqueId("attributeSelector");

    const urlBeginning = baseUrlService.resolve();
    const base_api_url = baseUrlService.getMasterUserPrefix();

    vm.iframeSrc = `${urlBeginning}/${base_api_url}/v/external/components/modal_add_columns?iframeId=${vm.iframeId}`;
    // vm.iframeSrc = `http://localhost:3000/space0ni5k/v/external/components/modal_add_columns?iframeId=${vm.iframeId}`; // for development

    const windowOrigin = window.origin;
    // const windowOrigin = 'http://localhost:3000'; // for development
    const foldersSeparatorRE = /\.\s(?=\S)/g; // equals to ". " which have symbol after it
    let iframeElem;
    let iframeWindow; // iframeElem.contentWindow;

    let memberLayout = globalDataService.getMemberLayout();

    const contentType = data.contentType;
    if (!data.contentType) throw new Error("Content type not specified.");

    const attributesList = data.attributes;
    const layoutNames = data.layoutNames || {};

    const initSettings = {
        selectedAttributes: data.selectedAttributes || [],
        favoriteAttributes: memberLayout || [],
    };

    if (data.title) initSettings.title = data.title;

    const processAttrName = function (attr) {

        let formattedName = attr.name;

        if ( attr.attribute_type ) {

            const namePieces = formattedName.split( foldersSeparatorRE );
            const last = namePieces.pop();
            const namePiece = attr.key.includes("pricing_policy_") ? "Pricing" : "User Attributes";

            namePieces.push(namePiece);
            namePieces.push(last);

            formattedName = namePieces.join('. ');

        }
        else if ( !attr.name.match( foldersSeparatorRE ) ) {
            formattedName = "General. " + attr.name;
        }

        return formattedName;

    }

    initSettings.attributes = attributesList.map(attr => {

        const attrData = {
            key: attr.key,
            name: processAttrName(attr),
            value_type: attr.value_type,
            // TODO get description for attributes from api
            description: '',
        };

        if ( layoutNames[attr.key] ) {
            attrData.layout_name = layoutNames[attr.key];
        }

        return attrData;

    })

    const saveFavAttrs = function (favAttrsData) {

        if ( !Array.isArray(favAttrsData) ) {
            const errorData = new Error(`Expected array. Got an '${typeof favAttrsData}'.`);
            errorData.___recievedParameter = favAttrsData;
            throw errorData;
        }

        favAttrsData = favAttrsData.map(fAttr => {

            const attr = attributesList.find( attr => attr.key === fAttr.key );

            if (attr) fAttr.name = attr.name;

            return fAttr;

        });

        const memberLayout = globalDataService.getMemberLayout();
        memberLayout.favorites.attributes[contentType] = favAttrsData;
        initSettings.favoriteAttributes = memberLayout.favorites.attributes[contentType];

        /*usersService.updateMember(member.id, member).then(() => {
            toastNotificationService.success('Favorite attributes updated.');
        });*/
        uiService.updateMemberLayout(memberLayout).then(() => {
            toastNotificationService.success('Favorite attributes updated.');
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

            let attrData = attributesList.find( attr => attr.key === attrKey );

            if (!attrData) {
                return;
            }

            /* let selAttr = {
                key: attrData.key,
                name: attrData.name,
                value_type: attrData.value_type,
            } */
            attrData = JSON.parse( JSON.stringify(attrData) );

            const favAttr = initSettings.favoriteAttributes.find( attr => attr.key === attrKey );

            if ( favAttr && favAttr.customName ) attrData.layout_name = favAttr.customName;

            resItems.push(attrData);

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
        /*if (event.origin !== windowOrigin) {
            console.error('Received message from a different origin', event.origin);
            return;
        }*/

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

            vm.readyStatus = true;
            $scope.$apply();

            iframeElem = document.querySelector("#id_" + vm.iframeId);

            iframeWindow = iframeElem.contentWindow;

            window.addEventListener("message", processMessagesFromIframe);
            window.removeEventListener("message", iframeReadyHandler);

            iframeWindow.postMessage({ action: 'INITIALIZATION_SETTINGS_TRANSMISSION', payload: initSettings }, windowOrigin );

        }

    }



    window.addEventListener("message", iframeReadyHandler);

}