/**
 * Created by szhitenev on 04.10.2022.
 */
// import baseUrlService from "../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    var listFiles = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!options.path) {
          options.path = ''
        }

        return xhrService.fetch(
          baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/explorer/?path=' + options.path + '&page=' + options.page + '&page_size=' + options.pageSize,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }
          )
    };

  var searchFiles = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();


    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/search/?query=' + options.query+ '&page=' + options.page + '&page_size=' + options.pageSize,
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

    var downloadZip = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/download-as-zip/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(function (response) {
            return response.blob()
        })
    };

    var downloadFile = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/download/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(function (response) {
            return response.blob()
        })
    };

  var sync = function () {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/sync/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Token ' + cookieService.getCookie('access_token'),
          Accept: 'application/json',
          'Content-type': 'application/json'
        }
    })
  };

  var rename = function (data) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/rename/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Token ' + cookieService.getCookie('access_token'),
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
  };


  var move = function (data) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/explorer/move/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Token ' + cookieService.getCookie('access_token'),
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
  };

    module.exports = {
        listFiles: listFiles,
        searchFiles: searchFiles,
        viewFile: viewFile,
        deleteFile: deleteFile,
        createFolder: createFolder,
        deleteFolder: deleteFolder,
        uploadFiles: uploadFiles,
        downloadZip: downloadZip,
        downloadFile: downloadFile,
        sync: sync,
        rename: rename,
        move: move,
    }

}());