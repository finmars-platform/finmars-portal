/**
 * Created by szhitenev on 16.06.2016.
 */

import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
import ErrorService from "../../../../shell/scripts/app/services/errorService";
import CookieService from "../../../../shell/scripts/app/services/cookieService";
import XhrService from "../../../../shell/scripts/app/services/xhrService";
import EcosystemDefaultService from "./ecosystemDefaultService";
import MetaContentTypesService from "./metaContentTypesService";

import UiService from "./uiServiceNew";

(function () {

    'use strict';

    const cookieService = new CookieService();
    const toastNotificationService = new ToastNotificationService();
    const errorService = new ErrorService(toastNotificationService);
    const xhrService = new XhrService(errorService, cookieService);
    const ecosystemDefaultService = new EcosystemDefaultService(cookieService, xhrService);
    const metaContentTypesService = new MetaContentTypesService(cookieService, xhrService);

    module.exports = new UiService(cookieService, xhrService, ecosystemDefaultService, metaContentTypesService, null);

}());