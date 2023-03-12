/**
 * Created by mevstratov on 25.05.2021.
 */

'use strict';

export default function (errorService) {

	var axService = require('../../../../core/services/axService')

	const fetch = function (url, params, options) {

		let requestId;
		const notifyError = options && options.hasOwnProperty('notifyError') ? options.notifyError : true;

		if (window.developerConsoleService) {
			requestId = window.developerConsoleService.pushRequest({
				url: url,
				params: params
			})
		}

		params.url = url

		return axService.ax.request(params)
			.then(function (response) {

				return new Promise(function (resolve, reject) {

					if (window.developerConsoleService) {
						window.developerConsoleService.resolveRequest(requestId, response.clone())
					}

					if (response.status === 204) { // No content
						resolve(response);
					}
					else if (response.status >= 400 && response.status < 500) {

						response.json().then(function (data) {

							const error = {
								status: response.status,
								statusText: response.statusText,
								message: data
							};

							reject(error)

						})

					} else if (response.status >= 500 && response.status < 600) {

						const error = {
							status: response.status,
							statusText: response.statusText,
							message: response.statusText
						};

						reject(error)

					} else {

						if (params.method !== "DELETE") {
							resolve(response.data);
						}
						else {
							resolve(response);
						}



					}

				})
			})
			.catch(function (reason) {

				console.log('xhrService.reason', reason);

				if (window.developerConsoleService) {
					window.developerConsoleService.rejectRequest(requestId, reason)
				}

				if (notifyError !== false) {
					errorService.notifyError(reason);
				}

				console.log('XHR Service catch error', reason);

				throw reason;

			})

	};

	return {
		fetch: fetch
	}

};