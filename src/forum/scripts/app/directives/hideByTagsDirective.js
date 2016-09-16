(function() {
	'use strict';

	module.exports = function () {
		return {
			restrict: 'E',
			scope: {
				tags: '='
			},
			templateUrl: 'views/directives/hide-by-tags-directive-view.html',
			link: function (scope, elem, attr) {
				scope.hideByTags = function () {
					var threads = $('md-card[data-tag-id]');
					var hiddenThreads = $('md-card[data-tag-id].ng-hide');
					// if there are hidden threads
					if (hiddenThreads.length > 0) {
						hiddenThreads.each(function () {
							var hiddenThread = $(this);
							hiddenThread.removeClass('ng-hide');
						});
					}

					threads.each(function () {
						var thread = $(this);
						var threadsTag = thread.data('tag-id');
						scope.tagsToHide.map(function(tag) {
							if (parseInt(threadsTag) === tag && !thread.hasClass('ng-hide')) {
								thread.addClass('ng-hide');
							}
						});
					}); 
				}
			}
		}
	}
}());