(function () {


    var render = function (obj, evDataService) {

        var requestParameters = evDataService.getRequestParameters(obj.___parentId);
        var pagination = requestParameters.pagination;

        var total_pages = Math.ceil(pagination.count / pagination.items_per_page);
        var page = pagination.page;

        // console.log('requestParameters', requestParameters);
        // console.log('total_pages', total_pages);
        // console.log('page', page);

        var classList = ['g-row'];

        var classes = classList.join(' ');

        var rowSelection = '<div class="g-row-selection"></div>';

        var result = '<div class="' + classes + '" data-type="control" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';

        result = result + rowSelection;

        if (page < total_pages) {

            result = result + '<button class="control-button load-more" data-type="control" data-ev-control-action="load-more" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" >Load more</button>';
            result = result + '<button class="control-button load-all" data-type="control" data-ev-control-action="load-all" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" > Load all</button>';

        } else {

            result = result + '<p class="m-0" style="padding-top: 2px; padding-left: 15px;">Data is fetched</p>'
        }

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());