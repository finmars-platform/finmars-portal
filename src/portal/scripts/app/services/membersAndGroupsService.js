(function() {
	'use strict';

	var membersAndGroupsRepository = require('../repositories/membersAndGroupsRepository');

	var getList = function (type) {
		return membersAndGroupsRepository.getList(type);
	};

	var getMemberOrGroupByKey = function (type, id) {
		return membersAndGroupsRepository.getMemberOrGroupByKey(type, id);
	}

	var create = function (type, data) {
		return membersAndGroupsRepository.create(type, data);
	}

	var update = function (type, id, data) {
		return membersAndGroupsRepository.update(type, id, data);
	};

	var deleteByKey = function (type, id) {
		return membersAndGroupsRepository.deleteByKey(type, id);
	};

	module.exports = {
		getList: getList,
		getMemberOrGroupByKey: getMemberOrGroupByKey,
		create: create,
		update: update,
		deleteByKey: deleteByKey
	}
}());