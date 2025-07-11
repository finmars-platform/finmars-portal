(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'views/controls/use-from-above-button/use-from-above-button.html',
            scope: {
                item: '=',
                data: '<',
                attributesEntityType: '=',
                filterType: '=',
                attributeDataService: '=',
                updateFilterFn: '&'
            },
            link: function (scope, elem, attr) {

                scope.openUseFromAboveDialog = function ($event) {

                    //console.log('control use-from-above', scope.item, scope.data, scope.filterType, scope.attributesEntityType);

                    $mdDialog.show({
                        controller: 'UseFromAboveDialogController as vm',
                        templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                item: scope.item,
                                data: scope.data,
                                entityType: scope.attributesEntityType,
                                filterType: scope.filterType
                            },
                            attributeDataService: scope.attributeDataService
                        }
                    }).then(function (res) {

                        console.log('openUseFromAboveDialog.res', res)
                        console.log('openUseFromAboveDialog.scope.item', scope.item)

                        if (res.status === 'agree') {

                            if (scope.item !== res.data.item ||
                                scope.filterType !== res.data.filterType) {

                                scope.item = res.data.item;
                                scope.filterType = res.data.filterType;
                                scope.attributesEntityType = res.data.attrsEntityType;
                                scope.updateFilterFn();

                            }

                        }

                    });

                };

            }
        }
    }
}());