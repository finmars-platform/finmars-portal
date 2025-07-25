/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    module.exports = function EntityViewerDeleteBulkDialogController($scope, $mdDialog, entityResolverService, evDataService, evEventService, data) {

        var vm = this;

        vm.entityType = evDataService.getEntityType();

        vm.isDeleted = false;

		var idsToDelete = [];

		if (data) {
			idsToDelete = data.idsToDelete || [];
		}


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.delete = function ($event) {

            var objects = evDataService.getObjects();

            var ids = objects
                .filter(function (item) {
                    return item.___is_activated
                }).map(function (item) {
                    return item.id
                });

			idsToDelete.forEach(function (id) {

				if (ids.indexOf(id) === -1) {
					ids.push(id);
				}

			});

            console.log('ids', ids);

            vm.processing = true;
            vm.isDeleted = true;

            var deleteProm;

            if (ids.length > 1) {

                deleteProm = entityResolverService.deleteBulk(vm.entityType, {ids: ids});

            } else {
                deleteProm = entityResolverService.deleteByKey(vm.entityType, ids[0]);
            }

            deleteProm.then(function (data) {

                vm.processing = false;

                $mdDialog.hide({status: 'agree', data: {ids: ids}});

            }).catch(function (reason) {

                let description = "Something wrong. Please, try again later."

                if (reason.error_key) {
                    console.error(reason.description)

                    description = reason.description;

                    if (ids.length > 1) {
                        description = "Bulk delete unavailable for this type of entities for now."
                    }

                }

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
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