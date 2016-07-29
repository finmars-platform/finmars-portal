/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider) {

        $stateProvider.state('app.forum', {
            url: '/forum',
            templateUrl: '',
            abstract: true,
            controller: 'ForumController as vm'

        }).state('app.forum.thread-groups', {
            url: '',
            templateUrl: '',
            controller: 'ForumThreadGroupListController as vm'

        }).state('app.forum.threads-list', {
            url: '/:groupId',
            templateUrl: '',
            controller: 'ForumThreadListController as vm'

        }).state('app.forum.thread', {
            url: '/forum',
            templateUrl: '',
            controller: 'ForumThreadController as vm'

        })

    }


}());