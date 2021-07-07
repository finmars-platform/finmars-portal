(function () {


    var render = function (evDataService, obj, prevObj, columnsWidthSum) {

        var selectedGroups = evDataService.getSelectedGroups();

        // var requestParameters = evDataService.getRequestParameters(obj.___parentId);
        // var pagination = requestParameters.pagination;
        // var rowHeight = evDataService.getRowHeight();
        //
        // var total_pages = Math.ceil(pagination.count / pagination.page_size);
        // var page = pagination.page;

        var rowHeight = evDataService.getRowHeight();
        var canLoadMore = false;


        selectedGroups.forEach(function (selectedGroup) {

            var requestParameters = evDataService.getRequestParameters(selectedGroup.___id);
            var pagination = requestParameters.pagination;


            var total_pages = Math.ceil(pagination.count / pagination.page_size);
            var page = pagination.page;

            if (page < total_pages) {
                canLoadMore = true;
            }


        })


        // console.log('requestParameters', requestParameters);
        // console.log('total_pages', total_pages);
        // console.log('page', page);

        var classList = ['g-row'];

        var classes = classList.join(' ');

        var rowSelection = '<div class="g-row-selection"></div>';

        var offsetTop = obj.___flat_list_offset_top_index * rowHeight;

        var result = '<div class="' + classes + '" style="top: '+ offsetTop + 'px"  data-type="control" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';

        result = result + rowSelection;

		result = result + '<div class="control-content" style="width: ' + columnsWidthSum + 'px;">';

		var flatList = evDataService.getFlatList();
		var parentGroup = evDataService.getGroup(obj.___parentId);

		var visibleItemsCount = flatList.length - 1; // "-1" because control at the end does not count
		// var itemsTotal = '';
		// var resultText = '(' + visibleItemsCount + ' of ' + parentGroup.___items_count + ' / ' + itemsTotal + ' total)';
		var resultText = '(' + visibleItemsCount + ' of ' + parentGroup.___items_count + ')';

		result = result + '<span class="display-inline-block m-0" style="padding-top: 6px; padding-left: 15px; color: #868686;">' + resultText + '</span>';

        if (canLoadMore) {

            result = result + '<button class="control-button load-more" data-type="control" data-ev-control-action="load-more" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" >Load more</button>';
            result = result + '<button class="control-button load-all" data-type="control" data-ev-control-action="load-all" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" > Load all</button>';

            if (obj.___errorMessage ) {
                result = result + '<div class="control-error-message">' + obj.___errorMessage + '</div>'
            }

        } /* else {

            if (!prevObj || obj.___parentId === prevObj.___id) {

                result = result + '<p class="m-0" style="padding-top: 7px; padding-left: 58px; color: #868686;">No items subject to the Filters</p>';

            } else {

                result = result + '<p class="m-0" style="padding-top: 7px; padding-left: 58px; color: #868686;">Data fully loaded</p>';

            }

        } */

        result = result + '</div></div>'; // closing div.g-row and div.control-content

        return result;

    };

    module.exports = {
        render: render
    }


}());