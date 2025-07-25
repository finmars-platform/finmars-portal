/**
 * Created by szhitenev on 15.06.2016.
 *
 * Deprecated. Use shell/scripts/app/services/xhrService.js instead
 *
 */

'use strict';

// TODO refactor this file
// No mixed modules types allowed

// import ToastNotificationService from "../../shell/scripts/app/services/toastNotificationService";
// import ErrorService from "../../shell/scripts/app/services/errorService";
// import XhrService from "../../shell/scripts/app/services/xhrService";
//
// export const fetch = l.fetch;

(function () {

	var ToastNotificationService = require("../../shell/scripts/app/services/toastNotificationService").default;
	var ErrorService = require("../../shell/scripts/app/services/errorService").default;
	var XhrService = require("../../shell/scripts/app/services/xhrService").default;

	// export const fetch = l.fetch;

	const toastNotificationService = new ToastNotificationService();
	const errorService = new ErrorService(toastNotificationService);
	const xhrService = new XhrService(errorService);

	module.exports = {
		fetch: xhrService.fetch
	}

})();