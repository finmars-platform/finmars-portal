/**
 * Created by szhitenev on 08.06.2022.
 */
(function () {

    var toastNotificationService = require('../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, authorizerService, globalDataService, commonDialogsService, profileAuthorizerService, cookieService) {

        let vm = this;

        vm.newToken = {};
        vm.currentToken = cookieService.getCookie('access_token')

        vm.requestReport = {
            access_token: vm.currentToken,
            status: 'init',
            body: {
                "account_mode": 1,
                "accounts": [],
                "accounts_cash": [],
                "accounts_position": [],
                "allocation_detailing": true,
                "approach_multiplier": 0.5,
                "calculationGroup": "portfolio",
                "complex_transaction_statuses_filter": "booked",
                "cost_method": 1,
                "custom_fields_to_calculate": "",
                "date_field": "transaction_date",
                "pl_first_date": null,
                "pl_include_zero": false,
                "portfolio_mode": 1,
                "portfolios": [],
                "pricing_policy": 1,
                "recieved_at": 1652459586146,
                "report_currency": 2,
                "report_date": "2022-06-07",
                "report_type": 1,
                "show_balance_exposure_details": false,
                "show_transaction_details": false,
                "strategies1": [],
                "strategies2": [],
                "strategies3": [],
                "strategy1_mode": 0,
                "strategy2_mode": 0,
                "strategy3_mode": 0,
                "table_font_size": "small",
                "task_id": null,
                "task_status": "SUCCESS",
                "transaction_classes": [],

            },
            fetchRequestText: '',
            curlRequestText: ''
        }

        vm.reportRequested = false;

        vm.readyStatus = {};


        // DEPRECATED
        vm.getTokens = function () {

            authorizerService.authTokenManagerGetList().then(function (data) {

                vm.tokens = data.results.map(function (token) {



                    if (token.current_master_user_object) {
                        token.api_url = window.location.origin + '/' + token.current_master_user_object.base_api_url + '/api/v1'
                    } else {
                        token.api_url = '';
                    }

                    if (token.keycloak_access_token === vm.currentToken) {
                        vm.requestReport.tokenItem = token;
                    }

                    token.authorizer_url = window.location.origin + '/authorizer/token-refresh/'

                    return token;

                });

                console.log('vm.tokens ', vm.tokens );


                $scope.$apply();

            })

        }

        vm.getMasterUsersList = function () {

            vm.readyStatus.masterUsers = false;

            profileAuthorizerService.getMasterUsersList().then(function (data) {
                vm.masterUsers = data.results;
                vm.readyStatus.masterUsers = true;
                $scope.$apply();
            });

        };

        vm.logoutDevices = function ($event) {


            var promises = []

            vm.tokens.forEach(function (token) {

                if (vm.currentToken !== token.keycloak_access_token) {

                    authorizerService.authTokenManagerDeleteToken(token.id);

                }
            })

            Promise.allSettled(promises).then(function () {

                vm.getTokens();
            })

        }

        vm.deleteAuthToken = function ($event, item) {

            authorizerService.authTokenManagerDeleteToken(item.id).then(function () {

                vm.getTokens();

            })

        }

        vm.createAuthToken = function ($event) {

            authorizerService.authTokenManagerCreateToken(vm.newToken).then(function () {

                vm.newToken = {}

                vm.getTokens();

            })

        }

        vm.copyToken = function (content) {


            var listener = function (e) {

                e.clipboardData.setData('text/plain', content);

                e.preventDefault();
            };

            document.addEventListener('copy', listener, false);

            document.execCommand("copy");

            document.removeEventListener('copy', listener, false);

            toastNotificationService.info("Copied")


        }

        vm.matchTokenItem = function (){

             vm.tokens.forEach(function (token) {

                if (token.key === vm.requestReport.token) {
                    vm.requestReport.tokenItem = token;
                }

            });

        }

        vm.executeRequestReport = function ($event) {

            let url = vm.requestReport.tokenItem.api_url + '/reports/balance-report/'
            let token = 'Token ' + vm.requestReport.access_token

            let body = JSON.stringify(vm.requestReport.body, null, 4)
            let bodyStr = JSON.stringify(vm.requestReport.body)

            vm.requestReport.fetchRequestText = `
fetch("${url}", {
    method: 'POST',
    headers: {
        "Authorization": "${token}",
        "Accept": "application/json",
        "Content-type": "application/json"
    },
    body: "${body}"
}).then(function(data){return data.json()})`


            vm.requestReport.curlRequestText = `
curl -X POST ${url}  \
   -H 'Content-Type: application/json' \
   -H 'Accept: application/json' \
   -H 'Authorization: ${token}' \
   -d '${bodyStr}'`

            fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": token,
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: body
            }).then(function(data){return data.json()}).then(function (data){

                vm.requestReport.responseText = JSON.stringify(data, null, 4);

                vm.requestReport.status = 'requested'

                $scope.$apply()

            }).catch(function (error) {
                vm.requestReport.responseText = error;
                vm.requestReport.status = 'requested'
            })





        }

        vm.init = function () {

            vm.getTokens()
            vm.getMasterUsersList();

            vm.member = globalDataService.getMember();

        };

        vm.init();

    }

}());