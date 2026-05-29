/**
 * Created by szhitenev on 04.05.2016.
 */

import router from "./app/router";
import customDialogService from "./app/services/customDialogService";
import bigDrawerService from "./app/services/bigDrawerService";
import importSchemesMethodsService from "./app/services/import/importSchemesMethodsService";
import multitypeFieldService from "./app/services/multitypeFieldService";
import evRvDomManagerService from "./app/services/evRvDomManagerService";
import entityDataConstructorService from "./app/services/entity-data-constructor/entityDataConstructorService";
import gridTableHelperService from "./app/helpers/gridTableHelperService";
import dashboardEntityViewerComponent from "./app/components/dashboardEntityViewerComponent";
import dashboardLayoutManagerController from "./app/controllers/dashboardLayoutManagerController";
import dashboardConstructorController from "./app/controllers/dashboardConstructorController";
import dashboardConstructorSocketSettingsDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorSocketSettingsDialogController";
import dashboardConstructorAccordionEditorDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorAccordionEditorDialogController";
import dashboardConstructorAccordionComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorAccordionComponentDialogController";
import dashboardConstructorControlComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorControlComponentDialogController";
import dashboardConstructorControlDateComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorControlDateComponentDialogController";
import dashboardConstructorControlRelationComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorControlRelationComponentDialogController";
import dashboardConstructorButtonSetComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorButtonSetComponentDialogController";
import dashboardConstructorSupersetDashboardComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorSupersetDashboardComponentDialogController";
import dashboardConstructorInputFormComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorInputFormComponentDialogController";
import dashboardConstructorFinmarsWidgetComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorFinmarsWidgetComponentDialogController";
import dashboardConstructorReportViewerComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerComponentDialogController";
import dashboardConstructorReportViewerMatrixComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerMatrixComponentDialogController";
import dashboardConstructorApexChartComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorApexChartComponentDialogController";
import dashboardConstructorIframeComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorIframeComponentDialogController";
import dashboardConstructorEntityViewerComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerComponentDialogController";
import dashboardConstructorEntityViewerSplitPanelComponentDialogController from "./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerSplitPanelComponentDialogController";
import dashboardReportViewerComponentSettingsDialogController from "./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerComponentSettingsDialogController";
import dashboardReportViewerMatrixComponentSettingsDialogController from "./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerMatrixComponentSettingsDialogController";
import dashboardConstructorFieldDirective from "./app/directives/dashboardConstructorFieldDirective";
import dashboardConstructorGridAlignerDirective from "./app/directives/dashboardConstructorGridAlignerDirective";
import dashboardController from "./app/controllers/dashboardController";
import dashboardGridAlignerDirective from "./app/directives/dashboard/dashboardGridAlignerDirective";
import dashboardAccordionDirective from "./app/directives/dashboard/dashboardAccordionDirective";
import dashboardButtonSetDirective from "./app/directives/dashboard/dashboardButtonSetDirective";
import dashboardControlDirective from "./app/directives/dashboard/dashboardControlDirective";
import dashboardControlDateDirective from "./app/directives/dashboard/dashboardControlDateDirective";
import dashboardControlRelationDirective from "./app/directives/dashboard/dashboardControlRelationDirective";
import dashboardEntityViewerDirective from "./app/directives/dashboard/dashboardEntityViewerDirective";
import dashboardEntityViewerSplitPanelDirective from "./app/directives/dashboard/dashboardEntityViewerSplitPanelDirective";
import dashboardInputFormDirective from "./app/directives/dashboard/dashboardInputFormDirective";
import dashboardReportViewerDirective from "./app/directives/dashboard/dashboardReportViewerDirective";
import dashboardReportViewerMatrixDirective from "./app/directives/dashboard/dashboardReportViewerMatrixDirective";
import dashboardApexChartDirective from "./app/directives/dashboard/dashboardApexChartDirective";
import dashboardIframeDirective from "./app/directives/dashboard/dashboardIframeDirective";
import dashboardSupersetDashboardDirective from "./app/directives/dashboard/dashboardSupersetDashboardDirective";
import dashboardFinmarsWidgetDirective from "./app/directives/dashboard/dashboardFinmarsWidgetDirective";
import dashboardShowStateDialogController from "./app/controllers/dialogs/dashboardShowStateDialogController";
import dashboardReportViewerController from "./app/controllers/entityViewer/dashboardReportViewerController";
import reportViewerMatrixDirective from "./app/directives/reportViewerMatrixDirective";
import reportViewerTableChartDirective from "./app/directives/reportViewerTableChartDirective";
import reportViewerBarsChart from "./app/directives/reportViewer/reportViewerBarsChart";
import reportViewerPieChart from "./app/directives/reportViewer/reportViewerPieChart";
import layoutListDialogController from "./app/controllers/dialogs/dashboard/layoutListDialogController";
import dashboardLayoutExportDialogController from "./app/controllers/dialogs/dashboard/dashboardLayoutExportDialogController";
import bookmarksController from "./app/controllers/bookmarksController";
import sideNavController from "./app/controllers/sideNavController";
import alertSideNavController from "./app/controllers/alertSideNavController";
import homeController from "./app/controllers/homeController";
import recycleBinPageController from "./app/controllers/pages/recycleBinPageController";
import tasksPageController from "./app/controllers/pages/tasksPageController";
import notFoundPageController from "./app/controllers/notFoundPageController";
import entityDataConstructorDialogController from "./app/controllers/dialogs/entityDataConstructorDialogController";
import entityViewerFormsPreviewDialogController from "./app/controllers/dialogs/entityViewerFormsPreviewDialogController";
import complexTransactionFormsPreviewDialogController from "./app/controllers/dialogs/complexTransactionFormsPreviewDialogController";
import evFormInstrumentTableSettingsDialogController from "./app/controllers/dialogs/evFormInstrumentTableSettingsDialogController";
import expressionEditorDialogController from "./app/controllers/dialogs/expressionEditorDialogController";
import aceEditorDialogController from "./app/controllers/dialogs/aceEditorDialogController";
import jsonEditorDialogController from "./app/controllers/dialogs/jsonEditorDialogController";
import entityAsJsonEditorDialogController from "./app/controllers/dialogs/entityAsJsonEditorDialogController";
import useFromAboveDialogController from "./app/controllers/dialogs/useFromAboveDialogController";
import instrumentSelectDialogController from "./app/controllers/dialogs/instrumentSelectDialogController";
import entitySearchDialogController from "./app/controllers/dialogs/entitySearchDialogController";
import twoFieldsMultiselectDialogController from "./app/controllers/dialogs/twoFieldsMultiselectDialogController";
import tableAttributeSelectorDialogController from "./app/controllers/dialogs/tableAttributeSelectorDialogController";
import tableAttributesMenuConstructorDialogController from "./app/controllers/dialogs/tableAttributesMenuConstructorDialogController";
import layoutChangesLossWarningDialogController from "./app/controllers/dialogs/layoutChangesLossWarningDialogController";
import classifierSelectDialogController from "./app/controllers/dialogs/classifierSelectDialogController";
import classifierTreeDirective from "./app/directives/classifierTreeDirective";
import classifierTreeNodeDirective from "./app/directives/classifierTreeNodeDirective";
import expandableItemsSelectorDialogController from "./app/controllers/dialogs/expandableItemsSelectorDialogController";
import saveLayoutDialogController from "./app/controllers/dialogs/saveLayoutDialogController";
import renameFieldDialogController from "./app/controllers/dialogs/renameFieldDialogController";
import resizeFieldDialogController from "./app/controllers/dialogs/resizeFieldDialogController";
import saveConfigurationExportLayoutDialogController from "./app/controllers/dialogs/saveConfigurationExportLayoutDialogController";
import actionsNotificationsSettingsDialogController from "./app/controllers/dialogs/actionsNotificationsSettingsDialogController";
import exportPdfDialogController from "./app/controllers/dialogs/exportPdfDialogController";
import notificationsController from "./app/controllers/system/notificationsController";
import headerNotificationsDialogController from "./app/controllers/dialogs/headerNotificationsDialogController";
import helpDialogController from "./app/controllers/dialogs/helpDialogController";
import validationDialogController from "./app/controllers/dialogs/validationDialogController";
import calculatorDialogController from "./app/controllers/dialogs/calculatorDialogController";
import tabsEditorDialogController from "./app/controllers/dialogs/tabsEditorDialogController";
import textEditorDialogController from "./app/controllers/dialogs/textEditorDialogController";
import inputTemplateLayoutViewerDialogController from "./app/controllers/dialogs/inputTemplateLayoutViewerDialogController";
import templateLayoutManagerController from "./app/controllers/pages/templateLayoutManagerController";
import newLayoutDialogController from "./app/controllers/dialogs/newLayoutDialogController";
import renameDialogController from "./app/controllers/dialogs/renameDialogController";
import saveAsDialogController from "./app/controllers/dialogs/saveAsDialogController";
import loaderDialogController from "./app/controllers/dialogs/loaderDialogController";
import contextMenuLayoutManagerController from "./app/controllers/contextMenuLayoutManagerController";
import contextMenuConstructorController from "./app/controllers/contextMenuConstructorController";
import contextMenuOptionSettingsDialogController from "./app/controllers/dialogs/contextMenuOptionSettingsDialogController";
import contextMenuConstructorOptionDirective from "./app/directives/contextMenuConstructorOptionDirective";
import universalInputDialogController from "./app/controllers/dialogs/universalInputDialogController";
import bulkJsonViewDialogController from "./app/controllers/dialogs/bulkJsonViewDialogController";
import instrumentSelectDatabaseDialogController from "./app/controllers/dialogs/instrumentSelectDatabaseDialogController";
import unifiedSelectDatabaseDialogController from "./app/controllers/dialogs/unifiedSelectDatabaseDialogController";
import ecosystemDefaultSettingsController from "./app/controllers/pages/ecosystemDefaultSettingsController";
import itemsSelectorWithGroupsDialogController from "./app/controllers/dialogs/selectors/itemsSelectorWithGroupsDialogController";
import draftDialogController from "./app/controllers/dialogs/draftDialogController";
import numberFormatSettingsDialogController from "./app/controllers/dialogs/numberFormatSettingsDialogController";
import reportViewerMatrixSettingsDialogController from "./app/controllers/dialogs/reportViewerMatrixSettingsDialogController";
import fillPriceManuallyInstrumentDialogController from "./app/controllers/dialogs/fillPriceManuallyInstrumentDialogController";
import floatCustomFieldConstructorController from "./app/controllers/floatCustomFieldConstructorController";
import dateCustomFieldConstructorController from "./app/controllers/dateCustomFieldConstructorController";
import auditController from "./app/controllers/system/auditController";
import settingsFormDesignController from "./app/controllers/settings/settingsFormDesignController";
import settingBloombergImportInstrumentController from "./app/controllers/settings/settingBloombergImportInstrumentController";
import classifierImportDialogController from "./app/controllers/dialogs/classifierImportDialogController";
import classifierExportDialogController from "./app/controllers/dialogs/classifierExportDialogController";
import layoutExportDialogController from "./app/controllers/dialogs/layoutExportDialogController";
import fileReportsController from "./app/controllers/pages/fileReportsController";
import healthcheckController from "./app/controllers/pages/healthcheckController";
import twoFactorLoginDialogController from "./app/controllers/dialogs/twoFactorLoginDialogController";
import successDialogController from "./app/controllers/dialogs/successDialogController";
import infoDialogController from "./app/controllers/dialogs/infoDialogController";
import filePreviewDialogController from "./app/controllers/dialogs/filePreviewDialogController";
import fileEditDialogController from "./app/controllers/dialogs/fileEditDialogController";
import systemErrorLogDialogController from "./app/controllers/dialogs/systemErrorLogDialogController";
import logDialogController from "./app/controllers/dialogs/logDialogController";
import historyDialogController from "./app/controllers/dialogs/historyDialogController";
import simpleLoginDialogController from "./app/controllers/dialogs/simpleLoginDialogController";
import configurationDialogController from "./app/controllers/dialogs/configurationDialogController";
import marketplaceConfigurationDialogController from "./app/controllers/dialogs/marketplaceConfigurationDialogController";
import actionsController from "./app/controllers/actionsController";
import fillPriceHistoryDialogController from "./app/controllers/dialogs/fillPriceHistoryDialogController";
import eventScheduleConfigDialogController from "./app/controllers/dialogs/eventScheduleConfigDialogController";
import priceDownloadSchemeAddDialogController from "./app/controllers/dialogs/priceDownloadSchemeAddDialogController";
import defaultPricingConfigDialogController from "./app/controllers/dialogs/defaultPricingConfigDialogController";
import instrumentDownloadDialogController from "./app/controllers/dialogs/instrument-download/instrumentDownloadDialogController";
import instrumentDownloadSchemeAddDialogController from "./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeAddDialogController";
import instrumentDownloadSchemeEditDialogController from "./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeEditDialogController";
import simpleEntityImportDialogController from "./app/controllers/dialogs/simple-entity-import/simpleEntityImportDialogController";
import simpleEntityImportErrorsDialogController from "./app/controllers/dialogs/simple-entity-import/simpleEntityImportErrorsDialogController";
import simpleEntityImportSchemeEditDialogController from "./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeEditDialogController";
import simpleEntityImportSchemeV2EditDialogController from "./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeV2EditDialogController";
import simpleEntityImportSchemeCreateDialogController from "./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeCreateDialogController";
import complexImportDialogController from "./app/controllers/dialogs/complex-import/complexImportDialogController";
import complexImportSchemeEditDialogController from "./app/controllers/dialogs/complex-import/complexImportSchemeEditDialogController";
import complexImportSchemeCreateDialogController from "./app/controllers/dialogs/complex-import/complexImportSchemeCreateDialogController";
import complexImportSchemeErrorsDialogController from "./app/controllers/dialogs/complex-import/complexImportSchemeErrorsDialogController";
import complexImportValidationErrorsDialogController from "./app/controllers/dialogs/complex-import/complexImportValidationErrorsDialogController";
import transactionImportSchemeAddDialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeAddDialogController";
import transactionImportSchemeEditDialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeEditDialogController";
import transactionImportSchemeV2DialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeV2DialogController";
import transactionImportSchemeInputsDialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeInputsDialogController";
import transactionImportDialogController from "./app/controllers/dialogs/transaction-import/transactionImportDialogController";
import transactionImportErrorsDialogController from "./app/controllers/dialogs/transaction-import/transactionImportErrorsDialogController";
import transactionImportSchemeScenarioFieldsDialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeScenarioFieldsDialogController";
import transactionImportSchemeSelectorValuesDialogController from "./app/controllers/dialogs/transaction-import/transactionImportSchemeSelectorValuesDialogController";
import colorPalettesSettingsController from "./app/controllers/colorPicker/colorPalettesSettingsController";
import colorPalettesSettingsDialogController from "./app/controllers/colorPicker/colorPalettesSettingsDialogController";
import twoInputsDialogController from "./app/controllers/dialogs/twoInputsDialogController";
import renameColorDialogController from "./app/controllers/dialogs/renameColorDialogController";
import colorPickerDialogController from "./app/controllers/colorPicker/colorPickerDialogController";
import selectColorDialogController from "./app/controllers/colorPicker/selectColorDialogController";
import colorPickerDirective from "./app/directives/colorPickerDirective";
import checkEventsController from "./app/controllers/checkEventsController";
import checkEventsDialogController from "./app/controllers/dialogs/events/checkEventsDialogController";
import eventWithReactDialogController from "./app/controllers/dialogs/events/eventWithReactDialogController";
import eventWithReactApplyDefaultConfirmDialogController from "./app/controllers/dialogs/events/eventWithReactApplyDefaultConfirmDialogController";
import eventDoNotReactDialogController from "./app/controllers/dialogs/events/eventDoNotReactDialogController";
import eventApplyDefaultDialogController from "./app/controllers/dialogs/events/eventApplyDefaultDialogController";
import attributesManagerController from "./app/controllers/attributesManagerController";
import attributesManagerDialogController from "./app/controllers/dialogs/attributesManagerDialogController";
import attributeTypeDialogController from "./app/controllers/dialogs/attributeTypeDialogController";
import classificationEditorDialogController from "./app/controllers/dialogs/classificationEditorDialogController";
import customFieldsConfigDialogController from "./app/controllers/dialogs/customFieldsConfigDialogController";
import moveExplorerDialogController from "./app/controllers/dialogs/moveExplorerDialogController";
import entityTypeMappingDialogController from "./app/controllers/dialogs/entityTypeMappingDialogController";
import entityTypeClassifierMappingDialogController from "./app/controllers/dialogs/entityTypeClassifierMappingDialogController";
import entityViewerController from "./app/controllers/entityViewer/entityViewerController";
import reportViewerController from "./app/controllers/entityViewer/reportViewerController";
import splitPanelReportViewerController from "./app/controllers/entityViewer/splitPanelReportViewerController";
import reconciliationViewerController from "./app/controllers/entityViewer/reconciliationViewerController";
import entityViewerAddDialogController from "./app/controllers/entityViewer/entityViewerAddDialogController";
import entityViewerEditDialogController from "./app/controllers/entityViewer/entityViewerEditDialogController";
import entityViewerDeleteDialogController from "./app/controllers/entityViewer/entityViewerDeleteDialogController";
import entityViewerDeleteBulkDialogController from "./app/controllers/entityViewer/entityViewerDeleteBulkDialogController";
import entityViewerRestoreDeletedBulkDialogController from "./app/controllers/entityViewer/entityViewerRestoreDeletedBulkDialogController";
import evAddEditValidationDialogController from "./app/controllers/dialogs/evAddEditValidationDialogController";
import entityViewerPermissionEditorController from "./app/controllers/entityViewer/entityViewerPermissionEditorController";
import priceHistoryErrorEditDialogController from "./app/controllers/entityViewer/priceHistoryErrorEditDialogController";
import currencyHistoryErrorEditDialogController from "./app/controllers/entityViewer/currencyHistoryErrorEditDialogController";
import listLayoutExportDialogController from "./app/controllers/dialogs/listLayoutExportDialogController";
import aceEditorPageController from "./app/controllers/aceEditorPageController";
import instrumentTypeAddDialogController from "./app/controllers/entityViewer/instrumentTypeAddDialogController";
import instrumentTypeEditDialogController from "./app/controllers/entityViewer/instrumentTypeEditDialogController";
import transactionTypeAddDialogController from "./app/controllers/entityViewer/transactionTypeAddDialogController";
import transactionTypeEditDialogController from "./app/controllers/entityViewer/transactionTypeEditDialogController";
import transactionTypeValidationErrorsDialogController from "./app/controllers/entityViewer/transactionTypeValidationErrorsDialogController";
import transactionTypeAddInputDialogController from "./app/controllers/dialogs/transactionTypeAddInputDialogController";
import complexTransactionAddDialogController from "./app/controllers/entityViewer/complexTransactionAddDialogController";
import complexTransactionEditDialogController from "./app/controllers/entityViewer/complexTransactionEditDialogController";
import complexTransactionViewDialogController from "./app/controllers/entityViewer/complexTransactionViewDialogController";
import bookTransactionTransactionsTabController from "./app/controllers/tabs/complex-transaction/bookTransactionTransactionsTabController";
import complexTransactionsTransactionEditDialogController from "./app/controllers/entityViewer/complexTransactionsTransactionEditDialogController";
import bookUniquenessWarningDialogController from "./app/controllers/dialogs/bookUniquenessWarningDialogController";
import accrualCalculationSchedulesController from "./app/controllers/tabs/instrument/accrualCalculationSchedulesController";
import eventSchedulesTabController from "./app/controllers/tabs/instrument/eventSchedulesTabController";
import instrumentPricingTabController from "./app/controllers/tabs/instrument/instrumentPricingTabController";
import configurePricingModuleDialogController from "./app/controllers/dialogs/configurePricingModuleDialogController";
import factorScheduleTabController from "./app/controllers/tabs/instrument/factorScheduleTabController";
import manualPricingFormulasTabController from "./app/controllers/tabs/instrument/manualPricingFormulasTabController";
import instrumentTypeEventSchedulesTabController from "./app/controllers/tabs/instrument-type/instrumentTypeEventSchedulesTabController";
import instrumentTypeAccrualsTabController from "./app/controllers/tabs/instrument-type/instrumentTypeAccrualsTabController";
import instrumentTypeUserAttributesTabController from "./app/controllers/tabs/instrument-type/instrumentTypeUserAttributesTabController";
import instrumentTypeFactorsTabController from "./app/controllers/tabs/instrument-type/instrumentTypeFactorsTabController";
import instrumentEventActionsDialogController from "./app/controllers/dialogs/instrumentEventActionsDialogController";
import generateEventScheduleDialogController from "./app/controllers/dialogs/generateEventScheduleDialogController";
import calculatePortfolioRegisterRecordsDialogController from "./app/controllers/dialogs/calculatePortfolioRegisterRecordsDialogController";
import dataPortfolioController from "./app/controllers/data/dataPortfolioController";
import dataPortfolioTypeController from "./app/controllers/data/dataPortfolioTypeController";
import dataPortfolioReconcileGroupController from "./app/controllers/data/dataPortfolioReconcileGroupController";
import dataPortfolioReconcileHistoryController from "./app/controllers/data/dataPortfolioReconcileHistoryController";
import dataPortfolioRegisterController from "./app/controllers/data/dataPortfolioRegisterController";
import dataPortfolioRegisterRecordController from "./app/controllers/data/dataPortfolioRegisterRecordController";
import dataAccountController from "./app/controllers/data/dataAccountController";
import dataAccountTypeController from "./app/controllers/data/dataAccountTypeController";
import dataCounterpartyController from "./app/controllers/data/dataCounterpartyController";
import dataCounterpartyGroupController from "./app/controllers/data/dataCounterpartyGroupController";
import dataResponsibleController from "./app/controllers/data/dataResponsibleController";
import dataResponsibleGroupController from "./app/controllers/data/dataResponsibleGroupController";
import dataInstrumentController from "./app/controllers/data/dataInstrumentController";
import dataGeneratedEventController from "./app/controllers/data/dataGeneratedEventController";
import dataInstrumentTypeController from "./app/controllers/data/dataInstrumentTypeController";
import dataPricingPolicyController from "./app/controllers/data/dataPricingPolicyController";
import dataTransactionController from "./app/controllers/data/dataTransactionController";
import dataComplexTransactionController from "./app/controllers/data/dataComplexTransactionController";
import dataTransactionTypeController from "./app/controllers/data/dataTransactionTypeController";
import dataTransactionTypeGroupController from "./app/controllers/data/dataTransactionTypeGroupController";
import dataPriceHistoryController from "./app/controllers/data/dataPriceHistoryController";
import dataPortfolioHistoryController from "./app/controllers/data/dataPortfolioHistoryController";
import dataCurrencyHistoryController from "./app/controllers/data/dataCurrencyHistoryController";
import dataCurrencyController from "./app/controllers/data/dataCurrencyController";
import dataStrategyController from "./app/controllers/data/dataStrategyController";
import dataStrategyGroupController from "./app/controllers/data/dataStrategyGroupController";
import dataStrategySubGroupController from "./app/controllers/data/dataStrategySubGroupController";
import auditTransactionsController from "./app/controllers/system/auditTransactionsController";
import auditInstrumentsController from "./app/controllers/system/auditInstrumentsController";
import dataCurrencyHistoryErrorController from "./app/controllers/data/dataCurrencyHistoryErrorController";
import dataPriceHistoryErrorController from "./app/controllers/data/dataPriceHistoryErrorController";
import balanceReportController from "./app/controllers/reports/balanceReportController";
import profitAndLostReportController from "./app/controllers/reports/profitAndLostReportController";
import transactionReportController from "./app/controllers/reports/transactionReportController";
import cashFlowProjectionReportController from "./app/controllers/reports/cashFlowProjectionReportController";
import performanceReportController from "./app/controllers/reports/performanceReportController";
import customFieldDialogController from "./app/controllers/dialogs/customFieldDialogController";
import customFieldController from "./app/controllers/reports/customFieldController";
import customFieldAddDialogController from "./app/controllers/dialogs/customFieldAddDialogController";
import customFieldEditDialogController from "./app/controllers/dialogs/customFieldEditDialogController";
import manualSortingSettingsDialogController from "./app/controllers/dialogs/manualSortingSettingsDialogController";
import manualSortingLayoutManagerDialogController from "./app/controllers/dialogs/manualSortingLayoutManagerDialogController";
import manualSortingLayoutManagerController from "./app/controllers/manualSortingLayoutManagerController";
import reportPriceCheckerDialogController from "./app/controllers/dialogs/report-missing-prices/reportPriceCheckerDialogController";
import viewMissingPriceHistoryDialogController from "./app/controllers/dialogs/report-missing-prices/viewMissingPriceHistoryDialogController";
import viewMissingFxRatesDialogController from "./app/controllers/dialogs/report-missing-prices/viewMissingFxRatesDialogController";
import viewMissingHistoricalFxRatesDialogController from "./app/controllers/dialogs/report-missing-prices/viewMissingHistoricalFxRatesDialogController";
import viewMissingPriceHistoryViewPositionsDialogController from "./app/controllers/dialogs/report-missing-prices/viewMissingPriceHistoryViewPositionsDialogController";
import viewMissingCustomFieldsDialogController from "./app/controllers/dialogs/report-missing-prices/viewMissingCustomFieldsDialogController";
import viewFailedReconcileHistoryDialogController from "./app/controllers/dialogs/report-missing-prices/viewFailedReconcileHistoryDialogController";
import settingsGeneralController from "./app/controllers/settings/settingsGeneralController";
import settingsGeneralProfileController from "./app/controllers/settings/general/settingsGeneralProfileController";
import settingsGeneralInterfaceAccessController from "./app/controllers/settings/general/settingsGeneralInterfaceAccessController";
import settingsGeneralTransactionFieldController from "./app/controllers/settings/general/settingsGeneralTransactionFieldController";
import settingsGeneralInstrumentFieldController from "./app/controllers/settings/general/settingsGeneralInstrumentFieldController";
import settingsGeneralChangePasswordController from "./app/controllers/settings/general/settingsGeneralChangePasswordController";
import settingsGeneralDataProvidersController from "./app/controllers/settings/general/settingsGeneralDataProvidersController";
import settingsPersonalDataProviderController from "./app/controllers/settings/settingsPersonalDataProviderController";
import settingsGeneralDataProvidersConfigController from "./app/controllers/settings/general/settingsGeneralDataProvidersConfigController";
import settingsGeneralDataProvidersBloombergController from "./app/controllers/settings/general/settingsGeneralDataProvidersBloombergController";
import settingsGeneralInstrumentImportController from "./app/controllers/settings/general/settingsGeneralInstrumentImportController";
import settingsGeneralComplexImportController from "./app/controllers/settings/general/settingsGeneralComplexImportController";
import settingsGeneralTransactionImportController from "./app/controllers/settings/general/settingsGeneralTransactionImportController";
import settingsGeneralSimpleEntityImportController from "./app/controllers/settings/general/settingsGeneralSimpleEntityImportController";
import configurationImportDialogController from "./app/controllers/dialogs/configuration-import/configurationImportDialogController";
import configurationImportResultDialogController from "./app/controllers/dialogs/configuration-import/configurationImportResultDialogController";
import settingsGeneralConfigurationController from "./app/controllers/settings/general/settingsGeneralConfigurationController";
import settingsGeneralInitConfigurationController from "./app/controllers/settings/general/settingsGeneralInitConfigurationController";
import settingGeneralMappingPreviewFileDialogController from "./app/controllers/dialogs/settingGeneralMappingPreviewFileDialogController";
import settingGeneralMappingExportFileDialogController from "./app/controllers/dialogs/settingGeneralMappingExportFileDialogController";
import settingGeneralMappingPreviewFileErrorsDialogController from "./app/controllers/dialogs/settingGeneralMappingPreviewFileErrorsDialogController";
import createConfigurationDialogController from "./app/controllers/dialogs/createConfigurationDialogController";
import editConfigurationDialogController from "./app/controllers/dialogs/editConfigurationDialogController";
import settingsMembersAndGroupsController from "./app/controllers/settings/settingsMembersAndGroupsController";
import createInviteDialogController from "./app/controllers/dialogs/createInviteDialogController";
import manageMemberDialogController from "./app/controllers/dialogs/manageMemberDialogController";
import manageGroupDialogController from "./app/controllers/dialogs/manageGroupDialogController";
import createGroupDialogController from "./app/controllers/dialogs/createGroupDialogController";
import uiLayoutListInvitesDialogController from "./app/controllers/dialogs/ui/uiLayoutListInvitesDialogController";
import uiLayoutListDialogController from "./app/controllers/dialogs/ui/uiLayoutListDialogController";
import uiShareLayoutDialogController from "./app/controllers/dialogs/ui/uiShareLayoutDialogController";
import uiLayoutSaveAsDialogController from "./app/controllers/dialogs/ui/uiLayoutSaveAsDialogController";
import selectLayoutDialogController from "./app/controllers/dialogs/selectLayoutDialogController";
import bookmarksWizardDialogController from "./app/controllers/dialogs/bookmarksWizardDialogController";
import bookmarksEditSelectedDialogController from "./app/controllers/dialogs/bookmarksEditSelectedDialogController";
import bookmarksLayoutSelectDialogController from "./app/controllers/dialogs/bookmarksLayoutSelectDialogController";
import floatRangeCustomFieldControlComponent from "./app/components/floatRangeCustomFieldControlComponent";
import dateRangeCustomFieldControlComponent from "./app/components/dateRangeCustomFieldControlComponent";
import menuToggleDirective from "./app/directives/menuToggleDirective";
import menuLinkDirective from "./app/directives/menuLinkDirective";
import sidenavDropdownMenuDirective from "./app/directives/sidenavDropdownMenuDirective";
import bindFieldControlDirective from "./app/directives/bindFieldControlDirective";
import bindFieldTableDirective from "./app/directives/bindFieldTableDirective";
import bindFieldAttachmentDirective from "./app/directives/bindFieldAttachmentDirective";
import bindFieldJsonDirective from "./app/directives/bindFieldJsonDirective";
import layoutConstructorFieldDirective from "./app/directives/layoutConstructorFieldDirective";
import addTabEcDirective from "./app/directives/addTabEcDirective";
import onFinishRenderDirective from "./app/directives/onFinishRenderDirective";
import draftButtonDirective from "./app/directives/draftButtonDirective";
import initialLoaderDirective from "./app/directives/initialLoaderDirective";
import progressCircularDirective from "./app/directives/progressCircularDirective";
import progressLinearDirective from "./app/directives/progressLinearDirective";
import userProfileDirective from "./app/directives/userProfileDirective";
import developerPanelController from "./app/controllers/pages/developerPanelController";
import simpleEntityImportController from "./app/controllers/pages/simpleEntityImportController";
import unifiedEntityImportController from "./app/controllers/pages/unifiedEntityImportController";
import transactionImportController from "./app/controllers/pages/transactionImportController";
import complexImportController from "./app/controllers/pages/complexImportController";
import instrumentDownloadCbondsController from "./app/controllers/pages/instrumentDownloadCbondsController";
import instrumentDownloadController from "./app/controllers/pages/instrumentDownloadController";
import fillPriceHistoryController from "./app/controllers/pages/fillPriceHistoryController";
import mappingTablesController from "./app/controllers/pages/mappingTablesController";
import mappingTablePageController from "./app/controllers/pages/mappingTablePageController";
import celeryWorkerPageController from "./app/controllers/pages/celeryWorkerPageController";
import celeryWorkerDialogController from "./app/controllers/dialogs/celeryWorkerDialogController";
import mappingTableDialogController from "./app/controllers/dialogs/mappingTableDialogController";
import processesController from "./app/controllers/pages/processesController";
import journalPageController from "./app/controllers/pages/journalPageController";
import marketplacePageController from "./app/controllers/pages/marketplacePageController";
import vaultPageController from "./app/controllers/pages/vaultPageController";
import vaultSecretDialogController from "./app/controllers/dialogs/vaultSecretDialogController";
import unsealVaultDialogController from "./app/controllers/dialogs/unsealVaultDialogController";
import manageConfigurationPageController from "./app/controllers/pages/manageConfigurationPageController";
import updateCenterController from "./app/controllers/pages/updateCenterController";
import systemMessagesController from "./app/controllers/pages/systemMessagesController";
import updateConfigurationPageController from "./app/controllers/pages/updateConfigurationPageController";
import explorerPageController from "./app/controllers/pages/explorerPageController";
import workflowsPageController from "./app/controllers/pages/workflowsPageController";
import createFolderDialogController from "./app/controllers/dialogs/createFolderDialogController";
import createFileDialogController from "./app/controllers/dialogs/createFileDialogController";
import dataStatsPageController from "./app/controllers/pages/dataStatsPageController";
import dataCalendarPageController from "./app/controllers/pages/dataCalendarPageController";
import errorPageController from "./app/controllers/pages/errorPageController";
import pricingProcedurePageController from "./app/controllers/pages/pricingProcedurePageController";
import pricingParentProcedurePageController from "./app/controllers/pages/pricingParentProcedurePageController";
import pricingProcedureAddDialogController from "./app/controllers/dialogs/procedures/pricingProcedureAddDialogController";
import pricingProcedureEditDialogController from "./app/controllers/dialogs/procedures/pricingProcedureEditDialogController";
import runPricingProcedurePageController from "./app/controllers/pages/runPricingProcedurePageController";
import dataProcedurePageController from "./app/controllers/pages/dataProcedurePageController";
import dataProcedureInstancePageController from "./app/controllers/pages/dataProcedureInstancePageController";
import dataProcedureAddDialogController from "./app/controllers/dialogs/procedures/dataProcedureAddDialogController";
import dataProcedureEditDialogController from "./app/controllers/dialogs/procedures/dataProcedureEditDialogController";
import runDataProcedurePageController from "./app/controllers/pages/runDataProcedurePageController";
import expressionProcedurePageController from "./app/controllers/pages/expressionProcedurePageController";
import expressionProcedureInstancePageController from "./app/controllers/pages/expressionProcedureInstancePageController";
import expressionProcedureAddDialogController from "./app/controllers/dialogs/procedures/expressionProcedureAddDialogController";
import expressionProcedureEditDialogController from "./app/controllers/dialogs/procedures/expressionProcedureEditDialogController";
import pricingPolicyPageController from "./app/controllers/pages/pricingPolicyPageController";
import balanceReportInstancePageController from "./app/controllers/pages/balanceReportInstancePageController";
import plReportInstancePageController from "./app/controllers/pages/plReportInstancePageController";
import pricingManagePageController from "./app/controllers/pages/pricingManagePageController";
import portfolioBundlePageController from "./app/controllers/pages/portfolioBundlePageController";
import pricingSchemePageController from "./app/controllers/pages/pricingSchemePageController";
import runPricingInstrumentDialogController from "./app/controllers/dialogs/pricing/runPricingInstrumentDialogController";
import runPricingCurrencyDialogController from "./app/controllers/dialogs/pricing/runPricingCurrencyDialogController";
import singleInstrumentGenerateEventDialogController from "./app/controllers/dialogs/singleInstrumentGenerateEventDialogController";
import singleInstrumentAddEventToTableDialogController from "./app/controllers/dialogs/singleInstrumentAddEventToTableDialogController";
import addRowToTableInsideEvUserTabDialogController from "./app/controllers/dialogs/addRowToTableInsideEvUserTabDialogController";
import instrumentEventParameterDialogController from "./app/controllers/dialogs/instrumentEventParameterDialogController";
import instrumentEventActionParameterDialogController from "./app/controllers/dialogs/instrumentEventActionParameterDialogController";
import currencyPricingSchemeAddDialogController from "./app/controllers/dialogs/pricing/currencyPricingSchemeAddDialogController";
import currencyPricingSchemeEditDialogController from "./app/controllers/dialogs/pricing/currencyPricingSchemeEditDialogController";
import instrumentPricingSchemeAddDialogController from "./app/controllers/dialogs/pricing/instrumentPricingSchemeAddDialogController";
import instrumentPricingSchemeEditDialogController from "./app/controllers/dialogs/pricing/instrumentPricingSchemeEditDialogController";
import pricingPolicyAddDialogController from "./app/controllers/dialogs/pricing/pricingPolicyAddDialogController";
import pricingPolicyEditDialogController from "./app/controllers/dialogs/pricing/pricingPolicyEditDialogController";
import portfolioBundleDialogController from "./app/controllers/dialogs/portfolioBundleDialogController";
import transactionTypeGroupDialogController from "./app/controllers/dialogs/transactionTypeGroupDialogController";
import transactionTypeGroupPageController from "./app/controllers/pages/transactionTypeGroupPageController";
import pricingMultipleParametersDialogController from "./app/controllers/dialogs/pricing/pricingMultipleParametersDialogController";
import schedulePageController from "./app/controllers/pages/schedulePageController";
import scheduleAddDialogController from "./app/controllers/dialogs/schedules/scheduleAddDialogController";
import scheduleEditDialogController from "./app/controllers/dialogs/schedules/scheduleEditDialogController";
import referenceTablesController from "./app/controllers/pages/referenceTablesController";
import referenceTableEditDialogController from "./app/controllers/dialogs/referenceTableEditDialogController";
import referenceTableImportDialogController from "./app/controllers/dialogs/referenceTableImportDialogController";
import referenceTableExportDialogController from "./app/controllers/dialogs/referenceTableExportDialogController";
import formsDataConstructorController from "./app/controllers/pages/formsDataConstructorController";
import layoutsSettingsController from "./app/controllers/pages/layoutsSettingsController";
import inputFormLayoutsSettingsController from "./app/controllers/pages/inputFormLayoutsSettingsController";
import entitiesCustomAttributesController from "./app/controllers/pages/entitiesCustomAttributesController";
import priceDownloadSchemeController from "./app/controllers/pages/priceDownloadSchemeController";
import templateFieldsController from "./app/controllers/pages/templateFieldsController";
import entityTooltipPageController from "./app/controllers/pages/entityTooltipPageController";
import crossEntityAttributeExtensionPageController from "./app/controllers/pages/crossEntityAttributeExtensionPageController";
import importConfigurationsController from "./app/controllers/pages/importConfigurationsController";
import exportConfigurationsController from "./app/controllers/pages/exportConfigurationsController";
import reconProcessBankFileDialogController from "./app/controllers/dialogs/reconciliation/reconProcessBankFileDialogController";
import reconMatchDialogController from "./app/controllers/dialogs/reconciliation/reconMatchDialogController";
import reconMatchViewComplexTransactionFieldDialogController from "./app/controllers/dialogs/reconciliation/reconMatchViewComplexTransactionFieldDialogController";
import reconMatchViewFileFieldDialogController from "./app/controllers/dialogs/reconciliation/reconMatchViewFileFieldDialogController";
import reconMatchViewLineDialogController from "./app/controllers/dialogs/reconciliation/reconMatchViewLineDialogController";
import reconciliationMatchEditorController from "./app/controllers/entityViewer/reconciliationMatchEditorController";
import permissionDeniedPageController from "./app/controllers/pages/permissionDeniedPageController";
import matchReconCardDirective from "./app/directives/reconciliation/matchReconCardDirective";
import expressionEditorButton from "./app/controls/expression-editor-button/expression-editor-button";
import aceEditorButton from "./app/controls/ace-editor-button/ace-editor-button";
import jsonEditorButton from "./app/controls/json-editor-button/json-editor-button";
import useFromAboveButton from "./app/controls/use-from-above-button/use-from-above-button";
import gTableComponent from "./app/directives/groupTable/gTableComponent";
import gTableBodyComponent from "./app/directives/groupTable/gTableBodyComponent";
import gFiltersDirective from "./app/directives/groupTable/filters/gFiltersDirective";
import gEvFiltersDirective from "./app/directives/groupTable/filters/entityViewer/gEvFiltersDirective";
import evFilterDirective from "./app/directives/groupTable/filters/entityViewer/evFilterDirective";
import evTextFilterDirective from "./app/directives/groupTable/filters/entityViewer/evTextFilterDirective";
import evBooleanFilterDirective from "./app/directives/groupTable/filters/entityViewer/evBooleanFilterDirective";
import evNumberFilterDirective from "./app/directives/groupTable/filters/entityViewer/evNumberFilterDirective";
import evDateFilterDirective from "./app/directives/groupTable/filters/entityViewer/evDateFilterDirective";
import gRvFiltersDirective from "./app/directives/groupTable/filters/reportViewer/gRvFiltersDirective";
import rvFilterDirective from "./app/directives/groupTable/filters/reportViewer/rvFilterDirective";
import rvTextFilterDirective from "./app/directives/groupTable/filters/reportViewer/rvTextFilterDirective";
import rvBooleanFilterDirective from "./app/directives/groupTable/filters/reportViewer/rvBooleanFilterDirective";
import rvNumberFilterDirective from "./app/directives/groupTable/filters/reportViewer/rvNumberFilterDirective";
import rvDateFilterDirective from "./app/directives/groupTable/filters/reportViewer/rvDateFilterDirective";
import gRowsBulkActionsDirective from "./app/directives/groupTable/gRowsBulkActionsDirective";
import gEvRowsBulkActionsDirective from "./app/directives/groupTable/gEvRowsBulkActionsDirective";
import gReportSettingsComponent from "./app/directives/groupTable/gReportSettingsComponent";
import gGroupingComponent from "./app/directives/groupTable/gGroupingComponent";
import gColumnsComponent from "./app/directives/groupTable/gColumnsComponent";
import gLayoutResizerComponent from "./app/directives/groupTable/gLayoutResizerComponent";
import gHeightAlignerComponent from "./app/directives/groupTable/gHeightAlignerComponent";
import gWidthAlignerComponent from "./app/directives/groupTable/gWidthAlignerComponent";
import groupEditorBinderComponent from "./app/directives/groupTable/groupEditorBinderComponent";
import gSplitPanelReportBinderComponent from "./app/directives/groupTable/gSplitPanelReportBinderComponent";
import gVerticalSplitPanelReportBinderComponent from "./app/directives/groupTable/gVerticalSplitPanelReportBinderComponent";
import gPermissionEditorBinderComponent from "./app/directives/groupTable/gPermissionEditorBinderComponent";
import gReconciliationMatchEditorBinderComponent from "./app/directives/groupTable/gReconciliationMatchEditorBinderComponent";
import rvGcfAreasDndDirective from "./app/directives/groupTable/rvGcfAreasDndDirective";
import evGcfAreasDndDirective from "./app/directives/groupTable/evGcfAreasDndDirective";
import viewConstructorDragAndDropDirective from "./app/directives/viewConstructorDragAndDropDirective";
import gColumnSettingsBtnDirective from "./app/directives/groupTable/attributeSettingsMenus/gColumnSettingsBtnDirective";
import gGroupSettingsBtnDirective from "./app/directives/groupTable/attributeSettingsMenus/gGroupSettingsBtnDirective";
import gFilterSettingsBtnDirective from "./app/directives/groupTable/attributeSettingsMenus/gFilterSettingsBtnDirective";
import contentTitleDirective from "./app/directives/contentTitleDirective";
import valueTitleDirective from "./app/directives/valueTitleDirective";
import gLayoutsManagerComponent from "./app/directives/groupTable/gLayoutsManagerComponent";
import dashboardLayoutsManagerComponent from "./app/directives/dashboardLayoutsManagerComponent";
import gReportSettingsDialogController from "./app/controllers/dialogs/gReportSettingsDialogController";
import gEntityViewerSettingsDialogController from "./app/controllers/dialogs/gEntityViewerSettingsDialogController";
import periodsEditorDialogController from "./app/controllers/dialogs/periodsEditorDialogController";
import dateTreeDialogController from "./app/controllers/dialogs/dateTreeDialogController";
import gColumnNumbersRenderingSettingsDialogController from "./app/controllers/dialogs/gColumnNumbersRenderingSettingsDialogController";
import gModalComponent from "./app/directives/groupTable/gModalComponent";
import gModalReportComponent from "./app/directives/groupTable/gModalReportComponent";
import gModalReportPnlComponent from "./app/directives/groupTable/gModalReportPnlComponent";
import gModalReportTransactionComponent from "./app/directives/groupTable/gModalReportTransactionComponent";
import gModalReportPerformanceComponent from "./app/directives/groupTable/gModalReportPerformanceComponent";
import gModalReportCashFlowProjectionComponent from "./app/directives/groupTable/gModalReportCashFlowProjectionComponent";
import gTopPartDirective from "./app/directives/groupTable/gTopPartDirective";
import gEvLeftPanelDirective from "./app/directives/groupTable/gEvLeftPanelDirective";
import gEvLeftPanelTreeElemDirective from "./app/directives/groupTable/gEvLeftPanelTreeElemDirective";
import entityViewerFieldResolverDirective from "./app/directives/entityViewerFieldResolverDirective";
import entityViewerSelectorResolverDirective from "./app/directives/entityViewerSelectorResolverDirective";
import instrumentSchemeManagerFieldResolverDirective from "./app/directives/instrumentSchemeManagerFieldResolverDirective";
import floatNumbersDirective from "./app/directives/floatNumbersDirective";
import instrumentModalResolverDirective from "./app/directives/instrumentModalResolverDirective";
import commonSelectDirective from "./app/directives/commonSelectDirective";
import ttypeActionsInputsSelectDirective from "./app/directives/ttypeActionsInputsSelectDirective";
import ttypeActionsRelationsSelectDirective from "./app/directives/ttypeActionsRelationsSelectDirective";
import entitySearchSelect from "./app/directives/customInputs/entitySearchSelect";
import crudSelect from "./app/directives/crudSelect";
import finmarsPlaybookDirective from "./app/directives/finmarsPlaybookDirective";
import pythonEditorDirective from "./app/directives/pythonEditorDirective";
import javascriptEditorDirective from "./app/directives/javascriptEditorDirective";
import jsonEditorDirective from "./app/directives/jsonEditorDirective";
import taskCardDirective from "./app/directives/taskCardDirective";
import usercodeInputDirective from "./app/directives/usercodeInputDirective";
import twoFieldsMultiselectDirective from "./app/directives/twoFieldsMultiselectDirective";
import twoFieldsOptionsDirective from "./app/directives/twoFieldsOptionsDirective";
import tableAttributeSelectorDirective from "./app/directives/tableAttributeSelectorDirective";
import tableAttributesMenuConstructorDirective from "./app/directives/tableAttributesMenuConstructorDirective";
import expandableItemsSelectorDirective from "./app/directives/expandableItemsSelectorDirective";
import instrumentEventActionResolverDirective from "./app/directives/instrumentEventActionResolverDirective";
import classifierModalResolverDirective from "./app/directives/classifierModalResolverDirective";
import zhDatePickerDirective from "./app/directives/zhDatePickerDirective";
import complexZhDatePickerDirective from "./app/directives/customInputs/complexDatepickers/complexZhDatePickerDirective";
import complexDatepickerDirective from "./app/directives/customInputs/complexDatepickers/complexDatepickerDirective";
import dateTreeInputDirective from "./app/directives/dateTreeInputDirective";
import dragDialogDirective from "./app/directives/dragDialogDirective";
import membersGroupsTableDirective from "./app/directives/membersGroupsTableDirective";
import inputFileDirective from "./app/directives/inputFileDirective";
import bookmarksDirective from "./app/directives/bookmarksDirective";
import numberFormatMenuDirective from "./app/directives/numberFormatMenuDirective";
import isDraggableSignDirective from "./app/directives/isDraggableSignDirective";
import dialogWindowResizerDirective from "./app/directives/dialogWindowResizerDirective";
import customPopupDirective from "./app/directives/customPopupDirective";
import chipsListDirective from "./app/directives/chipsListDirective";
import onRepeatElemInit from "./app/directives/onRepeatElemInit";
import textInputDirective from "./app/directives/customInputs/textInputDirective";
import numberInputDirective from "./app/directives/customInputs/numberInputDirective";
import dateInputDirective from "./app/directives/customInputs/dateInputDirective";
import datetimeInputDirective from "./app/directives/customInputs/datetimeInputDirective";
import expressionInputDirective from "./app/directives/customInputs/expressionInputDirective";
import dropdownSelectDirective from "./app/directives/customInputs/dropdownSelectDirective";
import instrumentSelectDirective from "./app/directives/customInputs/instrumentSelectDirective";
import unifiedDataSelectDirective from "./app/directives/customInputs/unifiedDataSelectDirective";
import classifierSelectDirective from "./app/directives/customInputs/classifierSelectDirective";
import multitypeFieldDirective from "./app/directives/customInputs/multitypeFieldDirective";
import dropdownSelect2Directive from "./app/directives/customInputs/dropdownSelect2Directive";
import gridTableDirective from "./app/directives/gridTable/gridTableDirective";
import gridTableTopPanelDirective from "./app/directives/gridTable/gridTableTopPanelDirective";
import gridTableCellDirective from "./app/directives/gridTable/gridTableCellDirective";
import gridTableHeaderCellDirective from "./app/directives/gridTable/cells/gridTableHeaderCellDirective";
import gridTablePopupCellDirective from "./app/directives/gridTable/cells/gridTablePopupCellDirective";
import gridTableMultiselectorCellDirective from "./app/directives/gridTable/cells/gridTableMultiselectorCellDirective";
import trustAsHtmlFilter from "./app/filters/trustAsHtmlFilter";
import trustAsUrlFilter from "./app/filters/trustAsUrlFilter";
import strLimitFilter from "./app/filters/strLimitFilter";
import propsFilter from "./app/filters/propsFilter";

