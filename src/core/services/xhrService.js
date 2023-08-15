/**
 * Created by szhitenev on 15.06.2016.
 *
 * Deprecated. Use shell/scripts/app/services/xhrService.js instead
 *
 */

'use strict';

import ToastNotificationService from "../../shell/scripts/app/services/toastNotificationService";
import ErrorService from "../../shell/scripts/app/services/errorService";
import XhrService from "../../shell/scripts/app/services/xhrService";

(function () {

	const toastNotificationService = new ToastNotificationService();
	const errorService = new ErrorService(toastNotificationService);
	const xhrService = new XhrService(errorService);

	module.exports = {
		fetch: xhrService.fetch
	}

})();