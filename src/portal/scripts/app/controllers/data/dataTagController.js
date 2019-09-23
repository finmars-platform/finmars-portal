/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var tagService = require('../../services/tagService');

    module.exports = function ($scope) {

        console.log('{"controller": "DataTagController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'tag'; // deprecated
        vm.contentType = 'tags.tag';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        // tagService.getList().then(function (data) {
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     console.log('vm.entityRaw', vm.entityRaw);
        //     $scope.$apply();
        // });

        vm.getList = function (options) {
            return tagService.getList(options).then(function (data) {
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());