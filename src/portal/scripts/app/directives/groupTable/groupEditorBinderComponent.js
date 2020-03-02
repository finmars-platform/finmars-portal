/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($templateCache, $compile, $controller, $mdDialog, $state) {
        return {
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            restrict: 'AE',
            template: '<div class="split-panel-controller-container"></div>',
            link: function (scope, elem, attrs) {

                var container = $(elem).find('.split-panel-controller-container');

                function createController() {

                    var entityType = scope.evDataService.getEntityType();
                    var activeObject = scope.evDataService.getActiveObject();

                    var editorTemplateUrl;
                    var tpl;
                    var templateScope;
                    var ctrl;

                    if (activeObject) {

                        $(container).html('');

                        if (entityType === 'transaction-type') {

                            editorTemplateUrl = 'views/entity-viewer/transaction-type-edit-split-panel-view.html';
                            tpl = $templateCache.get(editorTemplateUrl);

                            templateScope = scope.$new();

                            ctrl = $controller('TransactionTypeEditDialogController as vm', {
                                '$scope': templateScope,
                                '$mdDialog': $mdDialog,
                                '$state': $state,
                                'entityType': entityType,
                                'entityId': activeObject.id
                            });

                            container.html(tpl);
                            container.children().data('$ngControllerController', ctrl);

                            $compile(elem.contents())(templateScope);

                        } else {

                            if (entityType === 'transaction-type' || entityType === 'complex-transaction') {

                                editorTemplateUrl = 'views/entity-viewer/complex-transaction-edit-split-panel-view.html';
                                tpl = $templateCache.get(editorTemplateUrl);

                                templateScope = scope.$new();

                                ctrl = $controller('ComplexTransactionEditDialogController as vm', {
                                    '$scope': templateScope,
                                    '$mdDialog': $mdDialog,
                                    '$state': $state,
                                    'entityType': entityType,
                                    'entityId': activeObject.id
                                });

                                container.html(tpl);
                                container.children().data('$ngControllerController', ctrl);

                                $compile(elem.contents())(templateScope);

                            } else {

                                editorTemplateUrl = 'views/entity-viewer/entity-viewer-edit-split-panel-view.html';
                                tpl = $templateCache.get(editorTemplateUrl);

                                templateScope = scope.$new();

                                ctrl = $controller('EntityViewerEditDialogController as vm', {
                                    '$scope': templateScope,
                                    '$mdDialog': $mdDialog,
                                    '$state': $state,
                                    'entityType': entityType,
                                    'entityId': activeObject.id
                                });

                                container.html(tpl);
                                container.children().data('$ngControllerController', ctrl);

                                $compile(elem.contents())(templateScope);

                            }


                        }
                    }

                }

                scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    createController();

                });


                createController();

            }
        }
    }


}());