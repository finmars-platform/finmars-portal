(function () {

    'use strict';

    var bookmarkService = require('../services/bookmarkService');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'views/directives/bookmarks-view.html',
            link: function (scope, elem, attr) {

                //scope.showBookmarks = true;

                scope.toggleBookmarkPanel = function () {
                    scope.showBookmarks = !scope.showBookmarks;
                };

                scope.getBookmarks = function () {
                    bookmarkService.getList().then(function (data) {
                        scope.items = data.results;
                        scope.$apply();
                    });
                };

                scope.getBookmarks();

                scope.openSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'BookmarksWizardDialogController as vm',
                        templateUrl: 'views/dialogs/bookmarks-wizard-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {},
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            scope.getBookmarks();
                        }
                    });

                };

                scope.getState = function (item) {

                    var uiState = item.data;

                    return uiState.state + '({listLayout: ' + item.list_layout + '})';
                }

            }
        }
    }
}());