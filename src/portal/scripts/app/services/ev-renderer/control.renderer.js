(function () {

	/**
	 *
	 * @param evDataService {Object} - entityViewerDataService
	 * @param obj {Object} - data of row from flat list
	 * @param prevObj {Object} - data of previous row from flat list
	 * @param contentWidth {number} - sum of widths of columns
	 * @returns {string}
	 */
    var render = function (evDataService, obj, prevObj, contentWidth) {

        var selectedGroups = evDataService.getSelectedGroups();

        // var requestParameters = evDataService.getRequestParameters(obj.___parentId);
        // var pagination = requestParameters.pagination;
        // var rowHeight = evDataService.getRowHeight();
        //
        // var total_pages = Math.ceil(pagination.count / pagination.page_size);
        // var page = pagination.page;

        var rowHeight = evDataService.getRowHeight();
        var canLoadMore = false;


        console.log('control.render.selectedGroups', selectedGroups);


        if (selectedGroups && selectedGroups.length) {
            selectedGroups.forEach(function (selectedGroup) {

                var requestParameters = evDataService.getRequestParameters(selectedGroup.___id);
                var pagination = requestParameters.pagination;


                var total_pages = Math.ceil(pagination.count / pagination.page_size);
                var page = pagination.page;

                if (page < total_pages) {
                    canLoadMore = true;
                }


            })
        } else {
            var requestParameters = evDataService.getRequestParameters(obj.___parentId);
            var pagination = requestParameters.pagination;

            console.log('control.render.selectedGroups', obj);
            console.log('control.render.selectedGroups', requestParameters);


            var total_pages = Math.ceil(pagination.count / pagination.page_size);
            var page = pagination.page;

            if (page < total_pages) {
                canLoadMore = true;
            }

        }

        console.log('control.render.selectedGroups', canLoadMore);

        // console.log('requestParameters', requestParameters);
        // console.log('total_pages', total_pages);
        // console.log('page', page);

        // var classes = 'g-row g-control-row';

        var offsetTop = obj.___flat_list_offset_top_index * rowHeight;

        //# region Content of a .g-row.g-control-row

		var flatList = evDataService.getFlatList();
		var parentGroup = evDataService.getGroup(obj.___parentId);

		var visibleItemsCount = flatList.length - 1; // "-1" because control at the end does not count
		// var resultText = '(' + visibleItemsCount + ' of ' + parentGroup.___items_count + ' / ' + itemsTotal + ' total)';
		// var resultText = `(${ visibleItemsCount } of ${ parentGroup.___items_count })`;

		// result = result + '<span class="display-inline-block m-0" style="padding-top: 6px; padding-left: 15px; color: #868686;">' + resultText + '</span>';
		var content = `<div class="control-content">
                                <span class="display-inline-block m-0"
                                      style="padding-left: 15px; color: #868686;">
                                    
                                    (${ visibleItemsCount } of ${ parentGroup.___items_count })
                                    
                                </span>`;

        if (canLoadMore) {

			content = content +
                `<div class="control-loader-holder
                             progress-holder
                             progress-size-20
                             display-none
                             controlLoader">

                    <img src="portal/content/img/sphere.png" alt="">
                
                    <div class="progress
                                progress-circular
                                front-line-default
                                back-line-default"

                         style="border-top-color: #F05A22; border-right-color: #F05A22"
                    ></div>
                
                </div>
                
                <button class="control-button load-more controlBtn"
                        data-type="control"
                        data-ev-control-action="load-more"
                        data-object-id="${obj.___id}"
                        data-parent-group-hash-id="${obj.___parentId}">
                           Load more
                </button>

                <button class="control-button load-all controlBtn"
                        data-type="control"
                        data-ev-control-action="load-all"
                        data-object-id="${obj.___id}"
                        data-parent-group-hash-id="${obj.___parentId}">
                           Load all
                </button>`;

			if (obj.___errorMessage ) {
				content = content + `<div class="control-error-message">${obj.___errorMessage}</div>`
			}

        }

		content = content + '</div>'; // closing <div class="control-content">
        //# endregion

        return `<div class="g-row g-control-row gControlRow"
                     style="${ 'top:' + offsetTop + 'px' }"
                     data-type="control"
                     data-object-id="${obj.___id}"
                     data-parent-group-hash-id="${obj.___parentId}">
                        
                        <div class="g-row-selection
                                    border-right-transparent
                                    border-bottom-transparent"></div>
                        
                        <div class="g-row-settings
                                    g-row-settings-table
                                    border-right-transparent
                                    border-bottom-transparent
                                    gRowSettings"></div>
                        
                        <div class="control-placeholder"
                             style="${ 'width: ' + contentWidth + 'px;' }"></div>
                   
                    ${content}

            </div>`;

    };

    module.exports = {
        render: render
    }


}());