(function () {

    var evEvents = require('../../services/entityViewerEvents');
    var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');

    var initReducer = function (entityViewerDataService, entityViewerEventService, $mdDialog, getView) {

        entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

            evDataProviderService.updateDataStructure(entityViewerDataService, entityViewerEventService);

        });

        entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

            evDataProviderService.sortObjects(entityViewerDataService, entityViewerEventService);

        });

        entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

            evDataProviderService.sortGroupType(entityViewerDataService, entityViewerEventService);

        });

        entityViewerEventService.addEventListener(evEvents.GROUPS_LEVEL_FOLD, function () {

            // console.log('groups fold')


        });

        entityViewerEventService.addEventListener(evEvents.GROUPS_LEVEL_UNFOLD, function () {


            // console.log('groups unfold')

        });

        entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

            var activeObject = entityViewerDataService.getActiveObject();
            var action = entityViewerDataService.getActiveObjectAction();

            if (action === 'delete' && activeObject.id) {

                $mdDialog.show({
                    controller: 'EntityViewerDeleteDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: activeObject.event,
                    //clickOutsideToClose: false,
                    locals: {
                        entity: {
                            id: activeObject.id,
                            name: activeObject.name
                        },
                        entityType: entityViewerDataService.getEntityType()
                    }
                }).then(function (res) {
                    if (res.status === 'agree') {
                        entityViewerDataService.resetData();
                        entityViewerDataService.resetRequestParameters();

                        var rootGroup = entityViewerDataService.getRootGroupData();

                        entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                        entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                    }
                })


            }

            if (action === 'edit' && activeObject.id) {

                console.log('activeObject', activeObject);

                $mdDialog.show({
                    controller: 'EntityViewerEditDialogController as vm',
                    templateUrl: 'views/entity-viewer/edit-entity-viewer-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: activeObject.event,
                    //clickOutsideToClose: false,
                    locals: {
                        entityType: entityViewerDataService.getEntityType(),
                        entityId: activeObject.id
                    }
                }).then(function (res) {
                    if (res && res.res === 'agree') {
                        entityViewerDataService.resetData();
                        entityViewerDataService.resetRequestParameters();

                        var rootGroup = entityViewerDataService.getRootGroupData();

                        entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                        entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                    }
                });

            }

        });

        entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

            getView();

        })

    };

    module.exports = {
        initReducer: initReducer
    }

}());