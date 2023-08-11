/**
 * Created by szhitenev on 11.10.2019.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            scope: {
                diameter: '@',
                frontLineColor: '@',
                backLineColor: '@'
            },
            templateUrl: 'views/directives/progress-circular-view.html',
            link: function (scope, elem) {

                scope.color = '#F05A22';


                const brightColors = [
                    '#FF5733', '#FFC300', '#36D7B7', '#3399FF', '#FF33FF', // Original colors
                    '#FF6666', '#FF9900', '#66FF66', '#33CCFF', '#FF66CC', // Additional colors
                    '#FF9966', '#FFCC00', '#00FF00', '#66CCFF', '#FF66FF',
                    '#FFCCCC', '#FFFF00', '#00FF99', '#99CCFF', '#CC33FF',
                    '#FFCC99', '#FFFF33', '#33FF33', '#66CCCC', '#CC66FF',
                    '#FF9999', '#FFFF66', '#66FFCC', '#99A8FF', '#FF99FF',
                    '#FF0000', '#FFCC66', // More colors
                    '#FF8533', '#FFB600', '#66FF33', '#3399CC', '#FF00FF',
                    '#FF8080', '#FFCC33', '#33FF66', '#66A3FF', '#FF00CC',
                    '#FFA07A', '#FFD700', '#00FF7F', '#6699FF', '#FF0099',
                    '#FFA500', '#FFCC7F', '#00FFBF', '#99BBFF', '#FF0099',
                    '#FFB347', '#FFDD00', '#7FFF00', '#3399FF', '#FF1493',
                    '#FF6347', '#FFE303', '#32CD32', '#66CCFF', '#C71585',
                    '#FF4500', '#FFD700', // Even more colors
                    '#A020F0', '#FF69B4', '#9932CC', '#DA70D6', '#FFB6C1',
                    '#800080', '#FF00FF', '#FF1493', '#FF69B4', '#C71585',
                    '#9400D3', '#D8BFD8', '#FFA07A', '#FF6EB4', '#FF82AB',
                    '#800080', '#EE82EE', '#FF66CC', '#FF81C0', '#FF00FF',
                    '#800080', '#DA70D6', '#FF1493', '#FF69B4', '#C71585',
                    '#9932CC', '#BA55D3', '#9370DB', '#8A2BE2', '#9400D3',
                    '#9932CC', '#8B008B', '#800080', '#FF00FF', '#C71585',
                    '#FFA500', '#FFD700', '#00FF7F', '#6699FF', '#FF0099',
                    '#FF8533', '#FFB600', '#66FF33', '#3399CC', '#FF00FF',
                    '#FF8080', '#FFCC33', '#33FF66', '#66A3FF', '#FF00CC',
                    '#FFA07A', '#FFD700', '#00FF7F', '#6699FF', '#FF0099',
                    '#FFA500', '#FFCC7F', '#00FFBF', '#99BBFF', '#FF0099',
                    '#FFB347', '#FFDD00', '#7FFF00', '#3399FF', '#FF1493',
                    '#FF6347', '#FFE303', '#32CD32', '#66CCFF', '#C71585',
                    '#FF4500', '#FFD700', // More and more colors
                    '#A020F0', '#FF69B4', '#9932CC', '#DA70D6', '#FFB6C1',
                    '#800080', '#FF00FF', '#FF1493', '#FF69B4', '#C71585',
                    '#9400D3', '#D8BFD8', '#FFA07A', '#FF6EB4', '#FF82AB',
                    '#800080', '#EE82EE', '#FF66CC', '#FF81C0', '#FF00FF',
                    '#800080', '#DA70D6', '#FF1493', '#FF69B4', '#C71585',
                    '#9932CC', '#BA55D3', '#9370DB', '#8A2BE2', '#9400D3',
                    '#9932CC', '#8B008B', '#800080', '#FF00FF', '#C71585',
                    '#FFA500', '#FFD700', '#00FF7F', '#6699FF', '#FF0099',
                    '#FF8533', '#FFB600', '#66FF33', '#3399CC', '#FF00FF',
                    '#FF8080', '#FFCC33', '#33FF66', '#66A3FF', '#FF00CC'
                ];

                function getRandomBrightColor() {
                    const randomIndex = Math.floor(Math.random() * brightColors.length);
                    return brightColors[randomIndex];
                }

                if (!scope.frontLineColor) {
                    scope.frontLineColor = 'default'
                }

                if (!scope.backLineColor) {
                    scope.backLineColor = 'default';
                }

                if (!scope.diameter) {
                    scope.diameter = 10
                }

                scope.init = function () {

                    scope.progressInterval = setInterval(function () {
                        scope.color = getRandomBrightColor();
                        scope.$apply()
                    }, 2000)

                }

                scope.init();

                scope.$on('destroy', function () {

                    clearInterval(scope.progressInterval);

                })

            }
        }
    }


}());