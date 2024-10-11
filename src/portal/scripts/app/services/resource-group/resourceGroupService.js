(function () {
  var resourceGroupRepository = require('../../repositories/resource-group/resourceGroupRepository');
  var getList =  function (options) {
    return  resourceGroupRepository.getList(options);
  };
  module.exports = {
    getList: getList
  }
}());