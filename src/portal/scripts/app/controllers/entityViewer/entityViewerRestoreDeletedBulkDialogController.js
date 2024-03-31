/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function EntityViewerRestoreDeletedBulkDialogController($scope, $mdDialog, data) {

        var vm = this;

        // vm.entityType = evDataService.getEntityType();
		var entityType = data.entityType;
		var restoredItems = data.items;

        vm.isRestored = false;


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.restore = async function () {

            /* var objects = evDataService.getObjects();

            var restoredItems  = objects
                .filter(function (item) {
                    return item.___is_activated && item.is_deleted;
                }).map(function (item) {

                    var name = item.name.split('(del) ')[1];
                    var short_name = item.short_name.split('(del) ')[1];

                    return {
                        id: item.id,
                        name: name,
                        short_name: short_name,
                        user_code: item.deleted_user_code,
                        is_deleted: false,
                        is_enabled: true,
                        is_active: true
                    }
                });*/

			const itemsIds = [];

			restoredItems = restoredItems.map(function (item) {

				var name = item.name.split('(del) ')[1];
				var short_name = item.short_name.split('(del) ')[1];

				itemsIds.push(item.id);

				return {
					id: item.id,
					name: name,
					short_name: short_name,
					user_code: item.deleted_user_code,
					is_deleted: false,
					is_enabled: true,
					is_active: true
				};

			});

            console.log('restoredItems', itemsIds);

            vm.processing = true;
            vm.isRestored = true;

            try {

                const result = entityResolverService.restoreBulk(
                    entityType, {ids:itemsIds}
                );

                const response = await result[0];

                if (response.errors) {
                    throw response.errors;
                }

                if (response.status === 'E') {
                    throw {task: response.id, error_message: response.error_message};
                }

                vm.processing = false;

                $mdDialog.hide({status: 'agree', data: {itemsIds: itemsIds}});


            } catch (reason) {

                let description = "Something wrong. Please, try again later."

                if (reason.error_key) {
                    console.error(reason.description)

                    description = reason.description;

                    if (reason.error_key === "invalid_arguments") {
                        description = "Restore unavailable for this type of entities for now."
                    }

                }

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: description
                        }
                    }
                }).then(function (value) {

                    $mdDialog.hide({status: 'disagree'});

                })

            }


        };

    }

}());