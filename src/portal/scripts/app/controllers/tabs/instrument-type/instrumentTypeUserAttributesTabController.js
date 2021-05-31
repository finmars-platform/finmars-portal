/**
 * Created by vzubr on 18.05.2021.
 */
(function (){
    'use strict';

    const attributeTypeService = require('../../../services/attributeTypeService');
    const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');

    module.exports = function instrumentTypeUserAttributesTabController ($scope, $mdDialog) {

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;
        vm.entityType = $scope.$parent.vm.entityType;

		vm.evEditorDataService = $scope.$parent.vm.evEditorDataService;
		vm.evEditorEventService = $scope.$parent.vm.evEditorEventService;

        vm.attrs = [];

        if (!vm.entity.instrument_attributes) {
            vm.entity.instrument_attributes = []
        }

        vm.readyStatus = {
            attrs: false
        };

        const getList = () => {

            vm.readyStatus.attrs = false;

            attributeTypeService.getList('instrument', {pageSize: 1000}).then((data) => {

                const instrumentAttrs = data.results;

                vm.attrs = mapAttrsFromEntity(instrumentAttrs, vm.entity.instrument_attributes);

                vm.readyStatus.attrs = true;

                $scope.$apply();

            });

        }

        vm.deleteAttr = function (ev, item) {

            var description = 'Are you sure to delete attribute ' + item.name + ' ?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                },
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    const deletedItemIndex = vm.entity.instrument_attributes.findIndex(attr => attr.id === item.id);
                    vm.entity.instrument_attributes.splice(deletedItemIndex, 1);

                    getList();

                }

            });
        };

        vm.attrChange = function () {

            vm.entity.instrument_attributes = vm.attrs
                .filter(attr => !!attr.value)
                .map(attr => {
                    const result = {
                        attribute_type_user_code: attr.user_code,
                        value_type: attr.value_type,
                        value_string: null,
                        value_float: null,
                        value_date: null,
                        value_classifier: null,
                    }

                    switch (attr.value_type){
                        case 10:
                            result.value_string = attr.value;
                            break;
                        case 20:
                            result.value_float = attr.value;
                            break;
                        case 30:
                            result.value_classifier = attr.___classifierName ? attr.___classifierName : null;
                            break;
                        case 40:
                            result.value_date = attr.value;
                            break;
                    }

                    return result;
                });

        };

        const getAttrValue = (entityAttr) => {
            switch (entityAttr.value_type) {
                case 10:
                    return entityAttr.value_string;
                case 20:
                    return entityAttr.value_float;
                case 30:
                    return entityAttr.value_classifier;
                case 40:
                    return entityAttr.value_date;
                default:
                    return null;
            }
        }

        const mapAttrsFromEntity = (attrs, entityAttrs) => {

            const deletedAttrs = [];

            entityAttrs.forEach(entityAttr => {
                const user_code = entityAttr.attribute_type_user_code;
                const attr = attrs.find(attr => attr.user_code === user_code);
                const value = getAttrValue(entityAttr);

                const additionalProps = {
                    value,
                    ___classifierName: entityAttr.value_type === 30 ? value : null,
                };

                if (attr) {
                    Object.assign(attr, additionalProps);
                } else {
                    deletedAttrs.push({user_code, name: user_code, ...entityAttr, ...additionalProps, ___isDisabled: true});
                }
            })

            return attrs
                .concat(deletedAttrs)
                .sort((a, b) => {

                return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1

            });
        };

        const init = function () {

            getList();

        }

        init();

    }

}());
