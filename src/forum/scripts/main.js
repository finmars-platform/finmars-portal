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
    app.controller('ForumThreadGroupListController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadGroupListController')]);
    app.controller('ForumThreadListController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/forumThreadListController')]);
    app.controller('ForumThreadController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/forumThreadController')]);
    app.controller('ForumThreadGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadGroupDialogController')])
    app.controller('ForumThreadListDialogController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadListDialogController')]);
    app.controller('ForumWriteMessageDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/forumWriteMessageDialogController')]);

    require('./templates.min.js');

}());