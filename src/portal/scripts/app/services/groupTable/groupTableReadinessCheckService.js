(function() {

	var checkTableCondition = function () {
		var tableReady = false;
		return new Promise(function (resolve) {
			var tableReady = true;
			resolve(tableReady);
		});
	};

	module.exports = {
		checkTableCondition: checkTableCondition
	};
}());