(function () {
    'use strict';

    var logService = require('../../../../../core/services/logService');
    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {
        console.log('id for event buttons', data);

        var vm = this;

        vm.entityType = 'complex-transaction';
        vm.isEventBook = true;

        vm.actionsBtns = data.eventActions;
        console.log('event button is', vm.actionsBtns);
        var eventId = data.eventId;

        vm.eventAction = function ($event, actionId) {
            var actionUrl = {
                eventId: eventId,
                actionId: actionId
            };
            eventsService.getEventAction(actionUrl).then(function (data) {
                var currentDate = moment(new Date()).format('YYYY-MM-DD');
                data.values['date'] = currentDate;

                vm.eventBook = data;

                $mdDialog.show({
                    controller: 'EntityViewerAddDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    //clickOutsideToClose: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        parentScope: $scope
                    }
                }).then(function (res) {

                    if (res.status == 'agree') {
                        eventsService.putEventAction(actionUrl, res.data.eventBook).then(function () {
                            console.log('event action done');
                            vm.cancel();
                        });
                    }


                });


            });
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };
    }
}());