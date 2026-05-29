import EntityResolverService from "./entityResolverServiceNew";
import CookieService from "../../../../shell/scripts/app/services/cookieService";
import ToastNotificationService from "../../../../shell/scripts/app/services/toastNotificationService";
import ErrorService from "../../../../shell/scripts/app/services/errorService";
import XhrService from "../../../../shell/scripts/app/services/xhrService";
import InstrumentService from "./instrumentService";
import PriceHistoryService from "./priceHistoryService";
import CurrencyHistoryService from "./currencyHistoryService";
import ConfigurationService from "./configurationService";
import ReportService from "./reportService";
import TransactionImportSchemeService from "./import/transactionImportSchemeService";
import GridTableHelperService from "../helpers/gridTableHelperService";
import MultitypeFieldService from './multitypeFieldService';
import uiService from './uiService';
import transactionTypeService from "./transactionTypeService";

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

export default new EntityResolverService(instrumentService, transactionTypeService, priceHistoryService, currencyHistoryService, configurationService, reportService, transactionImportSchemeService);