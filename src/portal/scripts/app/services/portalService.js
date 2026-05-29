import portalRepository from '../repositories/portalRepository';

var getNavigationRoutingList = function (options) {
  return portalRepository.getNavigationRoutingList(options);
};

export default {
  getNavigationRoutingList: getNavigationRoutingList,
};