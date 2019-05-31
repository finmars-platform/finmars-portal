/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('SimpleEntityImportErrorsDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.getName = function (errorItem) {

            var result = '';

            if (errorItem.content_type) {
                result = result + metaContentTypesService.getEntityNameByContentType(errorItem.content_type)
            }

            if (errorItem.item) {

                result = result + ': ';

                if (errorItem.item.scheme_name) {
                    result = result + errorItem.item.scheme_name
                } else {

                    if (errorItem.item.short_name) {

                        result = result + errorItem.item.short_name + ' (' + errorItem.item.user_code + ')';

                    } else {

                        if (errorItem.item.user_code) {

                            result = result + errorItem.item.user_code;

                        } else {

                            if (errorItem.item.name) {
                                result = result + errorItem.item.name;
                            }

                        }
                    }


                }

            }

            return result

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());