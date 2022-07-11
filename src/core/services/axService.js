import axios from 'axios'
import baseUrlService from "../../shell/scripts/app/services/baseUrlService";
import cookieService from "./cookieService";

(function () {

    var cookieService = require('./cookieService');

    const authorizerUrl = baseUrlService.getAuthorizerUrl();


    const ax = axios.create({
        baseURL: '__API_HOST__',
        headers: {
            'Content-type': 'application/json'
        }
    })

    ax.interceptors.response.use(
        (response) => {
            return response
        },
        (err) => {

            // return other errors
            if (err.response.status !== 401) {
                return new Promise((resolve, reject) => {
                    reject(err)
                })
            }

            // error on login
            if (err.response.config.url === authorizerUrl + '/token-auth/') {
                return new Promise((resolve, reject) => {
                    reject(err)
                })
            }
            // error on refresh
            if (err.response.config.url === authorizerUrl + '/token-refresh/') {

                var pieces = window.location.href.split('#')
                window.location = pieces[0] + '#!/authentication'
                cookieService.deleteCookie('access_token')
                cookieService.deleteCookie('refresh_token')
                return new Promise((resolve, reject) => {
                    reject(err)
                })
            }
            // refresh
            return ax.post(authorizerUrl + '/token-refresh/', {refresh_token: cookieService.getCookie('refresh_token')}, {withCredentials: true}).then(
                response => {
                    const config = err.response.config
                    config.headers.Authorization = 'Token ' + response.data.access_token
                    cookieService.setCookie('access_token', response.data.access_token)
                    return ax(config)
                }
            )
        }
    )

    module.exports = {
        ax: ax
    }

}());