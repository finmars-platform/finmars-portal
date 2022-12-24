/**
 * Created by mevstratov on 27.05.2021
 */

'use strict';

const localStorageService = require('../../../../shell/scripts/app/services/localStorageService'); // TODO inject localStorageService into angular dependencies

export default function ($scope, $state, authorizerService, usersService, globalDataService, finmarsWidgetsService) {

    let vm = this;
    const PROJECT_ENV = '__PROJECT_ENV__'; // changed when building project by minAllScripts()

    vm.readyStatus = false;

    const getMember = function () {

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

    }

    const getCurrentMasterUser = function () {

        return new Promise((resolve, reject) => {

            authorizerService.getCurrentMasterUser().then(masterUser => {

                // websocketService.send({action: "update_user_state", data: {master_user: masterUser}});

                resolve();

            }).catch(error => reject(error));

        });

    };

    const init = function () {

        localStorageService.setGlobalDataService(globalDataService); // TODO inject localStorageService into angular dependencies

        vm.currentMasterUser = globalDataService.getMasterUser();
        const promises = [];

        if (!vm.currentMasterUser) { // if currentMasterUser was not set previously, load it
            promises.push(getCurrentMasterUser());
        }

        promises.push(getMember());

        promises.push(finmarsWidgetsService.getFinmarsWidgetsClass());

        Promise.allSettled(promises).then(resList => {

            console.log('PortalController.resData', resList);

            /*if (PROJECT_ENV !== 'local') {
                window.FinmarsWidgets = resData.pop();
            }*/
            let readyStatus = true;

            const fWidgetsRes = resList.pop();

            if (fWidgetsRes.status === 'fulfilled') {
                window.FinmarsWidgets = fWidgetsRes.value;
            }

            resList.forEach(res => {

                if (res.status === 'fulfilled') return;

                let error = res.reason;
                error.___custom_message = "PortalController init()"
                console.log('PortalController.error', error);
                console.error(error);

                readyStatus = false;

            })

            vm.readyStatus = readyStatus;
            $scope.$apply();

        })/*.catch(function (error) {

            error.___custom_message = "PortalController init()"
            console.log('PortalController.error', error);
            console.error(error);

			// window.open(redirectionService.getUrl('app.profile'), '_self')

        })*/

    };

    init();

};