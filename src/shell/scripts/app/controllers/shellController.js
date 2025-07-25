/**
 * Created by mevstratov on 18.05.2021
 */

// (function () {

'use strict';
// import * as authorizerService from '../services/authorizerService';
// const cookieService = require('../../../../core/services/cookieService').default;
import baseUrlService from "../services/baseUrlService.js";
import crossTabEvents from "../services/events/crossTabEvents";

import Keycloak from '../../../../core/keycloak/keycloak.js'
import explorerService from "../../../../portal/scripts/app/services/explorerService";

export default function ($scope, $state, $transitions, $urlService, $uiRouterGlobals, $mdDialog, toastNotificationService, cookieService, broadcastChannelService, middlewareService, authorizerService, globalDataService, redirectionService, usersService) {

    console.log("shellController init()")

    let vm = this;

    vm.isAuthenticated = false;
    vm.isAuthenticationPage = $state.current.name === 'app.authentication';
    vm.iframeMode = false;

    // let finmarsBroadcastChannel = new BroadcastChannel('finmars_broadcast');
    // vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)
    vm.PROJECT_ENV = '__PROJECT_ENV__'; // changed when building project by minAllScripts()

    // vm.keycloakAccountPage = window.KEYCLOAK_ACCOUNT_PAGE

    let homepageUrl;
    let profileUrl;

    vm.readyStatus = false;

    let transitionFromState = '';

    $scope.initLoaderProcessing = true;
    $scope.displayInitLoader = true;

    $scope.$on('initialLoadComplete', function () {
        $scope.initLoaderProcessing = false;

        // Important for smooth loader dissapearing
        setTimeout(function () {
            $scope.displayInitLoader = false;
            $scope.$apply();
        }, 1000)
    });

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
            console.log("redirection shellController onLogInSuccess() ");
            window.open(profileUrl, '_self'); // REDIRECTION: 'app.profile'

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
                        parent: document.querySelector('.dialog-containers-wrap'),
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

            authorizerService.getMe().then(async function (userData) {

                vm.user = userData;

                // enable by default list layout autosave
                if (typeof vm.user.data.autosave_layouts !== 'boolean') {
                    vm.user.data.autosave_layouts = true;
                }

                globalDataService.setUser(vm.user);

                // deprecated, theme part of member, not user
                // vm.user = await applyTheme(vm.user);

                resolve();

            }).catch(error => {
                reject(error);
            });

        });
        // return authorizerService.getMe();

    };

    const initTransitionListener = function () {

        const resetUrlAfterAbortion = function () {

            let fromUrl = $state.href($state.current.name, {}, {relative: true});
            fromUrl = fromUrl.slice(2); // remove #! part
            $urlService.url(fromUrl, true);

        };

        if (vm.iframeMode) {

            $transitions.onBefore({}, function (transition) {

                if (['app.authentication', 'app.portal.home', 'app.profile'].includes(transition.to().name)) {
                    // resetUrlAfterAbortion();
                    return false;

                }

            });

        } else {

            $transitions.onBefore({}, function (transition) {

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

        }

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

            /* if (ev.data.event === crossTabEvents.MASTER_USER_CHANGED) {
                middlewareService.masterUserChanged();

                window.open(homepageUrl, '_self');

            } */

            if (ev.data.event === crossTabEvents.LOGOUT) {

                middlewareService.initLogOut();

                if (window.EDITION_TYPE == 'enterprise') {

                    authorizerService.logout().then(function (data) {

                        sessionStorage.removeItem('afterLoginEvents');

                        /* if (window.location.pathname !== '/') {
                            window.location.pathname = '/';
                        } else {
                            window.location.reload()
                        } */
                        cookieService.deleteCookie('access_token');
                        cookieService.deleteCookie('refresh_token');

                        vm.isAuthenticated = false;

                        $state.go('app.authentication');


                    });
                } else {

                    sessionStorage.removeItem('afterLoginEvents');

                    /* if (window.location.pathname !== '/') {
                        window.location.pathname = '/';
                    } else {
                        window.location.reload()
                    } */
                    cookieService.deleteCookie('access_token');
                    cookieService.deleteCookie('refresh_token');

                    vm.isAuthenticated = false;

                    $state.go('app.authentication');

                }

            }


        };

        broadcastChannelService.setOnmessage('finmars_broadcast', onmessageCallback);

    }

    const refreshTokens = async () => {
        const isRefreshed = await keycloak.updateToken()

        // if ( !isRefreshed ) {
        //     await keycloak.login()
        // }
    }

    const setTokens = () => {
        cookieService.setCookie('access_token', window.keycloak.token);
        cookieService.setCookie('refresh_token', window.keycloak.refreshToken);
        cookieService.setCookie('id_token', window.keycloak.idToken);
    }

    vm.openAccManager = function () {
        window.keycloak.accountManagement();
    }

    const init = async function () {

        // keycloak adapter passes params as redirect_url + &state=
        // and ui-router if see /&state instead of ?state become mad
        // so solution is to add fake param ?foo=bar
        // and keycloak will do redirect_url?foo=bar&state
        // should work

        if (window.location.hash.indexOf('?') === -1) {

            window.location.hash = window.location.hash + '?auth'
        }

        if (window.location.href.indexOf('iframe=true') !== -1) {

            globalDataService.setIframeMode(true);
            vm.iframeMode = true;

            document.body.classList.add('iframe');

        }

        /* if (vm.PROJECT_ENV !== 'local') {

            websocketService.addEventListener('master_user_change', function (data) {

                if (data.base_api_url) {

                    window.document.title = data.master_user.name + ' | Finmars'

                    baseUrlService.setMasterUserPrefix(data.base_api_url);

                    globalDataService.setCurrentMasterUserStatus(true);

                }

                console.log('master_user_change data', data);

                if (localStorage.getItem('goToSetup')) {
                    $state.go('app.portal.setup');
                } else {

                    if ($state.current.name === 'app.portal.home') {
                        $state.reload('app');

                    } else {
                        // $state.go('app.portal.home');
                        console.log("redirection shellController init() 1", );
                        window.open(homepageUrl, '_self'); // REDIRECTION: app.portal.home
                    }

                }

            })

        } */

        middlewareService.addListenerOnLogOut(function () {
            vm.isAuthenticated = false;
        });

        initTransitionListener();

        if (broadcastChannelService.isAvailable) {
            initCrossTabBroadcast();
        }

        // ==================================================================================
        // = New way of settings base_api_url, now window.location.pathname can contains it =
        // ==================================================================================
        var pathname = window.location.pathname;
        var base_api_url;

        if (pathname.includes('/space')) {

            var pathnamePartsList = pathname.split('/');
            var realm_code = pathnamePartsList.find(part => part.startsWith('realm'));
            var space_code = pathnamePartsList.find(part => part.startsWith('space'));

            console.log('realm_code', realm_code);
            console.log('space_code', space_code);

            if (realm_code) {
                base_api_url = realm_code + '/' + space_code
            } else {
                base_api_url = space_code;
            }

            baseUrlService.setMasterUserPrefix(base_api_url);

        } else {
            console.error("ShellController: no base_api_url in the pathname", pathname);
        }

        homepageUrl = redirectionService.getUrlByState('app.portal.home');
        profileUrl = redirectionService.getUrlByState('app.profile');

        window.keycloak = new Keycloak({
            url: window.KEYCLOAK_URL,
            realm: window.KEYCLOAK_REALM,
            clientId: window.KEYCLOAK_CLIENT_ID
        });

        window.keycloak.onReady = () => {
            if (window.keycloak.isTokenExpired(10)) refreshTokens()
        }


        window.keycloak.onAuthSuccess = setTokens
        window.keycloak.onAuthRefreshSuccess = setTokens
        window.keycloak.onTokenExpired = refreshTokens

        console.log("Keycloak init")

        const authenticated = await window.keycloak.init({
            onLoad: 'login-required',
            token: cookieService.getCookie('access_token'),
            refreshToken: cookieService.getCookie('refresh_token'),
            idToken: cookieService.getCookie('id_token'),
            checkLoginIframe: true,
            checkLoginIframeInterval: 60, // Seconds
            timeSkew: 0, // fix bag with update token
            // checkLoginIframe: false
        });

        if (authenticated) {

            cookieService.setCookie('access_token', window.keycloak.token);
            cookieService.setCookie('refresh_token', window.keycloak.refreshToken);
            cookieService.setCookie('id_token', window.keycloak.idToken);

            vm.isAuthenticated = true;

            if (!base_api_url) { // logging in without specifying database

                baseUrlService.setMasterUserPrefix(null);

                globalDataService.setCurrentMasterUserStatus(false);

                if (vm.PROJECT_ENV === 'local') {

                    console.log("redirection shellController init() 1");
                    $state.go('app.portal.home'); // REDIRECTION: app.portal.home

                } else {

                    if ($state.current.name !== 'app.profile') {
                        // $state.go('app.profile', {}, {});
                        console.log("redirection shellController init() 2");
                        window.open(profileUrl, '_self'); // REDIRECTION: app.profile
                    }
                }

            }

            /* if (!data.current_master_user_id && $state.current.name !== 'app.profile') {

                $state.go('app.profile', {}, {});

            } else if (vm.isAuthenticationPage) {
                $state.go('app.portal.home');
            } */

            console.log("EDITION_TYPE: " + window.EDITION_TYPE)


            if (window.EDITION_TYPE == 'enterprise') {
                getUser().then(async () => {

                if (base_api_url) {

                    try {

                        const masterUser = await authorizerService.getCurrentMasterUser();

                        console.log("Setting base api url ", masterUser.base_api_url);
                        // baseUrlService.setMasterUserPrefix(base_api_url);

                        globalDataService.setCurrentMasterUserStatus(true);

                        if (vm.isAuthenticationPage) {
                            // $state.go('app.portal.home');
                            console.log("redirection shellController init() 3");
                            window.open(homepageUrl, '_self'); // REDIRECTION: app.portal.home
                        }

                    } catch (e) {
                        e.___custom_message = 'location: shellController -> init() -> getCurrentMasterUser()';
                        console.error(e);
                    }

                }


                vm.readyStatus = true;
                $scope.$apply();

            });
            } else if( window.EDITION_TYPE == 'community') {

                globalDataService.setUser({data: {}})

                vm.member = await usersService.getMyCurrentMember()

                vm.member.user.data = {} // fix in future

                globalDataService.setUser(vm.member.user);

                console.log('vm.member.user', vm.member.user);

                console.log("Fetching local master user?")

                globalDataService.setMasterUser({
                    name: "Local",
                    base_api_url: "space00000",
                    realm_code: "realm00000",
                    space_code: "space00000"
                });

                globalDataService.setCurrentMasterUserStatus(true);

                if (vm.isAuthenticationPage) {
                    // $state.go('app.portal.home');
                    console.log("redirection shellController init() 3");
                    window.open(homepageUrl, '_self'); // REDIRECTION: app.portal.home
                }

                vm.readyStatus = true;
                $scope.$apply();

            } else {
                toastNotificationService.error("Unknown Edition")
            }
        } else {
            toastNotificationService.error("Auth error")
        }

    };

    init();

};

// })();
