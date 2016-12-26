/**
 * Created by szhitenev on 04.05.2016.
 */
'use strict';

require('../../forum/scripts/main.js');

var app = angular.module('portal', [
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngMdIcons',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'vAccordion',
    'mdPickers',
    'bw.paging',
    'io.dennis.contextmenu',
    angularDragula(angular),

    'forum'
]);


app.config(['$stateProvider', '$urlRouterProvider', require('./app/router.js')]);
app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('YYYY-MM-DD');
    };
}]);

app.run(['$rootScope', function ($rootScope) {
    console.log('App initialized');
    localStorage.setItem('entityIsChanged', false);

    $rootScope.$on('$stateChangeStart', function () {
        setTimeout(function () {
            $(window).trigger('resize');
        }, 300);
    })
}]);


app.controller('ShellController', ['$scope', '$state', '$rootScope', '$mdDialog', require('./app/controllers/shellController')]);
app.controller('SideNavController', ['$scope', require('./app/controllers/sideNavController')]);

app.controller('DashboardController', ['$scope', '$mdDialog', require('./app/controllers/dashboardController')]);
app.controller('ActionsController', ['$scope', '$mdDialog', require('./app/controllers/actionsController')]);
app.controller('ImportInstrumentDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/importInstrumentDialogController')]);
app.controller('AutomatedUploadsHistoryDialogController', ['$scope', '$mdDialog', '$mdpTimePicker', require('./app/controllers/dialogs/automatedUploadsHistoryDialogController')]);
app.controller('FillPriceHistoryDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/fillPriceHistoryDialogController')]);
app.controller('EventScheduleConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/eventScheduleConfigDialogController')]);
app.controller('FillPriceManuallyInstrumentDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/fillPriceManuallyInstrumentDialogController')]);
app.controller('PriceDownloadSchemeAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/priceDownloadSchemeAddDialogController')]);
app.controller('EventDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/eventDialogController')]);

app.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', require('./app/controllers/attributesManagerController')]);
app.controller('AttributesManagerEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerEditDialogController')]);
app.controller('AttributesManagerAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerAddDialogController')]);
app.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classificationEditorDialogController')]);

app.controller('InstrumentMappingAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentMappingAddDialogController')]);
app.controller('InstrumentMappingEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/instrumentMappingEditDialogController')]);
app.controller('EntityTypeMappingDialogController', ['$scope', '$mdDialog', 'mapItem', require('./app/controllers/dialogs/entityTypeMappingDialogController')]);

app.controller('EntityViewerController', ['$scope', '$mdDialog', require('./app/controllers/entityViewer/entityViewerController')]);
app.controller('EntityViewerAddDialogController', ['$scope', '$mdDialog', 'parentScope', '$state', require('./app/controllers/entityViewer/entityViewerAddDialogController')]);
app.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', 'parentScope', 'entityId', '$state', require('./app/controllers/entityViewer/entityViewerEditDialogController')]);
app.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', require('./app/controllers/entityViewer/entityViewerDeleteDialogController')]);
app.controller('ReportWizardController', ['$scope', require('./app/controllers/entityViewer/onBeforeLoadActions/reportWizardController')]);

app.controller('EntityEditorController', ['$scope', '$state', require('./app/controllers/entityEditorController')]);

app.controller('ComplexTransactionSpecialRulesController', ['$scope', require('./app/controllers/special-rules/complexTransactionSpecialRulesController')]);

app.controller('BookTransactionActionsTabController', ['$scope', require('./app/controllers/tabs/complex-transaction/bookTransactionActionsTabController')]);
app.controller('BookTransactionTransactionsTabController', ['$scope', require('./app/controllers/tabs/complex-transaction/bookTransactionTransactionsTabController')]);

app.controller('TransactionTypeActionsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/transaction-type/transactionTypeActionsTabController')]);
app.controller('TransactionTypeGeneralTabController', ['$scope', require('./app/controllers/tabs/transaction-type/transactionTypeGeneralTabController')]);
app.controller('TransactionTypeInputsTabController', ['$scope', require('./app/controllers/tabs/transaction-type/transactionTypeInputsTabController')]);

app.controller('AccrualCalculationSchedulesTabController', ['$scope', require('./app/controllers/tabs/instrument/accrualCalculationSchedulesController')]);
app.controller('EventSchedulesTabController', ['$scope', require('./app/controllers/tabs/instrument/eventSchedulesController')]);
app.controller('FactorScheduleTabController', ['$scope', require('./app/controllers/tabs/instrument/factorScheduleTabController')]);
app.controller('ManualPricingFormulasTabController', ['$scope', require('./app/controllers/tabs/instrument/manualPricingFormulasTabController')]);
app.controller('InstrumentEventActionsDialogController', ['$scope', '$mdDialog', 'eventActions', require('./app/controllers/dialogs/instrumentEventActionsDialogController')]);

