/**
 * Created by sergey on 29.07.16.
 */
'use strict';

(function () {

    var app = angular.module('forum', []);

    app.config(['$stateProvider', require('./app/router.js')]);

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
    app.controller('EditThreadDialogController', ['$scope', '$mdDialog', 'threadId', require('./app/controllers/dialogs/editThreadDialogController')]);
    app.controller('EditThreadsGroupsDialogController', ['$scope', '$mdDialog', 'threadsGroupId', require('./app/controllers/dialogs/editThreadsGroupsDialogController')]);

    app.directive('hideByTags', [require('./app/directives/hideByTagsDirective')]);
    app.directive('bindForumQuote', [require('./app/directives/bindForumQuoteDirective')]);

    require('./templates.min.js');

    app.filter('forumFilterByTags', function () {
        return function (input, tags) {
            var filteredItems = []
            // loop through all items
            if (tags && tags.length) {
                input.map(function (inputItem) {
                    tags.map(function (tag) {
                        if (inputItem.tags[0] === tag) {
                            filteredItems.push(inputItem);
                        }
                    });
                });
            }
            else {
                input.map(function (item) {
                    filteredItems.push(item);
                });
            }
            return filteredItems;
        };
    });

}());