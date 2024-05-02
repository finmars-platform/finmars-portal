/**
 * Created by mevstratov on 27.05.2021
 */

'use strict';

const localStorageService = require('../../../../shell/scripts/app/services/localStorageService'); // TODO inject localStorageService into angular dependencies

var explorerService = require('../services/explorerService');

export default function ($scope, $state, authorizerService, usersService, globalDataService, redirectionService, middlewareService, uiService) {

    let vm = this;

    vm.readyStatus = false;
    vm.showWarningSideNav = false;

    /*const getMember = function () {

        return new Promise(function (resolve, reject) {

            usersService.getMyCurrentMember().then(function (data) {

                const member = data;
                // enable by default list layout autosave
                if (member.data && typeof member.data.autosave_layouts !== 'boolean') {
                    member.data.autosave_layouts = true;
                    globalDataService.setMember(member);
                }

                // websocketService.send({action: "update_user_state", data: {member: member}});

                resolve(member);

            }).catch(function (error) {
                console.error(error);
                reject(error);
            });

        });

    }*/

    const getMemberData = async function () {

        try {

            const res = await Promise.all([
                usersService.getMyCurrentMember(),
                uiService.getDefaultMemberLayout(),
            ]);

            /*const member = res[0]

            // enable by default list layout autosave
            if (member.data && typeof member.data.autosave_layouts !== 'boolean') {
                member.data.autosave_layouts = true;
                globalDataService.setMember(member);
            }*/
            const memberLayout = res[1];

            if (!memberLayout.data) {
                memberLayout.data = {}
            }

            if (memberLayout.data.isThemeInDarkMode == null || memberLayout.data.isThemeInDarkMode == undefined) {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    // Dark mode preferred
                    memberLayout.data.isThemeInDarkMode = true;
                    globalDataService.enableThemeDarkMode()
                } else {
                    memberLayout.data.isThemeInDarkMode = false;
                    globalDataService.disableThemeDarkMode()
                    // Light mode preferred
                }
            } else if (memberLayout.data.isThemeInDarkMode === true) {
                globalDataService.enableThemeDarkMode()
            } else {
                globalDataService.disableThemeDarkMode()
            }

            memberLayout.data.theme = 'com.finmars.default-theme' // for debug

            if (memberLayout.data.theme) {
                globalDataService.setTheme(memberLayout.data.theme);

                let themePath = memberLayout.data.theme.split('.').join('/')

                let itemPath = `.system/ui/themes/${themePath}/theme.css`

                explorerService.viewFile(itemPath).then((blob) => {

                    const reader = new FileReader();

                    reader.addEventListener("loadend", function (e) {
                        const content = reader.result;

                        var styleElement = document.createElement('style');
                        styleElement.textContent = content;

                        document.head.appendChild(styleElement);

                    });

                    reader.readAsText(blob);

                }).catch((error) => {

                    console.error("Could not fetch theme", error);

                    globalDataService.setTheme('base-theme')

                })
            } else {
                globalDataService.setTheme('base-theme')
            }


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

    const init = function () {

        middlewareService.onToggleWarningsSideNav(function () {
            vm.showWarningSideNav = !vm.showWarningSideNav;

        })

        localStorageService.setGlobalDataService(globalDataService); // TODO inject localStorageService into angular dependencies

        vm.currentMasterUser = globalDataService.getMasterUser();
        const promises = [];

        if (!vm.currentMasterUser) { // if currentMasterUser was not set previously, load it
            promises.push(getCurrentMasterUser());
        }

        promises.push(getMemberData());

        Promise.all(promises).then(resData => {

            console.log('PortalController.resData', resData);

            vm.readyStatus = true;

            $scope.$emit('initialLoadComplete'); // for turning off initial loader

            initAlertSideNavListeners();
            $scope.$apply();

        }).catch(function (error) {

            error.___custom_message = "PortalController init()"
            console.log('PortalController.error', error);
            console.error(error);

            // window.open(redirectionService.getUrlByState('app.profile'), '_self')

        })

    };

    init();

};