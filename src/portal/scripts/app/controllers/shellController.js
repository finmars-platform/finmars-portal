/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookiesService = require('../../../../core/services/cookieService');

    var usersService = require('../services/usersService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var notificationsService = require('../services/notificationsService');

    var reportCopyHelper = require('../helpers/reportCopyHelper');

    var metaService = require('../services/metaService');
    var uiService = require('../services/uiService');
    var middlewareService = require('../services/middlewareService');

    var crossTabEvents = {
        'MASTER_USER_CHANGED': 'MASTER_USER_CHANGED',
        'LOGOUT': 'LOGOUT'
    };

    module.exports = function ($scope, $state, $stateParams, $rootScope, $mdDialog, $transitions) {

        var vm = this;

        vm.readyStatus = {masters: false};

        vm.currentGlobalState = 'portal';
        vm.currentMasterUser = '';

        vm.broadcastManager = null;

        var pageStateName = $state.current.name;
        var pageStateParams = $stateParams.strategyNumber;

        /*vm.logout = function () {
            console.log('Logged out');

            usersService.logout();

            if (vm.broadcastManager) {
                vm.broadcastManager.postMessage({event: crossTabEvents.LOGOUT});
            }

            window.location.pathname = '/';
            cookiesService.deleteCookie();
            //usersService.logout();
        };*/

        if ('__PROJECT_ENV__' === 'development') {

            usersService.ping().then(function (data) {
                setTimeout(function () {
                    usersService.login('__LOGIN__', '__PASS__').then(function () {
                        console.log('after login', cookiesService.getCookie('csrftoken'));
                        $scope.$apply();
                    });
                }, 1000);
            });

        }

        vm.getMasterUsersList = function () {

            vm.readyStatus.masters = false;

            // return usersService.getMasterList().then(function (data) {
            return usersService.getMasterListLight().then(function (data) {
                vm.masters = data.results;
                vm.readyStatus.masters = true;
                vm.updateCurrentMasterUser();
                $scope.$apply();

            });

        };

        vm.updateCurrentMasterUser = function () {

            vm.masters.forEach(function (item) {

                if (item.is_current) {
                    vm.currentMasterUser = item;
                }

            });

        };

        usersService.getMe().then(function (data) {
            vm.user = data;
            $scope.$apply();
        });

        vm.initCrossTabBroadcast = function () {

            vm.broadcastManager = new BroadcastChannel('finmars_broadcast');

            vm.broadcastManager.onmessage = function (ev) {

                console.log(ev);

                if (ev.data.event === crossTabEvents.MASTER_USER_CHANGED) {
                    middlewareService.masterUserChanged();
                    $state.go('app.home');
                    vm.getMasterUsersList();
                }

                if (ev.data.event === crossTabEvents.LOGOUT) {

                    middlewareService.initLogOut();

                    usersService.logout().then(function (data) {
                        console.log('Logged out');
                        sessionStorage.removeItem('afterLoginEvents');
                        window.location.pathname = '/';

                        cookiesService.deleteCookie();
                    });

                }


            }
        };

        vm.selectMaster = function (master) {

            // var checkLayoutForChanges = middlewareService.getWarningOfLayoutChangesLossFn();

            var changeMasterUser = function () {

                middlewareService.masterUserChanged();

                usersService.setMasterUser(master.id).then(function (value) {

                    $state.go('app.home');

                    if (vm.broadcastManager) {
                        vm.broadcastManager.postMessage({event: crossTabEvents.MASTER_USER_CHANGED});
                    }

                    vm.getMasterUsersList();


                });
            };

            if (vm.currentMasterUser.id !== master.id) {

                $mdDialog.show({
                    controller: "WarningDialogController as vm",
                    templateUrl: "views/warning-dialog-view.html",
                    multiple: true,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: "Warning",
                            description: "All unsaved changes of layouts in all FinMARS browser tabs will be lost!",
                            actionsButtons: [
                                {
                                    name: "CANCEL",
                                    response: {status: 'disagree'}
                                },
                                {
                                    name: "OK, PROCEED",
                                    response: {status: 'agree'}
                                }
                            ]
                        }
                    }

                }).then(function (res) {

                    if (res.status === 'agree') {

                        changeMasterUser();

                    }

                });

            }

        };

        vm.getCurrentGlobalState = function () {

            if ($state.current.name.indexOf('app.profile') !== -1) {
                return 'profile'
            }

            if ($state.current.name.indexOf('app.setup') !== -1) {
                return 'setup';
            }

            if ($state.current.name.indexOf('app.new-database') !== -1) {
                return 'new-database';
            }

            return 'portal';

        };

        /*vm.currentLocation = function () {
            return metaService.getCurrentLocation($state).toUpperCase();
        };*/
        vm.currentLocation = function () {
            return metaService.getHeaderTitleForCurrentLocation($state);
        };

        // Get name of active layout in the toolbar


        var showLayoutName = false;

        vm.initTransitionListener = function () {

            $transitions.onStart({}, function () {
                $mdDialog.hide();
            });

            $transitions.onFinish({}, function (transition) {

                pageStateName = transition.to().name;
                pageStateParams = transition.params().strategyNumber;

                if (pageStateName.indexOf('app.data.') !== -1 || vm.isReport(pageStateName)) {
                    showLayoutName = true;
                    vm.activeLayoutName = null;
                    vm.activeSPLayoutName = false;

                    vm.getActiveLayoutName();

                } else {
                    showLayoutName = false;
                }

            });

            $transitions.onSuccess({}, function (transition) {

                middlewareService.clearEvents();

                vm.currentGlobalState = vm.getCurrentGlobalState();

                console.log('on onSuccess', vm.currentGlobalState)

                middlewareService.setNewSplitPanelLayoutName(false);
                var from = transition.from();

                if (from.name === 'app.profile') {
                    vm.getMasterUsersList();
                }

            });

        };

        vm.activeLayoutName = null;
        vm.activeSPLayoutName = false; // false needed to check whether split panel disabled and have no layout in middlewareService

        vm.isStateOfEntity = function () {

            var newLayoutName = middlewareService.getNewEntityViewerLayoutName();
            var newSplitPanelLayoutName = middlewareService.getNewSplitPanelLayoutName();
            // Change layout information on state change
            /*if (currentState !== previousState) {
                previousState = currentState;

                if (currentState.indexOf('app.data.') !== -1 || vm.isReport()) {
                    showLayoutName = true;
                    vm.getActiveLayoutName();
                } else {
                    showLayoutName = false;
                }
            }*/

            // Check if layout has been switched without changing state

            if (newLayoutName) {
                vm.getActiveLayoutName(newLayoutName);
            }

            if (newSplitPanelLayoutName !== vm.activeSPLayoutName) {
                vm.activeSPLayoutName = newSplitPanelLayoutName;
            }

            return showLayoutName;
        };

        vm.isLayoutFromUrl = function () {

            return window.location.href.indexOf('?layout=') !== -1

        };

        vm.getActiveLayoutName = function (newLayoutName) {

            if (typeof newLayoutName === "string") {

                vm.activeLayoutName = newLayoutName;

            } else {


                var entityType = metaContentTypesService.getContentTypeUIByState(pageStateName, pageStateParams);

                var setLayoutName = function (layoutData) {
                    if (layoutData && layoutData.length) {
                        newLayoutName = layoutData[0].name;
                    } else {
                        newLayoutName = '';
                    }

                    vm.activeLayoutName = newLayoutName;

                    $scope.$apply();
                };

                if (vm.isLayoutFromUrl()) {

                    var queryParams = window.location.href.split('?')[1];
                    var params = queryParams.split('&');

                    var layoutName;

                    params.forEach(function (param) {

                        var pieces = param.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        if (key === 'layout') {
                            layoutName = value
                        }

                    });

                    var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

                    uiService.getListLayoutDefault({
                        pageSize: 1000,
                        filters: {
                            content_type: contentType,
                            name: layoutName
                        }
                    }).then(function (activeLayoutData) {

                        var activeLayoutRes = activeLayoutData.results;

                        setLayoutName(activeLayoutRes);

                    })

                } else {

                    uiService.getActiveListLayout(entityType).then(function (activeLayoutData) {

                        if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results.length > 0) {

                            var activeLayoutRes = activeLayoutData.results;

                            setLayoutName(activeLayoutRes);

                        } else {

                            uiService.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                                var defaultLayoutRes = defaultLayoutData.results;

                                setLayoutName(defaultLayoutRes);

                            });

                        }

                    });

                }

            }

        };
        // < Get name of active layout in the toolbar >

        vm.showBookmarks = false;
        vm.toggleBookmarksPanel = function () {

            var mdContent = document.querySelector('md-content');
            mdContent.classList.add('overflow-hidden');

            vm.showBookmarks = !vm.showBookmarks;

            setTimeout(function () {
                mdContent.classList.remove('overflow-hidden');
            }, 100);

        };

        vm.openHelp = function ($event) {

            var urlPieces = $state.current.url.split('/');
            var destinationUrl = urlPieces[urlPieces.length - 1].replace('-', '_');

            var helpPageUrl = destinationUrl + '.html';

            $mdDialog.show({
                controller: 'HelpDialogController as vm',
                templateUrl: 'views/dialogs/help-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {
                        helpPageUrl: helpPageUrl
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            })
        };

        vm.isReport = function (currentStateName) {

            var stateName = currentStateName;

            if (!stateName && stateName !== '') {
                stateName = $state.current.name;
            }

            switch (stateName) {
                case 'app.reports.balance-report':
                    return true;
                    break;
                case 'app.reports.pl-report':
                    return true;
                    break;
                case 'app.reports.transaction-report':
                    return true;
                    break;
                case 'app.reports.cash-flow-projection-report':
                    return true;
                    break;
                case 'app.reports.performance-report':
                    return true;
                    break;
                default:
                    return false
            }

        };

        vm.openLayoutList = function ($event) {

            var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

            $mdDialog.show({
                controller: 'UiLayoutListDialogController as vm',
                templateUrl: 'views/dialogs/ui/ui-layout-list-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                multiple: true,
                locals: {
                    options: {
                        entityType: entityType
                    }
                }
            }).then(function (res) {
                if (res.status == 'agree') {
                    $state.reload();
                }

            })
        };

        vm.openNotificationsMenu = function ($event) {
            $mdDialog.show({
                controller: 'HeaderNotificationsDialogController as vm',
                templateUrl: 'views/dialogs/header-notifications-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event
            });
        };

        vm.getNotifications = function () {

            notificationsService.getList(1, 'unreaded').then(function (data) {
                vm.unreadedNotificationsAmount = data.count;
                $scope.$apply();
            });
        };

        /*$transitions.onSuccess({}, function (transition) {

            middlewareService.setNewSplitPanelLayoutName(false);
            var from = transition.from();

            if (from.name === 'app.profile') {
                vm.getMasterUsersList();
            }

        });*/

        vm.logOutMethod = function () {

            $mdDialog.show({
                controller: "WarningDialogController as vm",
                templateUrl: "views/warning-dialog-view.html",
                multiple: true,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: "Warning",
                        description: "All unsaved changes of layouts in all FinMARS browser tabs will be lost!",
                        actionsButtons: [
                            {
                                name: "CANCEL",
                                response: {status: 'disagree'}
                            },
                            {
                                name: "OK, PROCEED",
                                response: {status: 'agree'}
                            }
                        ]
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    if (vm.broadcastManager) {
                        vm.broadcastManager.postMessage({event: crossTabEvents.LOGOUT});
                    }

                    middlewareService.initLogOut();

                    usersService.logout().then(function (data) {
                        console.log('Logged out');
                        sessionStorage.removeItem('afterLoginEvents');
                        window.location.pathname = '/';

                        cookiesService.deleteCookie();

                    });

                }

            });
        };

        var openImportConfigurationManager = function (fileToRead) {

            var reader = new FileReader();

            reader.readAsText(fileToRead);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);

                    $mdDialog.show({
                        controller: 'SettingGeneralConfigurationPreviewFileDialogController as vm',
                        templateUrl: 'views/dialogs/settings-general-configuration-preview-file-dialog-view.html',
                        parent: angular.element(document.body),
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                file: file,
                                rawFile: fileToRead
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            $state.reload();
                        }

                    });

                } catch (error) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Error',
                                description: 'Unable to read it. This file is corrupted.'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    });


                }

            }

        };

        vm.importOnDragListeners = function () {

            var shellViewContainer = document.querySelector('.shell-view-container');

            var dragBackdropElem = document.createElement("div");
            dragBackdropElem.classList.add("drag-file-backdrop");
            dragBackdropElem.appendChild(document.createElement("div"));

            var dragBackdropTextHolder = dragBackdropElem.querySelector("div");
            dragBackdropTextHolder.appendChild(document.createElement("span")).textContent = "Drop File Here";

            shellViewContainer.addEventListener('dragenter', function (ev) {

                ev.preventDefault();

                if (vm.currentGlobalState === 'profile' || vm.currentGlobalState === 'portal') {
                    if (ev.dataTransfer.items && ev.dataTransfer.items.length === 1) {

                        if (ev.dataTransfer.items[0].kind === 'file') {
                            if (!shellViewContainer.contains(dragBackdropElem)) {
                                shellViewContainer.appendChild(dragBackdropElem);
                            }
                        }

                    }
                }

            });

            dragBackdropElem.addEventListener('dragleave', function (ev) {
                ev.preventDefault();
                if (ev.target === dragBackdropElem) {
                    shellViewContainer.removeChild(dragBackdropElem);
                }
            });

            window.addEventListener("dragover", function (ev) {
                ev.preventDefault();
            }, false);

            window.addEventListener('drop', function (ev) {

                ev.preventDefault();

                if (vm.currentGlobalState === 'profile' || vm.currentGlobalState === 'portal') {

                    if (ev.dataTransfer.items && ev.dataTransfer.items.length === 1) {

                        if (ev.dataTransfer.items[0].kind === 'file') {
                            var file = ev.dataTransfer.items[0].getAsFile();

                            var fileNameParts = file.name.split('.');
                            var fileExt = fileNameParts.pop();

                            if (fileExt !== 'fcfg') {

                                $mdDialog.show({
                                    controller: 'WarningDialogController as vm',
                                    templateUrl: 'views/warning-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose: false,
                                    locals: {
                                        warning: {
                                            title: 'Warning',
                                            description: "Wrong file extension. Drop configuration file to start import."
                                        }
                                    },
                                    autoWrap: true,
                                    multiple: true
                                })

                            } else {
                                openImportConfigurationManager(file);
                            }

                        }

                    }

                    shellViewContainer.removeChild(dragBackdropElem);

                }

            });

        };

        vm.init = function () {

            vm.currentGlobalState = vm.getCurrentGlobalState();

            vm.initTransitionListener();

            vm.getMasterUsersList().then(function () {

                if (vm.masters.length) {
                    vm.getNotifications();
                }

            });

            if (window.BroadcastChannel) {
                vm.initCrossTabBroadcast();
            }

            if (pageStateName.indexOf('app.data.') !== -1 || vm.isReport()) {
                showLayoutName = true;
                vm.getActiveLayoutName();
            }

            vm.importOnDragListeners();

        };

        vm.init();
    }

}());