/* require('../../forum/scripts/main.js');
require('../../profile/scripts/main.js'); */
/*import middlewareService from "../../shell/scripts/app/services/middlewareService";
import authorizerService from '../../shell/scripts/app/services/authorizerService.js';*/
//# region Services and helpers for them

import angularDragula from 'angular-dragula';
import 'mdPickers';
import 'v-accordion';
import 'angular-paging'
import 'ui-select'


// VUE 3 Integration
// import {FinmarsButton} from '@finmars/ui';
// import '@finmars/ui/dist/finmars-ui.css';
// import {vueClassConverter} from './vue-helper.js';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import masterUserService from "./app/services/masterUserService";

import uiService from "./app/services/uiServiceNew";
import metaContentTypesService from "./app/services/metaContentTypesService";
import customFieldService from "./app/services/reports/customFieldService";
import attributeTypeService from "./app/services/attributeTypeServiceNew";
import metaRestrictionsService from "./app/services/metaRestrictionsService";
import ecosystemDefaultService from "./app/services/ecosystemDefaultService";

import transactionTypeService from "./app/services/transactionTypeServiceNew";
import instrumentService from "./app/services/instrumentService";
import reportService from "./app/services/reportService";
import priceHistoryService from "./app/services/priceHistoryService";
import currencyHistoryService from "./app/services/currencyHistoryService";
import entityResolverService from "./app/services/entityResolverServiceNew";
import fieldResolverService from "./app/services/fieldResolverService";
import pricesCheckerService from "./app/services/reports/pricesCheckerService";
import expressionService from "./app/services/expression.serviceNew";
import customInputsService from "./app/services/customInputsService";

