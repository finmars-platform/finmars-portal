/**
 * Created by szhitenev on 04.05.2016.
 */
'use strict';

var app = angular.module('app', [
	'ngAria',
	'ngMaterial',
	'ngMessages',
	'ngMdIcons',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'mdPickers',
	'io.dennis.contextmenu',
	angularDragula(angular)
]);


app.config(['$stateProvider', '$urlRouterProvider', require('./app/router.js')]);
app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function (date) {
		return moment(date).format('YYYY-MM-DD');
	};
}]);

app.run(function () {
	console.log('App initialized');
});


app.controller('ShellController', ['$scope', '$state', '$rootScope', '$mdDialog', require('./app/controllers/shellController')]);
app.controller('SideNavController', ['$scope', require('./app/controllers/sideNavController')]);

app.controller('DashboardController', ['$scope', require('./app/controllers/dashboardController')]);

app.controller('NotificationsController', ['$scope', require('./app/controllers/notificationsController')]);
app.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', require('./app/controllers/attributesManagerController')]);
app.controller('AttributesManagerEditDialogController', ['$scope', '$mdDialog', 'attribute', require('./app/controllers/attributesManagerEditDialogController')]);
app.controller('AttributesManagerAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/attributesManagerAddDialogController')]);
app.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/classificationEditorDialogController')]);




app.controller('EntityViewerController', ['$scope', '$mdDialog', '$mdMedia', require('./app/controllers/entityViewer/entityViewerController')]);
app.controller('EntityViewerAddDialogController', ['$scope', '$mdDialog', 'parentScope', '$state', require('./app/controllers/entityViewer/entityViewerAddDialogController')]);
app.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', 'parentScope', 'entity', '$state', require('./app/controllers/entityViewer/entityViewerEditDialogController')]);
app.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', require('./app/controllers/entityViewer/entityViewerDeleteDialogController')]);

app.controller('DataPortfolioController', ['$scope', require('./app/controllers/data/dataPortfolioController')]);
app.controller('DataAccountController', ['$scope', require('./app/controllers/data/dataAccountController')]);
app.controller('DataCounterpartyController', ['$scope', require('./app/controllers/data/dataCounterpartyController')]);
app.controller('DataResponsibleController', ['$scope', require('./app/controllers/data/dataResponsibleController')]);
app.controller('DataInstrumentController', ['$scope', require('./app/controllers/data/dataInstrumentController')]);
app.controller('DataTransactionController', ['$scope', require('./app/controllers/data/dataTransactionController')]);
app.controller('DataPriceHistoryController', ['$scope', require('./app/controllers/data/dataPriceHistoryController')]);
app.controller('DataCurrencyHistoryController', ['$scope', require('./app/controllers/data/dataCurrencyHistoryController')]);

app.controller('EntityDataConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/entityDataConstructorController')]);

app.controller('AdditionsEditorEntityEditController', ['$scope', '$state', require('./app/controllers/additionsEditorEntityEditController')]);

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/warningDialogController')]);
app.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', require('./app/controllers/infoDialogController')]);
app.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog',  require('./app/controllers/instrumentSelectDialogController')]);

app.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
app.directive('menuLink', [require('./app/directives/menuLinkDirective')]);

app.directive('bindFieldControl', [require('./app/directives/bindFieldControlDirective')]);
app.directive('layoutConstructorField', [require('./app/directives/layoutConstructorFieldDirective')]);
app.directive('addTabEc', ['$compile', require('./app/directives/addTabEcDirective')]);

// GROUP TABLE START

app.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
app.directive('groupTableBody', ['$mdDialog', require('./app/directives/groupTable/gTableBodyComponent')]);
app.directive('groupSidebarFilter', [require('./app/directives/groupTable/gSidebarFilterComponent')]);
app.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
app.directive('groupGrouping', ['$mdDialog', require('./app/directives/groupTable/gGroupingComponent')]);
app.directive('groupColumns', [require('./app/directives/groupTable/gColumnsComponent')]);
app.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]);
app.directive('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
app.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
app.directive('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
app.directive('groupVerticalScroll', [require('./app/directives/groupTable/gVerticalScrollComponent')]);
app.directive('groupHorizontalScroll', [require('./app/directives/groupTable/gHorizontalScrollComponent')]);
app.directive('groupEditorBinder', ['$templateCache', '$compile', require('./app/directives/groupTable/groupEditorBinderComponent')]);
app.directive('groupColumnInitWidth', [require('./app/directives/groupTable/gColumnInitWidthComponent.js')]);

app.controller('gModalController', ['$scope', '$mdDialog', 'parentScope', 'callback', require('./app/directives/groupTable/gModalComponent')]);

// GROUP TABLE END

app.directive('evFieldResolver', [require('./app/directives/entityViewerFieldResolverDirective')]);
app.directive('floatNumbers', [require('./app/directives/floatNumbersDirective')]);
app.directive('instrumentModalResolver', ['$mdDialog', require('./app/directives/instrumentModalResolverDirective')]);
app.directive('zhDatePicker', ['$mdDialog', require('./app/directives/zhDatePickerDirective')]);

app.filter('trustAsHtml', ['$sce', require('./app/filters/trustAsHtmlFilter')]);
app.filter('strLimit', ['$filter', require('./app/filters/strLimitFilter')]);

app.directive('ngRightClick', ['$parse', function($parse) {
	return function(scope, element, attrs) {
		var fn = $parse(attrs.ngRightClick);
		element.bind('contextmenu', function(event) {
			scope.$apply(function() {
				event.preventDefault();
				fn(scope, {$event:event});
			});
		});
	};
}]);


require('./templates.min.js');