/**
 * Created by mevstratov on 18.05.2022
 */

'use strict';

import instrumentEventService from "../../../services/instrumentEventService";

export default function ($scope, $mdDialog, data) {

	let vm = this;

	vm.eventsList = data.events ? JSON.parse(angular.toJson(data.events)) : [];

	vm.activeEvent = null;
	vm.activeEventIndex;

	vm.eventDisabled = false;

	if (vm.eventsList.length) {

		vm.activeEventIndex = 0;
		vm.activeEvent = vm.eventsList[vm.activeEventIndex];

		vm.eventDisabled = ![1, 9].includes(vm.activeEvent.status);

	}

	vm.statuses = instrumentEventService.getEventStatuses();

	let resolvedEventsList = [];

	vm.bookDefault = function () {

		var defaultAction = vm.activeEvent.event_schedule_object.actions.find(action => action.is_book_automatic);

		if (!defaultAction) {
			return;
		}

		instrumentEventService.getEventAction(vm.activeEvent.id, defaultAction.id).then(eAction => {

			const status = defaultAction.is_sent_to_pending ? 8 : 5;

			instrumentEventService.putEventAction(vm.activeEvent.id, defaultAction.id, eAction, status).then(() => {

				vm.activeEvent.status = status;
				resolvedEventsList.push(vm.activeEvent);

				vm.nextEventOrHide('book_default');

			}, error => {

				$mdDialog.show({
					controller: 'EventsReactionsErrorsDialogController as vm',
					templateUrl: 'views/dialogs/events/reactions-errors-dialog-view.html',
					parent: document.querySelector('.dialog-containers-wrap'),
					locals: {
						data: {
							events: [JSON.parse(angular.toJson(vm.activeEvent))]
						}
					},
					multiple: true

				})
			});

		});

	};

	const bookAll = function () {

		let unprocessedList = vm.eventsList.slice(vm.activeEventIndex);

		const eventsWithDefaultActions = unprocessedList.filter(event => {

			const hasDefaultAction = !!event.event_schedule_object.actions.find(action => action.is_book_automatic);

			return (event.status === 1 || event.status === 9) && hasDefaultAction;

		});

		$mdDialog.show({
			controller: 'EventsBookDefaultDialogController as vm',
			templateUrl: 'views/dialogs/events/book-default-dialog-view.html',
			parent: document.querySelector('.dialog-containers-wrap'),
			locals: {
				data: {
					events: eventsWithDefaultActions
				}
			},
			multiple: true

		}).then(res => {

			if (res.status === 'agree') {

				if (res.resolvedEvents && res.resolvedEvents.length) {
					resolvedEventsList = resolvedEventsList.concat(res.resolvedEvents);
				}

				$mdDialog.hide({status: "agree", eventAction: 'book_all', resolvedEvents: resolvedEventsList});

			}

		});

	};

	vm.bookSelData = {
		options: [],
		selectOption: function (option, _$popup) {

			_$popup.cancel();

			if (option.id === "book_all") {

				bookAll();

			} else {

				const action = vm.activeEvent.event_schedule_object.actions[option.id];

				instrumentEventService.getEventAction(vm.activeEvent.id, action.id).then(eAction => {

					const status = action.is_sent_to_pending ? 8 : 5;

					instrumentEventService.putEventAction(vm.activeEvent.id, action.id, eAction, status).then(() => {

						vm.activeEvent.status = status;
						resolvedEventsList.push(vm.activeEvent);

						vm.nextEventOrHide();

					});

				});

			}

		}
	};

	const getBookOptions = () => {

		let options = vm.activeEvent.event_schedule_object.actions.map((action, index) => {
			return {
				id: index,
				name: action.display_text
			}
		});

		var bookAllData = {
			id: "book_all",
			name: "Book All",
		}

		if (options.length) bookAllData.classes = "border-top";

		options.push(bookAllData);

		return options;

	};

	vm.bookSelData.options = getBookOptions();

	vm.ignore = function () {

		instrumentEventService.informedEventAction(vm.activeEvent.id).then(function () {

			vm.activeEvent.status = 2;
			resolvedEventsList.push(vm.activeEvent);

			vm.nextEventOrHide();

		});

	};

	vm.ignoreSelData = {
		options: [
			{
				id: "ignore_all",
				name: "Ignore all"
			}
		],
		selectOption: function (option, _$popup) {

			_$popup.cancel();

			if (option.id === 'ignore_all') {

				const unprocessedList = vm.eventsList.slice(vm.activeEventIndex);

				const newEvents = unprocessedList.filter(event => event.status === 1 || event.status === 9);

				if (newEvents.length) {

					let promisesList = [];

					newEvents.forEach(event => {

						const ignoreProm = new Promise((resolve, reject) => {

							instrumentEventService.informedEventAction(event.id).then(function () {

								event.status = 2;
								resolvedEventsList.push(event);

								resolve();

							}).catch(error => reject(error));

						});

						promisesList.push(ignoreProm);

					})

					Promise.allSettled(promisesList).then(function () {
						agree('ignore_all');
					});

				} else {
					agree('ignore_all');
				}

			}

		}
	};

	const agree = function (eventAction) {

		let resData = {status: "agree", eventAction: eventAction};

		if (resolvedEventsList.length) resData.resolvedEvents = resolvedEventsList;

		$mdDialog.hide(resData);

	};

	vm.nextEventOrHide = function (eventAction) {

		if (vm.activeEventIndex + 1 < vm.eventsList.length) {

			vm.activeEventIndex = vm.activeEventIndex + 1;
			vm.activeEvent = vm.eventsList[vm.activeEventIndex];

			vm.eventDisabled = ![1, 9].includes(vm.activeEvent.status);

			vm.bookSelData.options = getBookOptions();

		} else {
			agree(eventAction);
		}

	};

};