/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    module.exports = function EntityViewerDeleteBulkDialogController($scope, $mdDialog, entityResolverService, evDataService, evEventService, data) {

        var vm = this;

        vm.entityType = evDataService.getEntityType();

        vm.isDeleted = false;

		var itemsToDelete = [];

		if (data) {
			itemsToDelete = data.itemsToDelete || [];
		}


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.delete = function ($event) {

            var objects = evDataService.getObjects();

            itemsToDelete = itemsToDelete.concat(objects
                .filter(function (item) {
                    return item.___is_activated
                }));

            const userCodes = Array.from(new Set(itemsToDelete.map((item) => item.user_code)));
            const ids = Array.from(new Set(itemsToDelete.map((item) => item.id)));
            console.log('userCodes', userCodes);

            vm.processing = true;
            vm.isDeleted = true;

            var deleteProm;

            if (userCodes.length > 1) {
                deleteProm = entityResolverService.deleteBulk(vm.entityType, {user_codes: userCodes});
            } else {
                deleteProm = entityResolverService.deleteByKey(vm.entityType, ids[0].id);
            }

            deleteProm.then(function (data) {

                vm.processing = false;

                $mdDialog.hide({status: 'agree', data: {ids: ids}});

            }).catch(function (reason) {

                let description = "Something wrong. Please, try again later."

                if (reason.error_key) {
                    console.error(reason.description)

                    description = reason.description;

                    if (userCodes.length > 1) {
                        description = "Bulk delete unavailable for this type of entities for now."
                    }

                }

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: description
                        }
                    }
                }).then(function (value) {

                    $mdDialog.hide({status: 'agree', data: {ids: []}});

                })

            });

        };

    }

}());