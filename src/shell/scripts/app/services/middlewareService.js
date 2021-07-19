/**
 * Created by mevstratov on 08.03.2019
 *
 * Used to perform global communication between modules
 */
// (function () {

'use strict';

export default function () {

	/* COMMITTED: 2021-07-19

	function setNewEntityViewerLayoutName(layoutName) {
		data.newEntityViewerLayoutName = layoutName;
	}

	function getNewEntityViewerLayoutName() {

		const newLayout = data.newEntityViewerLayoutName;
		data.newEntityViewerLayoutName = false;

		return newLayout;

	}

	function setNewSplitPanelLayoutName(layoutName) {
		data.newSplitPanelLayoutName = layoutName;
	}

	function getNewSplitPanelLayoutName() {
		return data.newSplitPanelLayoutName;
	} */
	let data = {
		/* newEntityViewerLayoutName: false,
		newSplitPanelLayoutName: false, */
		warnOnLayoutChangeFn: false,
		masterUserChangeEvents: [],
		logOutEvents: []
	};

	function setWarningOfLayoutChangesLossFn(callbackFn) {
		data.warnOnLayoutChangeFn = callbackFn;
	}

	function getWarningOfLayoutChangesLossFn() {
		var callbackFn = data.warnOnLayoutChangeFn;
		data.warnOnLayoutChangeFn = false;
		return callbackFn;
	}
	/**
	 *
	 * @param callback {Function} - to be called on log out
	 * @returns {number} - index of added callback inside list of callbacks
	 */
	function onMasterUserChanged(callback) {

		if (callback) {
			data.masterUserChangeEvents.push(callback);
			return data.masterUserChangeEvents.length - 1;
		}

	}

	function removeOnUserChangedListeners (callbackIndex) {

		if (callbackIndex < 0) {
			throw "Index is 0 or lesser";
		}

		if (callbackIndex > data.masterUserChangeEvents.length) {
			throw "Index is greater then listeners count";
		}

		data.masterUserChangeEvents.splice(callbackIndex, 1);

	}

	function masterUserChanged() {

		data.masterUserChangeEvents.forEach(function (callback) {
			callback();
		});

	}

	/**
	 *
	 * @param callback {Function} - to be called on log out
	 * @returns {number} - index of added callback inside list of callbacks
	 */
	function addListenerOnLogOut(callback) {

		if (callback) {
			data.logOutEvents.push(callback);
			return data.logOutEvents.length - 1;
		}

	}

	function removeOnLogOutListener (callbackIndex) {

		if (callbackIndex < 0) {
			throw "Index is 0 or lesser";
		}

		if (callbackIndex > data.logOutEvents.length) {
			throw "Index is greater then listeners count";
		}

		data.logOutEvents.splice(callbackIndex, 1);

	}

	function initLogOut() {

		data.logOutEvents.forEach(function (callback) {
			callback();
		});

	}

	function clearEvents() {
		data.masterUserChangeEvents = [];
		data.logOutEvents = [];
	}

	function resetData() {
		data = {
			newEntityViewerLayoutName: false,
			newSplitPanelLayoutName: false,
			warnOnLayoutChangeFn: false,
			masterUserChanged: false
		};
	}
	/** @module: middlewareService */
	return {
		/* COMMITTED: 2021-07-19

		setNewEntityViewerLayoutName: setNewEntityViewerLayoutName,
		getNewEntityViewerLayoutName: getNewEntityViewerLayoutName,
		setNewSplitPanelLayoutName: setNewSplitPanelLayoutName,
		getNewSplitPanelLayoutName: getNewSplitPanelLayoutName, */

		setWarningOfLayoutChangesLossFn: setWarningOfLayoutChangesLossFn,
		getWarningOfLayoutChangesLossFn: getWarningOfLayoutChangesLossFn,

		onMasterUserChanged: onMasterUserChanged,
		removeOnUserChangedListeners: removeOnUserChangedListeners,
		masterUserChanged: masterUserChanged,

		addListenerOnLogOut: addListenerOnLogOut,
		removeOnLogOutListener: removeOnLogOutListener,
		initLogOut: initLogOut,

		clearEvents: clearEvents,
		resetData: resetData
	};
};

// }());