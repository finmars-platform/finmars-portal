/**
 * Created by mevstratov on 25.05.2021.
 */

'use strict';

export default function () {

	const success = function (message) {
		toastr.success(message);
	};

	const error = function (message) {

		// var searchParams = new URLSearchParams(window.location.search);

		// if (searchParams.get('debug') === 'true') {
		toastr.error(message);
		// }

	};

	const warning = function (message) {
		toastr.warning(message)
	};

	const info = function (message) {
		toastr.info(message);
	};

	return {
		success: success,
		error: error,
		info: info,
		warning: warning
	}

}