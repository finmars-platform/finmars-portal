/**
 * Created by mevstratov on 21.05.2022
 */

'use strict';

import instrumentEventService from "../../../services/instrumentEventService";

export default function ($scope, $mdDialog, data) {

	let vm = this;

	vm.events = data.events;

	vm.statuses = instrumentEventService.getEventStatuses();

	vm.cancel = function () {
		$mdDialog.hide({status: 'disagree'});
	}

};