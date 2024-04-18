/**
 * Created by szhitenev on 16.06.2016.
 *
 * This service needed for modules that import entityResolverService by require()
 *
 * TODO: replace all entityResolverService imported by require() with
 * entityResolverService from dependency injection
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

    const EntityResolverService = require("./entityResolverServiceNew").default;
    const CookieService = require("../../../../shell/scripts/app/services/cookieService").default;
    const ToastNotificationService = require("../../../../shell/scripts/app/services/toastNotificationService").default;
    const ErrorService = require("../../../../shell/scripts/app/services/errorService").default;
    const XhrService = require("../../../../shell/scripts/app/services/xhrService").default;
    const InstrumentService = require("./instrumentService").default;
    const PriceHistoryService = require("./priceHistoryService").default;
    const CurrencyHistoryService = require("./currencyHistoryService").default;
    const ConfigurationService = require("./configurationService").default;
    const ReportService = require("./reportService").default;
    const TransactionImportSchemeService = require("./import/transactionImportSchemeService").default;


    const GridTableHelperService = require("../helpers/gridTableHelperService");

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
    const configurationService = new ConfigurationService(cookieService, xhrService);
    const reportService = new ReportService(cookieService, xhrService);
    const transactionImportSchemeService = new TransactionImportSchemeService(cookieService, xhrService);

    module.exports = new EntityResolverService(instrumentService, transactionTypeService, priceHistoryService, currencyHistoryService, configurationService, reportService, transactionImportSchemeService);

}());