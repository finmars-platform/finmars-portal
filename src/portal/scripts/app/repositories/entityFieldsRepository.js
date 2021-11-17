/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

	'use strict';

	var baseUrlService = require('../services/baseUrlService');
	var cookieService = require('../../../../core/services/cookieService');
	var xhrService = require('../../../../core/services/xhrService');
	var baseUrl = baseUrlService.resolve();

	var getPricingConditionChoices = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/pricing-condition/',
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			})
	};

	var getDailyPricingModelChoices = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/daily-pricing-model/',
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			})
	};

	var getPaymentSizeDetailChoices = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/payment-size-detail/',
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			})
	};

	var getTransactionClassList = function () {
		return new Promise(function (resolve, reject) {
			resolve([
				{
					"value": 1,
					"name": "Buy"
				},
				{
					"value": 2,
					"name": "Sell"
				},
				{
					"value": 3,
					"name": "FX Trade"
				},
				{
					"value": 4,
					"name": "Instrument PL"
				},
				{
					"value": 5,
					"name": "Transaction PL"
				},
				{
					"value": 6,
					"name": "Transfer"
				},
				{
					"value": 7,
					"name": "FX Transfer"
				},
				{
					"value": 8,
					"name": "Cash-Inflow"
				},
				{
					"value": 9,
					"name": "Cash-Outflow"
				}
			])
		})
	};

	module.exports = {
		getDailyPricingModelChoices: getDailyPricingModelChoices,
		getPaymentSizeDetailChoices: getPaymentSizeDetailChoices,
		getTransactionClassList: getTransactionClassList,
		getPricingConditionChoices: getPricingConditionChoices
	}

}());