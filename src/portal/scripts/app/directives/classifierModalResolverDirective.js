/**
 * Created by szhitenev on 21.07.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                classifierAttr: '=',
                entityType: '='
            },
            link: function (scope, elem, attr, ngModelCtrl) {

                logService.component('ClassifierModalResolver', 'initialize');

                $(elem).on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $mdDialog.show({
                        controller: 'ClassifierSelectDialogController as vm',
                        templateUrl: 'views/classifier-select-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        clickOutsideToClose: true,
                        locals: {
                            data: {
                                ngModelCtrl: ngModelCtrl,
                                classifier: scope.classifierAttr,
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            ngModelCtrl.$setViewValue(res.data.item);
                            ngModelCtrl.$render();
                            console.log('ngModelCtrl', ngModelCtrl);
                        }
                    });

                })
            }
        }
    }

}());