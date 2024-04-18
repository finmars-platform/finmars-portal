(function () {

    var explorerService = require('../services/explorerService');

    /** @module bindFieldTableDirective */
    module.exports = function ($mdDialog) {
        return {
            require: "^^bindFieldControl",
            restrict: "E",
            scope: {
                item: '=',
                entity: '='
            },
            templateUrl: "views/directives/bind-field-attachment-view.html",
            link: function (scope, elem, attr, bfcVm) {

                console.log('bindFieldAttachment.item', scope.item);
                console.log('bindFieldAttachment.entity', scope.entity);


                scope.downloadFile = function ($event, item) {

                    explorerService.viewFile(item.file_report_object.file_url).then(function (blob) {

                        var reader = new FileReader();

                        reader.addEventListener("loadend", function (e) {

                            var content = reader.result;

                            if (item.file_report_object.file_url.indexOf('.json') !== -1) {
                                content = JSON.parse(content)
                            }

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
                                        content: content,
                                        info: item
                                    }
                                }
                            });


                        });

                        reader.readAsText(blob);


                    });


                }


            }
        }
    };

}());