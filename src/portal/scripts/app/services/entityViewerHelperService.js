/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

	'use strict';

	var transformItems = function (items, attrs) {
		return new Promise(function (resolve, reject) {
			var transformedItems = [];
			var i, x;
			//console.log('attrs', attrs);
			if (items && items.length) {
				transformedItems = items.map(function (item) {
					for (i = 0; i < attrs.length; i = i + 1) {
						for (x = 0; x < item.attributes.length; x = x + 1) {
							if (item.attributes[x]['attribute_type'] === attrs[i].id) {
								item.attributes[x]['attribute_name'] = attrs[i].name;
								if (item.attributes[x]['attribute_type_object'].value_type == 30) {
									item[attrs[i].name] = item.attributes[x]['classifier'];
									//console.log('item!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', item);
								} else {
									if (item.attributes[x]['attribute_type_object'].value_type == 40) {
										item[attrs[i].name] = item.attributes[x]['value_date'];
									} else {
										if (item.attributes[x]['attribute_type_object'].value_type == 20) {
											item[attrs[i].name] = item.attributes[x]['value_float'];
										} else {
											item[attrs[i].name] = item.attributes[x]['value_string'];
										}
									}

								}

							}
						}
					}
					return item;
				});
			};
			// console.log('Items transformed', transformedItems);
			resolve(transformedItems);

		});

	};

	module.exports = {
		transformItems: transformItems
	}

}());