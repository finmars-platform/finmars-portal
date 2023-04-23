/**
 * Created by szhitenev on 08.06.2016.
 */
import metaContentTypesService from "../../services/metaContentTypesService";

(function () {

    'use strict';

	const uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog, commonDialogsService, metaContentTypesService, data) {

        var vm = this;

        if (!data || !data.entityType) throw new Error("entityType was not specified");

        let layoutsUserCodes = [];
		let layoutsPromise = null;
		const entityType = data.entityType;

        if (data.layoutsUserCodes) layoutsUserCodes = data.layoutsUserCodes;

		layoutsPromise = new Promise(resolve => {

			if (layoutsUserCodes.length) {
				resolve();

			} else {

				uiService.getListLayoutLight(entityType, {pageSize: 1000}).then(function (data) {

					layoutsUserCodes = data.results.map(layout => layout.user_code);
					resolve();

				}).catch(error => resolve());

			}

		});

        vm.item = {
            name: data.name || '',
			content_type: metaContentTypesService.findContentTypeByEntity(data.entityType)
        }

		console.log('vm.item', vm.item);

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

			if (vm.item.user_code.startsWith('system_autosave_')) {

				commonDialogsService.warning({
					warning: {
						title: 'Warning',
						description: 'This user code reserved for system layout. Please use another one.',
					}
				})

				return;

			}

			layoutsPromise.then(() => {

				if (layoutsUserCodes.includes(vm.item.user_code)) {

					commonDialogsService.warning({
						warning: {
							title: 'Warning',
							description: 'Layout with such user code already exists. Do you want to overwrite it?',
							actionsButtons: [
								{
									name: "Cancel",
									response: {}
								},
								{
									name: "Overwrite",
									response: {status: 'overwrite'}
								}
							]
						}
					})
					.then(function (res) {

						if (res.status === 'overwrite') {

							$mdDialog.hide({
								status: 'overwrite', data: {
									name: vm.item.name,
									user_code: vm.item.user_code
								}
							});

						}

					});

				}
				else {

					$mdDialog.hide({
						status: 'agree', data: {
							name: vm.item.name,
							user_code: vm.item.user_code
						}
					});

				}

			});

            /* $mdDialog.hide({
                status: 'agree', data: {
                    name: vm.item.name,
                    user_code: vm.item.user_code
                }
            }); */

        };

    }

}());