/**
 * Created by szhitenev on 01.08.2023.
 */
(function () {

    'use strict';

    var toastNotificationService = require('../../../../core/services/toastNotificationService');
    var explorerService = require('../services/explorerService')
    var workflowService = require('../services/workflowService')
    var md5Helper = require('../helpers/md5.helper')

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/finmars-playbook-view.html',
            scope: {
                item: '=',
                name: '=',
                filePathList: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                console.log('playbookDirective.item', scope.item);
                console.log('playbookDirective.name', scope.name);
                console.log('playbookDirective.filePathList', scope.filePathList);


                scope.activeCell = null;

                scope.execute = function ($event) {

                    scope.executing = true;

                    workflowService.executeCode({

                        code: scope.activeCell.source,
                        file_path: scope.filePathList.join('/')

                    }).then(function (data) {

                        scope.executing = false;
                        scope.activeCell.outputs = [data.result]
                        scope.$apply();

                        toastNotificationService.success("Executed")

                    })

                }

                scope.exportToDraft = function () {

                    return JSON.parse(JSON.stringify(scope.item));

                }

                scope.applyDraft = function ($event, data) {

                    // console.log('data', data);

                    scope.processing = true;

                    scope.item = data;

                    setTimeout(function () {

                        scope.processing = false;
                        scope.$apply();

                    }, 1000)

                }

                scope.save = function ($event) {

                    scope.fileSaveProcessing = true;

                    let formData = new FormData();

                    var content = JSON.stringify(scope.item, null, 4);

                    const blob = new Blob([content], {type: 'application/json'});
                    const file = new File([blob], scope.name)

                    var pathPieces = [...scope.filePathList]
                    pathPieces.pop();

                    var path = pathPieces.join('/');

                    formData.append("file", file)
                    formData.append('path', path)

                    return explorerService.uploadFiles(formData).then(function (e) {

                        toastNotificationService.success("File Saved")

                        scope.fileSaveProcessing = false;

                        scope.$apply();

                    })

                }

                scope.activateCell = function ($event, cell) {

                    scope.item.cells = scope.item.cells.map(function (item) {

                        item.active = false;

                        return item
                    })

                    cell.active = true;

                    scope.activeCell = cell;

                }

                function generateUniqueID() {
                    const currentDatetime = new Date().toISOString();
                    return md5Helper.md5(currentDatetime);
                }

                scope.addCell = function ($event) {

                    scope.item.cells.push({
                        "id": generateUniqueID(),
                        "cell_type": "code",
                        "source": "",
                        "metadata": {
                            "trusted": true
                        },
                        "execution_count": 0
                    })

                }

                scope.deleteCell = function ($event, $index, cell) {

                    console.log('deleteCell', $index, cell)

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: "<p>Are you sure you want to delete cell?</p>"
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.processing = true;

                            scope.item.cells = scope.item.cells.filter(function (item, index) {
                                return item.id != cell.id
                            })

                            setTimeout(function () {

                                scope.processing = false;
                                scope.$apply();

                            }, 1000)

                        }
                    });
                }

                scope.init = function () {

                    scope.activeCell = null;

                    scope.draftUserCode = 'explorer.' + scope.filePathList.join('__')

                    scope.item.cells = scope.item.cells.map(function (item) {

                        item.active = false;

                        return item
                    })

                    console.log('scope.item.cells', scope.item.cells);

                }

                scope.init();

            }
        }
    }

}());