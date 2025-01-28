/**
 * Created by szhitenev on 06.09.2023.
 */
(function () {

  var portalRepository = require('../repositories/portalRepository');

  var getNavigationRoutingList = function (options) {
    return portalRepository.getNavigationRoutingList(options);
  };

  module.exports = {
    getNavigationRoutingList: getNavigationRoutingList,
  }
}());