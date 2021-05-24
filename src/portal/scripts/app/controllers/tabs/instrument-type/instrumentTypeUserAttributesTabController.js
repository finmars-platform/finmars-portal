/**
 * Created by vzubr on 18.05.2021.
 */
(function (){
    'use strict';

    const attributeTypeService = require('../../../services/attributeTypeService');

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
                })
        };

        const instrumentAttributesPromise = attributeTypeService.getList('instrument', {pageSize: 1000}).then((data) => {
            return data.results;
        });

        const instrumentTypeAttributesPromise = attributeTypeService.getList( vm.entityType, {pageSize: 1000}).then((data) => {
            return data.results;
        });

        const getUniqueConcatAttrs = (instrumentAttrs, instrumentTypeAttrs) => {

            const uniqueInstrumentTypeAttrs = instrumentTypeAttrs
                .filter((instrumentTypeAttr) => {

                    return !instrumentAttrs.find((instrumentAttr) => {

                        return instrumentAttr.user_code === instrumentTypeAttr.user_code

                    });

                })
                .map((attr) => {
                    attr.___instrumentTypeAttr = true;
                    return attr;
                });

            return instrumentAttrs
                .concat(uniqueInstrumentTypeAttrs)
                .sort((a, b) => {

                    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1

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

            const entityAttrsAsObject = {};
            entityAttrs.forEach(attr => {
                entityAttrsAsObject[attr.attribute_type_user_code] = attr
            });

            return attrs.map(attr => {

                const entityAttr = entityAttrsAsObject[attr.user_code];
                if (entityAttr) {

                    attr.value = getAttrValue(entityAttr);

                    if (attr.value_type === 30) { //classifier
                        attr.___classifierName = attr.value;
                    }

                }

                return attr;
            })
        };

        const init = function () {
            Promise.all([instrumentAttributesPromise, instrumentTypeAttributesPromise]).then(([instrumentAttrs, instrumentTypeAttrs]) => {

                vm.attrs = getUniqueConcatAttrs(instrumentAttrs, instrumentTypeAttrs);
                vm.attrs = mapAttrsFromEntity(vm.attrs, vm.entity.instrument_attributes);

            })

        }

        init();

    }

}());
