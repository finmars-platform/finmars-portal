/**
 * Created by szhitenev on 04.05.2016.
 */

import baseUrlService from "./baseUrlService";

export default function (cookieService, xhrService) {

    const baseUrl = baseUrlService.resolve();

    const exportAll = function () {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/',
            xhrService.getRequestParams('GET'))

    };

    const getConfigurationData = function () {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        /*return new Promise((resolve, reject) => {

            xhrService.fetch(
                baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/',
                xhrService.getRequestParams('GET')
            )
                .then( data => {
                    resolve( data.json() )
                })
                .catch( error => reject(error) );

        })*/
        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/',
            xhrService.getRequestParams('GET')
        );

        return xhrService.processResponse(res);

    };

    const getMappingData = function () {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/mapping/',
            xhrService.getRequestParams('GET')
        )

        return xhrService.processResponse(res);

    };

    const getList = function () {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/?page_size=1000',
            xhrService.getRequestParams('GET')
        );

        return xhrService.processResponse(res);

    };

    const getByKey = function (id) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/',
            xhrService.getRequestParams('GET')
        );

        return xhrService.processResponse(res);

    };

    const create = function (data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/',
            xhrService.getRequestParams('POST', data)
        );

        return xhrService.processResponse(res);

    };

    const update = function (id, data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/',
            xhrService.getRequestParams('PUT', data)
        );

        return xhrService.processResponse(res);

    };

    const deleteByKey = function (id) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/',
            xhrService.getRequestParams('DELETE')
        );

        return xhrService.processResponse(res);

    };

    const exportConfiguration = function (id) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/export-configuration/',
            xhrService.getRequestParams('GET')
        );

        return xhrService.processResponse(res);

    };

    const importConfiguration = function (data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/import-configuration/',
            xhrService.getRequestParams('POST', data)
        );

        return xhrService.processResponse(res);

    };

    const pushConfigurationToMarketplace = function (id, data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/push-configuration-to-marketplace/',
            xhrService.getRequestParams('PUT', data)
        );

        return xhrService.processResponse(res);

    };

    const installConfiguration = function (data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        const res = xhrService.fetch(
            baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/install-configuration-from-marketplace/',
            xhrService.getRequestParams('POST', data)
        );

        return xhrService.processResponse(res);

    };

    return {
        exportAll: exportAll,
        getConfigurationData: getConfigurationData,
        getMappingData: getMappingData,
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        exportConfiguration: exportConfiguration,
        importConfiguration: importConfiguration,
        pushConfigurationToMarketplace: pushConfigurationToMarketplace,
        installConfiguration: installConfiguration,
    }
}