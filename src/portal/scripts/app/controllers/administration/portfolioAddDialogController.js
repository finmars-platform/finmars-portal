/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog) {

        console.log('Portfolio add dialog controller initialized...');

        var vm = this;

        var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.cancel = function(){
            $mdDialog.cancel();
        };

        $scope.save = function() {
            $mdDialog.hide();
        };

    }

}());