/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

	'use strict';

	function configureUrl(url, options) {
		if (options) {
			if (options.filters && options.sort.key) {
				keys = Object.keys(options.filters);
				keys.forEach(function (keysItem) {
					if (options.filters[keysItem]) {
						var filterItems = options.filters[keysItem];
						filterItems.map(function (filterItem, index) {
							if (index === 0) {
								url = url + '?' + keysItem + '=' + filterItem;
							} else {
								url = url + '&' + keysItem + '=' + filterItem;
							} 
						})
					}
				})
			}
			else if (options.filters && !options.sort.key) {
				var keys = [];
				keys = Object.keys(options.filters);
				keys.forEach(function (keysItem, i) {
					var filterItems = options.filters[keysItem];
					// if (i === 0) {
						// console.log('options.filters[keysItem]', filterItems);
					filterItems.map(function (filterItem, index) {
						if (index === 0) {
							url = url + '?' + keysItem + '=' + filterItem;
						} else {
							url = url + '&' + keysItem + '=' + filterItem;
						}
					})
					// } else {
					// 	console.log("without sorting");
					// 	filterItems.map(function (filterItem) {
					// 		url = url + '&' + keysItem + '=' + filterItem;
					// 	})
					// }
				})
			}
			else if (options.sort.key) {
				console.log('yet sorting');
				if (options.sort.direction === 'ASC') {
					url = url + '?ordering=' + options.sort.key
				} else {
					url = url + '?ordering=-' + options.sort.key
				}
			}

			if(options.page) {
				url = url + '&page=' + options.page;
			}
		}
		return url
	}

	module.exports = {
		configureUrl: configureUrl
	}

}());