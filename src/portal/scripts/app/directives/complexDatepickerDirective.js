/**
 * @module complexDatepickerDirective
 */
(function () {

	'use strict';

	const metaService = require('../services/metaService');
	const expressionService = require('../services/expression.service');

	const popupEvents = require('../services/events/popupEvents');
	const evEvents = require('../services/entityViewerEvents');

	module.exports = function ($mdDialog, pickmeup) {

		return {
			restrict: 'E',
			scope: {
				date: '=', // also used as dateFrom if datepicker in rangeOfDates mode
				datepickerOptions: '=',
				dateTo: '=',
				datepickerToOptions: '=',
				evDataService: '=',
				evEventService: '=',
				attributeDataService: '=',
				popupEventService: '='
			},
			templateUrl: 'views/directives/complex-datepicker-view.html',
			link: function (scope, elem, attrs) {
				console.log("testing complexDatepickerDirective date", scope.date, scope.datepickerOptions);
				console.log("testing complexDatepickerDirective dateTo", scope.dateTo, scope.datepickerToOptions);
				scope.rangeOfDates = scope.dateTo !== undefined;
				scope.dateIsDisabled = false;

				const entityType = scope.evDataService.getEntityType();
				const isReport = metaService.isReport(entityType);

				let firstCalendarElem, secondCalendarElem;
				let useFromAboveEventIndex, attributeKey;

				console.log("testing scope.datepickerOptions", scope.datepickerOptions);
				scope.openEditExpressionDialog = function ($event, dateNumber) {

					/* if (scope.datepickerOptions.datepickerMode !== 'expression') {

						scope.datepickerOptions.datepickerMode = 'expression';
						scope.datepickerOptions.expression = undefined;

						setTimeout(() => {
							scope.callbackMethod()
						}, 500);

					} */
					let dateProp = 'date';
					let datepickerOptsProp = 'datepickerOptions';

					if (dateNumber === 2) {
						dateProp = 'dateTo';
						datepickerOptsProp = 'datepickerToOptions';
					}
					console.log("testing openEditExpressionDialog", dateProp, datepickerOptsProp);
					const datepickerOptionsCopy = JSON.parse(JSON.stringify(scope[datepickerOptsProp]));

					let eeData = {returnExpressionResult: true};

					if (isReport) {

						eeData.entityType = entityType;
						eeData.attributeDataService = scope.attributeDataService;

					}

					const dialogContainerWrapElem = document.querySelector('.dialog-containers-wrap');

					$mdDialog.show({
						controller: 'ExpressionEditorDialogController as vm',
						templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
						parent: dialogContainerWrapElem,
						targetEvent: $event,
						autoWrap: true,
						locals: {
							item: {expression: datepickerOptionsCopy.expression},
							data: eeData
						}

					})
					.then(function (res) {

						if (res.status === 'agree') {

							scope[datepickerOptsProp].expression = res.data.item.expression;

							var expressionData = {
								expression: scope[datepickerOptsProp].expression,
								is_eval: true
							};

							// if no expression entered, turn off expression mode
							scope[datepickerOptsProp].datepickerMode = 'datepicker';

							if (scope[datepickerOptsProp].expression) {

								scope[datepickerOptsProp].datepickerMode = 'expression';

								expressionService.getResultOfExpression(expressionData).then(function (resData) {

									scope[datepickerOptsProp].date = resData.result;

									scope[dateProp] = resData.result;
									pickmeup(firstCalendarElem).set_date(new Date(scope[dateProp]));

									scope.$apply();

									if (scope.callbackMethod) scope.callbackMethod();

								})
								.catch(error => {

									$mdDialog.show({
										controller: 'WarningDialogController as vm',
										templateUrl: 'views/dialogs/warning-dialog-view.html',
										clickOutsideToClose: false,
										locals: {
											warning: {
												title: 'Error',
												description: 'Invalid expression'
											}
										}
									});

								});

							}

						}

					});

				};

				/* const onDateFromPickmeupChange = event => {

					let datesRange = [];
					console.log("testing on date from event", event);
					const dateFrom = event.detail.date[0];
					const secondCalendarDates = pickmeup(secondCalendarElem).get_date();
					console.log("testing on date from secondCalendarDates", secondCalendarDates);
					const dateTo = secondCalendarDates[1];
					// const dateFrom = firstCalendarDates[0];

					datesRange.push(dateTo);
					datesRange.push(dateFrom);

					let reversedDatesRange = [...[], ...datesRange];
					reversedDatesRange.reverse();
					console.log("testing on date from", datesRange, reversedDatesRange);
					pickmeup(firstCalendarElem).set_date(datesRange);
					pickmeup(secondCalendarElem).set_date(reversedDatesRange);

				};

				const onDateToPickmeupChange = event => {

					let datesRange = [];

					const firstCalendarDates = pickmeup(firstCalendarElem).get_date();
					const dateFrom = firstCalendarDates[0];
					const dateTo = event.detail.date[1];
					// const dateFrom = firstCalendarDates[0];

					datesRange.push(dateFrom);
					datesRange.push(dateTo);
					console.log("testing on date to", datesRange);
					pickmeup(firstCalendarElem).set_date(datesRange);
					pickmeup(secondCalendarElem).set_date(datesRange);

				}; */

				const initCalendar = function () {

					/* const pickmeupMode = scope.rangeOfDates ? 'range' : 'single';

					let calendarElem,
						dateProp,
						datepickerOptsProp;

					if (dateNumber === 2) {

						dateProp = 'dateTo';
						datepickerOptsProp = 'datepickerToOptions';
						secondCalendarElem = elem[0].querySelector(".secondCalendar");
						calendarElem = secondCalendarElem;

					} else { // first date or date from

						dateProp = 'date';
						datepickerOptsProp = 'datepickerOptions';
						firstCalendarElem = elem[0].querySelector(".firstCalendar");
						calendarElem = firstCalendarElem;

					} */
					firstCalendarElem = elem[0].querySelector(".firstCalendar");

					pickmeup(firstCalendarElem, {
						date: new Date(scope.date),
						flat: true,
						format: 'Y-m-d'
					});

					/* calendarElem.addEventListener("pickmeup-change", event => {
						console.log("testing pickmeup-change event", event);
						scope[dateProp] = event.detail.formatted_date;
						scope[datepickerOptsProp].datepickerMode = 'datepicker';

						scope.$apply();

					}); */

					firstCalendarElem.addEventListener("pickmeup-change", event => {
						console.log("testing pickmeup-change event", event);
						// firstDate = event.detail.date;
						scope.date = event.detail.formatted_date;

						scope.datepickerOptions.datepickerMode = 'datepicker';

						scope.$apply();

					});

				};

				const getSelectedDatesForPickmeup = function () {

					let dateFrom;

					if (moment(scope.date, 'YYYY-MM-DD', true).isValid()) {
						dateFrom = new Date(scope.date);
					}

					let dateTo;

					if (moment(scope.dateTo, 'YYYY-MM-DD', true).isValid()) {
						dateTo = new Date(scope.dateTo);
					}

					// if only one date selected, dates range is this one date
					if (dateFrom && !dateTo) dateTo = dateFrom;
					if (!dateFrom && dateTo)  dateFrom = dateTo;

					if (dateFrom && dateTo) return [dateFrom, dateTo];

					return [];

				};

				const dayRenderFn = date => {
					// console.log("testing dayRenderFn", scope.date, scope.dateTo);
					const ymdDate = moment(date).format('YYYY-MM-DD');

					if (ymdDate === scope.date && ymdDate === scope.dateTo) {
						return {class_name: "custom-pmu-date-from-to"};
					}

					if (ymdDate === scope.date) {
						return {class_name: "custom-pmu-date-from"};

					} else if (ymdDate === scope.dateTo) {
						return {class_name: "custom-pmu-date-to"};
					}

					return {};

				};

				const initRangeOfDatesCalendars = function () {

					firstCalendarElem = elem[0].querySelector(".firstCalendar");

					let pickmeupOpts = {
						flat: true,
						format: 'Y-m-d',
						mode: 'range',
						calendars: 2,
						render: dayRenderFn
					};

					const selectedDates = getSelectedDatesForPickmeup();

					if (selectedDates.length)  pickmeupOpts.date = selectedDates;

					pickmeup(firstCalendarElem, pickmeupOpts);

					firstCalendarElem.addEventListener('pickmeup-change', event => {
						console.log("testing event", event);
						/* const dateFrom = new Date(scope.date);
						if (event.detail.formatted_date[0] === event.detail.formatted_date[1] &&
							event.detail.date[1] > dateFrom) {

							const datesRange = [dateFrom, event.detail.date[1]];

							pickmeup(firstCalendarElem).set_date(datesRange);
							scope.dateTo = event.detail.formatted_date[1];
							// pickmeup(firstCalendarElem).update();

						}*/

						/* if (scope.date !== event.detail.formatted_date[0] &&
							event.detail.date[0] < dateFrom) {
							console.log("testing event1");
							const datesRange = [event.detail.date[0], event.detail.date[0]];
							scope.date = event.detail.formatted_date[0];
							scope.dateTo = event.detail.formatted_date[0];
							console.log("testing event1 datesRange", datesRange);
							scope.$apply();

							// pickmeup(firstCalendarElem).set_date(datesRange);
							pickmeup(firstCalendarElem).set_date(event.detail.date[0]);

						} */

						console.log("testing event2");
						const formattedDatesList = event.detail.formatted_date;

						if (scope.date !== formattedDatesList[0]) {
							scope.datepickerOptions.datepickerMode = 'datepicker';
						}

						scope.date = formattedDatesList[0];

						if (scope.dateTo !== formattedDatesList[1]) {

							scope.datepickerToOptions.datepickerMode = 'datepicker';
							scope.dateTo = formattedDatesList[1];

						}

						scope.$apply();

					});

				};

				/*
				// Separate calendars

				let firstDate;

				if (moment(scope.date, 'YYYY-MM-DD', true).isValid()) {
					firstDate = new Date(scope.date);
				}

				let secondDate;

				if (scope.rangeOfDates && moment(scope.date, 'YYYY-MM-DD', true).isValid()) {
					secondDate = new Date(scope.dateTo);
				}

				const initRangeOfDatesCalendars = function () {

					firstCalendarElem = elem[0].querySelector(".firstCalendar");
					secondCalendarElem = elem[0].querySelector(".secondCalendar");

					const dayRenderFn = date => {

						if (firstDate && secondDate) {

							/!* const dateTime = date.getTime();
							const firstDateTime = firstDate.getTime();
							const secondDateTime = secondDate.getTime(); *!/
							const ymdDate = moment(date).format('YYYY-MM-DD');
							/!* const ymdFirstDate = moment(firstDate).format('YYYY-MM-DD');
							const ymdSecondDate = moment(secondDate).format('YYYY-MM-DD');
							console.log("testing dayRenderFn", ymdDate, ymdFirstDate, ymdSecondDate); *!/

							// Separate calendars
							/!*if (ymdDate === scope.date || ymdDate === scope.dateTo) {
								return {class_name: "custom-pmu-selected"};

							} else if (firstDate < date && date < secondDate) {
								return {class_name: "custom-pmu-day-in-range"};
							}*!/
							// < Separate calendars >

						}
						/!*if (firstDate && secondDate &&
							firstDate < date && date < secondDate) {
							console.log("testing dayRenderFn", firstDate, secondDate, date);
							return {class_name: "custom-pmu-day-in-range"}

						}*!/

						return {};

					}

					pickmeup(firstCalendarElem, {
						date: new Date(scope.date),
						flat: true,
						format: 'Y-m-d',
						render: dayRenderFn
					});

					// firstCalendarElem.addEventListener("pickmeup-change", onDateFromPickmeupChange);
					firstCalendarElem.addEventListener("pickmeup-change", event => {
						console.log("testing pickmeup-change event", event);
						firstDate = event.detail.date;
						scope.date = event.detail.formatted_date;

						scope.datepickerOptions.datepickerMode = 'datepicker';

						scope.$apply();
						pickmeup(secondCalendarElem).update();

					});

					pickmeup(secondCalendarElem, {
						date: new Date(scope.dateTo),
						flat: true,
						format: 'Y-m-d',
						render: dayRenderFn
					});

					// secondCalendarElem.addEventListener("pickmeup-change", onDateToPickmeupChange);
					secondCalendarElem.addEventListener("pickmeup-change", event => {
						console.log("testing pickmeup-change event", event);
						secondDate = event.detail.date;
						scope.dateTo = event.detail.formatted_date;

						scope.datepickerToOptions.datepickerMode = 'datepicker';

						scope.$apply();
						pickmeup(firstCalendarElem).update();

					});

				};
				// < Separate calendars >
				*/

				const onDateInputChange = function (date) {
					console.log("testing onDateInputChange triggered", date);
					if (moment(date, 'YYYY-MM-DD', true).isValid()) {

						// firstDate = new Date(date);
						pickmeup(firstCalendarElem).set_date(new Date(date));

						// if previously date was taken from expression, and now date field changed
						scope.datepickerOptions.datepickerMode = 'datepicker';

						// if (scope.rangeOfDates) pickmeup(secondCalendarElem).update();
						console.log("testing onDateInputChange datepicker", scope.datepickerOptions.datepickerMode);
					}

				};

				const onDateRangeInputChange = function (date, dateNumber) {

					// const optionsProp = dateNumber === 2 ? 'datepickerToOptions' : 'datepickerOptions';
					let firstDate, secondDate, optionsProp;
					if (dateNumber === 2) {

						/*firstDate = new Date(scope.date);
						secondDate = new Date(date);*/
						scope.dateTo = date;
						optionsProp = 'datepickerToOptions';

					} else {

						/*firstDate = new Date(date);
						secondDate = new Date(scope.dateTo);*/
						scope.date = date;
						optionsProp = 'datepickerOptions';

					}
					// console.log("testing onDateRangeInputChange", scope.date, firstDate, scope.dateTo, secondDate);
					if (moment(date, 'YYYY-MM-DD', true).isValid()) {

						const datesRange = [new Date(scope.date), new Date(scope.dateTo)];
						// firstDate = new Date(date);
						pickmeup(firstCalendarElem).set_date(datesRange);

						// if previously date was taken from expression, and now date field changed
						scope[optionsProp].datepickerMode = 'datepicker';

						// if (scope.rangeOfDates) pickmeup(secondCalendarElem).update();
						console.log("testing onDateInputChange datepicker mode", scope[optionsProp].datepickerMode);
					}

				};

				const disableUseFromAboveMode = function () {

					if (useFromAboveEventIndex) {

						scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, useFromAboveEventIndex);
						useFromAboveEventIndex = null;
						attributeKey = null;

					}

				};

				scope.modeIsActive = modeNames => {

					if (Array.isArray(modeNames)) {
						return modeNames.includes(scope.datepickerOptions.datepickerMode);
					}

					return modeNames === scope.datepickerOptions.datepickerMode;

				};

				scope.activateCustomMode = function () {

					if (!scope.modeIsActive(['datepicker', 'expression'])) {

						if (scope.datepickerOptions.expression) {
							scope.datepickerOptions.datepickerMode = 'expression';

						} else {
							scope.datepickerOptions.datepickerMode = 'datepicker';
						}

						scope.dateIsDisabled = false;
						firstCalendarElem.classList.remove("pmu-calendar-disabled");

						disableUseFromAboveMode();

					}

				};

				scope.activateMode = function (mode) {

					switch (mode) {

						case 'today':

							scope.datepickerOptions.datepickerMode = 'today';
							scope.datepickerOptions.expression = 'now()';
							scope.date = moment(new Date()).format('YYYY-MM-DD');

							pickmeup(firstCalendarElem).set_date(new Date(scope.date));

							scope.dateIsDisabled = true;
							firstCalendarElem.classList.add("pmu-calendar-disabled");

							disableUseFromAboveMode();

							break;

					}

				};

				const init = function () {

					if (scope.rangeOfDates) {

						scope.onDateInputChange = onDateRangeInputChange;

						initRangeOfDatesCalendars();

					} else {

						scope.onDateInputChange = onDateInputChange;
						initCalendar(1);

					}

					// if (scope.dateTo) initCalendar(2);

				};

				init();

				scope.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, () => {
					scope.$destroy();
				});

			}
		}

	}

}());