app.controller('DataPortfolioController', ['$scope', require('./app/controllers/data/dataPortfolioController')]);
app.controller('DataTagController', ['$scope', require('./app/controllers/data/dataTagController')]);
app.controller('DataAccountController', ['$scope', require('./app/controllers/data/dataAccountController')]);
app.controller('DataAccountTypeController', ['$scope', require('./app/controllers/data/dataAccountTypeController')]);
app.controller('DataCounterpartyController', ['$scope', require('./app/controllers/data/dataCounterpartyController')]);
app.controller('DataCounterpartyGroupController', ['$scope', require('./app/controllers/data/dataCounterpartyGroupController')]);
app.controller('DataResponsibleController', ['$scope', require('./app/controllers/data/dataResponsibleController')]);
app.controller('DataResponsibleGroupController', ['$scope', require('./app/controllers/data/dataResponsibleGroupController')]);
app.controller('DataInstrumentController', ['$scope', require('./app/controllers/data/dataInstrumentController')]);
app.controller('DataInstrumentTypeController', ['$scope', require('./app/controllers/data/dataInstrumentTypeController')]);
app.controller('DataPricingPolicyController', ['$scope', require('./app/controllers/data/dataPricingPolicyController')]);
app.controller('DataTransactionController', ['$scope', require('./app/controllers/data/dataTransactionController')]);
app.controller('DataComplexTransactionController', ['$scope', require('./app/controllers/data/dataComplexTransactionController')]);
app.controller('DataTransactionTypeController', ['$scope', require('./app/controllers/data/dataTransactionTypeController')]);
app.controller('DataTransactionTypeGroupController', ['$scope', require('./app/controllers/data/dataTransactionTypeGroupController')]);
app.controller('DataPriceHistoryController', ['$scope', require('./app/controllers/data/dataPriceHistoryController')]);
app.controller('DataCurrencyHistoryController', ['$scope', require('./app/controllers/data/dataCurrencyHistoryController')]);
app.controller('DataCurrencyController', ['$scope', require('./app/controllers/data/dataCurrencyController')]);
app.controller('DataStrategyController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyController')]);
app.controller('DataStrategyGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyGroupController')]);
app.controller('DataStrategySubgroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategySubgroupController')]);
app.controller('TransactionsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditTransactionsController')]);
app.controller('InstrumentsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditInstrumentsController')]);

app.controller('BalanceReportController', ['$scope', require('./app/controllers/reports/balanceReportController')]);
app.controller('BalanceReportCustomAttrController', ['$scope', '$mdDialog', require('./app/controllers/reports/balanceReportCustomAttrController')]);
app.controller('BalanceReportDialogCustomAttrController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/balanceReportAddDialogCustomAttrController')]);

app.controller('ProfitAndLostReportController', ['$scope', require('./app/controllers/reports/profitAndLostReportController')]);
app.controller('TransactionReportController', ['$scope', require('./app/controllers/reports/transactionReportController')]);
app.controller('CashFlowProjectionReportController', ['$scope', require('./app/controllers/reports/cashFlowProjectionReportController')]);
app.controller('PerformanceReportController', ['$scope', require('./app/controllers/reports/performanceReportController')]);

app.controller('EntityDataConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/entityDataConstructorController')]);

app.controller('AdditionsEditorEntityEditController', ['$scope', '$state', '$mdDialog', require('./app/controllers/additionsEditorEntityEditController')]);

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/warningDialogController')]);
app.controller('SuccessDialogController', ['$scope', '$mdDialog', 'success', require('./app/controllers/dialogs/successDialogController')]);
app.controller('ValidationDialogController', ['$scope', '$mdDialog', 'validationData', require('./app/controllers/dialogs/validationDialogController')]);
app.controller('ExpressionEditorDialogController', ['$scope', '$mdDialog', 'item', require('./app/controllers/dialogs/expressionEditorDialogController')]);
app.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', require('./app/controllers/dialogs/infoDialogController')]);
app.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentSelectDialogController')]);
app.controller('ClassifierSelectDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierSelectDialogController')]);
app.controller('SaveLayoutDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/saveLayoutDialogController')]);

app.controller('AuditController', ['$scope', require('./app/controllers/system/auditController')]);
app.controller('NotificationsController', ['$scope', '$state', '$stateParams', require('./app/controllers/system/notificationsController')]);
app.controller('HeaderNotificationsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/HeaderNotificationsDialogController')]);

app.controller('SettingsGeneralController', ['$scope', '$state', require('./app/controllers/settings/settingsGeneralController')]);
app.controller('SettingsGeneralProfileController', ['$scope', require('./app/controllers/settings/general/settingsGeneralProfileController')]);
app.controller('SettingsGeneralDataProvidersController', ['$scope', require('./app/controllers/settings/general/settingsGeneralDataProvidersController')]);
app.controller('SettingsGeneralDataProvidersConfigController', ['$scope', '$stateParams', '$mdDialog', '$state', require('./app/controllers/settings/general/settingsGeneralDataProvidersConfigController')]);
app.controller('SettingsGeneralInstrumentImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentImportController')]);

