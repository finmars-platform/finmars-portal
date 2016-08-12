/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

	'use strict';

	function configureUrl(url, options) {
		if (options) {

			url = url + '?';

			var keys = [];

			if(options.hasOwnProperty('filters')) {
				keys = Object.keys(options.filters);
				keys.forEach(function (keysItem) {
					if (options.filters[keysItem]) {
						var filterItems = options.filters[keysItem];
						if (typeof filterItems === 'string') {
							url = url + '&' + keysItem + '=' + filterItems;
						} else {
							filterItems.map(function (filterItem, index) {
								url = url + '&' + keysItem + '=' + filterItem;
							})
						}
					}
				})
			}

			if(options.hasOwnProperty('sort')) {
				if (options.sort.direction === 'ASC') {
					url = url + '&ordering=' + options.sort.key
				} else {
					url = url + '&ordering=-' + options.sort.key
				}
			}

			if(options.hasOwnProperty('page')) {
				url = url + '&page=' + options.page;
			}


			//console.log('URL------------------', url);
		}
		return url
	}

	module.exports = {
		configureUrl: configureUrl
	}

}());