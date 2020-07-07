(function () {

    var tooltipRepository = require('../repositories/tooltipsRepository');

    var getTooltipsList = function (options) {
        return tooltipRepository.getList(options);
    }

    var updateTooltipsList = function (tooltipsList) {
        return tooltipRepository.update(tooltipsList);
    }

    module.exports = {
        getTooltipsList: getTooltipsList,
        updateTooltipsList: updateTooltipsList
    }

}());