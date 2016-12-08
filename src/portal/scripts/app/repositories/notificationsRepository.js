/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

	'use strict';
	var baseUrlService = require('../services/baseUrlService');

	var baseUrl = baseUrlService.resolve();


	var getList = function(page){
		return window.fetch(baseUrl + 'notifications/notification/?all=true&page=' + page,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			}).then(function (data) {
			return data.json();
		})
	};

	module.exports = {
		getList: getList
	}

}());