/**
 * Created by szhitenev on 02.08.2016.
 */
(function(){

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function($scope, $state) {

        logService.controller('SettingsFormDesignController', 'initialized');

        var vm = this;

        vm.goToState = function(entity){
            $state.go('app.data-constructor', {entityType: entity});
        }

    };

}());