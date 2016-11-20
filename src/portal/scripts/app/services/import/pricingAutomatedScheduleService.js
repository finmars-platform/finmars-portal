/**
 * Created by szhitenev on 25.08.2016.
 */
(function(){

    'use strict';

    var pricingAutomatedScheduleRepository = require('../../repositories/import/pricingAutomatedScheduleRepository');

    var updateSchedule = function(schedule){
        return pricingAutomatedScheduleRepository.updateSchedule(schedule);
    };

    var getSchedule = function(){
        return pricingAutomatedScheduleRepository.getSchedule();
    };

    module.exports = {
        getSchedule: getSchedule,
        updateSchedule: updateSchedule
    }

}());