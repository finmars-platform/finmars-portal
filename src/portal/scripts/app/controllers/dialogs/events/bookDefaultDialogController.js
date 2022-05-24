/**
 * Created by mevstratov on 16.05.2022
 */

'use strict';

const instrumentEventService = require('../../../services/instrumentEventService');

export default function ($scope, $mdDialog, toastNotificationService, data) {

	let vm = this;

	vm.eventsList = data.events ? JSON.parse(angular.toJson(data.events)) : [];

	vm.defaultActionsList = vm.eventsList.map(function (event) {
		return event.event_schedule_object.actions.find(action => action.is_book_automatic);
	});

	vm.agree = function () {

		let actionsPromList = [];

		vm.eventsList.forEach(function (event, index) {

			const defaultAction = vm.defaultActionsList[index];

			const actionProm = new Promise((resolve, reject) => {

				 const onError = error => {

					error.___action = defaultAction;
					error.___event = event;
					console.error(error);
					reject(error);

				};

				instrumentEventService.getEventAction(event.id, defaultAction.id).then(eAction => {

					const status = defaultAction.is_sent_to_pending ? 8 : 5;

					instrumentEventService.putEventAction(event.id, defaultAction.id, eAction, status).then(() => {

						resolve({eventId: event.id, actionId:  defaultAction.id, status: status});

					}).catch(onError);

				}).catch(onError);

			});

			actionsPromList.push(actionProm);

		});

		Promise.allSettled(actionsPromList).then(actionsExecList => {

			let rejectsList = [];
			let successesList = [];

			const rejectedActionsList = actionsExecList.filter((actionData, index) => {

				if (actionData.status === 'rejected') {

					rejectsList.push(vm.eventsList[index]);

					return true;

				} else {

					vm.eventsList[index].status = actionData.value.status;
					successesList.push(vm.eventsList[index]);

					return false;

				}

			});

			let responseData = {
				status: 'agree',
			};

			if (successesList.length) responseData.resolvedEvents = successesList;

			if (rejectedActionsList.length) {

				if (rejectedActionsList.length === vm.eventsList.length) responseData.status = 'error';

				rejectedActionsList.forEach(rejectionData => {
					console.error(rejectionData.reason);
				});

				// toastNotificationService.error("Error occured while trying to book some of the transactions.");

				responseData.errors = rejectedActionsList;

				$mdDialog.show({
					controller: 'EventsReactionsErrorsDialogController as vm',
					templateUrl: 'views/dialogs/events/reactions-errors-dialog-view.html',
					parent: document.querySelector('.dialog-containers-wrap'),
					locals: {
						data: {
							events: rejectsList
						}
					},
					multiple: true

				}).then(() => {
					$mdDialog.hide(responseData);
				});

			} else {
				toastNotificationService.success("Success")
				$mdDialog.hide(responseData);
			}

		});

	};

	vm.cancel = function () {
		$mdDialog.hide({status: 'disagree'});
	}

};