app.controller('SettingsFormDesignController', ['$scope', '$state', require('./app/controllers/settings/settingsFormDesignController')]);
app.controller('SettingBloombergImportInstrumentController', ['$scope', '$state', require('./app/controllers/settings/settingBloombergImportInstrumentController')]);

app.controller('SettingsMembersAndGroupsController', ['$scope', '$mdDialog', require('./app/controllers/settings/settingsMembersAndGroupsController')]);
app.controller('CreateMemberDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createMemberDialogController')]);
app.controller('ManageMemberDialogController', ['$scope', '$mdDialog', 'memberId', require('./app/controllers/dialogs/manageMemberDialogController')]);
app.controller('ManageGroupDialogController', ['$scope', '$mdDialog', 'groupId', require('./app/controllers/dialogs/manageGroupDialogController')]);
app.controller('CreateGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createGroupDialogController')]);

app.controller('UiLayoutListDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutListDialogController')]);
app.controller('UiLayoutSaveAsDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutSaveAsDialogController')]);

app.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
app.directive('menuLink', [require('./app/directives/menuLinkDirective')]);

app.directive('bindFieldControl', [require('./app/directives/bindFieldControlDirective')]);
app.directive('layoutConstructorField', [require('./app/directives/layoutConstructorFieldDirective')]);
app.directive('addTabEc', ['$compile', require('./app/directives/addTabEcDirective')]);

app.directive('fileRead', [require('./app/directives/fileReadDirective')]);

// GROUP TABLE START

app.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
app.directive('groupTableBody', ['$mdDialog', require('./app/directives/groupTable/gTableBodyComponent')]);
app.directive('groupSidebarFilter', ['$mdDialog', require('./app/directives/groupTable/gSidebarFilterComponent')]);
app.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
app.directive('groupGrouping', ['$mdDialog', require('./app/directives/groupTable/gGroupingComponent')]);
app.directive('groupColumns', [require('./app/directives/groupTable/gColumnsComponent')]);
app.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]);
app.directive('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
app.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
app.directive('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
app.directive('groupVerticalScroll', [require('./app/directives/groupTable/gVerticalScrollComponent')]);
app.directive('groupHorizontalScroll', [require('./app/directives/groupTable/gHorizontalScrollComponent')]);
app.directive('groupSecondVerticalScroll', [require('./app/directives/groupTable/gSecondVerticalScrollComponent')]);
app.directive('groupEditorBinder', ['$templateCache', '$compile', require('./app/directives/groupTable/groupEditorBinderComponent')]);
app.directive('groupColumnInitWidth', [require('./app/directives/groupTable/gColumnInitWidthComponent.js')]);

app.directive('groupBindReportRow', [require('./app/directives/groupTable/gBindReportRowDirective.js')]);

app.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'reportOptions', require('./app/controllers/dialogs/gReportSettingsDialogController')]);


app.controller('gModalController', ['$scope', '$mdDialog', 'parentScope', 'callback', require('./app/directives/groupTable/gModalComponent')]);

// GROUP TABLE END


app.directive('evFieldResolver', [require('./app/directives/entityViewerFieldResolverDirective')]);
app.directive('ismFieldResolver', [require('./app/directives/instrumentSchemeManagerFieldResolverDirective')]);
app.directive('floatNumbers', [require('./app/directives/floatNumbersDirective')]);
app.directive('instrumentModalResolver', ['$mdDialog', require('./app/directives/instrumentModalResolverDirective')]);
app.directive('instrumentEventActionResolver', ['$mdDialog', require('./app/directives/instrumentEventActionResolverDirective')]);
app.directive('classifierModalResolver', ['$mdDialog', require('./app/directives/classifierModalResolverDirective')]);
app.directive('zhDatePicker', ['$mdDialog', require('./app/directives/zhDatePickerDirective')]);
app.directive('customScroll', [require('./app/directives/customScrollDirective')]);
app.directive('dragDialog', [require('./app/directives/dragDialogDirective')]);
app.directive('membersGroupsTable', [require('./app/directives/membersGroupsTableDirective')]);
app.directive('twoFieldsOptions', [require('./app/directives/twoFieldsOptionsDirective')]);
app.directive('inputFileDirective', [require('./app/directives/inputFileDirective')]);

app.filter('trustAsHtml', ['$sce', require('./app/filters/trustAsHtmlFilter')]);
app.filter('strLimit', ['$filter', require('./app/filters/strLimitFilter')]);

app.directive('ngRightClick', ['$parse', function ($parse) {
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

require('./templates.min.js');