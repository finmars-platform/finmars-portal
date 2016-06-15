/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var property = function(name, value, styles){
        var css = styles || 'color: #81C784';
        console.log('%c{"property": "' + name +'", "value": "' + value + '"}', css);
    };

    var collection = function(name, value, styles){
        var css = styles || 'color: #4FC3F7';
        console.log('%c{"collection": "' + name +'", "data":', css, value , '}');
    };

    var event = function(name, event, styles){
        var css = styles || 'color: #EF5350';
        console.log('%c{"event": "' + name +'", "data": "' + event + '"}', css);
    };

    var controller = function(name, status, styles) {
        var css = styles || 'color: #E0E0E0';
        console.log('%c{"controller": "' + name +'", "status": "' + status + '"}', css);
    };

    var component = function(name, status, styles) {
        var css = styles || 'color: #B39DDB';
        console.log('%c{"component": "' + name +'", "status": "' + status + '"}', css);
    };

    var service = function(name, status, styles) {
        var css = styles || 'color: #EC407A';
        console.log('%c{"service": "' + name +'", "status": "' + status + '"}', css);
    };

    module.exports = {
        property: property,
        collection: collection,
        event: event,
        controller: controller,
        component: component,
        service: service
    }


}());