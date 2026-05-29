import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
import ErrorService from "../../../../shell/scripts/app/services/errorService";
import CookieService from "../../../../shell/scripts/app/services/cookieService";
import XhrService from "../../../../shell/scripts/app/services/xhrService";
import MetaRestrictionsService from "./metaRestrictionsService";
import AttributeTypeService from "./attributeTypeServiceNew";

'use strict';

const cookieService = new CookieService();
const toastNotificationService = new ToastNotificationService();
const errorService = new ErrorService(toastNotificationService);
const xhrService = new XhrService(errorService, cookieService);
const metaRestrictionsService = new MetaRestrictionsService();

export default new AttributeTypeService(cookieService, xhrService, metaRestrictionsService);