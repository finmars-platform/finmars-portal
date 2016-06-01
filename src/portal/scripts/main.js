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
    angularDragula(angular)
]);


app.config(['$stateProvider', '$urlRouterProvider', require('./app/router.js')]);

app.run(function(){
    console.log('App initialized');
});


app.controller('ShellController', ['$scope', '$state', require('./app/controllers/shellController')]);
app.controller('SideNavController', ['$scope', require('./app/controllers/sideNavController')]);

app.controller('DashboardController', ['$scope', require('./app/controllers/dashboardController')]);

app.controller('PortfolioController', ['$scope', '$mdDialog', '$mdMedia', require('./app/controllers/administration/portfolioController')]);
app.controller('PortfolioAddDialogController', ['$scope', '$mdDialog', 'parentScope', '$state', require('./app/controllers/administration/portfolioAddDialogController')]);
app.controller('PortfolioEditDialogController', ['$scope', '$mdDialog', 'parentScope', 'portfolio', '$state', require('./app/controllers/administration/portfolioEditDialogController')]);
app.controller('PortfolioDeleteDialogController', ['$scope', '$mdDialog', 'portfolio', require('./app/controllers/administration/PortfolioDeleteDialogController')]);

app.controller('EntityDataConstructorController', ['$scope', '$stateParams', '$state', require('./app/controllers/entityDataConstructorController')]);
app.controller('EntityDataConstructorDialogController', ['$scope', '$mdDialog', 'parentScope', require('./app/controllers/entityDataConstructorDialogController')]);

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
app.directive('groupAligner', [require('./app/directives/groupTable/gGroupAlignerComponent')]);
app.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
app.directive('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);

app.controller('gModalController', ['$scope', '$mdDialog', 'parentScope', 'callback', require('./app/directives/groupTable/gModalComponent')]);

// GROUP TABLE END





require('./templates.min.js');