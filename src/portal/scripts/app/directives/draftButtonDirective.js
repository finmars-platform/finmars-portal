/**
 * Created by szhitenev on 14.08.2023.
 */
(function () {

    'use strict';

    var draftService = require('../services/draftService');

    module.exports = function ($mdDialog, toastNotificationService) {
        return {
            restrict: 'E',
            scope: {
                onExportToDraftCallback: '&',
                onDraftApplyCallback: '&',
                userCode: '=',
            },
            templateUrl: 'views/directives/draft-button-view.html',
            link: function (scope, elem) {

                scope.draft = null;
                scope.lastSavedDraftData = null;
                scope.readyStatus = {
                    draft: false
                }

                scope.getOrCreate = function () {

                    return new Promise(function (resolve, reject) {

                        draftService.getList({
                            filters: {
                                user_code: scope.userCode
                            }
                        }).then(function (data) {

                            if (data.results.length) {

                                scope.draft = data.results[0];
                                scope.lastUpdate = scope.getLastUpdated(scope.draft.modified);


                            } else {
                                scope.draft = {
                                    name: 'Draft for ' + scope.userCode,
                                    user_code: scope.userCode,
                                    data: {}
                                }
                            }

                            resolve();

                        })


                    })

                }

                scope.getLastUpdated = function (date) {

                    if (!date) return "";
                    let momentDate = moment(date);

                    // Get the HH:MM format
                    let formattedTime = momentDate.format('HH:mm');

                    // Get the relative time
                    let relativeTime = momentDate.fromNow();

                    // Combine and return
                    return formattedTime + " (" + relativeTime + ")";

                }

                scope.saveDraft = function () {

                    scope.readyStatus.draft = false;

                    return new Promise(function (resolve, reject) {

                        console.log("going to save draft", scope.draft)


                        if (scope.draft.id) {

                            draftService.update(scope.draft.id, scope.draft).then(function (data) {

                                scope.draft = data;

                                scope.lastUpdate = scope.getLastUpdated(scope.draft.modified);

                                scope.readyStatus.draft = true;

                                setTimeout(function () {
                                    resolve()
                                }, 1000) // little delay to show the last update

                            }).catch(function () {

                                scope.readyStatus.draft = true;

                                setTimeout(function () {
                                    resolve()
                                }, 1000) // little delay to show the last update

                            })

                        } else {

                            draftService.create(scope.draft).then(function (data) {

                                scope.draft = data;

                                scope.lastUpdate = scope.getLastUpdated(scope.draft.modified);

                                scope.readyStatus.draft = true;

                                setTimeout(function () {
                                    resolve()
                                }, 1000) // little delay to show the last update

                            })

                        }

                    });

                }

                scope.previewDraft = function ($event) {

                    $mdDialog.show({
                        controller: 'DraftDialogController as vm',
                        templateUrl: 'views/dialogs/draft-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            data: {
                                draft: scope.draft
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.draft.data = res.data.data
                            scope.saveDraft().then(function () {

                                scope.onDraftApplyCallback({data: res.data.data});

                                scope.$apply();

                            });

                        }

                    })

                }

                scope.userSaveDraft = function ($event) {

                    var data = scope.onExportToDraftCallback();

                    if (data) {

                        scope.draft.data = scope.onExportToDraftCallback()
                        scope.lastSavedDraftData = scope.draft.data;

                        scope.saveDraft().then(function () {
                            scope.$apply();
                        })
                    } else {
                        toastNotificationService.error("Nothing to save")
                    }

                }

                scope.applyDraft = function ($event) {

                    scope.onDraftApplyCallback({event: $event, data: scope.draft.data})

                }

                scope.init = function () {

                    console.log("Draft Inited")


                    if (!scope.onExportToDraftCallback) {
                        console.warn("Export To Draft Callback is not set")
                    }

                    if (!scope.onDraftApplyCallback) {
                        console.warn("Draft Apply Callback is not set")
                    }

                    if (!scope.userCode) {
                        console.log("Draft User code is not set")
                    }


                    if (scope.userCode) {

                        scope.readyStatus.draft = false;

                        scope.getOrCreate().then(function () {

                            scope.readyStatus.draft = true;

                            scope.$apply();

                            scope.draftInteval = setInterval(function () {

                                var data = scope.onExportToDraftCallback();

                                if (data) {

                                    scope.draft.data = scope.onExportToDraftCallback()


                                    if (!scope.lastSavedDraftData) {

                                        scope.lastSavedDraftData = JSON.parse(JSON.stringify(scope.draft.data))

                                        scope.saveDraft().then(function () {
                                            scope.$apply();
                                        })

                                    } else {

                                        var diff = jsondiffpatch.diff(scope.draft.data, scope.lastSavedDraftData);

                                        if (diff) {

                                            scope.saveDraft().then(function () {
                                                scope.lastSavedDraftData = scope.draft.data;
                                                scope.$apply();
                                            })

                                        } else {
                                            console.log("Nothing changed in draft");
                                        }

                                    }

                                } else {
                                    toastNotificationService.error("Nothing to save")
                                }


                            }, 1000 * 30)

                        })

                    } else {
                        console.warn("Draft is not inited. User Code is not set")
                    }


                }

                scope.init();

                scope.$on('destroy', function () {

                    clearInterval(scope.draftInteval);

                })

            }
        }
    }


}());