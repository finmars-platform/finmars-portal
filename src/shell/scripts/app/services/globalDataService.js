'use strict';

export default function () {

	let data = {
		masterUser: null,
		master: null,
		member: null,
		user: null
	};

	const setMaster = function (master) {
		data.master = master;
	};

	const getMaster = () => {
		return data.master;
	};

	const setMasterUser = function (masterUser) {
		data.masterUser = masterUser;
	};

	const getMasterUser = () => {
		return data.masterUser;
	};

	const setUser = function (user) {
		data.user = user;
		console.log("testing globalDataService setuser", user, data);
	};

	const getUser = () => {
		console.log("testing globalDataService getUser", data.user);
		return data.user;
	};

	const setMember = function (member) {
		data.member = member;
	};

	const getMember = () => {
		return data.member;
	};

	return {
		setMaster: setMaster,
		getMaster: getMaster,

		setMasterUser: setMasterUser,
		getMasterUser: getMasterUser,

		setMember: setMember,
		getMember: getMember,

		setUser: setUser,
		getUser: getUser
	}

};