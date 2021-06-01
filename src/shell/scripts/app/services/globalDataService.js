'use strict';

export default function () {

	let userHaveCurrentMasterUser = false;

	let data = {
		masterUser: null,
		member: null,
		user: null
	};

	const doUserHasCurrentMasterUser = function () {
		return userHaveCurrentMasterUser;
	};

	/**
	 * Set whether user has current master user.
	 *
	 * @param currentMasterUserIsSet {boolean}
	 */
	const setCurrentMasterUserStatus = function (currentMasterUserIsSet) {
		userHaveCurrentMasterUser = currentMasterUserIsSet;
	};

	const setUser = function (user) {
		data.user = user;
	};

	const getUser = () => {
		return data.user;
	};

	const setMasterUser = function (masterUser) {
		data.masterUser = masterUser;
	};

	const getMasterUser = () => {
		return data.masterUser;
	};

	const setMember = function (member) {
		data.member = member;
	};

	const getMember = () => {
		return data.member;
	};

	const clearAllData = function () {

		userHaveCurrentMasterUser = false;

		for (const prop in data) {
			data[prop] = null;
		}

	};

	return {
		setCurrentMasterUserStatus: setCurrentMasterUserStatus,
		doUserHasCurrentMasterUser: doUserHasCurrentMasterUser,

		setUser: setUser,
		getUser: getUser,
		setMasterUser: setMasterUser,
		getMasterUser: getMasterUser,
		setMember: setMember,
		getMember: getMember,

		clearAllData: clearAllData
	}

};