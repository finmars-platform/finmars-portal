'use strict';

const transactionHelper = require('../../../helpers/transaction.helper');
const directivesEvents = require('../../../services/events/directivesEvents');
const gridTableEvents = require('../../../services/gridTableEvents');

const EventService = require('../../../services/eventService');

export default function (globalDataService, usersService) {
	return {
		restrict: 'E',
		scope: {
			row: '=',
			column: '=',
			gtDataService: '=',
			gtEventService: '=',

			onLoadEnd: '&?',
		},
		templateUrl: 'views/directives/gridTable/cells/grid-table-ttype-selector-cell-view.html',
		link: function (scope, elem, attrs) {

			if (!Array.isArray(scope.column.settings.transactionTypes)) scope.column.settings.transactionTypes = [];

			/* scope.cdsData = {
				ttypeGroupsList: [],
				ttypeFavOptionsList: [],
			}; */

			scope.readyStatus = false;

			let uttsIndex;

			scope.onFavTTypeOptionsChange = function () {

				var member = globalDataService.getMember();

				transactionHelper.saveFavoriteTTypeOptions(member, scope.ttypeFavOptionsList, usersService).then(function () {
					scope.gtEventService.dispatchEvent(gridTableEvents.UPDATE_TRANSACTION_TYPE_SELECTORS);
				});

			};

			scope.onChange = function () {

				var rowData = {
					key: scope.row.key,
					order: scope.row.order,
				};

				var colData = {
					key: scope.column.key,
					order: scope.column.order,
				};

				if (scope.column.methods && scope.column.methods.onChange) {
					scope.column.methods.onChange(rowData, colData, scope.gtDataService, scope.gtEventService);
				}

				scope.gtEventService.dispatchEvent(gridTableEvents.CELL_VALUE_CHANGED, {row: rowData, column: colData});

			};

			var init = function () {

				scope.cdsEventService = new EventService();

				const member = globalDataService.getMember();

				scope.ttypeGroupsList = transactionHelper.getTransactionGroups(scope.column.settings.transactionTypes);

				scope.ttypeFavOptionsList = transactionHelper.getFavoriteTTypeOptions(member, scope.ttypeGroupsList);

				scope.readyStatus = true;

				uttsIndex = scope.gtEventService.addEventListener(gridTableEvents.UPDATE_TRANSACTION_TYPE_SELECTORS, function () {

					const member = globalDataService.getMember();

					scope.ttypeGroupsList = transactionHelper.getTransactionGroups(scope.column.settings.transactionTypes);
					scope.ttypeFavOptionsList = transactionHelper.getFavoriteTTypeOptions(member, scope.ttypeGroupsList);

					const argumentsObj = {
						menuOptions: scope.ttypeGroupsList,
						favoriteOptions: scope.ttypeFavOptionsList
					};

					scope.cdsEventService.dispatchEvent(directivesEvents.DROPDOWN_MENU_OPTIONS_CHANGED, argumentsObj);

				});

			};

			init();

			if (scope.onLoadEnd) {
				scope.onLoadEnd();
			}

			scope.$on('$destroy', function () {
				scope.gtEventService.removeEventListener(gridTableEvents.UPDATE_TRANSACTION_TYPE_SELECTORS, uttsIndex);
			});

		}
	}
};