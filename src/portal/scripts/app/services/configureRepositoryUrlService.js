/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

	'use strict';

	function entityPlurarToSingular(key){
		switch (key){
			case 'accounts':
				return 'account';
				break;
			case 'portfolios':
				return 'portfolio';
				break;
			case 'responsibles':
				return 'responsible';
				break;
			case 'counterparties':
				return 'counterparty';
				break;
		}
	}

	function configureUrl(url, options) {

		console.log('OPTIOPNS', options);



		if (options) {

			url = url + '?';

			var keys = [];

			if(options.hasOwnProperty('filters')) {
				keys = Object.keys(options.filters);
				keys.forEach(function (keysItem) {
					if (options.filters[keysItem]) {
						var filterItems = options.filters[keysItem];
						if (typeof filterItems === 'string') {
							url = url + '&' + entityPlurarToSingular(keysItem) + '=' + filterItems;
						} else {
							filterItems.map(function (filterItem, index) {
								url = url + '&' + entityPlurarToSingular(keysItem) + '=' + filterItem;
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