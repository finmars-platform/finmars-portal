import QueuePromisesService from "../queuePromisesService";

var evEvents = require('../entityViewerEvents').default;
var evDataHelper = require('../../helpers/ev-data.helper').default;
var evRvCommonHelper = require('../../helpers/ev-rv-common.helper').default;
var rvDataHelper = require('../../helpers/rv-data.helper').default;
var queryParamsHelper = require('../../helpers/queryParamsHelper').default;

export default function (entityResolverService, pricesCheckerService, reportHelper, groupsService, objectsService) {

    /**
     * Use only inside `getGroups` and `getObjects`
     * @see getGroups
     * @see getObjects
     *
     * @param requestParameters { evRvRequestParameters }
     * @param evDataService { entityViewerDataService }
     * @return { {frontend_request_options: Object, page: Number, page_size: Number} }
     */
    var getOptionsForGetList = function (requestParameters, evDataService) {

        const options = {
            frontend_request_options: structuredClone(requestParameters.body),
        };

        options.frontend_request_options.groups_types = evDataHelper.getGroupsTypesToLevel(requestParameters.level, evDataService);

        options.page = requestParameters.pagination.page;
        options.page_size = requestParameters.pagination.page_size;

        return options;

    }

    var getObjects = function (requestParameters, evDataService) {

        console.log('getObjects.requestParameters', requestParameters);

        requestParameters.status = 'loading';

        evDataService.setRequestParameters(requestParameters);

        var requestId = evDataService.getCurrentRequestId();

        var options = getOptionsForGetList(
            requestParameters, evDataService
        );

        return new Promise(function (resolve, reject) {

            objectsService.getList(options, evDataService)
                .then(
                    function (data) {

                        if (requestId !== evDataService.getCurrentRequestId()) {
                            // do not remove
                            // Seems that this response is too old, just ignore it
                            // szhitenev 2023-11-16
                            return reject({key: "REQUEST_IRRELEVANT"});
                        }

                        var parentGroup = evDataService.getData(requestParameters.id);
                        var origChildrenLength = parentGroup.results.length;
                        // var reportOptions = evDataService.getReportOptions();
                        data.results.map(function (item, index) {

                            item.___fromData = true;
                            item.___parentId = parentGroup.___id;
                            item.___type = 'object';
                            item.___index = origChildrenLength + index;
                            item.___level = requestParameters.level;

                            //# region Create an ___id
                            item.___id = evRvCommonHelper.getId(item);

                            // Some depricated logic,
                            // right now new object will overwrite old one
                            // FN-2320 2023-11-12 szhitenev
                            /*var duplicateObj;

                            try {
                                // returns an error if a matching object is not found
                                duplicateObj = evDataService.getObject(item.___id, item.___parentId);
                            } catch (e) {
                                console.error(e);
                            }

                            if (duplicateObj) {
                                console.log("Error: duplicate ___id was created for an object: ", item);
                                var customError = new Error("Object with an ___id " + item.___id + " already exist");
                                customError.___item_data = item;

                                throw customError;

                            }*/

                            const itemPrevIndex = parentGroup.results.findIndex(
                                chObject => chObject.___id === item.___id
                            );

                            if (itemPrevIndex > -1) { // remove previous version of the group
                                parentGroup.results.splice(itemPrevIndex, 1);
                            }

                            parentGroup.results.push(item);
                            evDataService.setData(item);

                        });

                        requestParameters.status = 'loaded';

                        evDataService.setRequestParameters(requestParameters);

                        resolve(data);

                    },
                    function (e) {

                        // After integrating AbortSignal, process it in this function

                        console.error(
                            '[rvDataProviderService.getObjects] objectsService.getList rejected',
                            e
                        );

                        requestParameters.status = 'error';

                        evDataService.setRequestParameters(requestParameters);

                        reject({
                            key: "getListError",
                            error: e
                        });
                    }
                )
                .catch(function (error) {

                    console.error('getObjects.error', error);

                    requestParameters.status = 'error';

                    evDataService.setRequestParameters(requestParameters);

                    reject(error);

                })

        });

    };

    /**
     *
     * @param requestParameters { evRvRequestParameters }
     * @param evDataService
     * @param evEventService
     * @return {Promise<unknown>}
     */
    var getGroups = function (requestParameters, evDataService, evEventService) {

        console.log('getGroups.requestParameters', requestParameters);

        requestParameters.status = 'loading';

        evDataService.setRequestParameters(requestParameters);

        var requestId = evDataService.getCurrentRequestId();

        var options = getOptionsForGetList(
            requestParameters, evDataService
        );

        return new Promise(function (resolve, reject) {

            groupsService.getList(options, evDataService)
                .then(
                    function (data) {

                        if (requestId !== evDataService.getCurrentRequestId()) {
                            // do not remove
                            // Seems that this response is too old, just ignore it
                            // szhitenev 2023-11-16
                            return reject({key: "REQUEST_IRRELEVANT"});
                        }

                        var parentGroup = evDataService.getData(requestParameters.id);
                        var origChildrenLength = parentGroup.results.length;

                        data.results.map(function (item, index) {

                            item.___fromData = true;
                            item.___parentId = requestParameters.id;
                            item.___group_name = item.___group_name ? item.___group_name : '-';
                            item.___group_identifier = item.___group_identifier ? item.___group_identifier : '-';


                            item.___level = requestParameters.level;
                            item.___index = origChildrenLength + index;

                            item.___type = 'group';

                            item.___id = evRvCommonHelper.getId(item);
                            item.results = [];

                            var groupSettings = rvDataHelper.getOrCreateGroupSettings(evDataService, item);

                            //# region `___is_open` property
                            if (groupSettings.hasOwnProperty('is_open')) {
                                item.___is_open = groupSettings.is_open;
                            }


                            if (!parentGroup.___is_open) {

                                item.___is_open = false;
                                groupSettings.is_open = false;

                                rvDataHelper.setGroupSettings(evDataService, item, groupSettings);

                            }

                            var entityType = evDataService.getEntityType();
                            var viewContext = evDataService.getViewContext();

                            if (viewContext === 'dashboard') {
                                item.___is_open = true;
                            }

                            if (entityType === 'transaction-report' && viewContext === 'split_panel') {
                                item.___is_open = true;
                            }
                            //# endregion `___is_open` property

                            const itemPrevIndex = parentGroup.results.findIndex(
                                chGroup => chGroup.___id === item.___id
                            );

                            if (itemPrevIndex > -1) { // remove previous version of the group
                                parentGroup.results.splice(itemPrevIndex, 1);
                            }

                            parentGroup.results.push(item);
                            evDataService.setData(item);

                        });

                        evDataService.setData(parentGroup);

                        requestParameters.status = 'loaded';

                        evDataService.setRequestParameters(requestParameters);

                        resolve(data);

                    },
                    function (e) {
                        /*
                        After integrating AbortSignal,
                        process rejection caused by it in this function
                        */

                        console.error(
                            '[rvDataProviderService.getObjects] objectsService.getList rejected',
                            e
                        );

                        requestParameters.status = 'error';

                        evDataService.setRequestParameters(requestParameters);

                        reject({
                            key: "getListError",
                            error: e
                        });

                    }
                )
                .catch(function (error) {

                    console.error('[rvDataProviderService.getGroups] error', error);

                    requestParameters.status = 'error';

                    evDataService.setRequestParameters(requestParameters);

                    reject(error);

                })

        })

    };

    var createRequestParameters = function (evDataService, evEventService, item, parentRequestParameters) {

        console.log('rv.createRequestParameters.item', item);
        console.log('rv.createRequestParameters.parentRequestParameters', parentRequestParameters);

        var groups = evDataService.getGroups();

        var requestParameters;

        var requestType = "objects";
        // var id = evRvCommonHelper.getId(item);
        var id = item.___id;

        var parentLevel = parentRequestParameters.level;
        var level = parentLevel + 1;


        // var groups_types = evDataHelper.getGroupsTypesToLevel(groupLevel, evDataService);
        // TODO: use `evDataHelper.getGroupsValues()` or `evDataHelper.getGroupsValuesByItem()` and delete another
        var groups_values = evDataHelper.getGroupsValuesByItem(item, evDataService);

        groups_values.push(item.___group_identifier);

        var isGroupLevel = parentLevel < groups.length;
        // var paginationOpts = evDataService.getPagination();
        var groupIdentifier = item.___group_identifier ? item.___group_identifier : '-';

        if (groups.length && isGroupLevel) {
            requestType = "groups";
        }

        requestParameters = evDataService.createRequestParameters(
            requestType,
            id,
            item.___parentId,
            level,
            item.___group_name,
            groupIdentifier,
            {groupsValues: groups_values}
        )


        evDataService.setRequestParameters(requestParameters);

        return requestParameters;

    };

    /**
     *
     * @param evDataService {entityViewerDataService}
     * @param evEventService {entityViewerEventService}
     * @param [processedRequestParameters=[]] { [evRvRequestParameters]|[] }
     *
     * @return {Promise<[evRvRequestParameters]>} - Resolved when all promises in the queue are resolved.
     * Rejected if an error or rejection happened while processing a promise from the queue.
     */
    function processQueue(evDataService, evEventService, processedRequestParameters=[]) {

        return new Promise(function (resolve, reject) {

            if (evDataService.isRequestsQueueEmpty()) {
                return resolve(processedRequestParameters);
            }

            var requestParameters = evDataService.dequeueDataRequest();

            executeRequest(evDataService, evEventService, requestParameters, processedRequestParameters).then(function (processedReqParamsList) {
                resolve(processedReqParamsList);

            }).catch(function (e) {

                if (e && e.key === "REQUEST_IRRELEVANT") {

                    requestParameters.status = 'aborted';

                } else {

                    console.error(
                        `[rvDataProviderService.processQueue] ` +
                        `${evDataService.getCurrentRequestId()} executeRequest error`,
                        e
                    );

                    requestParameters.status = 'error';
                    requestParameters.error = {
                        origin: "front-end"
                    };

                    evDataService.setRequestParameters(requestParameters);

                }

                evDataService.setRequestParameters(requestParameters);

                reject({
                    requestParameters: requestParameters,
                    error: e,
                });

            });

        });

    }

    /**
     *
     * @param evDataService
     * @param evEventService
     * @param requestParameters
     * @return {Promise<unknown>}
     */
    function processQueueDispatchEvents(evDataService, evEventService, requestParameters) {

        evEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        // Start the process by enqueuing the first request
        evDataService.enqueueDataRequest(requestParameters);

        // Begin processing the queue
        return new Promise(function (resolve, reject) {

            processQueue(evDataService, evEventService)
                .then(function (processedReqParams) {
                    evEventService.dispatchEvent(evEvents.DATA_LOAD_END);

                    resolve(processedReqParams);

                })
                .catch(function (e) {

                    var requestWasNotAborted = !e || typeof e !== "object" ||
                        e.key !== "REQUEST_IRRELEVANT";

                    if (requestWasNotAborted) {
                        evEventService.dispatchEvent(evEvents.DATA_LOAD_END);
                    }

                    reject(e);
                });

        });

    }

    /**
     * Enqueue requests based on the response from previous request
     *
     * @param evDataService {Object}
     * @param evEventService {Object}
     * @param data {Object} - data from previous response
     * @param parentRequestParameters {Object}
     */
    function enqueueNewRequests(evDataService, evEventService, data, parentRequestParameters,) {
        // Based on the response 'data', decide what new requests to enqueue
        // Example: If 'data' contains groups, enqueue a request for each group
        data.results.forEach(item => {
            if (item.___is_open) {
                var newRequestParameters = createRequestParameters(evDataService, evEventService, item, parentRequestParameters);

                evDataService.enqueueDataRequest(newRequestParameters);
            }
        });
    }

    /**
     *
     * @param error {*} - data about an error from a catch function
     * @param evDataService {entityViewerDataService}
     * @param requestParametersId {String}
     * @param processedRequestParameters { [evRvRequestParameters]|[] }
     * @param resolveCb {Function} - callback function to resolve promise of
     * `executeObjectRequest` or `executeRequest`
     * @param rejectCb {Function} - callback function to reject promise of
     * `executeObjectRequest` or `executeRequest`
    */
    function processGetItemsError(error, evDataService, requestParametersId, processedRequestParameters, resolveCb, rejectCb) {

        if (error && error.key === "REQUEST_IRRELEVANT") {
            rejectCb(error);
        }
        else if (error && error.key === "getListError") {
            /*
             In case of an error getting data from backend
             requestParameters updated inside `getObjects()` or `getObjects()`
            */
            var reqParams = evDataService.getRequestParameters(requestParametersId);
            processedRequestParameters.push(reqParams);

            resolveCb(processedRequestParameters);

        }
        else {
            // Probably a front-end error
            console.error(
                `[rvDataProviderService.executeObjectRequest] ` +
                `${evDataService.getCurrentRequestId()} error`,
                error
            );

            rejectCb(error);

        }

    }

    /**
     * Must be called only inside `executeRequest()`.
     * @see executeRequest
     *
     * @param evDataService { entityViewerDataService }
     * @param evEventService { entityViewerEventService }
     * @param requestParameters { evRvRequestParameters }
     * @param processedRequestParameters { [evRvRequestParameters]|[] }
     *
     * @returns { Promise<[evRvRequestParameters]> } - array of request parameters for resolved requests
     */
    function executeObjectRequest(evDataService, evEventService, requestParameters, processedRequestParameters) {

        return new Promise(function (resolve, reject) {

            getObjects(requestParameters, evDataService, evEventService)
                .then(function (data) {

                    requestParameters.pagination.count = data.count;
                    requestParameters.pagination.downloaded = requestParameters.pagination.downloaded + data.results.length;

                    evDataService.setRequestParameters(requestParameters);
                    processedRequestParameters.push(requestParameters);

                    // enqueueNewRequests(evDataService, evEventService, data, requestParameters);
                    processQueue(evDataService, evEventService, processedRequestParameters)
                        .then(function (processedReqParamsList) {
                            resolve(processedReqParamsList);
                        }).catch(function (e) {
                            reject(e);
                        })

                })
                .catch(function (e) {
                    processGetItemsError(e, evDataService, requestParameters.id, processedRequestParameters, resolve, reject);
                });

        })

    }

    /**
     * Must be called only inside `processQueue()`.
     * @see processQueue
     *
     * @param evDataService
     * @param evEventService
     * @param requestParameters { evRvRequestParameters }
     * @param processedRequestParameters { [evRvRequestParameters]|[] }
     *
     * @return {Promise<[evRvRequestParameters]>} - array of request parameters for resolved requests
     */
    function executeRequest(evDataService, evEventService, requestParameters, processedRequestParameters) {

        return new Promise(function (resolve, reject) {

            if (requestParameters.requestType === 'groups') {

                getGroups(requestParameters, evDataService, evEventService)
                    .then(function (data) {

                        requestParameters.pagination.count = data.count;
                        requestParameters.pagination.downloaded = requestParameters.pagination.downloaded + data.results.length;
                        evDataService.setRequestParameters(requestParameters);

                        processedRequestParameters.push(requestParameters);

                        // enqueue requests for the next level of groups or objects
                        enqueueNewRequests(evDataService, evEventService, data, requestParameters);

                        processQueue(evDataService, evEventService, processedRequestParameters)
                            .then(function (processedReqParams) {
                                resolve(processedReqParams);
                            }).catch(function (e) {
                                reject(e);
                            })

                    })
                    .catch(function (e) {
                        processGetItemsError(e, evDataService, requestParameters.id, processedRequestParameters, resolve, reject);
                    });

            }
            else {
                // `processQueue()` called inside
                executeObjectRequest(evDataService, evEventService, requestParameters, processedRequestParameters)
                    .then(function (processedReqParams) {
                        resolve(processedReqParams);
                    })
                    .catch(function (e) { reject(e); });
            }

        });

    }

    /**
     *
     * @param evDataService {Object}
     * @param evEventService {Object}
     * @returns {Promise<void>} - returns a promise of the processQueue function
     */
    var createDataStructure = function (evDataService, evEventService) {
        console.log('rv.createDataStructure')

        evDataService.resetData();
        evDataService.resetRequestParameters();

        evDataService.incrementCurrentRequestId();

        var reportOptions = evDataService.getReportOptions();

        if (reportOptions) {
            reportOptions.report_instance_id = null // if clear report_instance_id then we request new Report Calculation
        }

        evDataService.setReportOptions(reportOptions);

        var defaultRootRequestParameters = evDataService.getActiveRequestParameters();

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        return processQueueDispatchEvents(evDataService, evEventService, defaultRootRequestParameters);

    };

    /**
     *
     * @return {Promise<void>}
     */
    const updateDataStructureByMultipleRequestParameters = async function (evDataService, evEventService, requestParametersList) {

        const promiseQueue = new QueuePromisesService();
        let lastPromise;

        evEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        requestParametersList.forEach((requestParameters, index) => {

            if (index === requestParametersList.length - 1) { // last

                lastPromise = promiseQueue.enqueue(
                    async function () {

                        let result, error;

                        try {

                            result = await updateDataStructureByRequestParameters(
                                evDataService,
                                evEventService,
                                requestParameters
                            )

                        } catch (e) {
                            error = e;
                        }

                        evEventService.dispatchEvent(evEvents.DATA_LOAD_END);

                        if (error) {
                            throw error;
                        }

                        return result;

                    }
                )

            }
            else {

                promiseQueue.enqueue(
                    function () {
                        return updateDataStructureByRequestParameters(evDataService, evEventService, requestParameters)
                    }
                )

            }

        });

        return lastPromise;

    }

    /**
     * Inject filters into request parameters and load data
     *
     * @param requestParameters { evRvRequestParameters } - object with options for a request
     * @param evDataService {entityViewerDataService}
     * @param evEventService {entityViewerEventService}
     * @returns {Promise<unknown>} - Resolved when request parameters in the queue are resolved.
     * Rejected if an error or rejection happened while processing a request parameter from the queue.
     */
    var updateDataStructureByRequestParameters = function (evDataService, evEventService, requestParameters) {

        return processQueueDispatchEvents(evDataService, evEventService, requestParameters);

    };

    /**
     * Update data using active request parameters
     *
     * @param evDataService
     * @param evEventService
     */
    var updateDataStructure = function (evDataService, evEventService) {

        var requestParameters = evDataService.getActiveRequestParameters();

        return updateDataStructureByRequestParameters(evDataService, evEventService, requestParameters);

    };

    /**
     * Helper function for functions `sortObjects` and `sortGroupType`.
     * Resets parameters for pagination of request parameters that will be used
     * for sorting.
     * @see sortObjects
     * @see sortGroupType
     *
     * @param groupsList { [{}] } - groups whose children will be sorted
     * @param evDataService { entityViewerDataService }
     * @return { [evRvRequestParameters] } - request parameters for requesting
     * sorted objects or groups
     */
    const getRequestParametersListForSorting = function (groupsList, evDataService) {

        var requestsParameters = evDataService.getAllRequestParameters();
        var reqParamsList = [];

        Object.values(requestsParameters).forEach(function (rParams) {

            const isSortingReqParam = groupsList.some(
                group => group.___id === rParams.id
            );

            if (isSortingReqParam) {

                rParams = evDataService.resetRequestParametersPages(rParams);

                evDataService.setRequestParameters(rParams);
                reqParamsList.push(rParams);

            }

        })

        return reqParamsList;

    }

    const sortObjects = function (evDataService, evEventService) {

        // var activeColumnSort = evDataService.getActiveColumnSort();
        const level = evDataService.getGroups().length;

        const levelGroups = evDataHelper.getGroupsByLevel(level, evDataService);

        evDataService.resetAllObjects();

        const requestParametersList = getRequestParametersListForSorting(levelGroups, evDataService);

        return updateDataStructureByMultipleRequestParameters(evDataService, evEventService, requestParametersList);

    };

    /**
     *
     * @param evDataService {entityViewerDataService}
     * @param evEventService {entityViewerEventService}
     * @param signalDataLoadEnd
     */
    const sortGroupType = function (evDataService, evEventService, signalDataLoadEnd) {

        /** @type {Object} */
        const activeGroupTypeSort = evDataService.getActiveGroupTypeSort();

        console.log('sortGroupType.activeGroupTypeSort', activeGroupTypeSort);

        const groupsTypes = evDataService.getGroups();

        // Level of a parent used, because sorting applies to an array inside 'result' property of a parent.
        // Because 0 level reserved for the root group, an index of a group equals to a level of its parent group.
        let parentLevel = groupsTypes.findIndex(function (item) {
            return item.key === activeGroupTypeSort.key;
        });

        if (parentLevel < 0) {
            parentLevel = 0;
        }
        console.log('sortGroupType.parentLevel', parentLevel);

        let groupsWithChildrenToSort = [];

        //# region Reset groups and objects affected by sorting and assemble `groupsWithChildrenToSort`
        evDataService.resetAllObjects();

        let dataList = evDataService.getDataAsList();
        let data = evDataService.getData();

        dataList.forEach(item => {

            if (item.___type === 'group') {

                if (item.___level === parentLevel) {

                    data[item.___id].results = [];
                    groupsWithChildrenToSort.push(item);

                } else if (item.___level > parentLevel) {

                    delete data[item.___id];
                    evDataService.deleteRequestParameters(item.___id);

                }

            }

        })

        evDataService.setAllData(data);
        //# endregion

        // const groupsWithChildrenToSort = evDataHelper.getGroupsByLevel(parentLevel, evDataService);

        /*const allReqParams = evDataService.getAllRequestParameters();
        const requestParametersForUnfoldedGroups = [];

        Object.values(allReqParams).forEach(rParams => {

            const isReqParamForUnfolded = groupsWithChildrenToSort.some(
                group => group.___id === rParams.id
            );

            if (isReqParamForUnfolded) {

                rParams.pagination.page = 1;
                rParams.pagination.count = 0;
                rParams.pagination.downloaded = 0;

                rParams.requestedPages = [1];

                evDataService.setRequestParameters(rParams);
                requestParametersForUnfoldedGroups.push(rParams);

            }

        });*/

        const sortingRequestParametersList = getRequestParametersListForSorting(groupsWithChildrenToSort, evDataService);

        return updateDataStructureByMultipleRequestParameters(evDataService, evEventService, sortingRequestParametersList);

    };

    return {
        createDataStructure: createDataStructure,
        updateDataStructure: updateDataStructure,

        sortObjects: sortObjects,
        sortGroupType: sortGroupType,

        createRequestParameters: createRequestParameters,
        updateDataStructureByRequestParameters: updateDataStructureByRequestParameters,
    }

}

