/**
 * Created by mevstratov on 25.05.2021.
 */

'use strict';

export default function () {

    // toastr.options.onclick = function() { console.log('clicked'); }

    const success = function (message, title, options) {
        toastr.success(message, title, options);
    };

    const error = function (message, title, options) {

        // var searchParams = new URLSearchParams(window.location.search);

        // if (searchParams.get('debug') === 'true') {

		toastr.error(message, title, options);

        // }

    };

    const warning = function (message, title, options) {
        toastr.warning(message, title, options)
    };

    const info = function (message, title, options) {
        toastr.info(message, title, options);
    };

    const clientError = function (message, options) {
        const title = '<span data-text="Client Error">Warning</span>'
        toastr.warning(message, title, options);
    }

    return {
        success: success,
        error: error,
        info: info,
        warning: warning,

        // Custom
        clientError: clientError
    }

}