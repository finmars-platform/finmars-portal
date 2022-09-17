/**
 * Created by mevstratov on 17.09.2022.
 */
(function () {

	'use strict';

	var getAttributes = function () {
		return [
			{
				"key": "name",
				"name": "Name",
				"value_type": 10
			},
			{
				"key": "short_name",
				"name": "Short name",
				"value_type": 10
			},
			{
				"key": "notes",
				"name": "Notes",
				"value_type": 10
			},
			{
				"key": "user_code",
				"name": "User code",
				"value_type": 10
			},
			{
				"key": "public_name",
				"name": "Public name",
				"value_type": 10,
				"allow_null": true
			},
			{
				"key": "notes",
				"name": "Notes",
				"value_type": 10
			},

			{
				"key": "registers",
				"name": "Portfolio registers",
				"value_content_type": "portfolios.portfolioregister",
				"value_entity": "portfolio-register",
				"code": "user_code",
				"value_type": "mc_field"
			}
		]
	};

	module.exports = {

		getAttributes: getAttributes

	}


}());