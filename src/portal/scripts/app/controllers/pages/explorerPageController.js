/**
 * Created by szhitenev on 04.10.2022.
 */
(function () {

    'use strict';

    var baseUrlService = require('../../services/baseUrlService');
    var explorerService = require('../../services/explorerService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var metaHelper = require('../../helpers/meta.helper')

    var baseUrl = baseUrlService.resolve();


    module.exports = function explorerController($scope, $state, $stateParams, $sce, authorizerService, globalDataService, $mdDialog) {

        var vm = this;

        vm.items = [];

        vm.reverse = true;
        vm.propertyName = 'name';

        vm.currentPath = []

        vm.showHiddenFiles = false;
        vm.showWorkflow = false;
        vm.showEditor = false;

        vm.fileEditor = {}
        vm.fileEditorLoading = false;

        vm.allSelected = false;
        vm.selectedCount = 0;

        vm.searchTerm = '';

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

        vm.breadcrumbsNavigation = function ($index) {

            if ($index === -1) {
                vm.currentPath = []
            } else {
                vm.currentPath = vm.currentPath.filter(function (item, index) {
                    return index <= $index;
                })
            }

            // vm.listFiles();
            // IMPORTANT! State.go escaping slashes and router goes mad
            window.location.hash = '#!/explorer/' + vm.currentPath.join('/')

        }

        vm.triggerMenu = function ($event) {

            console.log("$event", $event)
            // Cause md-menu on right click has wrong absolute position calc
            setTimeout(function () {
                $event.currentTarget.querySelector('.explorer-md-menu-trigger').click()
            }, 0)

        }

        vm.openFolder = function ($event, item) {

            console.log('open Folder ', item);

            vm.currentPath.push(item.name)

            console.log('vm.currentPath', vm.currentPath);

            // IMPORTANT! State.go escaping slashes and router goes mad
            window.location.hash = '#!/explorer/' + vm.currentPath.join('/')

            // vm.listFiles()

        }

        vm.editFile = function ($event, item, $mdMenu) {

            vm.fileEditor = {}

            if ($mdMenu) {
                $mdMenu.close()
            }

            vm.fileEditor.name = item.name

            var itemPath = vm.currentPath.join('/') + '/' + item.name

            vm.showEditor = true;

            vm.calculateExplorerStateClass();

            vm.fileEditorLoading = true;

            explorerService.viewFile(itemPath).then(function (blob) {

                var reader = new FileReader();

                reader.addEventListener("loadend", function (e) {
                    vm.fileEditor.content = reader.result;

                    vm.fileEditorLoading = false;

                    $scope.$apply();

                    vm.initFileEditor() // call after angular.js render


                });

                reader.readAsText(blob);


            });

        }

        vm.initFileEditor = function () {

            console.log('vm.initFileEditor.fileEditor ', vm.fileEditor)

            setTimeout(function () {

                vm.editor = ace.edit('fileEditorAceEditor');
                vm.editor.setTheme("ace/theme/monokai");

                if (vm.fileEditor.name.indexOf('.py') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/python");
                }

                if (vm.fileEditor.name.indexOf('.json') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/json");
                }

                if (vm.fileEditor.name.indexOf('.yaml') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/yaml");
                }

                if (vm.fileEditor.name.indexOf('.html') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/html");
                }

                if (vm.fileEditor.name.indexOf('.js') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/javascript");
                }

                if (vm.fileEditor.name.indexOf('.css') !== -1) {
                    vm.editor.getSession().setMode("ace/mode/css");
                }

                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);
                ace.require("ace/ext/language_tools");
                vm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);
                vm.editor.setValue(vm.fileEditor.content)

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)

        }

        vm.saveFileEditor = function () {
            vm.fileSaveProcessing = true;

            var name = vm.fileEditor.name

            var path = vm.currentPath.join('/');

            let formData = new FormData();

            var content = vm.editor.getValue()

            console.log('path', path)
            console.log('name', name)

            const blob = new Blob([content], {type: vm.contentType});
            const file = new File([blob], name)

            formData.append("file", file)
            formData.append('path', path)

            explorerService.uploadFiles(formData).then(function (e) {

                toastNotificationService.success("File Saved")

                vm.fileSaveProcessing = false;

                $scope.$apply();

            })
        }

        vm.deleteSelected = function ($event) {

            var itemsToDelete = vm.items.filter(function (item) {
                return item.selected;
            })

            var names = itemsToDelete.map(function (item) {
                return item.name
            }).join(', ');

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure that you want to delete " + names + "?",
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    var promises = [];

                    itemsToDelete.forEach(function (item) {

                        var itemPath = vm.currentPath.join('/') + '/' + item.name

                        if (item.type === 'dir') {
                            promises.push(new Promise(function (resolve) {
                                explorerService.deleteFolder(itemPath).then(function (data) {
                                    resolve()
                                })
                            }))

                        } else {
                            promises.push(new Promise(function (resolve) {
                                explorerService.deleteFile(itemPath, false).then(function (data) {
                                    resolve()
                                })
                            }))

                        }

                    })

                    Promise.allSettled(promises).then(function () {
                        toastNotificationService.success("Items deleted")
                        vm.listFiles();
                    })

                }
            })

        }

        vm.deleteFile = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure that you want to delete file " + vm.fileEditor.name + "?",
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    var itemPath = vm.fileEditor.name;
                    if (vm.currentPath.length) {
                        itemPath = vm.currentPath.join('/') + '/' + vm.fileEditor.name
                    }

                    var is_dir = false;

                    explorerService.deleteFile(itemPath, is_dir)

                    setTimeout(function () {
                        vm.showEditor = false;
                        vm.listFiles();
                    }, 600)

                }

            });

        }

        vm.closeFileEditor = function () {

            vm.showEditor = false;

            vm.listFiles();
        }

        vm.copyLink = function ($event, item) {

            const url = window.location.origin + '/' + baseUrlService.getMasterUserPrefix() + '/api/storage' + item.file_path

            metaHelper.copyToBuffer(url)

        }

        vm.copyFilePath = function ($event, item) {

            metaHelper.copyToBuffer(item.file_path)

        }

        vm.downloadFile = function ($event, item) {

            var itemPath = item.name
            if (vm.currentPath.length) {
                itemPath = vm.currentPath.join('/') + '/' + item.name
            }

            explorerService.viewFile(itemPath).then(function (blob) {


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

                setTimeout(function () {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(data);
                }, 100);
            })

            console.log("download", item)

        }

        vm.renameFile = function ($mdMenu, $event, item) {

            $mdDialog.show({
                controller: 'CreateFileDialogController as vm',
                templateUrl: 'views/dialogs/create-file-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {}
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    var itemPath = vm.fileEditor.name;
                    if (vm.currentPath.length) {
                        itemPath = vm.currentPath.join('/') + '/' + vm.fileEditor.name
                    }

                    var is_dir = false;

                    explorerService.deleteFile(itemPath, is_dir)

                    vm.fileEditor.name = res.name;

                    vm.saveFileEditor();

                }
            })

        }

        vm.toggleSelectAll = function ($event) {

            vm.allSelected = !vm.allSelected;

            vm.selectedCount = 0;

            console.log('toggleSelectAll searchTerm', vm.searchTerm);

            vm.items.filter(function (item) {
                if (vm.searchTerm) {
                    return item.name.indexOf(vm.searchTerm) !== -1
                }

                return true;

            }).forEach(function (item) {
                item.selected = vm.allSelected;

                if (item.selected) {
                    vm.selectedCount = vm.selectedCount + 1;
                }

            })


        }

        vm.selectItem = function ($event, item) {

            item.selected = !item.selected;

            console.log(" vm.selectItem item", item)

            var allSelected = true;

            vm.selectedCount = 0;

            vm.items.filter(function (item) {
                if (vm.searchTerm) {
                    return item.name.indexOf(vm.searchTerm) !== -1
                }
                return true;

            }).forEach(function (item) {
                if (!item.selected) {
                    allSelected = false;
                }

                if (item.selected) {
                    vm.selectedCount = vm.selectedCount + 1;
                }
            })

            vm.allSelected = allSelected;
        }

        vm.listFiles = function () {

            vm.processing = true;
            vm.selectedCount = 0;

            explorerService.listFiles(vm.currentPath.join('/')).then(function (data) {

                vm.items = data.results;

                vm.items = vm.items.filter(function (item) {

                    var result = true

                    if (item.name[0] === '.' && !vm.showHiddenFiles) {
                        result = false;
                    }

                    return result

                })

                vm.processing = false;

                $scope.$apply();

            })

        }

        vm.deleteFolder = function ($event) {

            var path = vm.currentPath.join('/')

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure that you want to delete folder " + path + "?",
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    explorerService.deleteFolder(path).then(function () {

                        vm.currentPath.pop()

                        vm.listFiles();

                    })

                }

            })
        }

        vm.createFolder = function ($event) {

            $mdDialog.show({
                controller: 'CreateFolderDialogController as vm',
                templateUrl: 'views/dialogs/create-folder-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {}
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    var itemPath = res.name
                    if (vm.currentPath.length) {
                        itemPath = vm.currentPath.join('/') + '/' + res.name
                    }

                    explorerService.createFolder(itemPath).then(function () {

                        vm.listFiles();

                    })
                }

            });

        }

        vm.createFile = function ($event) {

            $mdDialog.show({
                controller: 'CreateFileDialogController as vm',
                templateUrl: 'views/dialogs/create-file-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {}
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.fileEditor = {}

                    vm.fileEditor.name = res.name;
                    vm.fileEditor.content = '';

                    vm.showEditor = true;

                    vm.initFileEditor() // call after angular.js render

                }

            });

        }

        vm.uploadFiles = function ($event) {

            document.querySelector('#explorerFileUploadInput').click();

        }

        vm.downloadZip = function ($event) {

            var path = vm.currentPath.join('/')

            $mdDialog.show({
                controller: 'SaveAsDialogController as vm',
                templateUrl: 'views/dialogs/save-as-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        name: 'Archive'
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    var name = res.data.name + '.zip'

                    var paths = []

                    vm.items.forEach(function (item) {
                        if (item.selected) {

                            if (item.type === 'dir') {
                                paths.push(vm.currentPath.join('/') + '/' + item.name + '/') // important to add trailing slash
                            } else {
                                paths.push(vm.currentPath.join('/') + '/' + item.name)
                            }
                        }
                    })

                    console.log('paths', paths);

                    explorerService.downloadZip({paths: paths}).then(function (blob) {

                        downloadFileHelper.downloadFile(blob, "application/zip", name)

                    })

                }
            })

        }

        vm.uploadFileHandler = function ($event) {

            vm.processing = true;

            console.log("uploadFileHandler.$event", $event)

            var fileInput = document.querySelector('#explorerFileUploadInput')

            let formData = new FormData();
            for (var i = 0; i < fileInput.files.length; i = i + 1) {
                formData.append("file", fileInput.files[i]);
            }

            var path = vm.currentPath.join('/')

            console.log(path)

            formData.append('path', path)

            explorerService.uploadFiles(formData).then(function (data) {

                document.querySelector('#explorerFileUploadInput').value = "";

                vm.listFiles();

            })


        }

        vm.toggleHidden = function () {

            vm.showHiddenFiles = !vm.showHiddenFiles;

            vm.listFiles();

        }

        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        vm.resolveWorkflowIframeUrl = function () {

            vm.workflowIframeUrl = 'http://0.0.0.0:8084/space00000/workflow/'

            if (window.location.href.indexOf('finmars') !== -1) {
                vm.workflowIframeUrl = window.location.protocol + '//' + window.location.host + '/' + baseUrlService.getMasterUserPrefix() + '/workflow/'
            }

        }

        vm.calculateExplorerStateClass = function () {

            var result = '';

            if (vm.showWorkflow && !vm.showEditor) {

                result = 'show-explorer-workflow'

            }

            if (!vm.showWorkflow && vm.showEditor) {

                result = 'show-explorer-editor'

            }

            if (vm.showWorkflow && vm.showEditor) {

                result = 'show-explorer-editor-workflow'

            }

            vm.explorerStateClass = result;

        }

        vm.openInNewTab = function ($event, item) {

            const url = window.location.origin + '/' + baseUrlService.getMasterUserPrefix() + '/api/storage' + item.file_path


            window.open(url, "_blank");
        }

        vm.deleteFile = function ($event, item) {

        }

        vm.init = function () {

            vm.resolveWorkflowIframeUrl();

            console.log('$stateParams', $stateParams);

            if ($stateParams.folderPath) {
                vm.currentPath = $stateParams.folderPath.split('/')
            }

            console.log("here?")

            vm.listFiles();

            vm.member = globalDataService.getMember();

        };

        vm.init();

    };

}());