/**
 * Created by szhitenev on 16.06.2016.
 */

// TODO refactor this file
// No mixed modules types allowed
// import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
// import ErrorService from "../../../../shell/scripts/app/services/errorService";
// import CookieService from "../../../../shell/scripts/app/services/cookieService";
// import XhrService from "../../../../shell/scripts/app/services/xhrService";
// import EcosystemDefaultService from "./ecosystemDefaultService";
// import MetaContentTypesService from "./metaContentTypesService";
//
// import UiService from "./uiServiceNew";

(function () {

    'use strict';

    var ToastNotificationService = require("../../../../shell/scripts/app/services/toastNotificationService").default;
    var ErrorService = require("../../../../shell/scripts/app/services/errorService").default;
    var CookieService = require("../../../../shell/scripts/app/services/cookieService").default;
    var XhrService = require("../../../../shell/scripts/app/services/xhrService").default;
    var EcosystemDefaultService = require("./ecosystemDefaultService").default;
    var MetaContentTypesService = require("./metaContentTypesService").default;

    var UiService = require("./uiServiceNew").default;

    const cookieService = new CookieService();
    const toastNotificationService = new ToastNotificationService();
    const errorService = new ErrorService(toastNotificationService);
    const xhrService = new XhrService(errorService, cookieService);
    const ecosystemDefaultService = new EcosystemDefaultService(cookieService, xhrService);
    const metaContentTypesService = new MetaContentTypesService(cookieService, xhrService);

    module.exports = new UiService(cookieService, xhrService, ecosystemDefaultService, metaContentTypesService, null);

}());