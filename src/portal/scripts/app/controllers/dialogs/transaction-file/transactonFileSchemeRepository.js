/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {
  "use strict";

  var cookieService = require("../../../../../core/services/cookieService");
  var xhrService = require("../../../../../core/services/xhrService");
  var configureRepositoryUrlService = require("../../services/configureRepositoryUrlService");
  var baseUrlService = require("../../services/baseUrlService");

  var baseUrl = baseUrlService.resolve();

  var getTypes = function (options) {
    return xhrService.fetch(
      configureRepositoryUrlService.configureUrl(
        baseUrl + "pricing/currency-pricing-scheme-type/",
        options
      ),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
  };

  var getList = function (options) {
    return xhrService.fetch(
      configureRepositoryUrlService.configureUrl(
        baseUrl + "pricing/currency-pricing-scheme/",
        options
      ),
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
  };

  var getByKey = function (id) {
    return xhrService.fetch(
      baseUrl + "pricing/currency-pricing-scheme/" + id + "/",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
  };

  var create = function (item) {
    return xhrService.fetch(baseUrl + "pricing/currency-pricing-scheme/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": cookieService.getCookie("csrftoken"),
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(item),
    });
  };

  var update = function (id, item) {
    return xhrService.fetch(
      baseUrl + "pricing/currency-pricing-scheme/" + id + "/",
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-CSRFToken": cookieService.getCookie("csrftoken"),
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );
  };

  var deleteByKey = function (id) {
    return xhrService
      .fetch(baseUrl + "pricing/currency-pricing-scheme/" + id + "/", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": cookieService.getCookie("csrftoken"),
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
      .then(function (data) {
        return new Promise(function (resolve, reject) {
          resolve({ status: "deleted" });
        });
        //return data.json();
      });
  };

  module.exports = {
    getTypes: getTypes,

    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey,
  };
})();
