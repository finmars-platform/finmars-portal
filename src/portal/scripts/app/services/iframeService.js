/** @module iframeService **/
export function iframeService () {

    function postMessage ( data, source = window.parent, windowOrigin ) {
        source.postMessage( data, windowOrigin )
    }

    return {
        sendMessage: sendMessage,
    }
}