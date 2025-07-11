'use strict';

// const cookieService = require('../../../../core/services/cookieService').default;
import websocketService from "../../../../shell/scripts/app/services/websocketService.js";
import crossTabEvents from "../../../../shell/scripts/app/services/events/crossTabEvents.js";
// import {sys} from "browserify/lib/builtins";
// import {window} from "../../../../../libs/js/d3"; // wtf?

const metaService = require('../services/metaService').default; // TODO inject into angular dependencies

export default function ($mdDialog, $state, $transitions, cookieService, broadcastChannelService, middlewareService, authorizerService, usersService, uiService, globalDataService, systemMessageService, redirectionService, evRvLayoutsHelper) {

    return {
        restrict: 'E',
        scope: {
            openedInside: '@' // ('profile', 'portal')
        },
        templateUrl: 'views/directives/main-header-view.html',
        link: function (scope, elem, attrs) {

            if (!scope.openedInside) throw new Error("mainHeaderDirective: openedInside does not set");
            // let user;
            const user = globalDataService.getUser();

            const fmHeaderElement = elem.find('fm-header');

            // scope.keycloakAccountPage = window.KEYCLOAK_ACCOUNT_PAGE

            scope.currentLocation = '';
            scope.currentMasterUser = globalDataService.getMasterUser();
            scope.userName = '';
            scope.user = globalDataService.getUser();
            scope.logoPath = undefined

            scope.isThemeInDarkMode = globalDataService.isThemeInDarkMode();

            scope.getDocumentationLink = function () {

                var link = 'https://docs.finmars.com/search?term='

                var pieces = window.location.href.split('/#!/')[1].split('?')[0].split('/')

                pieces = pieces.map(function (item) {
                    return item.split('-').join(' ')
                })

                link = link + pieces.join(' ')

                return link

            }

            scope.toggleDarkMode = function (val) {
                if (val !== undefined) {
                    if (val) {
                        globalDataService.enableThemeDarkMode();
                    } else {
                        globalDataService.disableThemeDarkMode()
                    }
                } else {
                    if (scope.isThemeInDarkMode) {
                        globalDataService.disableThemeDarkMode()
                    } else {
                        globalDataService.enableThemeDarkMode();
                    }
                }

                scope.isThemeInDarkMode = globalDataService.isThemeInDarkMode(); // to update title in the switcher

                if (window.EDITION_TYPE == 'enterprise') {
                    const user = globalDataService.getUser();

                    authorizerService.updateUser(user.id, user);
                } else {
                    // do nothing
                }

                scope.setLogoPath()

            }

            scope.showAutosaveLayout = false;

            scope.member = globalDataService.getMember();
            scope.memberLayout = globalDataService.getMemberLayout();

            scope.homepageUrl = redirectionService.getUrlByState('app.portal.home');
            scope.profileUrl = redirectionService.getUrlByState('app.profile');

            scope.alertsStatus = 'healthy'

            scope.notiPopupData = {
                noti: [],
                SECTIONS: {
                    1: 'Events',
                    2: 'Transactions',
                    3: 'Instruments',
                    4: 'Data',
                    5: 'Prices',
                    6: 'Report',
                    7: 'Import',
                    8: 'Activity log',
                    9: 'Schedules',
                    10: 'Other'
                },
                homepageUrl: scope.homepageUrl,
                formatDate: function (date) {
                    if (moment().diff(moment(date), 'hours') > 12) {
                        return moment(date).format('DD.MM.YYYY HH:mm');
                    }

                    return moment(date).fromNow();
                }
            };

            let deregisterOnSuccessTransitionHook;

            const mdContent = document.querySelector('md-content');

            scope.openAccManager = function () {
                window.keycloak.accountManagement();
            }

            const updateCurrentMasterUser = function () {

                scope.currentMasterUser = globalDataService.getMasterUser();
                if (scope.currentMasterUser) {

                    window.document.title = scope.currentMasterUser.name + ' | Finmars'

                    websocketService.send({action: "update_user_state", data: {master_user: scope.currentMasterUser}});
                }

            };

            const getMasterUsersList = function () {

                // return usersService.getMasterList().then(function (data) {
                return new Promise(function (resolve, reject) {

                    if (window.EDITION_TYPE == 'enterprise') {

                        // usersService.getMasterListLight().then(function (data) {
                        authorizerService.getMasterUsersList().then(function (data) {

                            if (data.hasOwnProperty('results')) {

                                scope.masterUsers = data.results;

                                if (scope.masterUsers.length) {
                                    updateCurrentMasterUser();
                                }

                            } else {
                                scope.masterUsers = []
                            }

                            scope.$apply();

                            resolve();

                        }).catch(error => {
                            reject(error);
                        });

                    } else {
                        scope.masterUsers = [
                            {
                                "id": 1,
                                "name": "Local",
                                "description": "Local Space",
                                "status": 1,
                                "timezone": "UTC",
                                "is_initialized": true,
                                "base_api_url": "space00000",
                                "realm": 1,
                                "realm_object": {
                                    "id": 1,
                                    "name": "Local Realm",
                                    "realm_code": "realm00000",
                                    "update_channel": "rc",
                                    "is_update_allowed": true,
                                    "status": "operational"
                                },
                                "space_code": "space00000",
                                "realm_code": "realm00000",
                                "is_update_available": true,
                                "is_admin": true,
                                "is_owner": true
                            }
                        ]
                    }

                });

            };

            const loadNoti = function () {

                const options = {
                    pageSize: 3,
                    filters: {
                        only_new: true
                    }
                };

                systemMessageService.getList(options).then(messagesData => {
                    scope.notiPopupData.noti = messagesData.results;

                }).catch(e => {
                    console.error(e)
                });

            };

            const loadAlerts = function () {

                scope.alertsStatus = 'healthy'

                systemMessageService.getAlerts().then(function (data) {

                    for (var i = 0; i < data.results.length; i = i + 1) {

                        if (data.results[i].type === 2 && data.results[i].action_status === 2) {
                            scope.alertsStatus = 'warn'
                        }

                        if (data.results[i].type === 3 && data.results[i].action_status === 2) {
                            scope.alertsStatus = 'danger'
                            break;
                        }

                    }

                    scope.alertsCount = data.count;
                    scope.$apply();
                })

            };

            scope.toggleBookmarksPanel = function () {

                mdContent.classList.add('overflow-hidden');

                scope.showBookmarks = !scope.showBookmarks;

                setTimeout(function () {
                    mdContent.classList.remove('overflow-hidden');
                }, 100);

            };

            /*scope.openHelp = function ($event) {

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
                });

            };*/

            scope.logOutMethod = function () {

                $mdDialog.show({
                    controller: "WarningDialogController as vm",
                    templateUrl: "views/dialogs/warning-dialog-view.html",
                    parent: document.querySelector('.dialog-containers-wrap'),
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

                        if (broadcastChannelService.isAvailable) {
                            broadcastChannelService.postMessage('finmars_broadcast', {event: crossTabEvents.LOGOUT});
                        }

                        middlewareService.initLogOut();

                        authorizerService.logout().then(function (data) {

                            cookieService.deleteCookie('access_token');
                            cookieService.deleteCookie('refresh_token');
                            cookieService.deleteCookie('csrftoken');

                            sessionStorage.removeItem('afterLoginEvents');

                            /* if (window.location.pathname !== '/') {
                                window.location.pathname = '/';
                            } else {
                                window.location.reload()
                            } */
                            $state.go('app.authentication');

                            // cookieService.deleteCookie('authtoken');

                        });

                    }

                });
            };

            /* const getMember = function () {

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

            }; */

            scope.selectMaster = function (master) {

                // var checkLayoutForChanges = middlewareService.getWarningOfLayoutChangesLossFn();
                const changeMasterUser = function () {

                    if (window.PROJECT_ENV === 'local') {
                        window.location.href = '/' + master.realm_code + '/' + master.space_code + '/a/#!/'
                    } else {
                        window.location.href = '/' + master.realm_code + '/' + master.space_code + '/a/#!/dashboard'
                    }

                    /*if ($state.current.name.startsWith('app.portal')) {
                        // $state.reload('app.portal')
                        window.location.href = '/' + master.base_api_url + '/a/#!/'

                    } else {


                        // $state.go('app.portal.home')
                        // window.open(scope.homepageUrl, '_self');
                        // DEPRECATED, we need to go to new BASE_API_URL
                        // window.open(redirectionService.getUrlByState('app.portal.home'), '_self');
                    }*/


                    // DEPRECATED
                    // middlewareService.masterUserChanged();

                    // globalDataService.setMasterUser(master);


                    /* authorizerService.setCurrentMasterUser(master.id).then(function (data) {

                         if (data.base_api_url) {
                             // POSSIBLE DEPRECATED
                             // baseUrlService.setMasterUserPrefix(data.base_api_url)
                             //
                             // window.document.title = master.name + ' | Finmars'
                             //
                             // if (broadcastChannelService.isAvailable) {
                             //     broadcastChannelService.postMessage('finmars_broadcast', {event: crossTabEvents.MASTER_USER_CHANGED});
                             // }

                             // getMasterUsersList();

                             if ($state.current.name.startsWith('app.portal')) {
                                 // $state.reload('app.portal')
                                 window.location.href = '/' + data.base_api_url + '/a/#!/'

                             } else {
                                 // $state.go('app.portal.home')
                                 // window.open(scope.homepageUrl, '_self');
                                 window.open(redirectionService.getUrlByState('app.portal.home'), '_self');
                             }

                         } else {

                             // $state.go('app.profile', {});
                             window.open(scope.profileUrl, '_self')

                             console.log("Error activate", data)

                             if (data.message) {

                                 if (typeof data.message == 'string') {
                                     toastNotificationService.error(data.message)
                                 } else if (typeof data.message == 'object') {

                                     var message = {}

                                     Object.keys(data.message).forEach((key)=>{
                                         message = message = ' ' + key + ': ' + data.message[key]

                                     })

                                     toastNotificationService.error(message)

                                 } else {
                                     toastNotificationService.error(data.message)
                                 }


                             } else {
                                 toastNotificationService.error("Something went wrong. Please, try again later")
                             }
                         }

                     });*/
                };

                if (scope.currentMasterUser && scope.currentMasterUser.id !== master.id) {

                    $mdDialog.show({
                        controller: "WarningDialogController as vm",
                        templateUrl: "views/dialogs/warning-dialog-view.html",
                        parent: document.querySelector('.dialog-containers-wrap'),
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

                } else {

                    // $state.go('app.portal.home');
                    console.log("redirection mainHeaderDirective selectMaster to app.portal.home");
                    // window.location.href = '/' + master.realm_code + '/' + master.space_code + '/a/#!/dashboard'

                }

            };

            scope.toggleWarningsSideNav = function ($event) {

                $event.stopPropagation();

                middlewareService.toggleWarningsSideNav();

            }

            scope.onAutosaveToggle = function () {

                // globalDataService.setMember(scope.member);
                globalDataService.setMemberLayout(scope.memberLayout);
                middlewareService.autosaveLayoutToggle();

                uiService.updateMemberLayout(scope.memberLayout.id, scope.memberLayout).then(function () {
                    scope.memberLayout = globalDataService.getMemberLayout();
                });
            };

            if (scope.openedInside === 'portal') {

                const stateWithLayout = evRvLayoutsHelper.statesWithLayouts.includes($state.current.name);

                if (user.data.autosave_layouts && stateWithLayout) {

                    scope.showAutosaveLayoutCheckbox = true;

                    if (scope.member.data && typeof scope.member.data.autosave_layouts !== 'boolean') {
                        scope.member.data.autosave_layouts = true;
                        globalDataService.setMember(scope.member);
                    }

                }

            }

            deregisterOnSuccessTransitionHook = $transitions.onSuccess({}, function (transition) {

                scope.currentLocation = metaService.getHeaderTitleForCurrentLocation($state);
                const stateWithLayout = evRvLayoutsHelper.statesWithLayouts.includes($state.current.name);
                /* if (stateWithLayout && scope.member.data.autosave_layouts !== false) {
                    scope.showAutosaveLayoutCheckbox = true;
                } */
                scope.showAutosaveLayoutCheckbox = user.data.autosave_layouts && stateWithLayout;

            });

            scope.openUniversalInputDialog = function ($event) {

                $mdDialog.show({
                    controller: 'UniversalInputDialogController as vm',
                    templateUrl: 'views/dialogs/universal-input-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    targetEvent: $event,
                    locals: {
                        data: {}
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                });

            }

            const onToggleDarkMode = ($event) => scope.toggleDarkMode($event.detail)
            const onSelectMaster = ($event) => scope.selectMaster($event.detail)
            const goToProfile = () => window.open(scope.profileUrl, '_self')

            const init = async function () {

                const user = globalDataService.getUser();
                scope.userName = user.username;

                if (scope.openedInside === 'portal') scope.currentLocation = metaService.getHeaderTitleForCurrentLocation($state);

                // Promise.all([usersService.getUser(), getMasterUsersList()]).then(resData => {
                getMasterUsersList().then(resData => {
                    scope.$apply();
                });

                loadNoti();

                loadAlerts();

                scope.notiPopupData.homepageUrl = scope.homepageUrl;

                websocketService.addEventListener('master_user_change', function (data) {

                    scope.currentMasterUser = globalDataService.getMasterUser();
                    console.log("Header master user change")
                })


                scope.universalInputEnabled = false
                var universalInputStatus = window.localStorage.getItem('universalInputEnabled')
                if (universalInputStatus === 'true') {
                    scope.universalInputEnabled = true
                }

                if (fmHeaderElement.length) {
                    fmHeaderElement[0].addEventListener('setTheme', onToggleDarkMode);
                    fmHeaderElement[0].addEventListener('profile', goToProfile);
                    fmHeaderElement[0].addEventListener('security', scope.openAccManager);
                    fmHeaderElement[0].addEventListener('setCurrent', onSelectMaster);
                }

                scope.setLogoPath()

            };

            scope.getPrefixPath = function () {
                return `${window.API_HOST}/${window.base_api_url}/`
            }

            scope.setLogoPath = function () {
                const whiteLabel = globalDataService.getWhiteLabel()
                if (!whiteLabel) return undefined

                const relativePath = scope.isThemeInDarkMode ? whiteLabel.logo_dark_url : whiteLabel.logo_light_url

                if (relativePath) {
                    scope.logoPath = scope.getPrefixPath() + relativePath
                }
            }

            init();

            scope.$on("$destroy", function () {
                deregisterOnSuccessTransitionHook();

                if (fmHeaderElement.length) {
                    fmHeaderElement[0].removeEventListener('setTheme', onToggleDarkMode);
                    fmHeaderElement[0].removeEventListener('profile', goToProfile);
                    fmHeaderElement[0].removeEventListener('security', scope.openAccManager);
                    fmHeaderElement[0].removeEventListener('setCurrent', onSelectMaster);
                }
            });

        }
    }

};