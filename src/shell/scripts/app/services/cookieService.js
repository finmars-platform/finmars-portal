'use strict';

export default function () {

	const getCookie = function (name) {
		let cookieValue = null;
		if (document.cookie && document.cookie != '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	};

	const setCookie = function (name, value, options) {
		options = options || {};

		let expires = options.expires;

		if (typeof expires == "number" && expires) {
			let d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}

		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);

		let updatedCookie = name + "=" + value;

		for (const propName in options) {
			updatedCookie += "; " + propName;
			const propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}

		document.cookie = updatedCookie;
	};

	const deleteCookie = function (name) {
		setCookie(name, "", {expires: -1})
	};

	return {
		getCookie: getCookie,
		setCookie: setCookie,
		deleteCookie: deleteCookie
	}
	/*module.exports = {
		getCookie: getCookie,
		setCookie: setCookie,
		deleteCookie: deleteCookie
	}*/

};