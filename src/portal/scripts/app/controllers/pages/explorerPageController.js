/**
 * Created by szhitenev on 04.10.2022.
 */
(function () {

    'use strict';

    var baseUrlService = require('../../services/baseUrlService');
    var explorerService = require('../../services/explorerService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function explorerController($scope, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.items = [];

        vm.currentPath = []

        vm.showHiddenFiles = false;

        vm.breadcrumbsNavigation = function ($index) {

            if ($index === -1) {
                vm.currentPath = []
            } else {
                vm.currentPath = vm.currentPath.filter(function (item, index) {
                    return index <= $index;
                })
            }

            vm.listFiles();

        }

        vm.selectItem = function ($event, item){

            vm.items = vm.items.map(function (_item){
                _item.selected = false
                return _item
            })

            item.selected = true;
        }

        vm.triggerMenu = function ($event){

            console.log("$event", $event)
            // Cause md-menu on right click has wrong absolute position calc
            setTimeout(function (){
                $event.currentTarget.querySelector('.explorer-md-menu-trigger').click()
            }, 0)

        }

        vm.openFolder = function ($event, item) {

            console.log('open Folder ', item);

            vm.currentPath.push(item.name)

            vm.listFiles()

        }

        vm.previewFile = function ($event, item, $mdMenu) {

            if ($mdMenu) {
                $mdMenu.close()
            }

            var itemPath = vm.currentPath.join('/') + '/' + item.name

            explorerService.viewFile(itemPath).then(function (blob) {

                $mdDialog.show({
                    controller: 'FilePreviewDialogController as vm',
                    templateUrl: 'views/dialogs/file-preview-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        data: {
                            blob: blob,
                            file_descriptor: item
                        }
                    }
                });

            });

        }

        vm.downloadFile = function ($mdMenu, $event, item) {

            $mdMenu.close()

            var itemPath = item.name
            if (vm.currentPath.length) {
                itemPath = vm.currentPath.join('/') + '/' + item.name
            }

            explorerService.viewFile(itemPath).then(function (blob){


                // IE doesn't allow using a blob object directly as link href
                // instead it is necessary to use msSaveOrOpenBlob
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob);
                    return;
                }

                // For other browsers:
                // Create a link pointing to the ObjectURL containing the blob.
                var data = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = data;
                link.download = item.name;

                document.body.appendChild(link); // For Mozilla Firefox
                link.click();

                setTimeout(function(){
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(data);
                }, 100);
            })

            console.log("download", item)

        }

        vm.renameFile = function ($mdMenu, $event, item) {

            $mdMenu.close()

            item.rename = true

        }

        vm.deleteFile = function ($mdMenu, $event, item) {

            $mdMenu.close()

            var itemPath = item.name
            if (vm.currentPath.length) {
                itemPath = vm.currentPath.join('/') + '/' + item.name
            }

            var is_dir = false;

            if (item.type === 'dir') {
                is_dir = true;
            }

            explorerService.deleteFile(itemPath, is_dir)

            setTimeout(function (){
                vm.listFiles();
            }, 100)

        }

        vm.listFiles = function (){

            explorerService.listFiles(vm.currentPath.join('/')).then(function (data){

                vm.items = data.results;

                vm.items = vm.items.filter(function (item){

                    var result = true

                    if (item.name[0] === '.' && !vm.showHiddenFiles) {
                        result = false;
                    }

                    return result

                })

                $scope.$apply();

            })

        }

        vm.createFolder = function ($event) {


            $mdDialog.show({
                controller: 'CreateFolderDialogController as vm',
                templateUrl: 'views/dialogs/create-folder-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {

                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    var itemPath = res.name
                    if (vm.currentPath.length) {
                        itemPath = vm.currentPath.join('/') + '/' + res.name
                    }

                    explorerService.createFolder(itemPath).then(function (){

                        vm.listFiles();

                    })
                }

            });

        }

        vm.uploadFiles = function ($event) {

            document.querySelector('#explorerFileUploadInput').click();

        }

        vm.uploadFileHandler = function ($event) {

            console.log("uploadFileHandler.$event", $event)

            var fileInput = document.querySelector('#explorerFileUploadInput')

            let formData = new FormData();
            for (var i = 0; i < fileInput.files.length; i = i + 1) {
                formData.append("file", fileInput.files[i]);
            }

            var path = vm.currentPath.join('/')

            console.log(path)

            formData.append('path', path)

            explorerService.uploadFiles(formData).then(function (data){

                document.querySelector('#explorerFileUploadInput').value = "";

                vm.listFiles();

            })


        }

        vm.toggleHidden = function (){

            vm.showHiddenFiles = !vm.showHiddenFiles;

            vm.listFiles();

        }

        vm.init = function () {

            vm.listFiles();

            vm.member = globalDataService.getMember();

            document.querySelector('.explorer-page').addEventListener('click', function (e) {

                vm.items = vm.items.map(function (_item){
                    _item.selected = false
                    return _item
                })

            })

        };

        vm.init();

    };

}());