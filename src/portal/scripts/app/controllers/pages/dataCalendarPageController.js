/**
 * Created by szhitenev on 19.10.2022.
 */
(function () {

    'use strict';

    var baseUrlService = require('../../services/baseUrlService');
    var calendarEventsService = require('../../services/calendarEventsService');
    var processesService = require('../../services/processesService');
    var pricingProcedureInstanceService = require('../../services/procedures/pricingProcedureInstanceService');
    var dataProcedureInstanceService = require('../../services/procedures/dataProcedureInstanceService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');
    var systemMessageService = require('../../services/systemMessageService');
    var baseUrl = baseUrlService.resolve();


    module.exports = function dataCalendarController($scope, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.calendarEvent = null
        vm.calendarEventPayload = null
        vm.calendarEventPayloadLoading = false;

        vm.readyStatus = {content: true};

        vm.bigPicture = false;

        // vm.filter = ['system_message', 'system_schedule', 'schedule']
        vm.filter = ['data_procedure', 'expression_procedure', 'pricing_procedure', 'celery_task']

        vm.toggleFilter = function (name) {

            var index = vm.filter.indexOf(name)

            if (index === -1) {
                vm.filter.push(name)
            } else {
                vm.filter.splice(index, 1)
            }

            vm.renderCalendar();

        }

        vm.refresh = function () {

            vm.renderCalendar();
        }

        vm.loadCalendarEvent = function () {


            if (vm.calendarEvent.extendedProps.type === 'celery_task') {

                vm.calendarEventPayloadLoading = true;

                vm.calendarEventPayload = null

                processesService.getByKey(vm.calendarEvent.extendedProps.id).then(function (data) {

                    vm.calendarEventPayloadLoading = false;

                    vm.calendarEventPayload = data;

                    try {

                        vm.calendarEventPayload.options_object = JSON.stringify(vm.calendarEventPayload.options_object, null, 4);
                        vm.calendarEventPayload.result_object = JSON.stringify(vm.calendarEventPayload.result_object, null, 4);

                    } catch (error) {

                    }


                    $scope.$apply()

                })

            }

            if (vm.calendarEvent.extendedProps.type === 'pricing_procedure') {

                vm.calendarEventPayloadLoading = true;

                vm.calendarEventPayload = null

                pricingProcedureInstanceService.getByKey(vm.calendarEvent.extendedProps.id).then(function (data) {

                    vm.calendarEventPayloadLoading = false;

                    vm.calendarEventPayload = data;

                    try {
                        vm.calendarEventPayload.request_data = JSON.stringify(vm.calendarEventPayload.request_data, null, 4);
                    } catch (e) {


                    }

                    $scope.$apply()

                })
            }

            if (vm.calendarEvent.extendedProps.type === 'data_procedure') {

                vm.calendarEventPayloadLoading = true;

                vm.calendarEventPayload = null

                dataProcedureInstanceService.getByKey(vm.calendarEvent.extendedProps.id).then(function (data) {

                    vm.calendarEventPayloadLoading = false;

                    vm.calendarEventPayload = data;

                    try {
                        vm.calendarEventPayload.request_data = JSON.stringify(vm.calendarEventPayload.request_data, null, 4);
                    } catch (e) {


                    }


                    $scope.$apply()

                })
            }

        }

        vm.renderCalendar = function () {

            var calendarEl = document.getElementById('calendar');
            calendarEl.innerHTML = '';

            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                eventMouseEnter: function (info) {
                    // var tooltip = new Tooltip(info.el, {
                    //     title: info.event.extendedProps.description,
                    //     placement: 'top',
                    //     trigger: 'hover',
                    //     container: 'body'
                    // });
                    // console.log('here?', info)
                    info.el.setAttribute('title', info.event.title);
                },
                eventClick: function (info) {

                    vm.calendarEvent = info.event;

                    console.log('vm.calendarEvent', vm.calendarEvent);

                    vm.loadCalendarEvent()

                    setTimeout(function () {
                        $scope.$apply();
                    }, 0)

                },
                events: function (info, callback) {

                    console.log('start, end', info)

                    var date_from = info.startStr.split('T')[0]
                    var date_to = info.endStr.split('T')[0]
                    var filter_query = vm.filter.join(',')

                    if (!filter_query) {
                        filter_query = 'empty'
                    }

                    calendarEventsService.getList(date_from, date_to, filter_query).then(function (data) {

                        console.log('get data', data);

                        callback(data.results)


                    })


                }
            });
            calendar.render();

        }

        vm.downloadFile = function ($event, item) {

            // TODO WTF why systemMessage Service, replace with FilePreview Service later
            systemMessageService.viewFile(item.file_report).then(function (data) {

                console.log('data', data);

                $mdDialog.show({
                    controller: 'FilePreviewDialogController as vm',
                    templateUrl: 'views/dialogs/file-preview-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            content: data,
                            info: item
                        }
                    }
                });

            })


        }


        vm.init = function () {

            setTimeout(function () {
                vm.renderCalendar()
            }, 0)
        };

        vm.init();

    };

}());