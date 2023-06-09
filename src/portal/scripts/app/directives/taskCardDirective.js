/**
 * Created by szhitenev on 09.06.2023.
 */
(function () {

    'use strict';

    var tasksService = require('../services/tasksService');

    module.exports = function ($mdDialog, systemMessageService) {

        return {
            restrict: 'E',
            scope: {
                taskId: '='
            },
            templateUrl: 'views/directives/task-card-view.html',
            link: function (scope, elem, attrs) {

                function splitLongWords(text, maxLength) {
                    const words = text.split(" ");
                    const splittedWords = words.map(word => {
                        if (word.length <= maxLength) {
                            return word;
                        }

                        let chunks = [];
                        for (let i = 0; i < word.length; i += maxLength) {
                            chunks.push(word.substring(i, i + maxLength));
                        }
                        return chunks.join(" ");
                    });

                    return splittedWords.join(" ");
                }

                scope.getTask = function () {

                    tasksService.getByKey(scope.taskId).then(function (data) {

                        scope.task = data;


                        if (scope.task.progress_object) {
                            scope.taskDescriptionPretty = splitLongWords(scope.task.progress_object.description, 20);
                        }

                        scope.$apply();

                        if (scope.task.status !== 'P') {
                            clearInterval(scope.interval);
                        }

                    })

                }

                scope.downloadFile = function ($event, item) {

                    $event.preventDefault();
                    $event.stopPropagation();

                    systemMessageService.viewFile(item.file_report).then(function (data) {

                        console.log('data', data);

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
                                    content: data,
                                    info: item
                                }
                            }
                        });

                    })
                }

                scope.interval = setInterval(function () {

                    scope.getTask();

                }, 3 * 1000) // 2 seconds


            }
        }

    }

}());