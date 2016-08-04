(function() {

	var tableReady = false;

	var checkTableCondition = function (condition) {
		return new Promise(function (resolve) {
			if (tableReady) {
				resolve(tableReady);
			}
		});
	};

	module.exports = {
		checkTableCondition: checkTableCondition
	};
}());