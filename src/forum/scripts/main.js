/**
 * Created by sergey on 29.07.16.
 */
'use strict';

(function () {

    var app = angular.module('forum', []);

    app.config(['$stateProvider',  require('./app/router.js')]);

    app.run(function () {
        console.log('Forum initialized');
    });

    app.controller('ForumController', ['$scope', require('./app/controllers/forumController')]);
    app.controller('ForumThreadGroupListController', ['$scope', require('./app/controllers/forumThreadGroupListController')]);
    app.controller('ForumThreadListController', ['$scope', '$stateParams', require('./app/controllers/forumThreadListController')]);
    app.controller('ForumThreadController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/forumThreadController')]);
    app.controller('ForumWriteMessageDialogController', ['$scope', '$mdDialog', require('./app/controllers/forumWriteMessageDialogController')]);

    require('./templates.min.js');

}());