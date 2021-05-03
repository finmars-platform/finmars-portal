/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookiesService = require('../../../../core/services/cookieService');
    var localStorageService = require('../../../../core/services/localStorageService');

    var usersService = require('../services/usersService');
    var authorizerService = require('../services/authorizerService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var notificationsService = require('../services/notificationsService');

    var metaService = require('../services/metaService');
    var uiService = require('../services/uiService');
    var middlewareService = require('../services/middlewareService');
    var websocketService = require('../services/websocketService');
    var baseUrlService = require('../services/baseUrlService');

    var crossTabEvents = {
        'MASTER_USER_CHANGED': 'MASTER_USER_CHANGED',
        'LOGOUT': 'LOGOUT'
    };

    module.exports = function ($scope, $state, $stateParams, $rootScope, $mdDialog, $transitions) {

        var vm = this;

        vm.isAuthenticated = false; // check if logged in or not
        vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)

        vm.readyStatus = {masters: false};

        vm.currentGlobalState = 'portal';
        vm.currentMasterUser = '';
        var member = '';

        vm.broadcastManager = null;

        var pageStateName = $state.current.name;
        var pageStateParams = {
            strategyNumber: $stateParams.strategyNumber,
            layoutUserCode: $stateParams.layoutUserCode
            //layoutName: $stateParams.layoutName
        };

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

        vm.getMasterUsersList = function () {

            vm.readyStatus.masters = false

            // return usersService.getMasterList().then(function (data) {
            return new Promise(function (resolve, reject) {

                // usersService.getMasterListLight().then(function (data) {
                authorizerService.getMasterList().then(function (data) {

                    if (data.hasOwnProperty('results')) {
                        vm.masters = data.results

                        if (vm.masters.length) {
                            vm.updateCurrentMasterUser();
                        }

                    } else {
                        vm.masters = []
                    }

                    vm.readyStatus.masters = true
                    $scope.$apply();

                    resolve();

                }).catch(function (error) {
                    reject(error);
                });

            });

        };

        vm.updateCurrentMasterUser = function () {

            vm.masters.forEach(function (item) {

                if (item.is_current) {

                    vm.currentMasterUser = item
                    websocketService.send({action: "update_user_state", data: {master_user: vm.currentMasterUser}});

                }

            });

        };

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
                        if (window.location.pathname !== '/') {
                            window.location.pathname = '/';
                        } else {
                            window.location.reload()
                        }


                        cookiesService.deleteCookie();
                    });

                }


            }
        };

        vm.selectMaster = function (master) {

            // var checkLayoutForChanges = middlewareService.getWarningOfLayoutChangesLossFn();

            var changeMasterUser = function () {

                middlewareService.masterUserChanged();

                authorizerService.setMasterUser(master.id).then(function (data) {

                    if (data.base_api_url) {
                        baseUrlService.setMasterUserPrefix(data.base_api_url)
                    }

                    // $state.go('app.home', null, {reload: 'app'});

                    window.location.reload();

                    if (vm.broadcastManager) {
                        vm.broadcastManager.postMessage({event: crossTabEvents.MASTER_USER_CHANGED});
                    }

                    getMember()

                    vm.getMasterUsersList();


                });
            };

            if (vm.currentMasterUser.id !== master.id) {

                $mdDialog.show({
                    controller: "WarningDialogController as vm",
                    templateUrl: "views/dialogs/warning-dialog-view.html",
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

                        var count_cached_requests = 0;

                        if (window.cached_requests) {
                            count_cached_requests = Object.keys(window.cached_requests).length;
                        }

                        window.cached_requests = {};
                        console.log('Clear Cached Requests. Total: ', count_cached_requests);

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
            return metaService.getHeaderTitleForCurrentLocation($state).toLocaleLowerCase();
        };

        // Get name of active layout in the toolbar


        var showLayoutName = false;

        vm.initTransitionListener = function () {

            $transitions.onStart({}, function () {
                $mdDialog.hide();
            });

            $transitions.onFinish({}, function (transition) {

                pageStateName = transition.to().name;
                pageStateParams.strategyNumber = transition.params().strategyNumber;
                pageStateParams.layoutUserCode = transition.params().layoutUserCode;

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

                var entityType = metaContentTypesService.getContentTypeUIByState(pageStateName, pageStateParams.strategyNumber);
                // var layoutNameFromParams = pageStateParams.layoutName;
                var layoutUserCode = pageStateParams.layoutUserCode;

                var setLayoutName = function (layoutData) {

                    if (layoutData && layoutData.length) {
                        newLayoutName = layoutData[0].name;
                    } else {
                        newLayoutName = '';
                    }

                    vm.activeLayoutName = newLayoutName;
                    $scope.$apply();

                };

                if (layoutUserCode) {

                    uiService.getListLayout(entityType, {
                        pageSize: 1000,
                        filters: {
                            user_code: layoutUserCode
                        }

                    }).then(function (data) {

                        if (data.hasOwnProperty('results') && data.results[0]) {

                            //var layoutName = data.results[0];
                            setLayoutName(data.results);

                        } else {

                            uiService.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                                var defaultLayoutRes = defaultLayoutData.results;
                                setLayoutName(defaultLayoutRes);

                            });

                        }

                    })

                } else if (vm.isLayoutFromUrl()) {

                    var queryParams = window.location.href.split('?')[1];
                    var params = queryParams.split('&');

                    var layoutName;

                    params.forEach(function (param) {

                        var pieces = param.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        if (key === 'layout') {
                            layoutName = value;

                            if (layoutName.indexOf('%20') !== -1) {
                                layoutName = layoutName.replace(/%20/g, " ")
                            }

                        }

                    });

                    uiService.getListLayout(entityType, {
                        pageSize: 1000,
                        filters: {
                            name: layoutName
                        }
                    }).then(function (activeLayoutData) {

                        var activeLayoutRes = activeLayoutData.results;
                        setLayoutName(activeLayoutRes);

                    })

                } else {

                    uiService.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                        var defaultLayoutRes = defaultLayoutData.results;
                        setLayoutName(defaultLayoutRes);

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
                templateUrl: "views/dialogs/warning-dialog-view.html",
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

                    authorizerService.logout().then(function (data) {
                        console.log('Logged out');
                        sessionStorage.removeItem('afterLoginEvents');

                        if (window.location.pathname !== '/') {
                            window.location.pathname = '/';
                        } else {
                            window.location.reload()
                        }

                        cookiesService.deleteCookie('authtoken');

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
                        controller: 'ConfigurationImportDialogController as vm',
                        templateUrl: 'views/dialogs/configuration-import/configuration-import-dialog-view.html',
                        //controller: 'SettingGeneralConfigurationPreviewFileDialogController as vm',
                        //templateUrl: 'views/dialogs/settings-general-configuration-preview-file-dialog-view.html',
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
                        templateUrl: 'views/dialogs/warning-dialog-view.html',
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

            var shellViewDnDDiv = document.querySelector('.shellViewDnDDiv');

            var dragBackdropElem = document.createElement("div");
            dragBackdropElem.classList.add("drag-file-backdrop");
            dragBackdropElem.appendChild(document.createElement("div"));

            var dragBackdropTextHolder = dragBackdropElem.querySelector("div");
            dragBackdropTextHolder.appendChild(document.createElement("span")).textContent = "Drop File Here";

            shellViewDnDDiv.addEventListener('dragenter', function (ev) {

                ev.preventDefault();

                if (vm.currentGlobalState === 'profile' || vm.currentGlobalState === 'portal') {
                    if (ev.dataTransfer.items && ev.dataTransfer.items.length === 1) {

                        if (ev.dataTransfer.items[0].kind === 'file') {

                            if (!shellViewDnDDiv.contains(dragBackdropElem)) {
                                shellViewDnDDiv.appendChild(dragBackdropElem);
                            }

                        }

                    }
                }

            });

            dragBackdropElem.addEventListener('dragleave', function (ev) {
                ev.preventDefault();
                if (ev.target === dragBackdropElem) {
                    shellViewDnDDiv.removeChild(dragBackdropElem);
                }
            });

            window.addEventListener("dragover", function (ev) {
                ev.preventDefault();
            }, false);

            dragBackdropElem.addEventListener('drop', function (ev) {

                ev.preventDefault();
                ev.stopPropagation();

                if (vm.currentGlobalState === 'profile' || vm.currentGlobalState === 'portal') {

                    if (ev.dataTransfer.items && ev.dataTransfer.items.length === 1) {

                        if (ev.dataTransfer.items[0].kind === 'file') {
                            var file = ev.dataTransfer.items[0].getAsFile();

                            var fileNameParts = file.name.split('.');
                            var fileExt = fileNameParts.pop();

                            if (fileExt !== 'fcfg') {

                                $mdDialog.show({
                                    controller: 'WarningDialogController as vm',
                                    templateUrl: 'views/dialogs/warning-dialog-view.html',
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

                    shellViewDnDDiv.removeChild(dragBackdropElem);

                }

            });

        };


        vm.getUser = function () {

            return new Promise(function (resolve, reject) {

                authorizerService.getUser().then(function (data) {

                    vm.user = data;

                    resolve();

                }).catch(function (error) {
                    reject(error);
                });

            });


        };

        var getMember = function () {

            return new Promise(function (resolve, reject) {

                usersService.getMyCurrentMember().then(function (data) {

                    member = data;

                    websocketService.send({action: "update_user_state", data: {member: member}});

                    resolve(member);

                }).catch(function (error) {

                    console.error(error);

                    reject(error);
                });

            });

        }

        var transactionsList = [
            'app.settings.general.init-configuration', 'app.settings.init-configuration',
            'app.settings.ecosystem-default-settings', 'app.settings.data-providers', 'app.settings.users-groups',
            'app.processes'
        ];

        function enableAccessHandler($transitions) {

            // usersService.getMyCurrentMember().then(function (data) {

            $transitions.onStart({}, function (transition) {

                if (member.is_admin) {
                    return true
                }

                console.log('transition.to().name', transition.to().name);

                if (transactionsList.includes(transition.to().name)) {
                    return false;
                }

                return true;
            })

            // })

        }

        vm.initShell = function () {

            vm.currentGlobalState = vm.getCurrentGlobalState();

            if (vm.currentGlobalState === 'profile') {
                vm.isIdentified = true;
                console.log("User status: Identified");
            }

            document.title = metaService.getCurrentLocation($state);

            window.addEventListener('error', function (e) {
                toastr.error(e.error);
            });

            $transitions.onSuccess({}, function (trans) {

                var count_cached_requests = 0;

                if (window.cached_requests) {
                    count_cached_requests = Object.keys(window.cached_requests).length;
                }

                window.cached_requests = {};
                console.log('Clear Cached Requests. Total: ', count_cached_requests);

                var location = metaService.getCurrentLocation($state);

                var title = 'Finmars';

                if (location !== '') {
                    title = title + ' - ' + location;
                }

                document.title = title;

                // setTimeout(function () {
                //     window.dispatchEvent(new Event('resize'));
                // }, 1000);

            });

            vm.initTransitionListener();

            var getUserProm = vm.getUser();

            var getMasterUsersProm = vm.getMasterUsersList();




            var promises = []

            promises.push(getUserProm)
            promises.push(getMasterUsersProm)

            if (baseUrlService.getMasterUserPrefix()) {

                var getMemberProm = getMember();

                promises.push(getMemberProm)
            }

            Promise.allSettled(promises).then(function () {

                localStorageService.setUMuM(vm.user.id, vm.currentMasterUser.id, member.id);
                enableAccessHandler($transitions); // TODO Run after successful auth

                if (vm.masters.length) {

                    // vm.getNotifications();

                    vm.isIdentified = true;
                    console.log("User status: Identified");

                    $scope.$apply();

                } else {

                    if (vm.currentGlobalState !== 'profile') {
                        $state.go('app.profile', {}, {reload: 'app'})
                    }

                }

                if (pageStateName.indexOf('app.data.') !== -1 || vm.isReport()) {
                    showLayoutName = true;
                    vm.getActiveLayoutName();
                }

            })

            if (window.BroadcastChannel) {
                vm.initCrossTabBroadcast();
            }

            vm.importOnDragListeners();

        };

        vm.initLoginDialog = function () {

            $mdDialog.show({
                controller: 'LoginDialogController as vm',
                templateUrl: 'views/dialogs/login-dialog-view.html',
                targetEvent: new Event("click"),
                locals: {
                    data: null
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.isAuthenticated = true;

                    console.log("User status: Authenticated");



                    setTimeout(function () {
                        vm.initShell();
                        window.location.hash = '#!/profile';
                        window.location.reload();
                    }, 100);

                }

            })


        };

        vm.init = function () {

            authorizerService.ping().then(function (data) {

                // console.log('ping data', data);

                if (!data.is_authenticated) {

                    vm.isAuthenticated = false;

                    vm.initLoginDialog();

                } else {

                    vm.isAuthenticated = true;

                    if (!data.current_master_user_id) {
                        $state.go('app.profile', {}, {})
                    }

                    if (data.base_api_url) {
                        baseUrlService.setMasterUserPrefix(data.base_api_url)
                    }

                    console.log("User status: Authenticated");

                    $scope.$apply();

                    setTimeout(function () {
                        vm.initShell();
                    }, 100);
                }

            }).catch(function(data){
                if (!data.is_authenticated) {
                    vm.initLoginDialog();
                }
            })


        };

        vm.init();

    }

}());