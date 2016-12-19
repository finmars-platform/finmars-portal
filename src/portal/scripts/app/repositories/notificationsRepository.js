/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

	'use strict';
	var baseUrlService = require('../services/baseUrlService');

	var baseUrl = baseUrlService.resolve();
	var cookieService = require('../../../../core/services/cookieService');
	
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

	var markAsReaded = function (url, data) {
		var markUrl;
		switch (url) {
			case url.page && url.page.length:
				markUrl = '&page=' + url.page
				break;
			default:
				markUrl = ''
		}
		return window.fetch(baseUrl + 'notifications/notification/' + markUrl,
			{
			    method: 'POST',
			    credentials: 'include',
			    headers: {
			        'X-CSRFToken': cookieService.getCookie('csrftoken'),
			        Accept: 'application/json',
			        'Content-type': 'application/json'
			    },
			    body: JSON.stringify(data)
			}).then(function () {
				return data.json();
			});
	}

	module.exports = {
		getList: getList,
		markAsReaded: markAsReaded
	}

}());