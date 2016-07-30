/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider) {

        $stateProvider.state('app.forum', {
            url: '/forum',
            templateUrl: 'views/forum-shell-view.html',
            abstract: true,
            controller: 'ForumController as vm'

        }).state('app.forum.thread-groups', {
            url: '',
            templateUrl: 'views/forum-thread-groups-view.html',
            controller: 'ForumThreadGroupListController as vm'

        }).state('app.forum.threads-list', {
            url: '/:groupId',
            templateUrl: 'views/forum-threads-list-view.html',
            controller: 'ForumThreadListController as vm'

        }).state('app.forum.thread', {
            url: '/:groupId/thread/:threadId',
            templateUrl: 'views/forum-thread-view.html',
            controller: 'ForumThreadController as vm'

        })

    }


}());