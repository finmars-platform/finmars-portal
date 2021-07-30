(function () {

    'use strict';

	const uiService = require('../services/uiService');
	const metaContentTypesService = require('../services/metaContentTypesService');

	const evEvents = require('../services/entityViewerEvents');

	const toastNotificationService = require('../../../../core/services/toastNotificationService');
	const localStorageService = require('../../../../core/services/localStorageService');

    let getLinkingToFilters = function (layout) {

        let linkingToFilters = [];

        layout.data.filters.forEach(function (filter) {

            if (filter.options.use_from_above) {

                if (typeof filter.options.use_from_above === 'object') {

                    if (Object.keys(filter.options.use_from_above).length) {

                        let filterObj = {
                            key: filter.options.use_from_above.key,
                            name: filter.name,
                            filter_type: filter.options.filter_type
                        };

                        if (filter.layout_name) {
                            filterObj.layout_name = filter.layout_name;
                        }

                        linkingToFilters.push(filterObj);

                    }


                } else {

                    let filterObj = {
                        key: filter.options.use_from_above,
                        name: filter.name,
                        filter_type: filter.options.filter_type
                    };

                    if (filter.layout_name) {
                        filterObj.layout_name = filter.layout_name;
                    }

                    linkingToFilters.push(filterObj);

                }

            }

        });

        return linkingToFilters;
    };

    let getDataForLayoutSelectorWithFilters = function (layouts) {

        let result = [];

        layouts.forEach(function (layout) {

            let layoutObj = {
                id: layout.id,
                name: layout.name,
                user_code: layout.user_code,
                //content_type: layout.content_type,
                content: []
            };

            layoutObj.content = getLinkingToFilters(layout);

            result.push(layoutObj);

        });

        return result;

    };

    const saveRowTypeFiltersToLocalStorage = function (entityViewerDataService) {

        const rowTypeFilters = entityViewerDataService.getRowTypeFilters();

        if (rowTypeFilters) {
			const color = rowTypeFilters.markedRowFilters || 'none';
			const entityType = entityViewerDataService.getEntityType();
			const viewType = entityViewerDataService.getViewType();
			localStorageService.cacheRowTypeFilter(viewType, entityType, color);
        }

    };

    const saveLayoutList = function (entityViewerDataService, isReport) {

        saveRowTypeFiltersToLocalStorage(entityViewerDataService);

    	var currentLayoutConfig = entityViewerDataService.getLayoutCurrentConfiguration(isReport);

		if (currentLayoutConfig.hasOwnProperty('id')) {

			uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function (updatedLayoutData) {

                let listLayout = updatedLayoutData;

                entityViewerDataService.setListLayout(listLayout);
                entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});

				toastNotificationService.success("Success. Page was saved.");

			});

		}

	};

    /* const getLayoutByUserCode = function (entityType, userCode) {

		const contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

		return uiService.getListLayout(
			null,
			{
				pageSize: 1000,
				filters: {
					content_type: contentType,
					user_code: userCode
				}
			}
		);

	}; */
	/**
	 * @memberOf module:evRvLayoutsHelper
	 *
	 * @param isRootEntityViewer {boolean}
	 * @param evDataService {Object}
	 * @param evEventService {Object}
	 * @param layout {Object}
	 */
	const applyLayout = function (isRootEntityViewer, evDataService, evEventService, layout) {

		/* if (isRootEntityViewer) {

			// middlewareService.setNewEntityViewerLayoutName(layout.name);

		} else {
			evDataService.setSplitPanelDefaultLayout(layout.id);
			evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
			// middlewareService.setNewSplitPanelLayoutName(layout.name); // Give signal to update active split panel layout name in the toolbar
		} */

		if (!isRootEntityViewer) {
			evDataService.setSplitPanelDefaultLayout(layout.id);
			evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
		}

		evDataService.setListLayout(layout);
		evDataService.setActiveLayoutConfiguration({layoutConfig: layout});

		evEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

		toastNotificationService.success("New layout with name '" + layout.name + "' created");

		evDataService.setIsNewLayoutState(false);

	};

	/**
	 *
	 * @param layoutToOverwrite {Object}
	 * @param listLayout {Object}
	 * @returns {Promise<any>}
	 */
	const overwriteLayout = (layoutToOverwrite, listLayout) => {

		const id = layoutToOverwrite.id;

		listLayout.id = id;
		layoutToOverwrite.data = listLayout.data;
		layoutToOverwrite.name = listLayout.name;

		return uiService.updateListLayout(id, layoutToOverwrite);

	};
	/**
	 * @memberOf module:evRvLayoutsHelper
	 *
	 * @param evDataService {Object} - entityViewerDataService
	 * @param evEventService {Object} - entityViewerEventService
	 * @param isReport {boolean}
	 * @param entityType {string}
	 * @param $event {Object} - event object
	 * @return {Promise<any>} - saved layout or error
	 */
    const saveAsLayoutList = function (evDataService, evEventService, isReport, $mdDialog, entityType, $event) {

    	return new Promise((resolve, reject) => {

			const listLayout = evDataService.getLayoutCurrentConfiguration(isReport);
			const isRootEntityViewer = evDataService.isRootEntityViewer();

			/* $mdDialog.show({
				controller: 'UiLayoutSaveAsDialogController as vm',
				templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				locals: {
					options: {
						label: "Save layout as",
						layoutName: listLayout.name,
						complexSaveAsLayoutDialog: {
							entityType: entityType
						}
					}
				},
				clickOutsideToClose: false

			}) */
			$mdDialog.show({
				controller: 'NewLayoutDialogController as vm',
				templateUrl: 'views/dialogs/new-layout-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				preserveScope: false,
				locals: {
					data: {}
				}
			})
			.then(res => {

				if (res.status === 'agree') {

					const saveAsLayout = function () {

						listLayout.name = res.data.name;
						listLayout.user_code = res.data.user_code;

						uiService.createListLayout(entityType, listLayout).then(function (data) {

							listLayout.id = data.id;
							applyLayout(isRootEntityViewer, evDataService, evEventService, listLayout);
							toastNotificationService.success("Layout " + listLayout.name + " created.");

							resolve({status: res.status, layoutData: data});

						}).catch(error => {
							// toastNotificationService.error("Error occurred");
							reject({status: res.status, error: error});
						});

					};

					if (isRootEntityViewer) listLayout.is_default = true; // default layout for split panel does not have is_default === true

					if (listLayout.id) { // if layout based on another existing layout

						/* if (isRootEntityViewer) {
							listLayout.is_default = true;

						} else { // for split panel
							listLayout.is_default = false;
						} */
						delete listLayout.id;
						saveAsLayout();

					} else { // if layout was not based on another layout

						saveAsLayout();

					}

				}
				else if (res.status === 'overwrite') {

					const userCode = res.data.user_code;

					listLayout.name = res.data.name;
					listLayout.user_code = userCode;

					uiService.getListLayoutByUserCode(entityType, userCode).then(function (layoutToOverwriteData) {

						const layoutToOverwrite = layoutToOverwriteData.results[0];
						overwriteLayout(layoutToOverwrite, listLayout).then(function (updatedLayoutData) {

							listLayout.is_default = true;
							listLayout.modified = updatedLayoutData.modified;

							applyLayout(isRootEntityViewer, evDataService, evEventService, listLayout);
							toastNotificationService.success("Success. Page was saved.");

							resolve({status: res.status});

						}).catch(error => reject({status: res.status, error: error}));

					});

				}
				else {
					resolve({status: 'disagree'});
				}

			});

		});

	};

	const clearSplitPanelAdditions = function (evDataService) {

		var interfaceLayout = evDataService.getInterfaceLayout();
		interfaceLayout.splitPanel.height = 0;

		evDataService.setInterfaceLayout(interfaceLayout);

		var additions = evDataService.getAdditions();

		additions.isOpen = false;
		additions.type = '';
		delete additions.layoutData;

		evDataService.setSplitPanelStatus(false);
		evDataService.setAdditions(additions);

	};

    /** @module evRvLayoutsHelper */
    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters,

		saveLayoutList: saveLayoutList,
		saveAsLayoutList: saveAsLayoutList,

		clearSplitPanelAdditions: clearSplitPanelAdditions
    }

}());