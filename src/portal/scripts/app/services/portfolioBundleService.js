/**
 * Created by mevstratov on 12.09.2022.
 */

'use strict';

import portfolioBundleRepository from "../repositories/portfolioBundleRepository";

const getList = function (options) {
	return portfolioBundleRepository.getList(options);
};

const getListLight = function (options) {
	return portfolioBundleRepository.getListLight(options);
};

const getByKey = function (id) {
	return portfolioBundleRepository.getByKey(id);
};

const create = function (bundle) {
	return portfolioBundleRepository.create(bundle);
};

const update = function (id, bundle) {
	return portfolioBundleRepository.update(id, bundle);
};

const deleteByKey = function (id) {
	return portfolioBundleRepository.deleteByKey(id);
};

const updateBulk = function (bundles) {
	return portfolioBundleRepository.updateBulk(bundles);
};

const deleteBulk = function(data){
	return portfolioBundleRepository.deleteBulk(data);
};

export default {

	getList: getList,
	getListLight: getListLight,
	getByKey: getByKey,
	create: create,
	update: update,
	deleteByKey: deleteByKey,

	updateBulk: updateBulk,
	deleteBulk: deleteBulk

};