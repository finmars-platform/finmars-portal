/**
 * Created by mevstratov on 12.09.2022.
 */

'use strict';

export default function () {

	const vm = this;

	vm.readyStatus = {
		content: true
	};

	vm.entityType = 'portfolio-bundle'; // deprecated
	vm.contentType = 'portfolios.portfoliobundles';

};