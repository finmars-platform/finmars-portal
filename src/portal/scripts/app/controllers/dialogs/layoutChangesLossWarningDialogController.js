/**
 * Created by mevstratov on 22.04.2019.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog, metaContentTypesService, data){

        var vm = this;

        var evDataService = {};

        var isEmptyLayout = false;
        var entityType = undefined;

        if (data) {
            evDataService = data.evDataService;
            entityType = data.entityType;
        }

        vm.saveLayout = function ($event) {
            console.log("save layout");
            if (data) {
                var listLayout = evDataService.getListLayout();

                if ( !listLayout.hasOwnProperty('id') ) {

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        multiple: true,
                        locals: {
                            data: {
                                entityType: entityType,
                                offerToOverride: true,
                            }
                        }
                    })
                    .then(function (res) {

                        if (res.status === "agree" || res.status === "overwrite") {

                            $mdDialog.hide(
                                {
                                    status: 'save_layout',
                                    data: {
                                        layoutName: res.data.name,
                                        layoutUserCode: res.data.user_code,
                                        layoutConfigurationCode: res.data.configuration_code
                                    }
                                }
                            );
                        }

                    });

                } else {
                    $mdDialog.hide({status: 'save_layout'});
                }

            } else {
                $mdDialog.hide({status: 'save_layout'});
            }
        };

        vm.dontSave = function () {
            $mdDialog.hide({status: 'do_not_save_layout'});
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };
    }

}());