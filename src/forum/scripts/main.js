/**
 * Created by sergey on 29.07.16.
 */
'use strict';

// noinspection JSVoidFunctionReturnValueUsed
export default (function () {

    var forum = angular.module('finmars.forum', []);

	forum.config(['$stateProvider', require('./app/router.js')]);

	forum.controller('ForumController', ['$scope', require('./app/controllers/forumController')]);
	forum.controller('ForumThreadGroupListController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadGroupListController')]);
	forum.controller('ForumThreadListController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/forumThreadListController')]);
	forum.controller('ForumThreadController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/forumThreadController')]);
	forum.controller('ForumThreadGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadGroupDialogController')])
	forum.controller('ForumThreadListDialogController', ['$scope', '$mdDialog', require('./app/controllers/forumThreadListDialogController')]);
	forum.controller('ForumWriteMessageDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/forumWriteMessageDialogController')]);
	forum.controller('EditThreadDialogController', ['$scope', '$mdDialog', 'threadId', 'usersService', 'usersGroupService', require('./app/controllers/dialogs/editThreadDialogController')]);
	forum.controller('EditThreadsGroupsDialogController', ['$scope', '$mdDialog', 'threadsGroupId', 'usersService', 'usersGroupService', require('./app/controllers/dialogs/editThreadsGroupsDialogController')]);

	forum.directive('hideByTags', [require('./app/directives/hideByTagsDirective')]);
	forum.directive('bindForumQuote', [require('./app/directives/bindForumQuoteDirective')]);

    require('./templates.min.js');

	forum.filter('forumFilterByTags', function () {
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

})();