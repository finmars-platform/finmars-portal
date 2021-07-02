(function () {

	'use strict';
	const metaHelper = require("./meta.helper");

	/** @module: gFiltersHelper */
	module.exports = function () {

		/**
		 *
		 * @param filter {Object}
		 * @param isReport {Object=}
		 * @returns {Object} - changed filter
		 * @memberof gFiltersHelper
		 */
		const setFilterDefaultOptions = (filter, isReport) => {

			if (!filter.options) {
				filter.options = {}
			}

			if (!filter.options.filter_type) {
				filter.options.filter_type = metaHelper.getDefaultFilterType(filter.value_type);
			}

			if (!filter.options.filter_values) {
				filter.options.filter_values = []
			}

			if (!filter.options.hasOwnProperty('exclude_empty_cells')) {
				filter.options.exclude_empty_cells = false;
			}

			if (isReport) {

				if (!filter.options.use_from_above) {
					filter.options.use_from_above = {}
				}

			}

			return filter;

		};
		/**
		 *
		 * @param filterType {string} - filter mode
		 * @param filterOptions {Object}
		 * @returns {Array} - array with filterType and emptied filterOptions
		 * @memberof gFiltersHelper
		 */
		const emptyTextFilter = (filterType, filterOptions) => {

			filterOptions.filter_type = filterType;

			if (filterType === 'empty') {
				filterOptions.exclude_empty_cells = false;
			}

			filterOptions.filter_values = [];

			return [filterType, filterOptions];

		};
		/**
		 * @param filterType {string} - filter mode
		 * @param filterOptions {Object}
		 * @returns {Array} - array with filterType and emptied filterOptions
		 * @memberof gFiltersHelper
		 */
		const emptyNumberFilter = (filterType, filterOptions) => {

			filterOptions.filter_type = filterType;

			if (filterType === 'from_to' || filterType === 'out_of_range') {

				filterOptions.filter_values = {}

			} else {

				if (filterType === 'empty') {
					filterOptions.exclude_empty_cells = false;
				}

				filterOptions.filter_values = [];

			}

			return [filterType, filterOptions];

		};
		/**
		 * @param filterType {string} - filter mode
		 * @param filterOptions {Object}
		 * @returns {Array} - array with filterType and emptied filterOptions
		 * @memberof gFiltersHelper
		 */
		const emptyDateFilter = (filterType, filterOptions) => {

			filterOptions.filter_type = filterType;

			if (filterType === 'date_tree') {
				filterOptions.dates_tree = [];

			}
			else if (filterType === 'from_to' || filterType === 'out_of_range') {

				filterOptions.filter_values = {}

			} else {

				if (filterType === 'empty') {
					filterOptions.exclude_empty_cells = false;
				}

				filterOptions.filter_values = [];

			}

			return [filterType, filterOptions];

		};
		/**
		 *
		 * @param useFromAboveDialogPromise {Promise} - response of dialog window with use from above settings
		 * @param filterOptions {Object}
		 * @returns {Promise<Array>} - array with filterType and emptied filterOptions
		 * @memberof gFiltersHelper
		 */
		const openUseFromAboveSettings = function (useFromAboveDialogPromise, filterOptions) {

			return new Promise ((resolve, reject) => {

				useFromAboveDialogPromise.then(ufaData => {

					let activeFilterType = ufaData;

					if (activeFilterType === 'use_from_above') {

						filterOptions.use_from_above = {};
						filterOptions.filter_type = activeFilterType;
						filterOptions.filter_values = [];

					}

					resolve([activeFilterType, filterOptions]);

				});

			});

		};
		/**
		 *
		 * @param dateTree {Object}
		 * @returns {Array} - selected dates
		 */
		const convertDatesTreeToFlatList = function (dateTree) {

			var datesList = [];

			dateTree.map(function (yearGroup) {

				yearGroup.items.map(function (monthGroup) {

					monthGroup.items.map(function (date) {

						delete date.dayNumber;
						delete date.available;

						date = JSON.parse(angular.toJson(date));

						if (date.active) {
							datesList.push(date.value);
						}

					});

				});

			});

			return datesList;

		};

		return {
			setFilterDefaultOptions: setFilterDefaultOptions,

			emptyTextFilter: emptyTextFilter,
			emptyNumberFilter: emptyNumberFilter,
			emptyDateFilter: emptyDateFilter,

			openUseFromAboveSettings: openUseFromAboveSettings,

			convertDatesTreeToFlatList: convertDatesTreeToFlatList
		};

	}

})();