/**
 * Created by szhitenev on 04.07.2022.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var metaHelper = require('../../helpers/meta.helper');
    const toastNotificationService = require('../../../../../core/services/toastNotificationService');



    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.data = data;

        vm.item = {}

        function recursiveConvert(obj) {

            Object.keys(obj).forEach(function (key) {

                if (vm.data.entityType === 'complex-transaction') {

                    if (['inputs', 'transaction_type', 'status', 'meta', 'source'].indexOf(key) === -1) {

                        if (key === 'transaction_type_object') {
                            obj.transaction_type = obj.transaction_type_object.user_code;
                        }

                        delete obj[key]
                    }

                    if (key === 'inputs') {

                        obj.inputs = obj.inputs.map(function (input){

                            input.transaction_type_input = input.transaction_type_input_object.name
                            delete input.transaction_type_input_object;

                            return input;

                        })

                    }


                } else {

                    if (key === 'id') {
                        delete obj.id
                    }

                    if (key.indexOf('___') !== -1) {
                        delete obj[key]
                    }

                    if (key === 'deleted_user_code') {
                        delete obj.deleted_user_code
                    }

                    if (key === 'procedure_modified_datetime') {
                        delete obj['procedure_modified_datetime']
                    }

                    if (key === 'created') {
                        delete obj.created
                    }

                    if (key === 'modified') {
                        delete obj.modified
                    }

                    if (key === 'is_deleted') {
                        delete obj.is_deleted
                    }

                    if (obj.hasOwnProperty(key + '_object')) {

                        if (obj[key + '_object']) {

                            obj[key] = obj[key + '_object']['user_code']
                            delete obj[key + '_object']
                        }
                    }


                    if (key === 'pricing_policies') {
                        delete obj.pricing_policies
                    }
                    if (key === 'registers') {
                        delete obj.registers
                    }



                    if (key === 'attributes') {

                        obj.attributes = obj.attributes.map(function (attribute) {

                            attribute.attribute_type = attribute.attribute_type_object.user_code
                            delete attribute.attribute_type_object;

                            if (attribute.classifier_object) {
                                attribute.classifier = attribute.classifier_object.name
                                delete attribute.classifier_object;
                            }

                            return attribute
                        })

                    }

                    if (key === 'accrual_calculation_schedules') {

                        obj.accrual_calculation_schedules = obj.accrual_calculation_schedules.map(function (item) {

                            delete item['id']
                            item['accrual_calculation_model'] = item['accrual_calculation_model_object']['user_code']
                            delete item['accrual_calculation_model_object']

                            item['periodicity'] = item['periodicity_object']['user_code']
                            delete item['periodicity_object']

                            return item
                        })

                    }

                }




            })

            return obj

        }

        vm.convertToExport = function ($event) {

            var converted = recursiveConvert(JSON.parse(JSON.stringify(vm.item)))

            vm.editor.setValue(JSON.stringify(converted, null, 4))

            toastNotificationService.info("Converted")

        };

        vm.export = function () {

            var _item = JSON.parse(vm.editor.getValue())

            var name = ''

            if (_item.name) {
                name = name + _item.name
            }

            if (name) {
                name = name + ' (' + vm.entityTypeSlug() + ')'
            } else {
                name = name + vm.entityTypeSlug()
            }


            name = name + '.json'

            downloadFileHelper.downloadFile(vm.editor.getValue(), "application/json", name);
        }

        vm.init = function () {

            console.log('vm.data', vm.data);

            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.entityAsJsonEditorDialogElemToResize');
            }, 100);

            vm.entityType = vm.data.entityType

            if (vm.data.item) {
                vm.item = vm.data.item
            }

            setTimeout(function () {

                vm.editor = ace.edit('aceEditor');
                vm.editor.setTheme("ace/theme/monokai");
                vm.editor.getSession().setMode("ace/mode/json");
                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);
                vm.editor.setAutoScrollEditorIntoView(true);
                ace.require("ace/ext/language_tools");
                vm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true
                });
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);
                vm.editor.setValue(JSON.stringify(vm.item, null, 4))

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)

        }

        vm.init()


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.entityTypeSlug = function () {
            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.resizeDialogCallback = function () {
            vm.editor.resize();
        }

        vm.copyContent = function () {

            metaHelper.copyToBuffer(vm.editor.getValue())

        }

        vm.agree = function () {

            vm.processing = true

            vm.item = JSON.parse(vm.editor.getValue())

            try {

                if (vm.item.id) {

                    entityResolverService.update(vm.entityType, vm.item.id, vm.item).then(function (responseData) {

                        vm.processing = false;

                        $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                    }).catch(function (error) {

                        vm.processing = false;
                        $scope.$apply()

                    })

                } else {

                    entityResolverService.create(vm.entityType, vm.item).then(function (responseData) {

                        $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                    }).catch(function (error) {

                        vm.processing = false;
                        $scope.$apply()

                    })

                }

            } catch (error) {

                vm.processing = false;
                $scope.$apply()

            }

        };
    }

}());