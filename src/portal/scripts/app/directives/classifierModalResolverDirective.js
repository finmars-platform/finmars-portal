/**
 * Created by szhitenev on 21.07.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                classifierAttr: '=',
                entityType: '=',
                classifierValue: '='
            },
            link: function (scope, elem, attr, ngModelCtrl) {

                logService.component('ClassifierModalResolver', 'initialize');

                $(elem).on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    setTimeout(function () {
                        $('.md-select-backdrop')[0].dispatchEvent(new Event('click'));
                    }, 400);

                    $mdDialog.show({
                        controller: 'ClassifierSelectDialogController as vm',
                        templateUrl: 'views/classifier-select-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: event,
                        preserveScope: true,
                        autoWrap: true,
                        multiple: true,
                        skipHide: true,
                        locals: {
                            data: {
                                ngModelCtrl: ngModelCtrl,
                                classifier: scope.classifierAttr,
                                classifierId: scope.classifierValue,
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            ngModelCtrl.$setViewValue(res.data.item);
                            ngModelCtrl.$render();
                            console.log('ngModelCtrl', scope.classifierValue);
                        }
                    });

                })
            }
        }
    }

}());