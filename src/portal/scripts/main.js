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
    'ui.router'
]);


app.config(['$stateProvider', '$urlRouterProvider', require('./app/router.js')]);

app.run(function(){
    console.log('App initialized');
});


app.controller('ShellController', ['$scope', require('./app/controllers/shellController')]);
app.controller('SideNavController', ['$scope', require('./app/controllers/sideNavController')]);

app.controller('DashboardController', ['$scope', require('./app/controllers/dashboardController')]);

app.controller('PortfolioController', ['$scope', '$mdDialog', '$mdMedia', require('./app/controllers/administration/portfolioController')]);
app.controller('PortfolioAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/administration/portfolioAddDialogController')]);

app.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
app.directive('menuLink', [require('./app/directives/menuLinkDirective')]);

// GROUP TABLE START

app.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
app.directive('groupTableBody', [require('./app/directives/groupTable/gTableBodyComponent')]);
app.directive('groupSidebarFilter', [require('./app/directives/groupTable/gSidebarFilterComponent')]);
app.directive('groupRowSelection', [require('./app/directives/groupTable/gRowSelectionComponent')]);
app.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
app.directive('groupModal', [require('./app/directives/groupTable/gModalComponent')]);
app.directive('groupGrouping', [require('./app/directives/groupTable/gGroupingComponent')]);
app.directive('groupColumns', [require('./app/directives/groupTable/gColumnsComponent')]);

// GROUP TABLE END





require('./templates.min.js');