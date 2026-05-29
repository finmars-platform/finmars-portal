import resourceGroupRepository from '../../repositories/resource-group/resourceGroupRepository';
var getList =  function (options) {
  return  resourceGroupRepository.getList(options);
};

export default {
  getList: getList
};