import finmarsDatabaseService from "./app/services/finmarsDatabaseService";
import configurationImportGetService from "./app/services/configuration-import/configurationImportGetService";
import configurationImportMapService from "./app/services/configuration-import/configurationImportMapService";
import configurationImportSyncService from "./app/services/configuration-import/configurationImportSyncService";
import configurationImportService from "./app/services/configuration-import/configurationImportService";
import transactionImportSchemeService from "./app/services/import/transactionImportSchemeService";

import dashboardHelper from "./app/helpers/dashboard.helper.js";
import evRvLayoutsHelper from "./app/helpers/evRvLayoutsHelper";
import reportHelper from "./app/helpers/reportHelper";
import gFiltersHelper from "./app/helpers/gFiltersHelper";
import rvDataProviderService from "./app/services/rv-data-provider/rv-data-provider.service";
import groupsService from "./app/services/rv-data-provider/groups.service";
import objectsService from "./app/services/rv-data-provider/objects.service";
import reconDataProviderService from "./app/services/recon-data-provider/recon-data-provider.service";
import configurationService from "./app/services/configurationService";
import specificDataService from "./app/services/specificDataService";
import userFilterService from "./app/services/rv-data-provider/user-filter.service";
import dashboardConstructorMethodsService
    from "./app/services/dashboard-constructor/dashboardConstructorMethodsService";
