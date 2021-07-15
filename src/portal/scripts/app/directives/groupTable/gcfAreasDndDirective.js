(function () {

	'use strict';

	const evEvents = require('../../services/entityViewerEvents');

	const metaService = require('../../services/metaService');
	const evHelperService = require('../../services/entityViewerHelperService');

	module.exports = function ($mdDialog) {
		return {
			restrict: 'A',
			scope: {
				evDataService: '=',
				evEventService: '=',
				contentWrapElement: '='
			},
			link: function (scope, elem, attrs) {

				scope.viewContext = scope.evDataService.getViewContext();

				const entityType = scope.evDataService.getEntityType();
				scope.isReport = metaService.isReport(entityType);

				let groups = scope.evDataService.getGroups();
				let columns = scope.evDataService.getColumns();

				let dndAreas = {};
				let hiddenDnDAreas = [];

				if (scope.viewContext !== 'dashboard') {
					hiddenDnDAreas = ['filtersHolder', 'deletionAreaHolder', 'leftSideGroupsHolder', 'rightSideColumnsHolder'];
				}

				

			}
		}
	}

})();