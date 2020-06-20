(function () {

    var tooltipRepository = require('../repositories/tooltipsRepository');

    var getTooltipsList = function (options) {
        return tooltipRepository.getTooltipsList(options);
    }

    var updateTooltipsList = function (tooltipsList) {
        return tooltipRepository.updateTooltipsList(tooltipsList);
    }

    module.exports = {
        getTooltipsList: getTooltipsList,
        updateTooltipsList: updateTooltipsList
    }

}());