import priceHistoryErrorService from "./app/services/pricing/priceHistoryErrorService";

import utilsService from "./app/services/utilsService";
//# endregion Services and helpers for them
import portalController from './app/controllers/portalController.js';
import enterUserCodeDialogController from "./app/controllers/dialogs/enterUserCodeDialogController.js";
import portfolioRegisterDialogController from "./app/controllers/dialogs/portfolioRegisterDialogController";
import dashboard2ReportViewerComponentMatrixController
    from "./app/controllers/dashboard/_version2/reportViewer/componentMatrixController";
import systemPageController from "./app/controllers/pages/systemPageController";
import attributesSelectorDialogController from "./app/controllers/dialogs/attributesSelectorDialogController";
import splitPanelReportViewerWidgetController
    from "./app/controllers/entityViewer/splitPanelReportViewerWidgetController";

import gColumnResizerComponent from "./app/directives/groupTable/gColumnResizerComponent";
import dialogHeaderDirective from "./app/directives/dialogHeaderDirective";

//# region form tabs
import instrumentTypePricingTabController
    from "./app/controllers/tabs/instrument-type/instrumentTypePricingTabController.js";
import portfolioPerformanceTabController from "./app/controllers/tabs/portfolio/performanceTabController.js"
//# endregion form tabs
import mainHeaderDirective from "./app/directives/mainHeaderDirective.js";

import complexDropdownSelectDirective from "./app/directives/customInputs/complexDropdownSelectDirective";
import complexDropdownSelectMenuDirective from "./app/directives/customInputs/complexDropdownSelectMenuDirective";
import baseInputDirective from "./app/directives/customInputs/baseInputDirective";
import multiinputFieldDirective from "./app/directives/customInputs/multiinputFieldDirective";
import entityNamesFieldDirective from "./app/directives/customInputs/entityNamesFieldDirective";
import closeDialogButtonDirective from "./app/directives/closeDialogButtonDirective";

import * as Sentry from "@sentry/browser";
import {Angular as AngularIntegration} from "@sentry/integrations";

// Set up pdfjsLib globally if necessary
window.pdfjsLib = pdfjsLib;

// VUE 3 Integration
// import {FinmarsButton} from '@finmars/ui';
// import {vueClassConverter} from './vue-helper.js';

