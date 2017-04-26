$(document).on("enablePost", function (event, fieldsIncluded) {
    $(document).bind('DOMNodeInserted', function (evt) {
        if ($(evt.target).hasClass('view-toolbar grid-actions')) {
            var classes = 'btn btn-primary';
            var icon = DMS.Helpers.CreateFontAwesomeIcon('fa-thumb-tack');
            //var confirmation = DMS.Helpers.CreateDeleteConfirmation();
            var button = DMS.Helpers.CreateButton('button', classes, '', ' POST', icon);

            var recordArr = [];

            button.click(function () {
                var that = $(this);
                var html = that.html();

                recordArr = GetModelForSelectedRecords(fieldsIncluded);
                if (recordArr.length > 0) {
                    that.html('<i class="fa fa-spinner fa-spin"></i>&nbsp;PROCESSING..');
                    that.addClass('disabled');

                    var url = "/api/EditableGrid/UpdateRecords";
                    var json = JSON.stringify(recordArr);
                    var service = Service('PUT', url, json, DMS.Helpers.DefaultErrorHandler);

                    service.then(function () {
                        DMS.Helpers.RefreshEntityList();
                        DMS.Notification.Success('Valid records were posted!');
                    }).always(function () {
                        that.html(html);
                        that.removeClass('disabled');
                    });

                    return;
                }
                DMS.Notification.Error('Please select Open status record.');
            });

            $(evt.target).append(button);
        }
    });


    function GetModelForSelectedRecords(fields) {
        var result = [];

        var arr = { Id: null, Entity: null, Records: [] };
        // get configuration from adx layout config.
        var _layouts = $('.entitylist[data-view-layouts]').data("view-layouts");
        arr.Entity = _layouts[0].Configuration.EntityName;

        $('.entity-grid .view-grid table tbody tr').each(function () {
            var that = $(this);
            var isRowSelected = that.find('td:first').data('checked');
            var status = that.find('td[data-attribute="gsc_vehiclesalesreturnstatus"]').data('value');

            // row is approved
            if (isRowSelected == "true" && typeof status !== 'undefined') {

                if (status.Value != 100000000) return;

                arr.Id = that.data('id');
                var row = {
                    Attr: fields[0].key,
                    Value: fields[0].value,
                    Type: 'Microsoft.Xrm.Sdk.OptionSetValue'
                }
                arr.Records.push(row);

                result.push(arr);
            }
        });

        return result;
    }
});


$(document).ready(function () { 
  $(document).trigger("createFilter", [[["createdon", "Vehicle Sales Return Date"]]]);     
  $(document).trigger("enableBulkDelete");
  
   //Post Button
    var fields = [{ key: 'gsc_vehiclesalesreturnstatus', value: 100000001 }];
    $(document).trigger('enablePost', [fields]);
})