(function() {
	'use strict';

    var membersAndGroupsRepository = require('../repositories/membersAndGroupsRepository');

	var baseUrl = '/api/v1/';

	var getMembersOrGroups = function (option) {
		var fetchUrl = '';
		option === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		return window.fetch(baseUrl + 'users/member/',
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
		getMembersOrGroups: getMembersOrGroups
	}
}());