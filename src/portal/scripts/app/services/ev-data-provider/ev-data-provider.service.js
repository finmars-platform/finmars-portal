(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('../ev-data-provider/groups.service');
    var objectsService = require('../ev-data-provider/objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper').default;
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper').default;

    /*var injectEntityViewerOptions = function (entityViewerDataService) {
        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        requestParameters.body['ev_options'] = entityViewerDataService.getEntityViewerOptions();

        entityViewerDataService.setRequestParameters(requestParameters);
    };*/

    /*var injectGlobalTableSearch = function (entityViewerDataService) {
        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        requestParameters.body['global_table_search'] = ''

        var query = entityViewerDataService.getGlobalTableSearch();

        if (query) {
            requestParameters.body['global_table_search'] = query
        }

        entityViewerDataService.setRequestParameters(requestParameters);
    };*/
    const injectGlobalTableSearch = function (entityViewerDataService) {
        return entityViewerDataService.getGlobalTableSearch() || '';
    };

    /*var injectRegularFilters = function (entityViewerDataService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        var newRequestParametersBody = Object.assign({}, requestParameters.body);
        // newRequestParametersBody['filter_settings'] = [];
		newRequestParametersBody['filter_settings'] = {frontend: [], backend: []};

        var filtersData = entityViewerDataService.getFilters();

		//  var isFilterValid = function (filterItem) {
        //
		// 	if (filterItem.options && filterItem.options.enabled) { // if filter is enabled
        //
		// 		var filterType = filterItem.options.filter_type;
        //
		// 		if (filterType === 'empty' ||
		// 			filterItem.options.exclude_empty_cells) { // if filter works for empty cells
        //
		// 			return true;
        //
		// 		} else if (filterItem.options.filter_values) { // if filter values can be used for filtering (not empty)
        //
		// 			var filterValues = filterItem.options.filter_values;
        //
		// 			if (filterType === 'from_to') {
        //
		// 				if ((filterValues.min_value || filterValues.min_value === 0) &&
		// 					(filterValues.max_value || filterValues.max_value === 0)) {
		// 					return true;
		// 				}
        //
		// 			} else if (Array.isArray(filterValues)) {
        //
		// 				if (filterValues[0] || filterValues[0] === 0) {
		// 					return true;
		// 				}
        //
		// 			}
		// 		}
        //
		// 	}
        //
		// 	return false;
		// };
        //
		// filters.forEach(function (item) {
        //
		// 	if (isFilterValid(item)) {
        //
		// 		var filterSettings = {
		// 			key: item.key,
		// 			filter_type: item.options.filter_type,
		// 			exclude_empty_cells: item.options.exclude_empty_cells,
		// 			value_type: item.value_type,
		// 			value: item.options.filter_values
		// 		};
        //
		// 		if (item.options.is_frontend_filter) {
		// 			filterSettings.is_frontend_filter = true;
		// 		}
        //
		// 		//newRequestParametersBody = Object.assign(newRequestParametersBody, filterSettings);
		// 		newRequestParametersBody['filter_settings'].push(filterSettings);
        //
		// 	}
        //
		// });

		var formatFilter = function (filter, filterType) {

			if (evRvCommonHelper.isFilterValid(filter)) {

				var filterSettings = {
					key: filter.key,
					filter_type: filter.options.filter_type,
					exclude_empty_cells: filter.options.exclude_empty_cells,
					value_type: filter.value_type,
					value: filter.options.filter_values
				};

				newRequestParametersBody['filter_settings'][filterType].push(filterSettings);

			}

		};

		//  TO DELETE: if frontend filters will be applied outside of ev-data-provider files
		// filtersData.frontend.forEach(function (filter) {
		// 	formatFilter(filter, 'frontend');
		// });

		filtersData.backend.forEach(function (filter) {
			formatFilter(filter, 'backend');
		});

        requestParameters.body = newRequestParametersBody;

        entityViewerDataService.setRequestParameters(requestParameters);

    };*/
    const injectRegularFilters = function (entityViewerDataService) {

        var filtersOptions = {
            filter_settings: {
                frontend: [],
                backend: [],
            }
        };

        var filtersData = entityViewerDataService.getFilters();

        //  var isFilterValid = function (filterItem) {
        //
        // 	if (filterItem.options && filterItem.options.enabled) { // if filter is enabled
        //
        // 		var filterType = filterItem.options.filter_type;
        //
        // 		if (filterType === 'empty' ||
        // 			filterItem.options.exclude_empty_cells) { // if filter works for empty cells
        //
        // 			return true;
        //
        // 		} else if (filterItem.options.filter_values) { // if filter values can be used for filtering (not empty)
        //
        // 			var filterValues = filterItem.options.filter_values;
        //
        // 			if (filterType === 'from_to') {
        //
        // 				if ((filterValues.min_value || filterValues.min_value === 0) &&
        // 					(filterValues.max_value || filterValues.max_value === 0)) {
        // 					return true;
        // 				}
        //
        // 			} else if (Array.isArray(filterValues)) {
        //
        // 				if (filterValues[0] || filterValues[0] === 0) {
        // 					return true;
        // 				}
        //
        // 			}
        // 		}
        //
        // 	}
        //
        // 	return false;
        // };
        //
        // filters.forEach(function (item) {
        //
        // 	if (isFilterValid(item)) {
        //
        // 		var filterSettings = {
        // 			key: item.key,
        // 			filter_type: item.options.filter_type,
        // 			exclude_empty_cells: item.options.exclude_empty_cells,
        // 			value_type: item.value_type,
        // 			value: item.options.filter_values
        // 		};
        //
        // 		if (item.options.is_frontend_filter) {
        // 			filterSettings.is_frontend_filter = true;
        // 		}
        //
        // 		//newRequestParametersBody = Object.assign(newRequestParametersBody, filterSettings);
        // 		newRequestParametersBody['filter_settings'].push(filterSettings);
        //
        // 	}
        //
        // });

        var formatFilter = function (filter, filterType) {

            if (evRvCommonHelper.isFilterValid(filter)) {

                var filterSettings = {
                    key: filter.key,
                    filter_type: filter.options.filter_type,
                    exclude_empty_cells: filter.options.exclude_empty_cells,
                    value_type: filter.value_type,
                    value: filter.options.filter_values
                };

                filtersOptions['filter_settings'][filterType].push(filterSettings);

            }

        };

        //  TO DELETE: if frontend filters will be applied outside of ev-data-provider files
        // filtersData.frontend.forEach(function (filter) {
        // 	formatFilter(filter, 'frontend');
        // });

        filtersData.backend.forEach(function (filter) {
            formatFilter(filter, 'backend');
        });

        return filtersOptions.filter_settings.backend;

    };

    var _processGroupForNull = function(obj, groupData) {

        if ( [null, undefined, ""].includes(groupData.___group_name) ) {
            obj.___group_name = 'None';
        }

        return obj;

    }

    /**
     *
     * @param entityViewerDataService
     * @param entityViewerEventService
     * @param attributeDataService
     * @param data
     * @param requestParameters { evRvRequestParameters }
     * @param page
     */
    var deserializeObjects = function (entityViewerDataService, entityViewerEventService, attributeDataService, data, requestParameters, page) {

        /* var step = requestParameters.pagination.page_size;
        var pageAsIndex = parseInt(page, 10) - 1; */
        var event = requestParameters.event;

        var parentGroup;
        // var i;

        /*
        Have to do this because of case bellow when assigning `data`
        to the `parentGroup`.
        All properties must be assigned to `parentGroup` before formatting
        loaded objects from `data.results`.
        */
        var loadedObjects = data.results;
        delete data.results;

        if (!event.___id) {

            var rootGroupData = entityViewerDataService.getRootGroupData();

            parentGroup = Object.assign({}, rootGroupData);

            parentGroup.___items_count = data.count;

            parentGroup.count = data.count;
            parentGroup.next = data.next;
            parentGroup.previous = data.previous;

            /*for (i = 0; i < step; i = i + 1) {
                if (pageAsIndex * step + i < parentGroup.count) {
                    parentGroup.results[pageAsIndex * step + i] = data.results[i];
                }
            }*/

        }
        else {

            var groupData = entityViewerDataService.getData(event.___id);

            console.log('groupData', groupData);

            if (groupData) {

                parentGroup = Object.assign({}, groupData);

                parentGroup = _processGroupForNull(parentGroup, parentGroup);
                parentGroup.___items_count = data.count;

                parentGroup.count = data.count;
                parentGroup.next = data.next;
                parentGroup.previous = data.previous;

            }
            else {

                parentGroup = Object.assign({}, data);
                parentGroup.results = [];

                parentGroup = _processGroupForNull(parentGroup, event);
                // parentGroup.___items_count = event.itemsCount ? event.itemsCount : 0;
                parentGroup.___items_count = data.count;
                parentGroup.___is_open = true;
                parentGroup.___is_activated = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                parentGroup.___parentId = event.parentGroupId;
                parentGroup.___type = 'group';
                parentGroup.___id = event.___id;
                parentGroup.___level = requestParameters.level - 1;

            }


        }

        loadedObjects = loadedObjects.map(function (obj) {

            obj.___fromData = true;
            obj.___type = 'object';
            obj.___parentId = obj.___id;

            obj.___group_name = parentGroup.___group_name;
            obj = _processGroupForNull(obj, parentGroup);
            obj.___items_count = obj.___items_count ? obj.___items_count : 0;

            obj.___parentId = parentGroup.___id;

            obj.___level = requestParameters.level;
            obj.___id = evRvCommonHelper.getId(obj);

            const itemPrevIndex = parentGroup.results.findIndex(
                chObject => chObject.___id === obj.___id
            );

            if (itemPrevIndex > -1) { // remove previous version of the object
                parentGroup.results.splice(itemPrevIndex, 1);
            }

            return obj;

        });

        parentGroup.results = parentGroup.results.concat(loadedObjects);

        parentGroup.results = parentGroup.results.filter(function (item) {
            if (item && item.___type !== 'control') {
                return true;
            }

            return false;
        });

        parentGroup.results = parentGroup.results.map(function (item, index) {

            if (item.___type !== 'placeholder_object') {

                /* item = _processGroupForNull(item, parentGroup);
                item.___is_activated = evDataHelper.isSelected(entityViewerDataService);

                item.___parentId = parentGroup.___id;
                item.___type = 'object';

                item.___level = requestParameters.level;
                item.___index = index;
                item.___id = evRvCommonHelper.getId(item); */
                item.___is_activated = evDataHelper.isSelected(entityViewerDataService);

            }

            return item
        });
    	/*var controlObj = {
            ___parentId: obj.___id,
            ___type: 'control',
            ___level: obj.___level + 1
        };

        controlObj.___id = evRvCommonHelper.getId(controlObj);

        obj.results.push(controlObj);*/

        console.log('attributeDataService', attributeDataService);

        var attribute_type_map = {};
        var entityType = entityViewerDataService.getEntityType()

        console.log('entityType', entityType);

        var attrs = attributeDataService.getDynamicAttributesByEntityType(entityType);

        attrs.forEach(function (item) {

            attribute_type_map[item.id] = item

        })

        console.log('attribute_type_map', attribute_type_map);

        parentGroup.results.forEach(function (item) {

            if (item.attributes) {
                item.attributes.forEach(function (attr) {

                    attr.attribute_type_object = attribute_type_map[attr.attribute_type]

                })
            }

            entityViewerDataService.setData(item); // Important to set it object in data propr, consider refactor EV later

        })

        console.log('parentGroup', parentGroup);

        entityViewerDataService.setData(parentGroup);

    };

    var deserializeGroups = function (entityViewerDataService, entityViewerEventService, data, requestParameters, page) {

        var event = requestParameters.event;
        var parentGroup;

        /*
        Have to do this because of case bellow when assigning `data`
        to the `parentGroup`.
        All properties must be assigned to `parentGroup` before formatting
        loaded groups from `data.results`.
        */
        var loadedGroups = data.results;
        delete data.results;

        if (!event.___id) { // root group

            parentGroup = entityViewerDataService.getRootGroupData();

            parentGroup.___items_count = data.count;

            parentGroup.count = data.count;
            parentGroup.next = data.next;
            parentGroup.previous = data.previous;
            parentGroup.___is_open = true;

        }
        else {

            var groupData = entityViewerDataService.getData(event.___id);

            if (groupData) {

                parentGroup = groupData;

                parentGroup = _processGroupForNull(parentGroup, parentGroup);
                parentGroup.___items_count = parentGroup.___items_count ? parentGroup.___items_count : 0;

                parentGroup.count = data.count;
                parentGroup.next = data.next;
                parentGroup.previous = data.previous;
                parentGroup.___is_open = true;

            }
            else {

                parentGroup = data;
                parentGroup.results = [];
                parentGroup = _processGroupForNull(parentGroup, event);

                parentGroup.___items_count = data.count;

                parentGroup.___is_open = true;
                parentGroup.___is_activated = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                parentGroup.___parentId = event.parentGroupId;
                parentGroup.___type = 'group';
                parentGroup.___id = event.___id;

                parentGroup.___level = requestParameters.level - 1;

            }
        }

        loadedGroups = loadedGroups.map(function (group) {

            group.___fromData = true;

            group.___type = "group";
            group.results = [];

            group.___parentId = parentGroup.___id;
            group.___id = evRvCommonHelper.getId(group);

            group = _processGroupForNull(group, group);
            group.___items_count = group.___items_count ? group.___items_count : 0;

            group.___level = requestParameters.level;

            group.___is_open = false;

            group.___has_selected_child = false;


            const itemPrevIndex = parentGroup.results.findIndex(
                chGroup => chGroup.___id === group.___id
            );

            if (itemPrevIndex > -1) { // remove previous version of the object
                parentGroup.results.splice(itemPrevIndex, 1);
            }

            return group;

        });

        parentGroup.results = parentGroup.results.concat(loadedGroups);

        parentGroup.results = parentGroup.results.filter(function (item) {
            return item.___type !== 'control';
        });
        // TODO: consider moving assigning of properties from bellow to `loadedGroups.map` above
        parentGroup.results = parentGroup.results.map(function (item, index) {

            if (item.___type !== 'placeholder_group') {

                /* item.___parentId = parentGroup.___id;
                item = _processGroupForNull(item, item);
                item.___items_count = item.___items_count ? item.___items_count : 0;

                item.___is_activated = evDataHelper.isSelected(entityViewerDataService);

                item.___level = requestParameters.level;


                item.___id = evRvCommonHelper.getId(item);

                entityViewerDataService.setData(item); // Important to set it object in data propr, consider refactor EV later
*/
                entityViewerDataService.setData(item); // By Sergei Zhitenev 2023-09-14: Important to set it object in data propr, consider refactor EV later

            }

            return item;
        });
        /* var controlObj = {
            ___parentId: obj.___id,
            ___type: 'control',
            ___level: obj.___level + 1
        };

        controlObj.___id = evRvCommonHelper.getId(controlObj);

        obj.results.push(controlObj); */

        console.log('DESERIALIZE GROUPS', parentGroup.results);

        entityViewerDataService.setData(parentGroup);

    };

    /**
     * Use only inside `getGroups` and `getObjects`
     * @see getGroups
     * @see getObjects
     *
     * @param requestParameters { evRvRequestParameters }
     * @param entityViewerDataService { entityViewerDataService }
     * @return {
     *     {
     *         ev_options: Object,
     *         global_table_search: String,
     *         filter_settings: [{}],
     *         groups_types: [String],
     *         page: Number,
     *         page_size: Number,
     *         is_enabled: String,
     *         groups_types: [String],
     *         groups_values: [String],
     *     }
     * }
     */
    const getOptionsForGetList = function (entityViewerDataService, requestParameters) {

        let options = structuredClone(requestParameters.body);

        /* options.filter_settings = options.filter_settings.filter(function (optionsFilter) {
            if (!optionsFilter.is_frontend_filter) {
                return true;
            }


            return false;
        }); */

        options.page = requestParameters.pagination.page;
        options.page_size = requestParameters.pagination.page_size;
        options.is_enabled = 'any';

        const groupTypes = evDataHelper.getGroupsTypesToLevel(requestParameters.level, entityViewerDataService);
        options.groups_types = groupTypes.map(type => type.key);

        options.ev_options = entityViewerDataService.getEntityViewerOptions();
        options.filter_settings = injectRegularFilters(entityViewerDataService);
        options.global_table_search = injectGlobalTableSearch(entityViewerDataService);

        return options;

    }

    var getObjects = function (requestParameters, entityViewerDataService, entityViewerEventService, attributeDataService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var promises = [];

            var entityType = entityViewerDataService.getEntityType();

            var activeColumnSort = entityViewerDataService.getActiveColumnSort();

            var pagesToRequest = requestParameters.requestedPages.filter(function (page) {

                return requestParameters.processedPages.indexOf(page) === -1

            });
            //if (requestParameters.body.frontend_filter_changed) {
            pagesToRequest.forEach(function (pageToRequest) {

                promises.push(new Promise(function (resolveLocal) {

                    /*var options = Object.assign({}, requestParameters.body);

					options.filter_settings = options.filter_settings.backend;

                    options.page = pageToRequest;
                    options.page_size = itemsPerPage;
                    options.is_enabled = 'any';

                    if (options.groups_types) {

                        options.groups_types = options.groups_types.map(function (groupType) {

                            return groupType.key;

                        })

                    }*/

                    // `requestParameters.pagination.page` must be updated before calling `getOptionsForGetList()`
                    requestParameters.pagination.page = pageToRequest;
                    entityViewerDataService.setRequestParameters(requestParameters);

                    var options = getOptionsForGetList(entityViewerDataService, requestParameters);

                    if (activeColumnSort) {
                        if (activeColumnSort.options.sort === 'ASC') {
                            options.ordering = activeColumnSort.key
                        } else {
                            options.ordering = '-' + activeColumnSort.key
                        }
                    }

                    // entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    objectsService.getFilteredList(entityType, options).then(function (data) {
                        // TODO: validate `id` of objects
                        // console.log('requestParameters', requestParameters);

                        requestParameters.pagination.count = data.count;
                        requestParameters.pagination.downloaded = requestParameters.pagination.downloaded + data.results.length;
                        requestParameters.processedPages.push(pageToRequest);

                        entityViewerDataService.setRequestParameters(requestParameters);

                        deserializeObjects(entityViewerDataService, entityViewerEventService, attributeDataService, data, requestParameters, pageToRequest);

                        if (requestParameters.loadAll) {

                            if (requestParameters.pagination.page * requestParameters.pagination.page_size >= requestParameters.pagination.count) {

                                requestParameters.loadAll = false;


                                entityViewerDataService.setRequestParameters(requestParameters);

                                var errorMessage = 'Something went wrong. Please try again later.';

                                evDataHelper.deleteDefaultObjects(entityViewerDataService, entityViewerEventService, requestParameters, errorMessage);

                                // entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            } else {

                                requestParameters.pagination.page = requestParameters.pagination.page + 1;
                                requestParameters.requestedPages.push(requestParameters.pagination.page);

                                entityViewerDataService.setRequestParameters(requestParameters);
                                entityViewerDataService.setActiveRequestParametersId(requestParameters.id);

                                entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            }

                        }

                        resolveLocal();

                    })
					.catch(function (data) {

                        console.log('data', data);

                        console.log('error getFilteredList request requestParameters', requestParameters);

                        requestParameters.loadAll = false;

                        requestParameters.requestedPages.pop();
                        requestParameters.pagination.page = requestParameters.pagination.page - 1;

                        entityViewerDataService.setRequestParameters(requestParameters);

                        var errorMessage = 'Something went wrong. Please try again later.';

                        evDataHelper.deleteDefaultObjects(entityViewerDataService, entityViewerEventService, requestParameters, errorMessage);

                        // entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        resolveLocal()


                    })

                }));

            });


            Promise.all(promises).then(function () {

				entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                resolve();

            })
            //};
        });

    };

    /**
     * Use only inside `getGroups`
     * @see getGroups
     *
     * @param {Object} item - group
     * @private
     */
    var _checkItemForRequiredProps = function (item) {

        var reqProps = ["group_name", "group_identifier", "items_count"];

        reqProps.forEach(function (propName) {

            if ( !item.hasOwnProperty(propName) ) {
                console.error(item);
                throw `[evDataProviderService getGroups] item lacks required property "${propName}"`;
            }

        })

    }

    var getGroups = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var promises = [];

            var entityType = entityViewerDataService.getEntityType();

            // var activeGroupTypeSort = entityViewerDataService.getActiveGroupTypeSort();

            var pagesToRequest = requestParameters.requestedPages.filter(function (page) {

                return requestParameters.processedPages.indexOf(page) === -1

            });

            console.log('pagesToRequest', pagesToRequest);

            pagesToRequest.forEach(function (pageToRequest) {

                promises.push(new Promise(function (resolveLocal) {

                    // `requestParameters.pagination.page` must be updated before calling `getOptionsForGetList()`
                    requestParameters.pagination.page = pageToRequest;
                    entityViewerDataService.setRequestParameters(requestParameters);

                    var options = getOptionsForGetList(entityViewerDataService, requestParameters);

                    var groupTypeKey = options.groups_types.at(-1);

                    var groupType = entityViewerDataService.getGroups();
                    groupType = groupType.find(gType => gType.key === groupTypeKey);

                    if (groupType.options?.sort) {
                        options.groups_order = groupType.options.sort.toLocaleLowerCase();
                    }

                    groupsService.getFilteredList(entityType, options)
                        .then(function (data) {

                            console.log('get groups', data);

                            requestParameters.pagination.count = data.count;
                            requestParameters.pagination.downloaded = requestParameters.pagination.downloaded + data.results.length;
                            requestParameters.processedPages.push(pageToRequest);

                            entityViewerDataService.setRequestParameters(requestParameters);


                            data.results = data.results.map(function (item) {

                                var result = {};

                                _checkItemForRequiredProps(item);

                                result.___group_name = item.group_name;
                                result.___group_identifier = item.group_identifier;
                                result.___items_count = item.items_count;
                                result.___group_type_key = groupTypeKey; // TODO assign ___group_type_key from an 'item' after backend starts to return it


                                return result
                            });

                            deserializeGroups(entityViewerDataService, entityViewerEventService, data, requestParameters, pageToRequest);

                            resolveLocal();

                            if (requestParameters.loadAll) {

                                requestParameters.pagination.page = requestParameters.pagination.page + 1;
                                requestParameters.requestedPages.push(requestParameters.pagination.page);

                                entityViewerDataService.setRequestParameters(requestParameters);
                                entityViewerDataService.setActiveRequestParametersId(requestParameters.id);

                                entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            }

                        })
					    .catch(function (error) {

                            console.error(
                                `plat691 [evDataProviderService.getGroups] ` +
                                `${requestParameters.id} getGroups error`,
                                error
                            );
                            console.error(
                                `plat691 [evDataProviderService.getGroups] ` +
                                `${requestParameters.id} getGroups requestParameters`,
                                requestParameters
                            );

                            console.error(
                                `[evDataProviderService.getGroups] ` +
                                `${requestParameters.id} getGroups error`,
                                error
                            );
                            console.error(
                                `[evDataProviderService.getGroups] ` +
                                `${requestParameters.id} getGroups requestParameters`,
                                requestParameters
                            );

                            requestParameters.loadAll = false;

                            requestParameters.requestedPages.pop();
                            requestParameters.pagination.page = requestParameters.pagination.page - 1;

                            entityViewerDataService.setRequestParameters(requestParameters);

                            var errorMessage = 'Something went wrong. Please try again later.';

                            evDataHelper.deleteDefaultGroups(entityViewerDataService, entityViewerEventService, requestParameters, errorMessage);

                            // entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            resolveLocal()


                        })

                }))
            });

            Promise.all(promises).then(function () {
				entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

            	resolve();
            })

        })

    };

    var updateDataStructure = function (entityViewerDataService, entityViewerEventService, attributeDataService) {

        console.time('Updating data structure');

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        console.log('updateDataStructure.requestParameters', JSON.parse(JSON.stringify(requestParameters)));

        if (requestParameters.requestType === 'objects') {

            getObjects(requestParameters, entityViewerDataService, entityViewerEventService, attributeDataService)
                .then(function () {
                    entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);
                })

        }

        if (requestParameters.requestType === 'groups') {

            getGroups(requestParameters, entityViewerDataService, entityViewerEventService).then(function () {

                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            })

        }

        console.timeEnd('Updating data structure');

    };

    var sortObjects = function (entityViewerDataService, entityViewerEventService, attributeDataService) {

        entityViewerDataService.resetAllObjects();

    	var level = entityViewerDataService.getGroups().length;
		var lastGroups = evDataHelper.getGroupsByLevel(level, entityViewerDataService);

        var requestsParameters = entityViewerDataService.getAllRequestParameters();
		var requestParametersForLastGroups = [];

        entityViewerDataService.setProjection([]);
        entityViewerDataService.setFlatList([]);

		Object.keys(requestsParameters).forEach(function (key) {

			lastGroups.forEach(function (group) {

                entityViewerDataService.resetObjectsOfGroup(group.___id);

				if (group.___id === requestsParameters[key].id) {
					requestParametersForLastGroups.push(requestsParameters[key]);
				}

			})

		});

        var promises = [];

		requestParametersForLastGroups.forEach(function (requestParameters) {

            promises.push(getObjects(requestParameters, entityViewerDataService, entityViewerEventService, attributeDataService))

        });

        Promise.all(promises).then(function () {

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        })

    };

    const getRequestParametersListForSorting = function (groupsList, entityViewerDataService) {

        var requestsParameters = entityViewerDataService.getAllRequestParameters();
        var reqParamsList = [];

        Object.values(requestsParameters).forEach(function (rParams) {

            const isSortingReqParam = groupsList.some(
                group => group.___id === rParams.id
            );

            if (isSortingReqParam) {

                rParams = entityViewerDataService.resetRequestParametersPages(rParams);

                entityViewerDataService.setRequestParameters(rParams);
                reqParamsList.push(rParams);

            }

        })

        return reqParamsList;

    }

    /**
     * Remove groups, objects that will be sorted and their request parameters
     * from data.
     * Must be used inside sortGroupType.
     * @see sortGroupType
     *
     * @param entityViewerDataService {entityViewerDataService}
     * @param level {Number} - level of groups that are parents of
     * sorted objects or groups
     * @return {[]|[{}]} - groups with children to sort
     */
    var resetDataBeforeSortingGroups = function (entityViewerDataService, level) {

        var groupsWithChildrenToSort = [];

        entityViewerDataService.setSelectedGroups([]);
        entityViewerDataService.resetAllObjects();

        let dataList = entityViewerDataService.getDataAsList();

        let data = entityViewerDataService.getData();

        dataList.forEach(item => {

            if (item.___type === 'group') {

                if (item.___level === level) {

                    data[item.___id].results = [];
                    data[item.___id].___has_selected_child = false;
                    data[item.___id].___is_open = false;

                    groupsWithChildrenToSort.push(item);

                } else if (item.___level > level) {

                    delete data[item.___id];
                    entityViewerDataService.deleteRequestParameters(item.___id);

                }

            }

        })

        entityViewerDataService.setAllData(data);

        return groupsWithChildrenToSort;

    }

    var sortGroupType = function (entityViewerDataService, entityViewerEventService) {

        var activeGroupSort = entityViewerDataService.getActiveGroupTypeSort();

        console.log('sortGroupType.activeGroupSort', activeGroupSort);

        var groupsTypes = entityViewerDataService.getGroups();

        // Level of a parent used, because sorting applies to an array inside 'result' property of a parent.
        // Because 0 level reserved for the root group, an index of a group equals to a level of its parent group.
        var parentLevel = groupsTypes.findIndex(function (item) {

            if (activeGroupSort.key && item.key === activeGroupSort.key) {
                return true;

            } else  {
                // Is this needed for a legacy layouts?
                if (activeGroupSort.id && item.id === activeGroupSort.id) {
                    return true;
                }

            }

            return false;

        });

        if (parentLevel < 0) parentLevel = 0;

        var groupsWithChildrenToSort = resetDataBeforeSortingGroups(
            entityViewerDataService, parentLevel
        );

        const sortingRequestParameters = getRequestParametersListForSorting(
            groupsWithChildrenToSort, entityViewerDataService
        );

        var promises = [];

        sortingRequestParameters.forEach(function (requestParameters) {

            promises.push(getGroups(requestParameters, entityViewerDataService, entityViewerEventService));

        });

        Promise.all(promises).then(function () {

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        });

    };

    module.exports = {
        updateDataStructure: updateDataStructure,
        sortObjects: sortObjects,
        sortGroupType: sortGroupType
    }

}());