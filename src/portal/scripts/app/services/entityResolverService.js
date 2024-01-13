/**
 * Created by szhitenev on 16.06.2016.
 *
 * This service needed for modules that import entityResolverService by require()
 */
// import EntityResolverService from "./entityResolverServiceNew";
// import CookieService from "../../../../shell/scripts/app/services/cookieService";
// import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
// import ErrorService from "../../../../shell/scripts/app/services/errorService";
// import XhrService from "../../../../shell/scripts/app/services/xhrService";
// import InstrumentService from "./instrumentService";
// import PriceHistoryService from "./priceHistoryService";
// import CurrencyHistoryService from "./currencyHistoryService";
// import ReportService from "./reportService";
// import GridTableHelperService from "../helpers/gridTableHelperService";


(function () {

    var EntityResolverService = require("./entityResolverServiceNew").default;
    var CookieService = require("../../../../shell/scripts/app/services/cookieService").default;
    var ToastNotificationService = require("../../../../shell/scripts/app/services/toastNotificationService").default;
    var ErrorService = require("../../../../shell/scripts/app/services/errorService").default;
    var XhrService = require("../../../../shell/scripts/app/services/xhrService").default;
    var InstrumentService = require("./instrumentService").default;
    var PriceHistoryService = require("./priceHistoryService").default;
    var CurrencyHistoryService = require("./currencyHistoryService").default;
    var ReportService = require("./reportService").default;

    var GridTableHelperService = require("../helpers/gridTableHelperService");

    const MultitypeFieldService = require('./multitypeFieldService');
    const uiService = require('./uiService').default;
    const transactionTypeService = require("./transactionTypeService");

    'use strict';
    const cookieService = new CookieService();
    const toastNotificationService = new ToastNotificationService();
    const errorService = new ErrorService(toastNotificationService);
    const xhrService = new XhrService(errorService, cookieService);
    const multitypeFieldService = new MultitypeFieldService();

    const gridTableHelperService = new GridTableHelperService(multitypeFieldService);

    // const instrumentService = new InstrumentService(cookieService, xhrService, uiService, gridTableHelperService, multitypeFieldService);
    const instrumentService = new InstrumentService(cookieService, toastNotificationService, xhrService, uiService, gridTableHelperService, multitypeFieldService);
    const priceHistoryService = new PriceHistoryService(cookieService, xhrService);
    const currencyHistoryService = new CurrencyHistoryService(cookieService, xhrService);
    const reportService = new ReportService(cookieService, xhrService);

    module.exports = new EntityResolverService(instrumentService, transactionTypeService, priceHistoryService, currencyHistoryService, reportService, uiService);

}());