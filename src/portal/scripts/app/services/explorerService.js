/**
 * Created by szhitenev on 04.10.2022.
 */
(function () {

    var explorerRepository = require('../repositories/explorerRepository');

    var listFiles = function (options) {
        return explorerRepository.listFiles(options);
    };

    var searchFiles = function (options) {
        return explorerRepository.searchFiles(options);
    };

    var viewFile = function (path) {
        return explorerRepository.viewFile(path);
    }

    var deleteFile = function (path, is_dir) {
        return explorerRepository.deleteFile(path, is_dir);
    }

    var createFolder = function (path) {
        return explorerRepository.createFolder(path);
    }

    var deleteFolder = function (path) {
        return explorerRepository.deleteFolder(path);
    }

    var uploadFiles = function (formData) {
        return explorerRepository.uploadFiles(formData);
    }


    var downloadZip = function (data) {
        return explorerRepository.downloadZip(data)
    }

    var downloadFile = function (data) {
        return explorerRepository.downloadFile(data)
    }

    var sync = function () {
        return explorerRepository.sync()
    }

    var rename = function (data) {
        return explorerRepository.rename(data)
    }

    var move = function (data) {
        return explorerRepository.move(data)
    }

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