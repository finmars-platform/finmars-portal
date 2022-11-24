/**
 * Created by mevstratov on 18.05.2021
 */

// (function () {

'use strict';
// import * as authorizerService from '../services/authorizerService';
// const cookieService = require('../../../../core/services/cookieService');
import websocketService from "../../../../shell/scripts/app/services/websocketService.js";
import baseUrlService from "../services/baseUrlService.js";
import crossTabEvents from "../services/events/crossTabEvents";

export default function ($scope, $state, $transitions, $urlService, $mdDialog, cookieService, broadcastChannelService, middlewareService, authorizerService, globalDataService, redirectionService) {

    let vm = this;

    vm.isAuthenticated = false;
    vm.isAuthenticationPage = $state.current.name === 'app.authentication';
    vm.iframeMode = false;

    // let finmarsBroadcastChannel = new BroadcastChannel('finmars_broadcast');
    // vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)
    const PROJECT_ENV = '__PROJECT_ENV__'; // changed when building project by minAllScripts()

    const homepageUrl = redirectionService.getUrl('app.portal.home');
    const profileUrl = redirectionService.getUrl('app.profile');

    vm.readyStatus = false;

    let transitionFromState = '';

    vm.showPageContent = function () {

        if (vm.isAuthenticationPage) {
            return !vm.isAuthenticated; // do not show loader if its loading page and we are not authorized
        }

        return vm.isAuthenticated && vm.readyStatus;

    }

    const onLogInSuccess = function (data) {

        vm.username = '';

        cookieService.setCookie('access_token', data['access_token']);
        cookieService.setCookie('refresh_token', data['refresh_token']);

        authorizerService.getMe().then(activeUser => {

            globalDataService.setUser(activeUser);

            vm.isAuthenticated = true;
            vm.readyStatus = true;

            // $state.go('app.profile', {}, {});
            window.open(profileUrl, '_self');

        });

    }
    /** Used inside shell/.../login-view.html */
    vm.logIn = function ($event) {
        // vm.username, vm.password set inside login-view.html

        vm.processing = true;
        authorizerService.tokenLogin(vm.username, vm.password).then(function (data) {

            console.log('authorizerService.login.data', data);

            if (data.success) {

                if (data.two_factor_check) {

                    $mdDialog.show({
                        controller: 'TwoFactorLoginDialogController as vm',
                        templateUrl: 'views/dialogs/two-factor-login-dialog-view.html',
                        parent: angular.element(document.body),
                        locals: {
                            username: vm.username,
                            password: vm.password
                        },
                        multiple: true,
                        targetEvent: $event

                    })
                        .then(res => {
                            if (res.status === 'agree') {
                                onLogInSuccess(res.data);
                            } else {
                                vm.processing = false;
                            }
                        });

                } else {
                    onLogInSuccess(data);
                }

            } else {
                vm.processing = false;
                vm.error = true;
                vm.errorMessage = data.message
                $scope.$apply();
            }

        }).catch(error => {
            vm.processing = false;
            vm.error = true;
            console.error(error);
        });

    };

    const getUser = function () {

        return new Promise(function (resolve, reject) {

            authorizerService.getMe().then(function (userData) {

                vm.user = userData;

                // enable by default list layout autosave
                if (typeof vm.user.data.autosave_layouts !== 'boolean') {
                    vm.user.data.autosave_layouts = true;
                }

                globalDataService.setUser(vm.user);

                resolve();

            }).catch(error => {
                reject(error);
            });

        });
        // return authorizerService.getMe();

    };

    const initTransitionListener = function () {

        $transitions.onBefore({}, function (transition) {

            const resetUrlAfterAbortion = function () {

                let fromUrl = $state.href($state.current.name, {}, {relative: true});
                fromUrl = fromUrl.slice(2); // remove #! part
                $urlService.url(fromUrl, true);

            };

            if (vm.isAuthenticated) {

                if (transition.to().name === 'app.authentication') {

                    resetUrlAfterAbortion();
                    return false;

                }

            } else if (transition.to().name !== 'app.authentication') {

                resetUrlAfterAbortion();
                return false;
                // transition.abort();
            }

        });

        $transitions.onStart({}, function (transition) {

            let openedDialogs = document.querySelectorAll('md-dialog');


            openedDialogs.forEach((item) => {
                if (!item.classList.contains('log-dialog')) {
                    $mdDialog.hide();
                }
            });

        });

        $transitions.onSuccess({}, function (transition) {

            var count_cached_requests = 0;

            if (window.cached_requests) {
                count_cached_requests = Object.keys(window.cached_requests).length;
            }

            window.cached_requests = {};
            console.log('Clear Cached Requests. Total: ', count_cached_requests);

            /* var location = metaService.getCurrentLocation($state);

            var title = 'Finmars';

            if (location !== '') {
                title = title + ' - ' + location;
            }

            document.title = title;

            setTimeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 1000); */
            transitionFromState = transition.from().name;

            if (transitionFromState === 'app.authentication') {
                vm.username = '';
                vm.password = '';
            }

            // middlewareService.clearEvents();
            vm.isAuthenticationPage = transition.to().name === 'app.authentication';

        });

        /* $transitions.onFinish({}, function (transition) {

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

        }); */

    };

    const initCrossTabBroadcast = function () {

        broadcastChannelService.openChannel('finmars_broadcast');

        const onmessageCallback = function (ev) {

            if (ev.data.event === crossTabEvents.MASTER_USER_CHANGED) {
                middlewareService.masterUserChanged();

                // $state.go('app.portal.home');
                window.open(homepageUrl, '_self');

            }

            if (ev.data.event === crossTabEvents.LOGOUT) {

                middlewareService.initLogOut();

                authorizerService.logout().then(function (data) {

                    sessionStorage.removeItem('afterLoginEvents');

                    /* if (window.location.pathname !== '/') {
                        window.location.pathname = '/';
                    } else {
                        window.location.reload()
                    } */
                    $state.go('app.authentication');

                    cookieService.deleteCookie('access_token');
                    cookieService.deleteCookie('refresh_token');

                });

            }


        };

        broadcastChannelService.setOnmessage('finmars_broadcast', onmessageCallback);

    }

    const init = function () {

        if (window.location.href.indexOf('iframe=true') !== -1) {
            vm.iframeMode = true

            document.body.classList.add('iframe')
        }

        if (PROJECT_ENV !== 'local') {

            websocketService.addEventListener('master_user_change', function (data) {

                if (data.base_api_url) {

                    window.document.title = data.master_user.name + ' | Finmars'

                    baseUrlService.setMasterUserPrefix(data.base_api_url);

                    globalDataService.setCurrentMasterUserStatus(true);

                }

                console.log('master_user_change data', data);

                /* if (window.location.pathname !== '/') {
                    window.location.href = '/portal/#!/';
                } else {
                    window.location.reload()
                } */

                if (localStorage.getItem('goToSetup')) {
                    $state.go('app.portal.setup');
                } else {

                    if ($state.current.name === 'app.portal.home') {
                        $state.reload('app');

                    } else {
                        // $state.go('app.portal.home');
                        window.open(homepageUrl, '_self');
                    }

                }

            })

        }

        middlewareService.addListenerOnLogOut(function () {
            vm.isAuthenticated = false;
        });

        initTransitionListener();

        if (broadcastChannelService.isAvailable) {
            initCrossTabBroadcast();
        }

        authorizerService.ping().then(function (data) {

            // console.log('ping data', data);

            if (!data.is_authenticated) {

                vm.isAuthenticated = false;

                $state.go('app.authentication');

            } else {

                vm.isAuthenticated = true;

                if (window.location.href.indexOf('/client') !== -1) {

                    // ================================================================================
                    // = New way of settings base_api_url, now its mandatory in window.location.href
                    // ================================================================================
                    var base_api_url;
                    var pieces = window.location.href.split('/a')[0].split('/')

                    base_api_url = pieces[pieces.length - 1]

                    console.log("Setting base api url ", base_api_url)

                    baseUrlService.setMasterUserPrefix(base_api_url);

                    globalDataService.setCurrentMasterUserStatus(true);

                    if (vm.isAuthenticationPage) {
                        // $state.go('app.portal.home');
                        window.open(homepageUrl, '_self');
                    }

                } else {

                    baseUrlService.setMasterUserPrefix(null);

                    globalDataService.setCurrentMasterUserStatus(false);

                    if ($state.current.name !== 'app.profile') {
                        // $state.go('app.profile', {}, {});
                        window.open(profileUrl, '_self');
                    }

                }

                /* if (!data.current_master_user_id && $state.current.name !== 'app.profile') {

                    $state.go('app.profile', {}, {});

                } else if (vm.isAuthenticationPage) {
                    $state.go('app.portal.home');
                } */
                console.log("User status: Authenticated");

                getUser().then(() => {

                    vm.readyStatus = true;
                    $scope.$apply();

                });

            }

        }).catch(error => {
            if (!error.is_authenticated) $state.go('app.authentication');
        })

    };

    init();

};

// })();