(function () {

	'use strict';

	var logService = require('../../../../core/services/logService');

	module.exports = function () {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {

				var dragger = $(elem).find('md-toolbar');

				var parent = $(elem);

				var posY = 0, posX = 0;
				var elemLeft = 0, elemTop = 0;
				var initMouseX = 0, initMouseY = 0;

				function mousemove(e) {

					// posX = document.all ? window.event.clientX : e.pageX;
					// posY = document.all ? window.event.clientY : e.pageY;
					posX = e.pageX;
					posY = e.pageY;
					//console.log('posX', posX);
					//console.log('elemLeft', elemLeft);
					//console.log(posX - elemLeft);
					//console.log(posY - elemTop);
					//console.log(initMouseX, initMouseY, posX, posY, elemLeft, elemTop);

					// parent[0].style.left = (posX - elemLeft + 8) + 'px';
					// parent[0].style.top = (posY - elemTop - 8 - 150) + 'px';
					parent[0].style.left = (posX + elemLeft - initMouseX) + 'px';
					parent[0].style.top = (posY + elemTop - initMouseY) + 'px';
					// parent[0].style.left = ()

				}

				dragger.bind('mousedown', function (e) {
					e.preventDefault();
					e.stopPropagation();
					//console.log(parent);
					initMouseX = e.clientX;
					initMouseY = e.clientY;
					// if (elemLeft !== 0) {
						elemLeft = parent[0].offsetLeft;
						elemTop = parent[0].offsetTop;
						// elemLeft = posX - parent[0].offsetLeft;
						// elemTop = posY - parent[0].offsetTop;
					// }
					//console.log(elemLeft, elemTop);
					$(window).bind('mousemove', mousemove);

					$(window).bind('mouseup', function (e) {
						//console.log('unbind');
						$(window).unbind('mousemove');
					});
					return false;
				})
			}
		}
	}

}());