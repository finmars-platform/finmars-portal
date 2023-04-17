/**
 * Created by szhitenev on 04.10.2022.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var listFiles = function (path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            path = ''
        }

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/explorer/?path=' + path,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var viewFile = function (path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            path = ''
        }

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/view/?path=' + path,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (response) {
            return response.blob()
        })
    };

    var deleteFile = function (path, is_dir) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            throw Error("Path is required");
        }

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/delete/?path=' + path + '&is_dir=' + is_dir,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (response) {
            return response.blob()
        })
    };

    var createFolder = function (path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            path = ''
        }

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/create-folder/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({path: path})
            }).then(function (response) {
            return response.blob()
        })
    };

    var deleteFolder = function (path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            path = ''
        }

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/delete-folder/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({path: path})
            }).then(function (response) {
            return response.blob()
        })
    };

    var uploadFiles = function (formData) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/upload/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                },
                body: formData
            }).then(function (response) {
            return response.blob()
        })
    };

    var downloadZip = function (path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!path) {
            path = ''
        }

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/download-folder-as-zip/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({path: path})
            }).then(function (response) {
            return response.blob()
        })
    };


    module.exports = {
        listFiles: listFiles,
        viewFile: viewFile,
        deleteFile: deleteFile,
        createFolder: createFolder,
        deleteFolder: deleteFolder,
        uploadFiles: uploadFiles,
        downloadZip: downloadZip
    }

}());