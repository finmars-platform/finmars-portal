/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($templateCache, $compile, $controller, $mdDialog, $state, $transitions, metaContentTypesService, templateLoader) {
        return {
            scope: {
                evDataService: '=',
                evEventService: '=',
                spExchangeService: '='
            },
            restrict: 'AE',
            template: '<div class="split-panel-controller-container"></div>',
            link: function (scope, elem, attrs) {

                var container = $(elem).find('.split-panel-controller-container');
                var templateScope;
                var splitPanelAdditions;

                async function createControllerAndTemplate() {

                    splitPanelAdditions = JSON.parse(JSON.stringify( scope.evDataService.getAdditions() ));

                    container.html('');

                    const editorTemplateUrl = 'views/entity-viewer/split-panel-report-viewer-view.html';
                    // tpl = $templateCache.get(editorTemplateUrl);
                    const tpl = await templateLoader.loadTemplate(editorTemplateUrl)

                    templateScope = scope.$new();

                    templateScope.$parent.vm = {};
                    templateScope.$parent.vm.entityType = splitPanelAdditions.type;
                    // templateScope.$parent.vm.contentType = metaContentTypesService.findContentTypeByEntity( additions.type);
                    templateScope.$parent.vm.contentType = splitPanelAdditions.layoutData.content_type;

                    const ctrl = $controller('SplitPanelReportViewerController as vm', {
                        '$scope': templateScope,
                        '$mdDialog': $mdDialog,
                        '$transitions': $transitions,
                        'parentEntityViewerDataService': scope.evDataService,
                        'parentEntityViewerEventService': scope.evEventService,
                        'splitPanelExchangeService': scope.spExchangeService
                    });

                    container.html(tpl);
                    container.children().data('$ngControllerController', ctrl);

                    $compile(elem.contents())(templateScope);

                }

                createControllerAndTemplate();

                const acIndex = scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                    const additions = scope.evDataService.getAdditions();

                    if (!additions.isOpen) {
                        /* without this `if` when closing split panel
                        this function will be executed before eventListener
                        is removed by scope.$on("$destroy", function)*/
                        return;
                    }

                    delete templateScope.vm;
                    templateScope.$destroy();

                    if (
                        additions.type !== splitPanelAdditions.type ||
                        ( additions.layoutData?.content_type !== splitPanelAdditions.layoutData.content_type )
                    ) {
                        // report viewer is inside split panel and type of report changed
                        createControllerAndTemplate();
                    }

                });

                scope.$on("$destroy", function () {
                    scope.evEventService.removeEventListener(evEvents.ADDITIONS_CHANGE, acIndex);
                })

            }
        }
    }


}());