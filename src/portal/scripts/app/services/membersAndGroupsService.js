(function() {
	'use strict';

	var membersAndGroupsRepository = require('../repositories/membersAndGroupsRepository');

	var getList = function (type) {
		return membersAndGroupsRepository.getList(type);
	};

	var create = function (type, data) {
		return membersAndGroupsRepository.create(type);
	}

	var update = function (type, id, data) {
		return membersAndGroupsRepository.update(type);
	};

	var deleteByKey = function (type, id) {
		return membersAndGroupsRepository.deleteByKey(type, id);
	};

	module.exports = {
		getList: getList,
		create: create,
		update: update,
		deleteByKey: deleteByKey
	}
}());