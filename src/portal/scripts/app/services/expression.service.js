// import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
// import ErrorService from "../../../../shell/scripts/app/services/errorService";
// import CookieService from "../../../../shell/scripts/app/services/cookieService";
// import XhrService from "../../../../shell/scripts/app/services/xhrService";
// import ExpressionService from "./expression.serviceNew";

(function () {

	var ToastNotificationService = require("../../../../shell/scripts/app/services/toastNotificationService").default;
	var ErrorService = require("../../../../shell/scripts/app/services/errorService").default;
	var CookieService = require("../../../../shell/scripts/app/services/cookieService").default;
	var XhrService = require("../../../../shell/scripts/app/services/xhrService").default;
	var ExpressionService = require("./expression.serviceNew").default;

	'use strict';

	const cookieService = new CookieService();
	const toastNotificationService = new ToastNotificationService();
	const errorService = new ErrorService(toastNotificationService);
	const xhrService = new XhrService(errorService, cookieService);

	module.exports = new ExpressionService(cookieService, xhrService);

}());