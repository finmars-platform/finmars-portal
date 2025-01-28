/**
 * Created by mevstratov on 27.05.2021
 */

'use strict';

import baseUrlService from "../services/baseUrlService";
import {NavigationRoutes} from '@finmars/ui';

const localStorageService = require('../../../../shell/scripts/app/services/localStorageService'); // TODO inject localStorageService into angular dependencies

var explorerService = require('../services/explorerService');
var portalService = require('../services/portalService').default;

export default function ($scope, $state, $transitions, $urlService, authorizerService, usersService, globalDataService, redirectionService, middlewareService, uiService) {

    let vm = this;

    vm.ROLES_MAP = {
        'local.poms.space0i3a2:viewer': ['dashboard', 'reports', 'add-ons'],
        'local.poms.space0i3a2:base-data-manager': ['data', 'valuations', 'transactions-from-file', 'data-from-file', 'reconciliation', 'workflows'],
        'local.poms.space0i3a2:configuration-manager': ['Default-settings', 'Account-Types', 'Instrument-Types', 'Transaction-Types', 'Account-Types', 'Transaction-Type-Groups'],
        'local.poms.space0i3a2:full-data-manager': ['dashboard', 'Member', 'Permissions',],
        'local.poms.space0i3a2:member': ['dashboard', 'reports', 'Member', 'navigation', 'group']
    };
    vm.allowedItems = [];
    vm.readyStatus = false;
    vm.showWarningSideNav = false;

    const urlBeginning = baseUrlService.resolve();
    const angularPart = baseUrlService.getAngularJsPart();

    const [realm_code, space_code] = baseUrlService?.getMasterUserPrefix()?.split('/');

    vm.route = {params: {realm_code, space_code}, path: ''};
    vm.baseUrl = baseUrlService.resolve();

    const getMemberData = async function () {


        try {

            const res = await Promise.all([usersService.getMyCurrentMember(), uiService.getDefaultMemberLayout(),]);

            const memberLayout = res[1];

            // enable by default list layout autosave
            if (typeof memberLayout.data.autosave_layouts !== 'boolean') {
                memberLayout.data.autosave_layouts = true;
                globalDataService.setMemberLayout(memberLayout);
            }

        } catch (error) {
            console.error(error);
            throw error;
        }


    }

    const getCurrentMasterUser = function () {

        return new Promise((resolve, reject) => {

            authorizerService.getCurrentMasterUser().then(masterUser => {

                // websocketService.send({action: "update_user_state", data: {master_user: masterUser}});

                resolve();

            }).catch(error => reject(error));

        });

    };


    const initAlertSideNavListeners = function () {

        setTimeout(function () {

            $('.alert-sidenav-wrapper').click(function (event) {
                event.stopPropagation();
            })

            $('body').click(function () {
                //Hide the menus if visible
                console.log('showWarningSideNav.click hide')
                vm.showWarningSideNav = false;
                setTimeout(function () {
                    $scope.$apply();
                }, 0)
            });

        }, 100)

    }

    const loadWhiteLabelDefault = function () {

        return new Promise(function (resolve, _reject) {

            uiService.loadThemeSettingsDefault().then(function (data) {
                let themeSettings = null

                if (Array.isArray(data)) {
                    themeSettings = data[0]
                } else {
                    themeSettings = data
                }

                uiService.installTheme(themeSettings)
                resolve();

            });

        });

    };

    const getActivePath = function (stateName) {

        let path = $state.href(stateName);
        path = $urlService.path(path);

        return `${urlBeginning}/${angularPart}${path}`;

    };

    const deregisterTransitionOnSuccess = $transitions.onSuccess({}, function (transition) {
        vm.route.path = getActivePath(transition.to().name);
    });

    const resizeSideNav = function () {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        })
    };

    const addNavigationPortalListener = function () {
        const navigationPortal = document.querySelector('#fm-navigation-portal');

        if (navigationPortal) {
            navigationPortal.addEventListener('resizeSideNav', resizeSideNav);
        }
    };

    const removeNavigationPortalListener = function () {
        const navigationPortal = document.querySelector('#fm-navigation-portal');
        if (navigationPortal) {
            navigationPortal.removeEventListener('resizeSideNav', resizeSideNav);
        }
    };

    const filterMenuItems = function (navigationRouts, allowedKeys) {
        if (!allowedKeys) return [];

        return navigationRouts.reduce(function (acc, item) {
            let hasChildren = Array.isArray(item.children) && item.children.length > 0;
            let filteredChildren = [];

            if (hasChildren) {
                filteredChildren = filterMenuItems(item.children, allowedKeys);
            }

            let isParentAllowed = allowedKeys.includes(item.key);
            let isChildAllowed = filteredChildren.length > 0;

            if (isParentAllowed && !isChildAllowed) {
                acc.push({
                    ...item, children: item.children
                });
            } else if (isChildAllowed) {
                acc.push({
                    ...item, children: filteredChildren
                });
            }

            return acc;
        }, []);
    };

    const buildNavigationSidebar = async function () {
        const member = await usersService.getMyCurrentMember();

        if (member?.is_admin) {
            vm.allowedItems = NavigationRoutes;
        } else {
            const roles = member?.roles_object || [];

            const promises = roles.map(role => {
                const options = {
                    role: role?.user_code,
                    user_code: role?.user_code?.split(':')?.[1],
                    configuration_code: role?.configuration_code
                };

                return portalService.getNavigationRoutingList(options);
            });

            Promise.all(promises)
              .then(results => {
                  const allAllowedItems = [];

                  results.forEach(res => {
                      if (res?.[0]?.allowed_items) {
                          allAllowedItems.push(...res[0].allowed_items);
                      }
                  });

                  const uniqueAllowedItems = Array.from(new Set(allAllowedItems));

                  vm.allowedItems = filterMenuItems(NavigationRoutes, uniqueAllowedItems);
              })
              .catch(error => {
                  console.log(`getNavigationRoutingList: ${error}`);
                  vm.allowedItems = [];
              });
        }
    };



    const init = function () {

        middlewareService.onToggleWarningsSideNav(function () {
            vm.showWarningSideNav = !vm.showWarningSideNav;

        })

        if (localStorageService.setGlobalDataService) localStorageService.setGlobalDataService(globalDataService); // TODO inject localStorageService into angular dependencies

        vm.currentMasterUser = globalDataService.getMasterUser();
        const promises = [];

        if (!vm.currentMasterUser) { // if currentMasterUser was not set previously, load it
            promises.push(getCurrentMasterUser());
        }

        promises.push(getMemberData());
        promises.push(loadWhiteLabelDefault());
        promises.push(buildNavigationSidebar());

        Promise.all(promises).then(resData => {

            vm.route.path = getActivePath($state.current.name);

            vm.readyStatus = true;

            $scope.$emit('initialLoadComplete'); // for turning off initial loader

            initAlertSideNavListeners();
            $scope.$apply();

            addNavigationPortalListener()

        }).catch(function (error) {

            error.___custom_message = "PortalController init()"
            console.log('PortalController.error', error);
            console.error(error);

            // window.open(redirectionService.getUrlByState('app.profile'), '_self')

        })

    };

    init();

    $scope.$on("$destroy", function () {
        deregisterTransitionOnSuccess();
        removeNavigationPortalListener()
    });

};