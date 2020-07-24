(function () {


    var render = function (obj, evDataService, prevObj) {

        var requestParameters = evDataService.getRequestParameters(obj.___parentId);
        var pagination = requestParameters.pagination;

        var total_pages = Math.ceil(pagination.count / pagination.page_size);
        var page = pagination.page;

        // console.log('requestParameters', requestParameters);
        // console.log('total_pages', total_pages);
        // console.log('page', page);

        console.log('obj', obj);

        var classList = ['g-row'];

        var classes = classList.join(' ');

        var rowSelection = '<div class="g-row-selection"></div>';

        var result = '<div class="' + classes + '" data-type="control" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';

        result = result + rowSelection;

        if (page < total_pages) {

            result = result + '<button class="control-button load-more" data-type="control" data-ev-control-action="load-more" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" >Load more</button>';
            result = result + '<button class="control-button load-all" data-type="control" data-ev-control-action="load-all" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '" > Load all</button>';

            if (obj.___errorMessage ) {
                result = result + '<div class="control-error-message">' + obj.___errorMessage + '</div>'
            }

        } else {

            if (!prevObj || obj.___parentId === prevObj.___id) {

                result = result + '<p class="m-0" style="padding-top: 2px; padding-left: 15px; color: #868686;">No items subject to the Filters</p>';

            } else {

                result = result + '<p class="m-0" style="padding-top: 2px; padding-left: 15px; color: #868686;">Data fully loaded</p>';

            }
        }

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());