// noinspection JSVoidFunctionReturnValueUsed
export default function () {

    let modules = [

        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ngMdIcons',
        'ngResource',
        'ngSanitize',
        'mdPickers',  // Time picker in Automated upload schedule history
        'vAccordion', // Accordion in Transaction Type Actions
        'ui.router',
        'bw.paging', // Pagination in Forum
        'ui.select', // Tags control in Transaction Type
        // 'ui.scroll', // Infinite scroll in Mapping Dialog

        angularDragula(angular), // Drag in Drop in Entity Viewer / Report Viewer/ View Constructor/ Form Editor

        /*'forum',
        'profile'*/
    ]

    if (window.location.href.indexOf('space00000') === -1) {
        Sentry.init({
            dsn: window.SENTRY_DSN,
            integrations: [new AngularIntegration()],
        });

        modules.push('ngSentry')
    }

    let portal = angular.module('finmars.portal', modules);


    portal.config(['$stateProvider', router]);
    /* portal.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('YYYY-MM-DD');
        };
    }]); */

    portal.factory('pickmeup', ['$window', function ($window) {
        if ($window.pickmeup) {
            return $window.pickmeup;
        }
    }]);

    portal.factory('d3Service', ['$window', function ($window) {
        if ($window.d3) {
            return $window.d3;
        }
    }]);

    portal.factory('Pickr', ['$window', function ($window) {
        if ($window.Pickr) {
            return $window.Pickr;
        }
    }]);

    portal.factory('templateLoader', ['$templateCache', '$http', function ($templateCache, $http) {
        return {
            loadTemplate: function (templateUrl) {
                // Check if the template is in $templateCache
                let template = $templateCache.get(templateUrl);

                if (template) {
                    // Return a promise resolved with the template
                    return Promise.resolve(template);
                } else {
                    // Fetch the template from the URL
                    return $http.get(templateUrl, {cache: true})
                        .then(response => {
                            // Put the fetched template in $templateCache
                            $templateCache.put(templateUrl, response.data);
                            return response.data;
                        })
                        .catch(error => {
                            console.error('Error loading template:', error);
                            throw error;
                        });
                }
            }
        };
    }]);

    portal.service('$customDialog', ['$rootScope', '$templateCache', '$compile', '$controller', customDialogService]);
    portal.service('$bigDrawer', ['$rootScope', '$templateCache', '$compile', '$controller', 'templateLoader', bigDrawerService]);

    /* portal.service('authorizerService', [authorizerService]);
    portal.service('middlewareService', [middlewareService]); */
    portal.service('masterUserService', ['cookieService', 'xhrService', masterUserService]);
    portal.service('ecosystemDefaultService', ['cookieService', 'xhrService', ecosystemDefaultService]);
    portal.service('uiService', ['cookieService', 'xhrService', 'ecosystemDefaultService', 'metaContentTypesService', 'globalDataService', uiService]);
    portal.service('metaContentTypesService', ['cookieService', 'xhrService', metaContentTypesService]);
    portal.service('customFieldService', ['cookieService', 'xhrService', customFieldService]);
    portal.service('metaRestrictionsService', [metaRestrictionsService]);
    portal.service('attributeTypeService', ['cookieService', 'xhrService', 'metaRestrictionsService', attributeTypeService]);

    portal.service('transactionTypeService', ['cookieService', 'xhrService', transactionTypeService]);
    portal.service('instrumentService', ['cookieService', 'toastNotificationService', 'xhrService', 'uiService', 'gridTableHelperService', 'multitypeFieldService', instrumentService]);
    portal.service('reportService', ['cookieService', 'xhrService', reportService]);
    portal.service('priceHistoryService', ['cookieService', 'xhrService', priceHistoryService]);
    portal.service('currencyHistoryService', ['cookieService', 'xhrService', currencyHistoryService]);
    portal.service('pricesCheckerService', ['cookieService', 'xhrService', pricesCheckerService]);
    portal.service('entityResolverService', ['instrumentService', 'transactionTypeService', 'priceHistoryService', 'currencyHistoryService', 'configurationService', 'reportService', 'transactionImportSchemeService', 'priceHistoryErrorService', entityResolverService]);
    portal.service('fieldResolverService', ['instrumentService', 'transactionTypeService', 'metaContentTypesService', fieldResolverService]);
    portal.service('expressionService', ['cookieService', 'xhrService', expressionService]);
    portal.service('dashboardConstructorMethodsService', ['uiService', 'dashboardHelper', dashboardConstructorMethodsService]);
    portal.service('utilsService', ['cookieService', 'xhrService', utilsService]);
    portal.service('configurationService', ['cookieService', 'xhrService', configurationService]);
    portal.service('specificDataService', ['cookieService', 'xhrService', specificDataService]);
    portal.service('userFilterService', [userFilterService]);
    portal.service('finmarsDatabaseService', ['cookieService', 'xhrService', finmarsDatabaseService]);
    portal.service('customInputsService', [customInputsService]);
    portal.service('priceHistoryErrorService', ['cookieService', 'xhrService', priceHistoryErrorService]);

    //# region Services for import and export
    portal.service('configurationImportGetService', ['entityResolverService', 'customFieldService', 'attributeTypeService', 'transactionTypeService', configurationImportGetService]);
    portal.service('configurationImportMapService', ['metaContentTypesService', 'attributeTypeService', 'uiService', 'configurationImportGetService', configurationImportMapService]);
    portal.service('configurationImportSyncService', ['metaContentTypesService', 'configurationImportGetService', 'configurationImportMapService', configurationImportSyncService]);
    portal.service('configurationImportService', ['metaContentTypesService', 'attributeTypeService', 'customFieldService', 'entityResolverService', 'uiService', 'transactionImportSchemeService', 'configurationImportGetService', 'configurationImportMapService', 'configurationImportSyncService', configurationImportService]);
    portal.service('importSchemesMethodsService', ['$mdDialog', importSchemesMethodsService]);

    portal.service('transactionImportSchemeService', ['cookieService', 'xhrService', transactionImportSchemeService]);
    //# endregion Services for import and export

    // portal.service('uiService', ['localStorageService', uiService]);
    portal.service('multitypeFieldService', [multitypeFieldService]);
    portal.service('evRvDomManagerService', [evRvDomManagerService]);
    portal.service('entityDataConstructorService', [entityDataConstructorService]);

    portal.service('gFiltersHelper', [gFiltersHelper]);
    portal.service('gridTableHelperService', ['multitypeFieldService', gridTableHelperService]);

    //# region desc="Helpers">
    portal.service('evRvLayoutsHelper', ['toastNotificationService', 'metaContentTypesService', 'uiService', evRvLayoutsHelper]);
    portal.service('dashboardHelper', ['toastNotificationService', 'uiService', 'evRvLayoutsHelper', dashboardHelper]);
    portal.service('reportHelper', ['expressionService', reportHelper]);
    portal.service('groupsService', ['entityResolverService', groupsService])
    portal.service('objectsService', ['entityResolverService', objectsService])

    portal.service('rvDataProviderService', ['entityResolverService', 'pricesCheckerService', 'reportHelper', 'groupsService', 'objectsService', rvDataProviderService]);
    portal.service('reconDataProviderService', ['entityResolverService', 'reportHelper', reconDataProviderService]);
    //# endregion Helpers

    //# region Dashboard
    portal.component('dashboardEntityViewer', dashboardEntityViewerComponent);

    portal.controller('DashboardLayoutManagerController', ['$scope', '$mdDialog', dashboardLayoutManagerController]);

    portal.controller('DashboardConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', 'toastNotificationService', 'metaContentTypesService', 'customFieldService', 'attributeTypeService', 'uiService', dashboardConstructorController]);
    portal.controller('DashboardConstructorSocketSettingsDialogController', ['$scope', '$mdDialog', 'dashboardConstructorDataService', 'dashboardConstructorEventService', 'attributeDataService', 'data', dashboardConstructorSocketSettingsDialogController]);

    // DEPRECATED SINCE 01.2021
    portal.controller('DashboardConstructorAccordionEditorDialogController', ['$scope', '$mdDialog', 'data', dashboardConstructorAccordionEditorDialogController]);

    portal.controller('DashboardConstructorAccordionComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'data', dashboardConstructorAccordionComponentDialogController]);
    portal.controller('DashboardConstructorControlComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'reportHelper', 'dashboardHelper', 'entityResolverService', 'item', 'dataService', 'multitypeFieldService', 'data', dashboardConstructorControlComponentDialogController]);
    portal.controller('DashboardConstructorControlDateComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'reportHelper', 'dashboardHelper', 'entityResolverService', 'item', 'dataService', 'multitypeFieldService', 'data', dashboardConstructorControlDateComponentDialogController]);
    portal.controller('DashboardConstructorControlRelationComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'reportHelper', 'dashboardHelper', 'entityResolverService', 'item', 'dataService', 'multitypeFieldService', 'data', dashboardConstructorControlRelationComponentDialogController]);
    portal.controller('DashboardConstructorButtonSetComponentDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'transactionTypeService', 'uiService', 'transactionImportSchemeService', 'dashboardConstructorMethodsService', 'item', 'dataService', dashboardConstructorButtonSetComponentDialogController]);
    portal.controller('DashboardConstructorSupersetDashboardComponentDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', 'dashboardConstructorMethodsService', 'item', 'dataService', 'eventService', dashboardConstructorSupersetDashboardComponentDialogController]);
    portal.controller('DashboardConstructorInputFormComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', dashboardConstructorInputFormComponentDialogController]);
    portal.controller('DashboardConstructorFinmarsWidgetComponentDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', 'dashboardConstructorMethodsService', 'item', 'dataService', 'eventService', dashboardConstructorFinmarsWidgetComponentDialogController]);


    portal.controller('DashboardConstructorReportViewerComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'dashboardHelper', 'evRvLayoutsHelper', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', dashboardConstructorReportViewerComponentDialogController]);
    portal.controller('DashboardConstructorReportViewerMatrixComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'dashboardHelper', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', dashboardConstructorReportViewerMatrixComponentDialogController]);
    portal.controller('DashboardConstructorApexChartComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'dashboardHelper', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', dashboardConstructorApexChartComponentDialogController]);
    portal.controller('DashboardConstructorIframeComponentDialogController', ['$scope', '$mdDialog', 'uiService', 'dashboardConstructorMethodsService', 'dashboardHelper', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', dashboardConstructorIframeComponentDialogController]);

    portal.controller('DashboardConstructorEntityViewerComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', dashboardConstructorEntityViewerComponentDialogController]);
    portal.controller('DashboardConstructorEntityViewerSplitPanelComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', dashboardConstructorEntityViewerSplitPanelComponentDialogController]);

    portal.controller('DashboardReportViewerComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', dashboardReportViewerComponentSettingsDialogController]);
    portal.controller('DashboardReportViewerMatrixComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', dashboardReportViewerMatrixComponentSettingsDialogController]);

    portal.directive('dashboardConstructorField', ['$mdDialog', dashboardConstructorFieldDirective]);
    portal.directive('dashboardConstructorGridAligner', [dashboardConstructorGridAlignerDirective]);

    portal.controller('DashboardController', ['$scope', '$stateParams', '$mdDialog', dashboardController]);

    portal.directive('dashboardGridAligner', [dashboardGridAlignerDirective]);

    portal.directive('dashboardAccordion', ['$mdDialog', '$state', dashboardAccordionDirective]);
    portal.directive('dashboardButtonSet', ['$mdDialog', '$state', 'transactionImportSchemeService', dashboardButtonSetDirective]);
    portal.directive('dashboardControl', ['metaContentTypesService', 'entityResolverService', 'uiService', 'reportHelper', dashboardControlDirective]);
    portal.directive('dashboardControlDate', ['metaContentTypesService', 'entityResolverService', 'uiService', 'reportHelper', dashboardControlDateDirective]);
    portal.directive('dashboardControlRelation', ['metaContentTypesService', 'entityResolverService', 'uiService', 'reportHelper', dashboardControlRelationDirective]);
    portal.directive('dashboardEntityViewer', [dashboardEntityViewerDirective]);
    portal.directive('dashboardEntityViewerSplitPanel', [dashboardEntityViewerSplitPanelDirective]);
    portal.directive('dashboardInputForm', [dashboardInputFormDirective]);
    portal.directive('dashboardReportViewer', ['$mdDialog', 'dashboardHelper', 'metaContentTypesService', dashboardReportViewerDirective]);
    portal.directive('dashboardReportViewerMatrix', ['$mdDialog', 'uiService', 'dashboardHelper', 'metaContentTypesService', 'reportHelper', dashboardReportViewerMatrixDirective]);
    portal.directive('dashboardApexChart', ['$mdDialog', 'dashboardHelper', 'entityResolverService', dashboardApexChartDirective]);
    portal.directive('dashboardIframe', ['$mdDialog', 'dashboardHelper', 'globalDataService', dashboardIframeDirective]);
    portal.directive('dashboardSupersetDashboard', ['$mdDialog', '$state', dashboardSupersetDashboardDirective]);
    portal.directive('dashboardFinmarsWidget', ['$mdDialog', '$state', 'globalDataService', dashboardFinmarsWidgetDirective]);

    portal.controller('DashboardShowStateDialogController', ['$scope', '$mdDialog', 'data', dashboardShowStateDialogController]);


    portal.controller('DashboardReportViewerController', ['$scope', '$mdDialog', 'toastNotificationService', 'usersService', 'globalDataService', 'priceHistoryService', 'currencyHistoryService', 'metaContentTypesService', 'customFieldService', 'attributeTypeService', 'uiService', 'pricesCheckerService', 'expressionService', 'rvDataProviderService', 'reportHelper', 'gFiltersHelper', 'dashboardHelper', dashboardReportViewerController]);

    portal.directive('reportViewerMatrix', ['$mdDialog', 'groupsService', reportViewerMatrixDirective]);
    portal.directive('reportViewerTableChart', ['$mdDialog', reportViewerTableChartDirective]);
    portal.directive('reportViewerBarsChart', ['d3Service', reportViewerBarsChart]);
    portal.directive('reportViewerPieChart', ['d3Service', reportViewerPieChart]);


    portal.controller('DashboardLayoutListDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'backendConfigurationImportService', 'data', layoutListDialogController]);
    portal.controller('DashboardLayoutExportDialogController', ['$scope', '$mdDialog', 'data', dashboardLayoutExportDialogController]);

    portal.controller('Dashboard2RvMatrixController', ['$scope', '$uiRouterGlobals', 'metaContentTypesService', dashboard2ReportViewerComponentMatrixController]);
    //# endregion desc="Dashboard">

    // Common
    // portal.controller('ShellController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdDialog', '$transitions', require('./app/controllers/shellController')]);
    portal.controller('PortalController', ['$scope', '$state', '$transitions', '$urlService', 'authorizerService', 'usersService', 'globalDataService', 'redirectionService', 'middlewareService', 'uiService', 'configurationService', portalController]);
    portal.controller('BookmarksController', ['$scope', '$mdDialog', '$state', 'toastNotificationService', bookmarksController]);
    portal.controller('SideNavController', ['$scope', '$interval', '$mdDialog', '$transitions', 'usersService', 'globalDataService', 'redirectionService', 'uiService', sideNavController]);
    portal.controller('AlertSideNavController', ['$scope', 'globalDataService', 'systemMessageService', alertSideNavController]);
    portal.controller('HomeController', ['$scope', '$state', '$mdDialog', 'authorizerService', 'usersService', 'globalDataService', 'systemMessageService', 'redirectionService', homeController]);
    portal.controller('SystemPageController', ['$scope', '$mdDialog', 'toastNotificationService', 'authorizerService', 'globalDataService', 'masterUserService', 'utilsService', systemPageController]);
    portal.controller('RecycleBinPageController', ['$scope', '$state', '$stateParams', '$mdDialog', 'globalDataService', 'utilsService', recycleBinPageController]);
    portal.controller('TasksPageController', ['$scope', '$state', '$mdDialog', 'toastNotificationService', tasksPageController]);
    // portal.controller('SetupController', ['$scope', '$state', 'usersService', require('./app/controllers/setupController')]);
    portal.controller('NotFoundPageController', ['$scope', notFoundPageController]);
    portal.controller(
        'EntityDataConstructorDialogController',
        ['$scope', '$stateParams', '$state', '$mdDialog', 'toastNotificationService', 'metaContentTypesService', 'attributeTypeService', 'uiService', 'entityDataConstructorService', 'data',
            entityDataConstructorDialogController]
    );
    portal.controller('EntityViewerFormsPreviewDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'instrumentService', 'entityResolverService', 'fieldResolverService', 'attributeTypeService', 'uiService', 'inputFormTabs', 'data', entityViewerFormsPreviewDialogController]);
    portal.controller('ComplexTransactionFormsPreviewDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'attributeTypeService', 'inputFormTabs', 'data', complexTransactionFormsPreviewDialogController]);
    portal.controller('EvFormInstrumentTableSettingsDialogController', ['$scope', '$mdDialog', 'gridTableHelperService', 'data', evFormInstrumentTableSettingsDialogController]);
    portal.controller('ExpressionEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', expressionEditorDialogController]);
    portal.controller('AceEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', aceEditorDialogController]);
    portal.controller('JsonEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', jsonEditorDialogController]);
    portal.controller('EntityAsJsonEditorDialogController', ['$scope', '$mdDialog', 'data', entityAsJsonEditorDialogController]);
    portal.controller('UseFromAboveDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', useFromAboveDialogController]);
    portal.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog', 'instrumentService', instrumentSelectDialogController]);
    portal.controller('EntitySearchDialogController', ['$scope', '$mdDialog', 'data', entitySearchDialogController]);
    portal.controller('TwoFieldsMultiselectDialogController', ['$scope', '$mdDialog', 'data', twoFieldsMultiselectDialogController]);
    portal.controller('TableAttributeSelectorDialogController', ['$scope', '$mdDialog', 'data', tableAttributeSelectorDialogController]);
    portal.controller('AttributesSelectorDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'uiService', 'globalDataService', 'data', attributesSelectorDialogController]);
    portal.controller('TableAttributesMenuConstructorDialogController', ['$scope', '$mdDialog', 'data', tableAttributesMenuConstructorDialogController]);
    portal.controller('LayoutChangesLossWarningDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'data', layoutChangesLossWarningDialogController]);
    portal.controller('ClassifierSelectDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', classifierSelectDialogController]);
    portal.directive('classifierTree', [classifierTreeDirective]);
    portal.directive('classifierTreeNode', [classifierTreeNodeDirective]);
    portal.controller('ExpandableItemsSelectorDialogController', ['$scope', '$mdDialog', 'data', expandableItemsSelectorDialogController]);
    portal.controller('SaveLayoutDialogController', ['$scope', '$mdDialog', saveLayoutDialogController]);
    portal.controller('RenameFieldDialogController', ['$scope', '$mdDialog', 'data', renameFieldDialogController]);
    portal.controller('ResizeFieldDialogController', ['$scope', '$mdDialog', 'data', resizeFieldDialogController]);
    portal.controller('SaveConfigurationExportLayoutDialogController', ['$scope', '$mdDialog', 'uiService', 'data', saveConfigurationExportLayoutDialogController]);
    portal.controller('ActionsNotificationsSettingsDialogController', ['$scope', '$mdDialog', 'usersService', 'globalDataService', actionsNotificationsSettingsDialogController]);
    portal.controller('ExportPdfDialogController', ['$scope', '$mdDialog', 'globalDataService', 'uiService', 'reportHelper', 'evDataService', 'evEventService', 'data', exportPdfDialogController]);
    portal.controller('NotificationsController', ['$scope', '$state', '$stateParams', notificationsController]);
    portal.controller('HeaderNotificationsDialogController', ['$scope', '$mdDialog', headerNotificationsDialogController]);
    portal.controller('HelpDialogController', ['$scope', '$mdDialog', 'data', helpDialogController]);
    portal.controller('ValidationDialogController', ['$scope', '$mdDialog', 'validationData', validationDialogController]);
    portal.controller('CalculatorDialogController', ['$scope', '$mdDialog', 'data', calculatorDialogController]);
    portal.controller('TabsEditorDialogController', ['$scope', '$mdDialog', 'tabs', 'data', tabsEditorDialogController]);
    portal.controller('TextEditorDialogController', ['$scope', '$mdDialog', 'data', textEditorDialogController]);
    portal.controller('PortfolioRegisterDialogController', ['$scope', '$mdDialog', 'data', portfolioRegisterDialogController]);

    portal.controller('InputTemplateLayoutViewerDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'data', inputTemplateLayoutViewerDialogController]);
    portal.controller('TemplateLayoutManagerController', ['$scope', '$mdDialog', 'ecosystemDefaultService', 'metaContentTypesService', 'uiService', 'fieldResolverService', 'gridTableHelperService', templateLayoutManagerController]);
    portal.controller('NewLayoutDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'metaContentTypesService', 'data', newLayoutDialogController]);
    portal.controller('RenameDialogController', ['$scope', '$mdDialog', 'data', renameDialogController]);
    portal.controller('SaveAsDialogController', ['$scope', '$mdDialog', 'data', saveAsDialogController]);
    portal.controller('LoaderDialogController', ['$scope', '$customDialog', 'data', loaderDialogController]);

    portal.controller('ContextMenuLayoutManagerController', ['$scope', '$mdDialog', contextMenuLayoutManagerController]);
    portal.controller('ContextMenuConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', 'toastNotificationService', 'metaContentTypesService', 'uiService', contextMenuConstructorController]);
    portal.controller('ContextMenuOptionSettingsDialogController', ['$scope', '$mdDialog', 'data', contextMenuOptionSettingsDialogController]);
    portal.directive('contextMenuConstructorOption', [contextMenuConstructorOptionDirective]);

    portal.controller('UniversalInputDialogController', ['$scope', '$mdDialog', 'utilsService', 'data', universalInputDialogController]);
    portal.controller('BulkJsonViewDialogController', ['$scope', '$mdDialog', 'data', bulkJsonViewDialogController]);

    portal.controller('InstrumentSelectDatabaseDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'instrumentService', 'data', instrumentSelectDatabaseDialogController]);
    portal.controller('UnifiedSelectDatabaseDialogController', ['$scope', '$mdDialog', 'finmarsDatabaseService', 'data', unifiedSelectDatabaseDialogController]);


    portal.controller('EcosystemDefaultSettingsController', ['$scope', '$mdDialog', 'toastNotificationService', 'usersService', 'ecosystemDefaultService', 'fieldResolverService', ecosystemDefaultSettingsController]);

    // Dialog selectors
    portal.controller('ItemsSelectorWithGroupsDialogController', ['$scope', '$mdDialog', 'data', itemsSelectorWithGroupsDialogController]);

    portal.controller('DraftDialogController', ['$scope', '$mdDialog', 'data', draftDialogController]);

    // Common - unknown
    portal.controller('NumberFormatSettingsDialogController', ['$scope', '$element', '$mdDialog', 'data', numberFormatSettingsDialogController]);
    // Victor 20210601 #115 new design for number format dialog
    // portal.controller('NumberFormatDialogController', ['$scope', '$element', '$mdDialog', 'data', require('./app/controllers/dialogs/numberFormatDialogController')]);
    portal.controller('ReportViewerMatrixSettingsDialogController', ['$scope', '$mdDialog', 'data', reportViewerMatrixSettingsDialogController]);
    portal.controller('EnterUserCodeDialogController', ['$scope', '$mdDialog', 'data', enterUserCodeDialogController]);

    portal.controller('FillPriceManuallyInstrumentDialogController', ['$scope', '$mdDialog', 'instrumentService', 'priceHistoryService', 'currencyHistoryService', 'data', fillPriceManuallyInstrumentDialogController]);
    portal.controller('FloatCustomFieldConstructorController', ['$scope', floatCustomFieldConstructorController]);
    portal.controller('DateCustomFieldConstructorController', ['$scope', dateCustomFieldConstructorController]);
    portal.controller('AuditController', ['$scope', auditController]);
    portal.controller('SettingsFormDesignController', ['$scope', '$state', settingsFormDesignController]);
    portal.controller('SettingBloombergImportInstrumentController', ['$scope', '$state', settingBloombergImportInstrumentController]);

    portal.controller('ClassifierImportDialogController', ['$scope', '$mdDialog', 'data', classifierImportDialogController]);
    portal.controller('ClassifierExportDialogController', ['$scope', '$mdDialog', 'data', classifierExportDialogController]);
    portal.controller('LayoutExportDialogController', ['$scope', '$mdDialog', 'data', layoutExportDialogController]);
    portal.controller('FileReportsController', ['$scope', '$mdDialog', fileReportsController]);
    /* Use 'app.authentication' state instead
    portal.controller('LoginDialogController', ['$scope', '$mdDialog', 'authorizerService', 'data', require('./app/controllers/dialogs/loginDialogController')]);
    */
    portal.controller('HealthcheckController', ['$scope', healthcheckController]);

    portal.controller('TwoFactorLoginDialogController', ['$scope', '$mdDialog', 'username', 'password', twoFactorLoginDialogController]);

    // System Dialogs

    // portal.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/warningDialogController')]);
    portal.controller('SuccessDialogController', ['$scope', '$mdDialog', 'success', successDialogController]);
    portal.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', infoDialogController]);
    portal.controller('FilePreviewDialogController', ['$scope', '$mdDialog', 'data', filePreviewDialogController]);
    portal.controller('FileEditDialogController', ['$scope', '$mdDialog', 'data', fileEditDialogController]);
    portal.controller('SystemErrorLogDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', systemErrorLogDialogController]);
    portal.controller('LogDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', logDialogController]);
    portal.controller('HistoryDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', historyDialogController]);

    portal.controller('SimpleLoginDialogController', ['$scope', '$mdDialog', 'data', simpleLoginDialogController]);

    // Configuration

    portal.controller('ConfigurationDialogController', ['$scope', '$mdDialog', 'globalDataService', 'toastNotificationService', 'configurationService', 'data', configurationDialogController]);
    portal.controller('MarketplaceConfigurationDialogController', ['$scope', '$mdDialog', 'globalDataService', 'toastNotificationService', 'configurationService', 'data', marketplaceConfigurationDialogController]);


    // Actions

    portal.controller('ActionsController', ['$scope', '$mdDialog', actionsController]);
    portal.controller('FillPriceHistoryDialogController', ['$scope', '$mdDialog', fillPriceHistoryDialogController]);
    portal.controller('EventScheduleConfigDialogController', ['$scope', '$mdDialog', eventScheduleConfigDialogController]);
    portal.controller('PriceDownloadSchemeAddDialogController', ['$scope', '$mdDialog', priceDownloadSchemeAddDialogController]);
    portal.controller('DefaultPricingConfigDialogController', ['$scope', '$mdDialog', defaultPricingConfigDialogController]);

    // Instrument Download

    portal.controller('InstrumentDownloadDialogController', ['$scope', '$mdDialog', 'instrumentService', 'data', instrumentDownloadDialogController]);
    portal.controller('InstrumentDownloadSchemeAddDialogController', ['$scope', '$mdDialog', 'importSchemesMethodsService', instrumentDownloadSchemeAddDialogController]);
    portal.controller('InstrumentDownloadSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', 'importSchemesMethodsService', instrumentDownloadSchemeEditDialogController]);

    // Simple Entity Import

    portal.controller('SimpleEntityImportDialogController', ['$scope', '$mdDialog', 'usersService', 'metaContentTypesService', 'data', simpleEntityImportDialogController]);
    portal.controller('SimpleEntityImportErrorsDialogController', ['$scope', '$mdDialog', 'data', simpleEntityImportErrorsDialogController]);
    portal.controller('SimpleEntityImportSchemeEditDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'attributeTypeService', 'schemeId', 'importSchemesMethodsService', simpleEntityImportSchemeEditDialogController]);
    portal.controller('SimpleEntityImportSchemeV2EditDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'metaContentTypesService', 'attributeTypeService', 'importSchemesMethodsService', 'data', simpleEntityImportSchemeV2EditDialogController]);
    portal.controller('SimpleEntityImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'metaContentTypesService', 'attributeTypeService', 'data', 'importSchemesMethodsService', simpleEntityImportSchemeCreateDialogController]);

    // Complex Import

    portal.controller('ComplexImportDialogController', ['$scope', '$mdDialog', 'data', 'usersService', complexImportDialogController]);
    portal.controller('ComplexImportSchemeEditDialogController', ['$scope', '$mdDialog', 'transactionImportSchemeService', 'schemeId', complexImportSchemeEditDialogController]);
    portal.controller('ComplexImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'transactionImportSchemeService', 'data', complexImportSchemeCreateDialogController]);
    portal.controller('ComplexImportSchemeErrorsDialogController', ['$scope', '$mdDialog', 'data', complexImportSchemeErrorsDialogController]);
    portal.controller('ComplexImportValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', complexImportValidationErrorsDialogController]);

    // Transaction Import

    portal.controller('TransactionImportSchemeAddDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'ecosystemDefaultService', 'transactionTypeService', 'data', 'transactionImportSchemeService', 'importSchemesMethodsService', transactionImportSchemeAddDialogController]);
    portal.controller('TransactionImportSchemeEditDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'transactionTypeService', 'transactionImportSchemeService', 'importSchemesMethodsService', 'schemeId', transactionImportSchemeEditDialogController]);
    portal.controller('TransactionImportSchemeV2DialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'transactionTypeService', 'transactionImportSchemeService', 'importSchemesMethodsService', 'data', transactionImportSchemeV2DialogController]);
    portal.controller('TransactionImportSchemeInputsDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'transactionTypeService', 'data', transactionImportSchemeInputsDialogController]);
    portal.controller('TransactionImportDialogController', ['$scope', '$mdDialog', 'data', 'usersService', 'transactionImportSchemeService', transactionImportDialogController]);
    portal.controller('TransactionImportErrorsDialogController', ['$scope', '$mdDialog', 'data', transactionImportErrorsDialogController]);
    portal.controller('TransactionImportSchemeScenarioFieldsDialogController', ['$scope', '$mdDialog', 'data', transactionImportSchemeScenarioFieldsDialogController]);
    portal.controller('TransactionImportSchemeSelectorValuesDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', transactionImportSchemeSelectorValuesDialogController]);

    //# region Color palettes
    portal.controller('ColorPalettesSettingsController', ['$scope', '$mdDialog', 'data', colorPalettesSettingsController]);
    portal.controller('ColorPalettesSettingsDialogController', ['$scope', '$mdDialog', colorPalettesSettingsDialogController]);
    portal.controller('TwoInputsDialogController', ['$scope', '$mdDialog', 'data', twoInputsDialogController]);
    portal.controller('RenameColorDialogController', ['$scope', '$mdDialog', 'data', renameColorDialogController]);
    portal.controller('ColorPickerDialogController', ['$scope', '$mdDialog', 'data', colorPickerDialogController]);
    portal.controller('SelectColorDialogController', ['$scope', '$mdDialog', 'data', selectColorDialogController]);

    portal.directive('colorPicker', ['$mdDialog', colorPickerDirective]);
    //# endregion

    //# region Events
    portal.controller('CheckEventsController', ['$scope', '$mdDialog', checkEventsController]);
    portal.controller('CheckEventsDialogController', ['$scope', '$mdDialog', checkEventsDialogController]);
    portal.controller('EventWithReactDialogController', ['$scope', '$mdDialog', 'data', eventWithReactDialogController]);
    portal.controller('EventWithReactApplyDefaultConfirmDialogController', ['$scope', '$mdDialog', 'data', eventWithReactApplyDefaultConfirmDialogController]);
    portal.controller('EventDoNotReactDialogController', ['$scope', '$mdDialog', 'data', eventDoNotReactDialogController]);
    portal.controller('EventApplyDefaultDialogController', ['$scope', '$mdDialog', 'data', eventApplyDefaultDialogController]);
    //# endregion

    // Attribute Manager

    portal.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', attributesManagerController]);
    portal.controller('AttributesManagerDialogController', ['$scope', '$state', 'data', '$mdDialog', attributesManagerDialogController]);
    portal.controller('AttributeTypeDialogController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'metaContentTypesService', 'data', attributeTypeDialogController]);
    portal.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', classificationEditorDialogController]);
    portal.controller('CustomFieldsConfigDialogController', ['$scope', '$mdDialog', 'data', customFieldsConfigDialogController]);
    portal.controller('MoveExplorerDialogController', ['$scope', '$mdDialog', 'data', moveExplorerDialogController]);

    portal.controller('EntityTypeMappingDialogController', ['$scope', '$mdDialog', 'mapItem', entityTypeMappingDialogController]);
    portal.controller('EntityTypeClassifierMappingDialogController', ['$scope', '$mdDialog', 'options', entityTypeClassifierMappingDialogController]);

    //# region Entity Viewer & Report Viewer

    portal.controller('EntityViewerController', ['$scope', '$mdDialog', '$state', '$transitions', '$urlService', '$customDialog', '$bigDrawer', 'middlewareService', 'globalDataService', 'toastNotificationService', 'metaContentTypesService', 'instrumentService', 'customFieldService', 'attributeTypeService', 'entityResolverService', 'uiService', 'evRvLayoutsHelper', entityViewerController]);
    portal.controller('ReportViewerController', ['$scope', '$mdDialog', '$stateParams', '$transitions', 'toastNotificationService', 'middlewareService', 'globalDataService', 'priceHistoryService', 'currencyHistoryService', 'metaContentTypesService', 'customFieldService', 'attributeTypeService', 'uiService', 'pricesCheckerService', 'expressionService', 'rvDataProviderService', 'reportHelper', 'evRvLayoutsHelper', reportViewerController]);
    portal.controller('SplitPanelReportViewerController', ['$scope', '$mdDialog', '$transitions', 'toastNotificationService', 'globalDataService', 'priceHistoryService', 'currencyHistoryService', 'metaContentTypesService', 'customFieldService', 'attributeTypeService', 'rvDataProviderService', 'uiService', 'pricesCheckerService', 'expressionService', 'reportHelper', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', splitPanelReportViewerController]);
    portal.controller('SplitPanelReportViewerWidgetController', ['$scope', '$uiRouterGlobals', 'metaContentTypesService', splitPanelReportViewerWidgetController]);

    portal.controller('ReconciliationViewerController', ['$scope', '$mdDialog', '$transitions', 'metaContentTypesService', 'customFieldService', 'attributeTypeService', 'uiService', 'reconDataProviderService', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', reconciliationViewerController]);
    portal.controller(
        'EntityViewerAddDialogController',
        ['$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'authorizerService', 'usersService', 'usersGroupService', 'globalDataService', 'metaContentTypesService', 'instrumentService', 'priceHistoryService', 'entityResolverService', 'fieldResolverService', 'attributeTypeService', 'uiService', 'entityType', 'entity', 'data', 'configurationService', entityViewerAddDialogController]
    );
    portal.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'authorizerService', 'usersService', 'usersGroupService', 'metaContentTypesService', 'instrumentService', 'priceHistoryService', 'entityResolverService', 'fieldResolverService', 'attributeTypeService', 'uiService', 'configurationService', 'entityType', 'entityId', 'data', entityViewerEditDialogController]);
    portal.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', entityViewerDeleteDialogController]);
    portal.controller('EntityViewerDeleteBulkDialogController', ['$scope', '$mdDialog', 'entityResolverService', 'evDataService', 'evEventService', 'data', entityViewerDeleteBulkDialogController]);
    portal.controller('EntityViewerRestoreDeletedBulkDialogController', ['$scope', '$mdDialog', 'data', entityViewerRestoreDeletedBulkDialogController]);
    portal.controller('EvAddEditValidationDialogController', ['$scope', '$mdDialog', 'data', evAddEditValidationDialogController]);

    portal.controller('EntityViewerPermissionEditorController', ['$scope', '$mdDialog', '$transitions', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'usersService', 'usersGroupService', entityViewerPermissionEditorController]);

    portal.controller('PriceHistoryErrorEditDialogController', ['$scope', '$mdDialog', '$state', 'priceHistoryErrorService', 'entityId', priceHistoryErrorEditDialogController]);
    portal.controller('CurrencyHistoryErrorEditDialogController', ['$scope', '$mdDialog', '$state', 'entityId', currencyHistoryErrorEditDialogController]);

    portal.controller('ListLayoutExportDialogController', ['$scope', '$mdDialog', 'data', listLayoutExportDialogController]);
    //# endregion Entity Viewer & Report Viewer

    portal.controller('AceEditorPageController', ['$scope', '$state', '$mdDialog', aceEditorPageController]);


    // Instrument Type

    portal.controller(
        'InstrumentTypeAddDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'authorizerService', 'usersService', 'usersGroupService', 'metaContentTypesService', 'instrumentService', 'entityResolverService', 'fieldResolverService', 'attributeTypeService', 'uiService', 'entityType', 'entity', 'data',
            instrumentTypeAddDialogController
        ]
    );
    portal.controller(
        'InstrumentTypeEditDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'authorizerService', 'usersService', 'usersGroupService', 'metaContentTypesService', 'instrumentService', 'entityResolverService', 'fieldResolverService', 'attributeTypeService', 'uiService', 'entityType', 'entityId', 'data',
            instrumentTypeEditDialogController
        ]
    );

    // Transaction type form

    portal.controller(
        'TransactionTypeAddDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'entityType', 'entity', 'data', 'usersService', 'usersGroupService', 'transactionTypeService', 'attributeTypeService', 'ecosystemDefaultService', 'metaContentTypesService', 'uiService', 'fieldResolverService', 'gridTableHelperService',
            transactionTypeAddDialogController
        ]
    );
    portal.controller(
        'TransactionTypeEditDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'usersService', 'usersGroupService', 'ecosystemDefaultService', 'metaContentTypesService', 'entityResolverService', 'transactionTypeService', 'attributeTypeService', 'uiService', 'fieldResolverService', 'gridTableHelperService', 'entityType', 'entityId', 'data',
            transactionTypeEditDialogController
        ]
    );
    portal.controller('TransactionTypeValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', transactionTypeValidationErrorsDialogController]);
    portal.controller('TransactionTypeAddInputDialogController', ['$scope', '$mdDialog', 'data', transactionTypeAddInputDialogController]);

    // Complex transaction form

    portal.controller('ComplexTransactionAddDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'usersService', 'usersGroupService', 'globalDataService', 'metaContentTypesService', 'attributeTypeService', 'entityType', 'entity', 'data', complexTransactionAddDialogController]);
    portal.controller('ComplexTransactionEditDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'toastNotificationService', 'usersService', 'usersGroupService', 'globalDataService', 'metaContentTypesService', 'attributeTypeService', 'entityType', 'entityId', 'data', complexTransactionEditDialogController]);
    portal.controller('complexTransactionViewDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'usersService', 'usersGroupService', 'globalDataService', 'entityType', 'entityId', 'data', complexTransactionViewDialogController]);
    portal.controller('BookTransactionTransactionsTabController', ['$scope', '$mdDialog', bookTransactionTransactionsTabController]);
    portal.controller('ComplexTransactionsTransactionEditDialogController', ['$scope', '$mdDialog', 'entityId', complexTransactionsTransactionEditDialogController]);
    portal.controller('BookUniquenessWarningDialogController', ['$scope', '$mdDialog', 'data', bookUniquenessWarningDialogController]);


    // Instrument form - tabs

    portal.controller('AccrualCalculationSchedulesController', ['$scope', '$mdDialog', 'instrumentService', 'gridTableHelperService', 'multitypeFieldService', accrualCalculationSchedulesController]);
    portal.controller('EventSchedulesTabController', ['$scope', '$mdDialog', 'instrumentService', 'gridTableHelperService', eventSchedulesTabController]);
    // portal.controller('PricingPoliciesTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument/pricingPoliciesTabController')]);
    portal.controller('InstrumentPricingTabController', ['$scope', '$mdDialog', 'gridTableHelperService', 'configurationService', instrumentPricingTabController]);
    portal.controller('ConfigurePricingModuleDialogController', ['$scope', '$mdDialog', '$sce', 'globalDataService', 'data', configurePricingModuleDialogController]);
    portal.controller('InstrumentTypePricingTabController', ['$scope', '$mdDialog', 'configurationService', 'toastNotificationService', instrumentTypePricingTabController]);
    portal.controller('FactorScheduleTabController', ['$scope', factorScheduleTabController]);
    portal.controller('ManualPricingFormulasTabController', ['$scope', 'fieldResolverService', manualPricingFormulasTabController]);

    // Instrument type form - tabs

    portal.controller('InstrumentTypeEventSchedulesTabController', ['$scope', '$mdDialog', 'instrumentService', 'transactionTypeService', 'multitypeFieldService', 'gridTableHelperService', instrumentTypeEventSchedulesTabController]);
    portal.controller('InstrumentTypeAccrualsTabController', ['$scope', '$mdDialog', 'instrumentService', 'fieldResolverService', 'multitypeFieldService', 'gridTableHelperService', instrumentTypeAccrualsTabController]);
    portal.controller('InstrumentTypeUserAttributesTabController', ['$scope', '$mdDialog', instrumentTypeUserAttributesTabController]);
    portal.controller('InstrumentTypeFactorsTabController', ['$scope', '$mdDialog', 'instrumentService', 'multitypeFieldService', 'gridTableHelperService', instrumentTypeFactorsTabController]);

    // Currency form - tabs

    portal.controller('InstrumentEventActionsDialogController', ['$scope', '$mdDialog', 'eventActions', instrumentEventActionsDialogController]);
    portal.controller('GenerateEventScheduleDialogController', ['$scope', '$mdDialog', generateEventScheduleDialogController]);

    portal.controller('CalculatePortfolioRegisterRecordsDialogController', ['$scope', '$mdDialog', 'data', calculatePortfolioRegisterRecordsDialogController]);

    // Portfolio form - tabs
    portal.controller('PortfolioPerformanceTabController', ['$scope', '$state', '$mdDialog', 'commonDialogsService', 'toastNotificationService', portfolioPerformanceTabController]);

    // Data

    portal.controller('DataPortfolioController', ['$scope', dataPortfolioController]);
    portal.controller('DataPortfolioTypeController', ['$scope', dataPortfolioTypeController]);
    portal.controller('DataPortfolioReconcileGroupController', ['$scope', dataPortfolioReconcileGroupController]);
    portal.controller('DataPortfolioReconcileHistoryController', ['$scope', dataPortfolioReconcileHistoryController]);
    portal.controller('DataPortfolioRegisterController', ['$scope', dataPortfolioRegisterController]);
    portal.controller('DataPortfolioRegisterRecordController', ['$scope', dataPortfolioRegisterRecordController]);
    portal.controller('DataAccountController', ['$scope', '$stateParams', dataAccountController]);
    portal.controller('DataAccountTypeController', ['$scope', '$stateParams', dataAccountTypeController]);
    portal.controller('DataCounterpartyController', ['$scope', '$stateParams', dataCounterpartyController]);
    portal.controller('DataCounterpartyGroupController', ['$scope', '$stateParams', dataCounterpartyGroupController]);
    portal.controller('DataResponsibleController', ['$scope', '$stateParams', dataResponsibleController]);
    portal.controller('DataResponsibleGroupController', ['$scope', '$stateParams', dataResponsibleGroupController]);
    portal.controller('DataInstrumentController', ['$scope', 'instrumentService', dataInstrumentController]);
    portal.controller('DataGeneratedEventController', ['$scope', '$stateParams', dataGeneratedEventController]);
    portal.controller('DataInstrumentTypeController', ['$scope', '$stateParams', dataInstrumentTypeController]);
    portal.controller('DataPricingPolicyController', ['$scope', '$stateParams', dataPricingPolicyController]);
    portal.controller('DataTransactionController', ['$scope', '$stateParams', dataTransactionController]);
    portal.controller('DataComplexTransactionController', ['$scope', '$stateParams', dataComplexTransactionController]);
    portal.controller('DataTransactionTypeController', ['$scope', '$stateParams', dataTransactionTypeController]);
    portal.controller('DataTransactionTypeGroupController', ['$scope', '$stateParams', dataTransactionTypeGroupController]);
    portal.controller('DataPriceHistoryController', ['$scope', '$stateParams', 'priceHistoryService', dataPriceHistoryController]);
    portal.controller('DataPortfolioHistoryController', ['$scope', '$stateParams', 'priceHistoryService', dataPortfolioHistoryController]);
    portal.controller('DataCurrencyHistoryController', ['$scope', '$stateParams', 'currencyHistoryService', dataCurrencyHistoryController]);
    portal.controller('DataCurrencyController', ['$scope', '$stateParams', dataCurrencyController]);
    portal.controller('DataStrategyController', ['$scope', '$stateParams', dataStrategyController]);
    portal.controller('DataStrategyGroupController', ['$scope', '$stateParams', dataStrategyGroupController]);
    portal.controller('DataStrategySubgroupController', ['$scope', '$stateParams', dataStrategySubGroupController]);
    portal.controller('TransactionsAuditController', ['$scope', '$stateParams', auditTransactionsController]);
    portal.controller('InstrumentsAuditController', ['$scope', '$stateParams', auditInstrumentsController]);
    portal.controller('DataCurrencyHistoryErrorController', ['$scope', '$stateParams', dataCurrencyHistoryErrorController]);
    portal.controller('DataPriceHistoryErrorController', ['$scope', dataPriceHistoryErrorController]);


    // Reports

    portal.controller('BalanceReportController', ['$scope', 'reportService', balanceReportController]);
    portal.controller('ProfitAndLostReportController', ['$scope', '$stateParams', profitAndLostReportController]);
    portal.controller('TransactionReportController', ['$scope', 'reportService', transactionReportController]);
    portal.controller('CashFlowProjectionReportController', ['$scope', 'reportService', cashFlowProjectionReportController]);
    portal.controller('PerformanceReportController', ['$scope', 'reportService', performanceReportController]);

    portal.controller('CustomFieldDialogController', ['$scope', '$mdDialog', 'customFieldService', 'attributeDataService', 'entityViewerEventService', 'data', customFieldDialogController]);
    portal.controller('CustomFieldController', ['$scope', '$stateParams', '$mdDialog', customFieldController]);
    portal.controller('CustomFieldAddDialogController', ['$scope', '$mdDialog', 'customFieldService', 'data', 'attributeDataService', customFieldAddDialogController]);
    portal.controller('CustomFieldEditDialogController', ['$scope', '$mdDialog', 'customFieldService', 'data', 'attributeDataService', customFieldEditDialogController]);

    portal.controller('ManualSortingSettingsDialogController', ['$scope', '$mdDialog', 'data', 'entityViewerDataService', manualSortingSettingsDialogController]);
    portal.controller('ManualSortingLayoutManagerDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'data', 'entityViewerDataService', manualSortingLayoutManagerDialogController]);
    portal.controller('ManualSortingLayoutManagerController', ['$scope', '$mdDialog', manualSortingLayoutManagerController]);

    // Reports Missing Prices

    portal.controller('ReportPriceCheckerDialogController', ['$scope', '$mdDialog', 'data', reportPriceCheckerDialogController]);
    portal.controller('ViewMissingPriceHistoryDialogController', ['$scope', '$mdDialog', 'data', viewMissingPriceHistoryDialogController]);
    portal.controller('ViewMissingFxRatesDialogController', ['$scope', '$mdDialog', 'data', viewMissingFxRatesDialogController]);
    portal.controller('ViewMissingHistoricalFxRatesDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'currencyHistoryService', 'data', viewMissingHistoricalFxRatesDialogController]);
    portal.controller('ViewMissingPriceHistoryViewPositionsDialogController', ['$scope', '$mdDialog', 'data', viewMissingPriceHistoryViewPositionsDialogController]);
    portal.controller('ViewMissingCustomFieldsDialogController', ['$scope', '$mdDialog', 'data', viewMissingCustomFieldsDialogController]);
    portal.controller('ViewFailedReconcileHistoryDialogController', ['$scope', '$mdDialog', 'data', viewFailedReconcileHistoryDialogController]);

    // Settings

    portal.controller('SettingsGeneralController', ['$scope', '$state', settingsGeneralController]);
    portal.controller('SettingsGeneralProfileController', ['$scope', 'usersService', 'globalDataService', settingsGeneralProfileController]);
    portal.controller('SettingsGeneralInterfaceAccessController', ['$scope', '$state', 'usersService', 'globalDataService', settingsGeneralInterfaceAccessController]);
    portal.controller('SettingsGeneralTransactionFieldController', ['$scope', '$mdDialog', settingsGeneralTransactionFieldController]);
    portal.controller('SettingsGeneralInstrumentFieldController', ['$scope', '$mdDialog', settingsGeneralInstrumentFieldController]);
    portal.controller('SettingsGeneralChangePasswordController', ['$scope', '$mdDialog', 'authorizerService', settingsGeneralChangePasswordController]);
    portal.controller('SettingsGeneralDataProvidersController', ['$scope', '$mdDialog', settingsGeneralDataProvidersController]);
    portal.controller('SettingsPersonalDataProviderController', ['$scope', '$mdDialog', 'provider', settingsPersonalDataProviderController]);
    portal.controller('SettingsGeneralDataProvidersConfigController', ['$scope', '$stateParams', '$mdDialog', '$state', settingsGeneralDataProvidersConfigController]);
    portal.controller('SettingsGeneralDataProvidersBloombergController', ['$scope', '$stateParams', '$mdDialog', '$state', settingsGeneralDataProvidersBloombergController]);

    // Settings - imports

    portal.controller('SettingsGeneralInstrumentImportController', ['$scope', '$mdDialog', settingsGeneralInstrumentImportController]);
    portal.controller('SettingsGeneralComplexImportController', ['$scope', '$mdDialog', settingsGeneralComplexImportController]);
    portal.controller('SettingsGeneralTransactionImportController', ['transactionImportSchemeService', settingsGeneralTransactionImportController]);
    portal.controller('SettingsGeneralSimpleEntityImportController', ['$scope', '$mdDialog', settingsGeneralSimpleEntityImportController]);

    // Configuration Import

    portal.controller('ConfigurationImportDialogController', ['$scope', '$interval', '$mdDialog', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'systemMessageService', 'metaContentTypesService', 'configurationImportService', 'data', configurationImportDialogController]);
    portal.controller('ConfigurationImportResultDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'data', configurationImportResultDialogController]);

    // Configuration Export

    //portal.controller('SettingGeneralConfigurationExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralConfigurationExportFileDialogController')]);
    portal.controller('SettingsGeneralConfigurationController', ['$scope', '$mdDialog', settingsGeneralConfigurationController]);
    portal.controller('SettingsGeneralInitConfigurationController', ['$scope', '$mdDialog', settingsGeneralInitConfigurationController]);

    // Settings - Mapping Export/Import

    portal.controller('SettingGeneralMappingPreviewFileDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'file', settingGeneralMappingPreviewFileDialogController]);
    portal.controller('SettingGeneralMappingExportFileDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'configurationService', settingGeneralMappingExportFileDialogController]);
    portal.controller('SettingGeneralMappingPreviewFileErrorsDialogController', ['$scope', '$mdDialog', 'data', settingGeneralMappingPreviewFileErrorsDialogController]);

    // Configuration

    portal.controller('CreateConfigurationDialogController', ['$scope', '$mdDialog', createConfigurationDialogController]);
    portal.controller('EditConfigurationDialogController', ['$scope', '$mdDialog', 'item', editConfigurationDialogController]);

    // Groups & Members

    portal.controller('SettingsMembersAndGroupsController', ['$scope', '$mdDialog', '$uiRouterGlobals', 'authorizerService', 'globalDataService', settingsMembersAndGroupsController]);
    portal.controller('CreateInviteDialogController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', createInviteDialogController]);
    portal.controller('ManageMemberDialogController', ['$scope', '$mdDialog', 'memberId', 'authorizerService', manageMemberDialogController]);
    portal.controller('ManageGroupDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'groupId', manageGroupDialogController]);
    portal.controller('CreateGroupDialogController', ['$scope', '$mdDialog', createGroupDialogController]);

    // Layouts

    portal.controller('UiLayoutListInvitesDialogController', ['$scope', '$mdDialog', 'backendConfigurationImportService', 'options', uiLayoutListInvitesDialogController]);
    portal.controller('UiLayoutListDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', 'backendConfigurationImportService', 'reportHelper', 'globalDataService', 'options', uiLayoutListDialogController]);
    portal.controller('UiShareLayoutDialogController', ['$scope', '$mdDialog', 'options', uiShareLayoutDialogController]);
    portal.controller('UiLayoutSaveAsDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'commonDialogsService', 'data', uiLayoutSaveAsDialogController]);
    portal.controller('SelectLayoutDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', 'options', selectLayoutDialogController]);

    // Bookmarks

    portal.controller('BookmarksWizardDialogController', ['$scope', '$mdDialog', bookmarksWizardDialogController]);
    portal.controller('BookmarksEditSelectedDialogController', ['$scope', '$mdDialog', 'data', bookmarksEditSelectedDialogController]);
    portal.controller('BookmarksLayoutSelectDialogController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', bookmarksLayoutSelectDialogController]);

    portal.component('floatRangeCustomFieldControl', floatRangeCustomFieldControlComponent);
    portal.component('dateRangeCustomFieldControl', dateRangeCustomFieldControlComponent);

    portal.directive('menuToggle', [menuToggleDirective]);
    portal.directive('menuLink', [menuLinkDirective]);
    portal.directive('sidenavDropdownMenu', [sidenavDropdownMenuDirective]);

    portal.directive('bindFieldControl', ['$mdDialog', bindFieldControlDirective]);
    portal.directive('bindFieldTable', ['$mdDialog', 'instrumentService', 'gridTableHelperService', 'multitypeFieldService', 'entityDataConstructorService', bindFieldTableDirective]);
    portal.directive('bindFieldAttachment', ['$mdDialog', bindFieldAttachmentDirective]);
    portal.directive('bindFieldJson', ['$mdDialog', bindFieldJsonDirective]);
    portal.directive('layoutConstructorField', ['$mdDialog', layoutConstructorFieldDirective]);
    // portal.directive('newLayoutConstructorField', ['$mdDialog', require('./app/directives/newLayoutConstructorFieldDirective')]);
    portal.directive('addTabEc', ['$compile', addTabEcDirective]);

    portal.directive('onFinishRender', [onFinishRenderDirective]);

    portal.directive('draftButton', ['$mdDialog', 'toastNotificationService', draftButtonDirective]);
    portal.directive('initialLoader', [initialLoaderDirective]);
    portal.directive('progressCircular', ['$interval', progressCircularDirective]);
    portal.directive('progressLinear', [progressLinearDirective]);
    portal.directive('userProfile', ['globalDataService', userProfileDirective]);

    // Pages

    portal.controller('DeveloperPanelController', ['$scope', '$mdDialog', developerPanelController]);

    portal.controller('SimpleEntityImportController', ['$scope', '$mdDialog', 'usersService', 'metaContentTypesService', 'systemMessageService', simpleEntityImportController]);
    portal.controller('UnifiedEntityImportController', ['$scope', '$mdDialog', 'usersService', 'metaContentTypesService', unifiedEntityImportController]);
    portal.controller('TransactionImportController', ['$scope', '$mdDialog', 'usersService', 'transactionImportSchemeService', transactionImportController]);
    portal.controller('ComplexImportController', ['$scope', '$mdDialog', 'usersService', complexImportController]);
    portal.controller('InstrumentDownloadCbondsController', ['$scope', '$mdDialog', instrumentDownloadCbondsController]);
    portal.controller('InstrumentDownloadController', ['$scope', '$mdDialog', 'instrumentService', instrumentDownloadController]);
    portal.controller('FillPriceHistoryController', ['$scope', '$mdDialog', fillPriceHistoryController]);
    portal.controller('MappingTablesController', ['$scope', '$mdDialog', mappingTablesController]);
    portal.controller('MappingTablePageController', ['$scope', '$mdDialog', mappingTablePageController]);
    portal.controller('CeleryWorkerPageController', ['$scope', '$mdDialog', celeryWorkerPageController]);
    portal.controller('CeleryWorkerDialogController', ['$scope', '$mdDialog', 'data', celeryWorkerDialogController]);
    portal.controller('MappingTableDialogController', ['$scope', '$mdDialog', 'data', mappingTableDialogController]);
    portal.controller('ProcessesController', ['$scope', '$mdDialog', processesController]);
    portal.controller('JournalPageController', ['$scope', '$state', '$stateParams', '$mdDialog', 'usersService', 'metaContentTypesService', journalPageController]);
    portal.controller('MarketplacePageController', ['$scope', '$state', '$stateParams', '$mdDialog', 'configurationService', marketplacePageController]);
    portal.controller('VaultPageController', ['$scope', '$state', '$stateParams', '$mdDialog', 'globalDataService', vaultPageController]);
    portal.controller('VaultSecretDialogController', ['$scope', '$mdDialog', 'data', vaultSecretDialogController]);
    portal.controller('UnsealVaultDialogController', ['$scope', '$mdDialog', 'data', unsealVaultDialogController]);
    portal.controller('ManageConfigurationPageController', ['$scope', '$state', '$stateParams', '$mdDialog', 'configurationService', manageConfigurationPageController]);
    portal.controller('UpdateCenterController', ['$scope', 'authorizerService', 'globalDataService', updateCenterController]);
    portal.controller('SystemMessagesController', ['$scope', '$mdDialog', 'systemMessageService', systemMessagesController]);
    portal.controller('UpdateConfigurationPageController', ['$scope', '$state', '$mdDialog', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'authorizerService', updateConfigurationPageController]);
    portal.controller('ExplorerPageController', ['$scope', '$state', '$stateParams', '$sce', 'authorizerService', 'globalDataService', '$mdDialog', explorerPageController]);
    portal.controller('WorkflowsPageController', ['$scope', '$sce', 'authorizerService', 'globalDataService', '$mdDialog', workflowsPageController]);
    portal.controller('CreateFolderDialogController', ['$scope', '$mdDialog', 'data', createFolderDialogController]);
    portal.controller('CreateFileDialogController', ['$scope', '$mdDialog', 'data', createFileDialogController]);
    portal.controller('DataStatsPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', dataStatsPageController]);
    portal.controller('DataCalendarPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', 'systemMessageService', dataCalendarPageController]);
    portal.controller('ErrorPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', 'systemMessageService', errorPageController]);

    // Procedures

    portal.controller('PricingProcedurePageController', ['$scope', '$mdDialog', pricingProcedurePageController]);
    portal.controller('PricingParentProcedurePageController', ['$scope', '$mdDialog', pricingParentProcedurePageController]);

    portal.controller('PricingProcedureAddDialogController', ['$scope', '$mdDialog', 'data', pricingProcedureAddDialogController]);
    portal.controller('PricingProcedureEditDialogController', ['$scope', '$mdDialog', 'data', pricingProcedureEditDialogController]);
    portal.controller('RunPricingProcedurePageController', ['$scope', '$mdDialog', runPricingProcedurePageController]);


    portal.controller('DataProcedurePageController', ['$scope', '$mdDialog', dataProcedurePageController]);
    portal.controller('DataProcedureInstancePageController', ['$scope', '$mdDialog', dataProcedureInstancePageController]);

    portal.controller('DataProcedureAddDialogController', ['$scope', '$mdDialog', 'transactionImportSchemeService', 'data', dataProcedureAddDialogController]);
    portal.controller('DataProcedureEditDialogController', ['$scope', '$mdDialog', 'transactionImportSchemeService', 'data', dataProcedureEditDialogController]);

    portal.controller('RunDataProcedurePageController', ['$scope', '$mdDialog', runDataProcedurePageController]);


    portal.controller('ExpressionProcedurePageController', ['$scope', '$mdDialog', expressionProcedurePageController]);
    portal.controller('ExpressionProcedureInstancePageController', ['$scope', '$mdDialog', expressionProcedureInstancePageController]);

    portal.controller('ExpressionProcedureAddDialogController', ['$scope', '$mdDialog', 'data', expressionProcedureAddDialogController]);
    portal.controller('ExpressionProcedureEditDialogController', ['$scope', '$mdDialog', 'data', expressionProcedureEditDialogController]);

    // Pricing


    portal.controller('PricingPolicyPageController', ['$scope', '$mdDialog', '$state', pricingPolicyPageController]);
    portal.controller('BalanceReportInstancePageController', ['$scope', '$mdDialog', balanceReportInstancePageController]);
    portal.controller('PlReportInstancePageController', ['$scope', '$mdDialog', plReportInstancePageController]);
    portal.controller('PricingManagePageController', ['$scope', '$mdDialog', 'instrumentService', pricingManagePageController]);
    portal.controller('PortfolioBundlePageController', ['$scope', '$mdDialog', portfolioBundlePageController]);
    portal.controller('PricingSchemePageController', ['$scope', '$mdDialog', pricingSchemePageController]);
    portal.controller('RunPricingInstrumentDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', runPricingInstrumentDialogController]);
    portal.controller('RunPricingCurrencyDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', runPricingCurrencyDialogController]);
    portal.controller('SingleInstrumentGenerateEventDialogController', ['$scope', '$mdDialog', 'data', singleInstrumentGenerateEventDialogController]);
    portal.controller('SingleInstrumentAddEventToTableDialogController', ['$scope', '$mdDialog', 'instrumentService', 'transactionTypeService', 'gridTableHelperService', 'multitypeFieldService', 'data', singleInstrumentAddEventToTableDialogController]);
    portal.controller('AddRowToTableInsideEvUserTabDialogController', ['$scope', '$mdDialog', 'gridTableHelperService', 'multitypeFieldService', 'data', addRowToTableInsideEvUserTabDialogController]);

    portal.controller('InstrumentEventParameterDialogController', ['$scope', '$mdDialog', 'data', instrumentEventParameterDialogController]);
    portal.controller('InstrumentEventActionParameterDialogController', ['$scope', '$mdDialog', 'data', instrumentEventActionParameterDialogController]);


    portal.controller('CurrencyPricingSchemeAddDialogController', ['$scope', '$mdDialog', 'data', currencyPricingSchemeAddDialogController]);
    portal.controller('CurrencyPricingSchemeEditDialogController', ['$scope', '$mdDialog', 'data', currencyPricingSchemeEditDialogController]);

    portal.controller('InstrumentPricingSchemeAddDialogController', ['$scope', '$mdDialog', 'data', instrumentPricingSchemeAddDialogController]);
    portal.controller('InstrumentPricingSchemeEditDialogController', ['$scope', '$mdDialog', 'data', instrumentPricingSchemeEditDialogController]);

    portal.controller('PricingPolicyAddDialogController', ['$scope', '$mdDialog', 'data', pricingPolicyAddDialogController]);
    portal.controller('PricingPolicyEditDialogController', ['$scope', '$mdDialog', 'toastNotificationService', 'data', pricingPolicyEditDialogController]);
    portal.controller('PortfolioBundleDialogController', ['$scope', '$mdDialog', 'data', portfolioBundleDialogController]);

    portal.controller('TransactionTypeGroupDialogController', ['$scope', '$mdDialog', 'data', transactionTypeGroupDialogController]);
    portal.controller('TransactionTypeGroupPageController', ['$scope', '$mdDialog', transactionTypeGroupPageController]);


    portal.controller('PricingMultipleParametersDialogController', ['$scope', '$mdDialog', 'data', pricingMultipleParametersDialogController]);


    // Schedules

    portal.controller('SchedulePageController', ['$scope', '$mdDialog', schedulePageController]);

    portal.controller('ScheduleAddDialogController', ['$scope', '$mdDialog', 'data', scheduleAddDialogController]);
    portal.controller('ScheduleEditDialogController', ['$scope', '$mdDialog', 'data', scheduleEditDialogController]);


    // Reference Table

    portal.controller('ReferenceTablesController', ['$scope', '$mdDialog', referenceTablesController]);
    portal.controller('ReferenceTableEditDialogController', ['$scope', '$mdDialog', 'data', referenceTableEditDialogController]);
    portal.controller('ReferenceTableImportDialogController', ['$scope', '$mdDialog', 'data', referenceTableImportDialogController]);
    portal.controller('ReferenceTableExportDialogController', ['$scope', '$mdDialog', 'data', referenceTableExportDialogController]);


    portal.controller('FormsDataConstructor', ['$scope', '$mdDialog', formsDataConstructorController]);
    portal.controller('LayoutsSettingsController', ['$scope', '$mdDialog', '$state', layoutsSettingsController]);
    portal.controller('InputFormLayoutsSettingsController', ['$scope', '$mdDialog', 'metaContentTypesService', 'uiService', inputFormLayoutsSettingsController]);

    portal.controller('EntitiesCustomAttributesController', ['$scope', '$mdDialog', entitiesCustomAttributesController]);
    portal.controller('PriceDownloadSchemeController', ['$scope', priceDownloadSchemeController]);
    portal.controller('TemplateFieldsController', ['$scope', '$mdDialog', 'configurationService', 'globalDataService', templateFieldsController]);
    portal.controller('EntityTooltipPageController', ['$scope', 'toastNotificationService', 'attributeTypeService', 'metaContentTypesService', 'uiService', entityTooltipPageController]);
    portal.controller('CrossEntityAttributeExtensionPageController', ['$scope', 'toastNotificationService', 'attributeTypeService', 'uiService', crossEntityAttributeExtensionPageController]);
    portal.controller('ImportConfigurationsController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'metaContentTypesService', 'backendConfigurationImportService', 'systemMessageService', 'configurationService', 'configurationImportService', importConfigurationsController]);
    portal.controller('ExportConfigurationsController', ['$scope', '$mdDialog', 'usersService', 'metaContentTypesService', 'configurationService', 'uiService', exportConfigurationsController]);

    // Reconciliation

    portal.controller('ReconProcessBankFileDialogController', ['$scope', '$mdDialog', 'transactionImportSchemeService', 'data', reconProcessBankFileDialogController]);
    portal.controller('ReconMatchDialogController', ['$scope', '$mdDialog', 'data', reconMatchDialogController]);
    portal.controller('ReconMatchViewComplexTransactionFieldDialogController', ['$scope', '$mdDialog', 'data', reconMatchViewComplexTransactionFieldDialogController]);
    portal.controller('ReconMatchViewFileFieldDialogController', ['$scope', '$mdDialog', 'data', reconMatchViewFileFieldDialogController]);
    portal.controller('ReconMatchViewLineDialogController', ['$scope', '$mdDialog', 'data', reconMatchViewLineDialogController]);

    portal.controller('ReconciliationMatchEditorController', ['$scope', '$mdDialog', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', reconciliationMatchEditorController]);

    portal.controller('PermissionDeniedPageController', ['$scope', '$mdDialog', permissionDeniedPageController]);


    portal.directive('matchReconCard', ['$mdDialog', matchReconCardDirective]);

    // Controls

    portal.directive('expressionEditorButton', ['$mdDialog', expressionEditorButton]);
    portal.directive('aceEditorButton', ['$mdDialog', aceEditorButton]);
    portal.directive('jsonEditorButton', ['$mdDialog', jsonEditorButton]);
    portal.directive('useFromAboveButton', ['$mdDialog', useFromAboveButton]);


    //# region GROUP TABLE
    portal.directive('groupTable', ['globalDataService', gTableComponent]);
    portal.directive('groupTableBody', ['toastNotificationService', 'usersService', 'globalDataService', 'transactionTypeService', 'priceHistoryService', 'uiService', 'evRvDomManagerService', 'rvDataProviderService', gTableBodyComponent]);
    /* portal.directive('rvTextFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvTextFilterDirective')]);
    portal.directive('rvNumberFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvNumberFilterDirective')]);
    portal.directive('rvDateFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvDateFilterDirective')]); */

    portal.directive('gFilters', ['$mdDialog', 'uiService', 'evRvLayoutsHelper', 'gFiltersHelper', gFiltersDirective]);
    portal.directive('gEvFilters', ['$mdDialog', '$state', '$bigDrawer', 'toastNotificationService', gEvFiltersDirective]);
    portal.directive('evFilter', ['gFiltersHelper', evFilterDirective]);
    portal.directive('evTextFilter', ['specificDataService', 'userFilterService', 'gFiltersHelper', evTextFilterDirective]);
    portal.directive('evBooleanFilter', ['gFiltersHelper', evBooleanFilterDirective]);
    portal.directive('evNumberFilter', ['gFiltersHelper', evNumberFilterDirective]);
    portal.directive('evDateFilter', ['specificDataService', 'gFiltersHelper', evDateFilterDirective]);
    portal.directive('gRvFilters', ['$mdDialog', 'gFiltersHelper', 'uiService', gRvFiltersDirective]);
    portal.directive('rvFilter', ['$mdDialog', 'specificDataService', 'userFilterService', 'gFiltersHelper', rvFilterDirective]);
    portal.directive('rvTextFilter', ['userFilterService', 'gFiltersHelper', rvTextFilterDirective]);
    portal.directive('rvBooleanFilter', ['gFiltersHelper', rvBooleanFilterDirective]);
    portal.directive('rvNumberFilter', ['gFiltersHelper', rvNumberFilterDirective]);
    portal.directive('rvDateFilter', ['specificDataService', 'gFiltersHelper', rvDateFilterDirective]);
    /* portal.directive('evTextFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldTextFilterDirective')]);
    portal.directive('evNumberFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldNumberFilterDirective')]);
    portal.directive('evDateFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldDateFilterDirective')]); */
    portal.directive('gRowsBulkActions', ['$mdDialog', gRowsBulkActionsDirective]);
    portal.directive('gEvRowsBulkActions', ['evRvDomManagerService', gEvRowsBulkActionsDirective]);

    portal.directive('groupReportSettings', [gReportSettingsComponent]);
    portal.directive('groupGrouping', ['$mdDialog', gGroupingComponent]); //2021-12-17 DEPRECATED
    portal.directive('groupColumns', ['$mdDialog', 'toastNotificationService', 'usersService', 'globalDataService', 'uiService', 'evRvDomManagerService', 'rvDataProviderService', gColumnsComponent]);
    // portal.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]); // potentially deprecated
    portal.directive('groupColumnResizer', ['evRvDomManagerService', gColumnResizerComponent]);
    portal.directive('groupLayoutResizer', [gLayoutResizerComponent]);
    portal.directive('gHeightAligner', [gHeightAlignerComponent]);
    portal.directive('groupWidthAligner', [gWidthAlignerComponent]);
    portal.directive('groupEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', groupEditorBinderComponent]);
    portal.directive('groupSplitPanelReportBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', 'metaContentTypesService', 'templateLoader', gSplitPanelReportBinderComponent]);
    portal.directive('gVerticalSplitPanelReportBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', gVerticalSplitPanelReportBinderComponent]);
    portal.directive('groupPermissionEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', gPermissionEditorBinderComponent]);
    portal.directive('groupReconciliationMatchEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', gReconciliationMatchEditorBinderComponent]);
    // portal.directive('gCAreasDragAndDrop', ['$mdDialog', require('./app/directives/groupTable/gCAreasDragAndDropDirective')]);
    portal.directive('rvGcfAreasDnd', ['$mdDialog', rvGcfAreasDndDirective]);
    portal.directive('evGcfAreasDnd', ['$mdDialog', evGcfAreasDndDirective]);
    portal.directive('viewConstructorDragAndDrop', ['$mdDialog', viewConstructorDragAndDropDirective]);

    portal.directive('gColumnSettingsButton', ['$mdDialog', gColumnSettingsBtnDirective]);
    portal.directive('gGroupSettingsButton', ['$mdDialog', gGroupSettingsBtnDirective]);
    portal.directive('gFilterSettingsBtn', [gFilterSettingsBtnDirective]);
    portal.directive('contentTitle', ['$timeout', contentTitleDirective]);
    portal.directive('valueTitle', ['$timeout', valueTitleDirective]);

    portal.directive('gLayoutsManager', ['$mdDialog', '$state', 'toastNotificationService', 'usersService', 'globalDataService', 'ecosystemDefaultService', 'metaContentTypesService', 'uiService', 'backendConfigurationImportService', 'reportHelper', 'evRvLayoutsHelper', gLayoutsManagerComponent]);
    portal.directive('dashboardLayoutsManagerComponent', ['$mdDialog', '$state', 'toastNotificationService', 'uiService', 'backendConfigurationImportService', 'evRvLayoutsHelper', dashboardLayoutsManagerComponent]);

    portal.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'customFieldService', 'ecosystemDefaultService', 'uiService', 'data', gReportSettingsDialogController]);
    portal.controller('GEntityViewerSettingsDialogController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', gEntityViewerSettingsDialogController]);
    portal.controller('PeriodsEditorDialogController', ['$scope', '$mdDialog', 'options', periodsEditorDialogController]);
    portal.controller('DateTreeDialogController', ['$scope', '$mdDialog', 'data', dateTreeDialogController]);
    portal.controller('gColumnNumbersRenderingSettingsDialogController', ['$scope', '$mdDialog', 'data', gColumnNumbersRenderingSettingsDialogController]);

    portal.controller('gModalController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', gModalComponent]);
    portal.controller('gModalReportController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', gModalReportComponent]);
    portal.controller('gModalReportPnlController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', gModalReportPnlComponent]);
    portal.controller('gModalReportTransactionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', gModalReportTransactionComponent]);
    portal.controller('gModalReportPerformanceController', ['$scope', '$mdDialog', 'customFieldService', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', gModalReportPerformanceComponent]);
    portal.controller('gModalReportCashFlowProjectionController', ['$scope', '$mdDialog', 'customFieldService', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', gModalReportCashFlowProjectionComponent]);

    // New report viewer interface
    portal.directive('gTopPart', ['$mdDialog', '$state', 'usersService', 'ecosystemDefaultService', 'globalDataService', 'evRvLayoutsHelper', 'reportHelper', gTopPartDirective]);

    portal.directive('gEvLeftPanel', ['$mdDialog', gEvLeftPanelDirective]);
    portal.directive('gEvLeftPanelTreeElem', ['$mdDialog', '$state', gEvLeftPanelTreeElemDirective]);

    //# endregion GROUP TABLE

    portal.directive('mainHeader', ['$mdDialog', '$state', '$transitions', 'cookieService', 'broadcastChannelService', 'middlewareService', 'authorizerService', 'usersService', 'uiService', 'globalDataService', 'systemMessageService', 'redirectionService', 'evRvLayoutsHelper', mainHeaderDirective]);
    portal.directive('evFieldResolver', ['metaContentTypesService', 'fieldResolverService', entityViewerFieldResolverDirective]);
    portal.directive('evSelectorResolver', [entityViewerSelectorResolverDirective]);
    portal.directive('ismFieldResolver', ['$mdDialog', 'fieldResolverService', instrumentSchemeManagerFieldResolverDirective]);
    portal.directive('floatNumbers', [floatNumbersDirective]);
    portal.directive('instrumentModalResolver', ['$mdDialog', instrumentModalResolverDirective]);
    portal.directive('commonSelect', [commonSelectDirective]);
    portal.directive('ttypeActionsInputSelect', [ttypeActionsInputsSelectDirective]);
    portal.directive('ttypeActionsRelationsSelect', [ttypeActionsRelationsSelectDirective]);
    portal.directive('entitySearchSelect', ['$mdDialog', 'metaContentTypesService', entitySearchSelect]);
    portal.directive('crudSelect', ['$mdDialog', crudSelect]);
    portal.directive('finmarsPlaybook', ['$mdDialog', finmarsPlaybookDirective]);
    portal.directive('pythonEditor', ['$mdDialog', pythonEditorDirective]);
    portal.directive('javascriptEditor', ['$mdDialog', javascriptEditorDirective]);
    portal.directive('jsonEditor', ['$mdDialog', jsonEditorDirective]);
    portal.directive('taskCard', ['$mdDialog', 'systemMessageService', taskCardDirective]);
    portal.directive('usercodeInput', ['configurationService', usercodeInputDirective]);
    portal.directive('twoFieldsMultiselect', ['$mdDialog', 'customInputsService', twoFieldsMultiselectDirective]);
    portal.directive('twoFieldsOptions', [twoFieldsOptionsDirective]);
    portal.directive('tableAttributeSelector', ['$mdDialog', tableAttributeSelectorDirective]);
    portal.directive('tableAttributesMenuConstructor', ['$mdDialog', tableAttributesMenuConstructorDirective]);
    portal.directive('expandableItemsSelector', ['$mdDialog', expandableItemsSelectorDirective]);
    portal.directive('instrumentEventActionResolver', ['$mdDialog', instrumentEventActionResolverDirective]);
    portal.directive('classifierModalResolver', ['$mdDialog', classifierModalResolverDirective]);
    portal.directive('zhDatePicker', ['pickmeup', zhDatePickerDirective]);
    portal.directive('complexZhDatepicker', ['$mdDialog', complexZhDatePickerDirective]);
    portal.directive('complexDatepicker', ['$mdDialog', 'pickmeup', 'toastNotificationService', complexDatepickerDirective]);
    portal.directive('dateTreeInput', ['$mdDialog', dateTreeInputDirective]);
    portal.directive('dragDialog', [dragDialogDirective]);
    portal.directive('membersGroupsTable', [membersGroupsTableDirective]);
    portal.directive('inputFileDirective', [inputFileDirective]);
    portal.directive('bookmarks', ['$mdDialog', bookmarksDirective]);
    portal.directive('numberFormatMenu', ['$mdDialog', numberFormatMenuDirective]);
    portal.directive('dialogHeader', [dialogHeaderDirective]);
    portal.directive('isDraggableSign', [isDraggableSignDirective]);
    portal.directive('dialogWindowResizer', [dialogWindowResizerDirective]);
    portal.directive('closeDialogButton', [closeDialogButtonDirective]);

    // portal.directive('popUp', [require('./app/directives/dialogWindowResizerDirective.js')]);
    portal.directive('customPopup', ['$rootScope', '$compile', '$timeout', customPopupDirective]);
    portal.directive('chipsList', ['$filter', chipsListDirective]);
    portal.directive('onRepeatElemInit', [onRepeatElemInit]);

    //# region Custom inputs
    portal.directive('baseInput', [baseInputDirective]);
    portal.directive('textInput', ['$mdDialog', textInputDirective]);
    portal.directive('numberInput', ['$mdDialog', numberInputDirective]);
    portal.directive('dateInput', ['$timeout', dateInputDirective]);
    portal.directive('datetimeInput', [datetimeInputDirective]);
    portal.directive('expressionInput', ['$mdDialog', expressionInputDirective]);
    portal.directive('dropdownSelect', ['$mdDialog', 'customInputsService', dropdownSelectDirective]);
    portal.directive('instrumentSelect', ['$mdDialog', 'toastNotificationService', 'instrumentService', 'customInputsService', instrumentSelectDirective]);
    portal.directive('unifiedDataSelect', ['$mdDialog', 'finmarsDatabaseService', 'customInputsService', unifiedDataSelectDirective]);
    portal.directive('classifierSelect', ['$mdDialog', classifierSelectDirective]);
    portal.directive('multitypeField', [multitypeFieldDirective]);
    portal.directive('multiinputField', [multiinputFieldDirective]);
    portal.directive('entityNamesField', ['metaContentTypesService', 'globalDataService', entityNamesFieldDirective]);
    portal.directive('complexDropdownSelect', [complexDropdownSelectDirective]);
    portal.directive('complexDropdownSelectMenu', [complexDropdownSelectMenuDirective]);
    portal.directive('dropdownSelect2', [dropdownSelect2Directive]);
    //# endregion

    //#region Grid Table
    portal.directive('gridTable', [gridTableDirective]);
    portal.directive('gridTableTopPanel', ['gridTableHelperService', gridTableTopPanelDirective]);
    portal.directive('gridTableCell', ['$compile', gridTableCellDirective]);
    portal.directive('gridTableHeaderCell', [gridTableHeaderCellDirective]);
    portal.directive('gridTablePopupCell', ['$compile', '$mdDialog', gridTablePopupCellDirective]);
    portal.directive('gridTableMultiselectorCell', ['$mdDialog', gridTableMultiselectorCellDirective]);
    //# endregion

    portal.filter('trustAsHtml', ['$sce', trustAsHtmlFilter]);
    portal.filter('trustAsUrl', ['$sce', trustAsUrlFilter]);
    portal.filter('strLimit', ['$filter', strLimitFilter]);
    portal.filter('propsFilter', ['$filter', propsFilter]);

    portal.directive('ngRightClick', ['$parse', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    }]);

    // require('./templates.min.js');

    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    // VUE 3 Integration
    // portal.directive('finmarsButton', ['$rootScope', vueClassConverter(FinmarsButton)]);
    // portal.directive('finmarsExpressionInput', ['$rootScope', vueClassConverter(FinmarsButton)]);

    window.onerror = function (error) {

        if (!window.system_errors) {
            window.system_errors = []
        }

        window.system_errors.push({
            created: new Date().toISOString(),
            location: window.location.href,
            text: JSON.stringify(error)
        })

    }

    var currentUrl = location.href;
    window.addEventListener('hashchange', function () {

        const hash = window.location.hash.substr(3); // Remove the `#`

        currentUrl = `${location.origin}${location.pathname}${hash}`; // Build the new clean URL

        if (typeof _paq !== 'undefined') {

            // _paq.push(['setReferrerUrl', currentUrl]);
            // currentUrl = '/' + window.location.hash.substr(1);
            _paq.push(['setCustomUrl', currentUrl]);
            _paq.push(['setDocumentTitle', document.title]);

            // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
            _paq.push(['deleteCustomVariables', 'page']);
            _paq.push(['trackPageView']);

            // make Matomo aware of newly added content
            var content = document.body;
            _paq.push(['MediaAnalytics::scanForMedia', content]);
            _paq.push(['FormAnalytics::scanForForms', content]);
            _paq.push(['trackContentImpressionsWithinNode', content]);
            _paq.push(['enableLinkTracking']);
            _paq.push(['enableHeartBeatTimer']);

        }
    });


}