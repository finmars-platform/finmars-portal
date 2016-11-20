(function() {

	'use strict';

	var metaService = require('../../services/metaService');

	module.exports = function () {
		return {
			restrict: 'A',
			scope: {
				columns: "="
			},
			link: function (scope, elem, attr) {
				var groupsWidth = metaService.columnsWidthGroups();
				var setDefaultWidth = function () {
					if (groupsWidth['newColumnAdded']) {
						var columns = elem.find('.g-column');
						var lastColumn = columns.length - 1;
						var newColumn = columns[lastColumn];
						var columnWidth;
						switch (scope.columns[lastColumn]["value_type"]) {
							case 10:
								columnWidth = groupsWidth.groupThree;
								break;
							case 20:
							case 40:
								columnWidth = groupsWidth.groupFive;
								break;
							case 30:
								columnWidth = groupsWidth.groupOne;
								break;
						}
						$(newColumn).width(columnWidth);
					}
				};
				scope.$watchCollection('columns', function () {
					setDefaultWidth();
				});
			}
		}
	}
}());