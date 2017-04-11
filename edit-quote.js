$(document).ready(function () {
    //TEST Commit Tom, Jerome, Jek
    $('form fieldset').attr('disabled', true);
   
    //JGC_01192017 : Disabled Activate Button
    if ($('#gsc_paymentmode').val() == "100000001" && (($('#gsc_bankid').val() == null || $('#gsc_bankid').val() == "")
           || ($('#gsc_financingschemeid').val() == null || $('#gsc_financingschemeid').val() == "")
           || ($('#gsc_downpaymentamount').val() == "" || $('#gsc_downpaymentpercentage').val() == "") || ($('#gsc_netmonthlyamortization').html() == "" || $('#gsc_netmonthlyamortization').html() == "₱0.00"))) {
        $(".activate-quote-link").addClass("permanent-disabled disabled");
    }

    //Added by Ernest Sarmiento 02-06-2017
    var vehicleModel = $('#gsc_productid').val();
    var color1 = $('#gsc_vehiclecolorid1').val();
    var paymentMode = $('#gsc_paymentmode').val();

    if (vehicleModel == "" || color1 == "" || paymentMode == "") {
        $(".activate-quote-link").addClass("permanent-disabled disabled");
    }

    //Added by: JGC_12092016
    var Userposition = DMS.Settings.User.positionName;
    
    /*Start - Revised by Christell Ann Mataac - 3/15/17 */
    if (Userposition != 'System Administrator' && Userposition != 'Branch Administrator' && Userposition != 'Sales Executive' && Userposition != 'Sales Supervisor' && Userposition != 'Sales Lead' && Userposition != 'Sales Manager' && Userposition != 'MMPC System Admin' && Userposition != 'MMPC System Administrator') 
    {
        $(".nav.nav-tabs li:eq(3)").hide();
        $("#gsc_totalpremium").prop("readonly", true);
        $('#gsc_rate_label').closest('td').addClass("hidden");
        $('#gsc_cost_label').closest('td').addClass("hidden");
        $('#gsc_originaltotalpremium_label').closest('td').addClass("hidden");
    }
    /*End - Revised by Christell Ann Mataac - 3/15/17 */
    
    
    if (typeof (Page_ClientValidate) == 'function') {
    }

    $(".row.form-custom-actions > .col-sm-6.clearfix").removeClass('col-sm-6');
    $(".row.form-custom-actions > .clearfix").addClass('col-sm-12');

    //Hide Order Amortization CRM Subgrid
    $('#MonthlyAmortization').html('');
    //End

    function DisableTotalPremium() {
        if ($("#gsc_free").prop("checked")) {
            $("#gsc_totalpremium").prop("readonly", true);
        }
        else {
            if (Userposition == 'Sales Manager' || Userposition == 'System Administrator') {
                var originalPremium = $("#gsc_originaltotalpremium").val();
                if (originalPremium == "" || originalPremium == 0) {
                    $("#gsc_totalpremium").prop("readonly", true);
                } else {
                    $("#gsc_totalpremium").prop("readonly", false);
                }
            }
        }
    }

    DisableTotalPremium();

    $("#gsc_free").change(function () {
        DisableTotalPremium();
    });

    $(document).trigger("initializeEditableGrid", AccessroiessGridInstance);
    $(document).trigger("initializeEditableGrid", CabChasisGridInstance);
    $(document).trigger("initializeEditableGrid", monthlyAmortizationGridInstance);

    DisableMonthlyAmortizationSave();
    function DisableMonthlyAmortizationSave() {
        var count = $('#monthlyamortization-editablegrid .htCheckboxRendererInput').length;
        if (count < 1)
            $('#btnSaveCopy').addClass('permanent-disabled');
    }

    //JGC_01182016
    $('#MonthlyAmortization .save').hide();
    $btnSaveCopy = DMS.Helpers.CreateButton('button', "btn-primary btn", '', ' SAVE', DMS.Helpers.CreateFontAwesomeIcon('fa-floppy-o'));
    $btnSaveCopy.attr('id', 'btnSaveCopy');
    $('#MonthlyAmortization .editable-grid-toolbar').find($('.delete')).before($btnSaveCopy);
    $btnSaveCopy.click(function (e) {
        e.preventDefault();
        var counter = 0;
        var count = $('#monthlyamortization-editablegrid .htCheckboxRendererInput').length;
        for (var x = 0 ; x < count ; x++) {
            if ($('#monthlyamortization-editablegrid .htCheckboxRendererInput')[x].checked == true)
                counter++;
        }
        if (counter > 1 || counter == 0) {
            DMS.Notification.Error("You can only select one financing term", true, 5000);
        }
        else {
            $('#MonthlyAmortization .save').click();
            location.reload();
        }
    });
    $('#MonthlyAmortization .htCheckboxRendererInput').click(function (e) {
        alert("test");
    });
    //END

    var isPrintQuote = false;
    var stateCode = $(".record-status").html();
    var recordOwnerId = $("#gsc_recordownerid").val();
    var allowDraftPrinting = DMS.Settings.Branch.allowDraftPrinting;
    var usertoActivate = DMS.Settings.Branch.usertoActivate;
    var managertoActivate = DMS.Settings.Branch.managertoActivate;
    var branchtoActivate = DMS.Settings.Branch.branchtoActivate;

    if (stateCode != "Draft") {
        checkDiscountSubgrid();
        checkChargesSubgrid();
        $('.editable-grid-toolbar').addClass("hidden");
    }

    function checkDiscountSubgrid() {
        if ($('table[data-name="tabbed-DISCOUNTS"]').is(":visible")) {
            $('table[data-name="tabbed-DISCOUNTS"]').parent().addClass("permanent-disabled");
            $('table[data-name="tabbed-DISCOUNTS"]').parent().attr("disabled", "disabled");
        }
        else {
            setTimeout(function () { checkDiscountSubgrid(); }, 50);
        }
    }

    function checkChargesSubgrid() {
        if ($('table[data-name="tabbed-CHARGES"]').is(":visible")) {
            $('table[data-name="tabbed-CHARGES"]').parent().addClass("permanent-disabled");
            $('table[data-name="tabbed-CHARGES"]').parent().attr("disabled", "disabled");
        }
        else {
            setTimeout(function () { checkChargesSubgrid(); }, 50);
        }
    }

    //Custom Create Order - Created By : Jerome Anthony Gerero, Created On : 10/26/2016
    $createOrderButton = DMS.Helpers.CreateAnchorButton("btn-primary btn", '', ' CREATE ORDER', DMS.Helpers.CreateFontAwesomeIcon('fa-file'));
    $createOrderButton.attr('data-toggle', 'modal');
    $createOrderButton.attr('data-target', '#createOrderModal');
    $createOrderButton.click(function (evt) {
        evt.preventDefault();
    });

    if (stateCode == 'Active') {
        DMS.Helpers.AppendButtonToToolbar($createOrderButton);
    }

    var createOrderModal = document.createElement('div');
    createOrderModal.innerHTML = '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-body" class="modal-body">Create Order</h4>' +
        '</div>' +
        '<div id="modal-body" class="modal-body">' +
        '<center><p>Use this quote to create an order.<br>' +
        '<i>Note: This will convert prospect record to customer.</i></p></center>' +
        //'<div id="closeRemarksDiv2"><textarea id="closeRemarks2" style="height: 100px;" rows="2" cols="40"></textarea></center></div>' +
        '<div id="closeOpportunityDiv2" style="padding-left: 210px"><input type="radio" name="closeOpportunity2" value="1"> Close Opportunity <br>' +
        '<input type="radio" name="closeOpportunity2" value="0" checked="checked"> Do not update Opportunity</div>' +
        '<div class="modal-footer">' +
        '<button id="createOrderBtn" type="submit" class="btn btn-dialog button">OK</button>' +
        '<button type="button" class="btn btn-dialog button" data-dismiss="modal"></i> CANCEL</button>' +
        '</div>' +
        '</div><!-- /.modal-content -->' +
        '</div><!-- /.modal-dialog -->';
    createOrderModal.setAttribute('id', 'createOrderModal');
    createOrderModal.setAttribute('class', 'modal fade');
    createOrderModal.setAttribute('tabindex', '-1');
    createOrderModal.setAttribute('role', 'dialog');
    $('.crmEntityFormView').append(createOrderModal);

    $('#createOrderBtn').click(function () {
        event.preventDefault();
        var closeOpportunityValue2 = $('input[name="closeOpportunity2"]:checked').val();
        var opportunityId = $('#opportunityid').val();
        var quoteId = DMS.Helpers.GetUrlQueryString('id');

        if (opportunityId == null) {
            opportunityId = '00000000-0000-0000-0000-000000000000';
        }

        var opportunityOdataUrl = "/_odata/quotation?$filter=opportunityid/Id eq (Guid'" + opportunityId + "')";

        var entityId = getQueryVariable("id");
        var workflowName = '';

        if (closeOpportunityValue2 == 1) {
            $.ajax({
                type: 'get',
                async: true,
                url: opportunityOdataUrl,
                success: function (data) {
                    console.log(data.value[0].quoteid);
                    for (var i = 0; i < data.value.length; i++) {
                        var obj = data.value[i];
                        if (quoteId != data.value[i].quoteid) {
                            for (var key in obj) {
                                var attrName = key;
                                var attrValue = obj[key];
                                if (attrName == 'statecode') {
                                    var quoteStateCode = attrValue;
                                    console.log(quoteStateCode.Name);
                                    if (quoteStateCode.Name == 'Draft' || quoteStateCode.Name == 'Active') {
                                        return alert('There are still active or draft quotes with the associated opportunity');
                                    }
                                    else if (quoteStateCode.Name == 'Won') {
                                        return alert('There are won quotes associated with the opportunity. The opportunity must be manually updated from In-Progress to Won.');
                                    }
                                }
                            }
                        }
                    }
                },
                error: function (xhr, textStatus, errorMessage) {
                    console.log(errorMessage);
                }
            });

            workflowName = 'Quote Won - Close Opportunity';
        }
        else {
            workflowName = 'Quote Won - Do Not Close Opportunity';
        }

        $.blockUI({ message: null, overlayCSS: { opacity: .3 } });

        var div = document.createElement("DIV");
        div.className = "view-loading message text-center";
        div.style.cssText = 'position: absolute; top: 50%; left: 50%;margin-right: -50%;display: block;';
        var span = document.createElement("SPAN");
        span.className = "fa fa-2x fa-spinner fa-spin";
        div.appendChild(span);
        $(".content-wrapper").append(div);

        $.ajax({
            type: "PUT",
            url: "/api/Service/RunWorkFlow/?workflowName=" + workflowName + "&entityId=" + entityId,
            success: function (response) {
                var url = document.location.protocol + '//' +
                    document.location.host + (document.location.host.indexOf("demo.adxstudio.com") != -1
                        ? document.location.pathname.split("/").slice(0, 3).join("/")
                        : "") + '/Cache.axd?Message=InvalidateAll&d=' +
                    (new Date()).valueOf();
                var req = new XMLHttpRequest();
                req.open('GET', url, false);
                req.send(null); //window.location.reload(true);
                setTimeout(RedirecttoSalesOrder(), 1000);
            }
        }).error(function (errormsg) { console.log(errormsg) });
});

    function RedirecttoSalesOrder() {
        var host = window.location.host;
        var protocol = window.location.protocol;
        var salesOrderUrl = protocol + "//" + host + "/transactions/salesorder";
        window.location.replace(salesOrderUrl);
    }

    //End Custom Create Order

    //Print Quote Button
    $btnPrint = DMS.Helpers.CreateAnchorButton("btn-primary btn", '', ' PRINT ', DMS.Helpers.CreateFontAwesomeIcon('fa-print'));
    $btnPrint.click(function (evt) {
        $("#UpdateButton").click();

        if (Page_ClientValidate("")) {
            var param1var = getQueryVariable("id");

            var protocol = window.location.protocol;
            var host = window.location.host;
            var url = protocol + "//" + host + "/report/?reportname={9528e482-50b5-e611-80e3-00155d010e2c}&reportid=" + param1var;
            window.open(url, 'blank', 'scrollbars=1,resizable=1,width=850,height=1000');
        }
    });
    if (stateCode == "Draft" && allowDraftPrinting == "False") {
        $btnPrint.addClass("permanent-disabled disabled");
    }
    DMS.Helpers.AppendButtonToToolbar($btnPrint);

    //control visible here
    //Revise Button
    if (stateCode === "Active" || stateCode == "Closed") {
        $btnRevise = DMS.Helpers.CreateAnchorButton("btn-primary btn", '', ' REVISE', DMS.Helpers.CreateFontAwesomeIcon('fa-pencil-square-o'));
        $btnRevise.click(function (evt) {
            $.blockUI({ message: null, overlayCSS: { opacity: .3 } });

            var div = document.createElement("DIV");
            div.className = "view-loading message text-center";
            div.style.cssText = 'position: absolute; top: 50%; left: 50%;margin-right: -50%;display: block;';
            var span = document.createElement("SPAN");
            span.className = "fa fa-2x fa-spinner fa-spin";
            div.appendChild(span);
            $(".content-wrapper").append(div);

            var entityId = getQueryVariable("id");
            var workflowName = "Sales Quote - Reactivation";

            $.ajax({
                type: "PUT",
                url: "/api/Service/RunWorkFlow/?workflowName=" + workflowName + "&entityId=" + entityId,
                success: function (response) {
                    var url = document.location.protocol + '//' +
                        document.location.host + (document.location.host.indexOf("demo.adxstudio.com") != -1
                            ? document.location.pathname.split("/").slice(0, 3).join("/")
                            : "") + '/Cache.axd?Message=InvalidateAll&d=' +
                        (new Date()).valueOf();
                    var req = new XMLHttpRequest();
                    req.open('GET', url, false);
                    req.send(null); window.location.reload(true);
                }
            }).error(function (errormsg) { console.log(errormsg) });
        });
        DMS.Helpers.AppendButtonToToolbar($btnRevise);
    }

    //Recalculate Button 
    $btnRecalculate = DMS.Helpers.CreateAnchorButton("btn-primary btn", '', ' RECALCULATE', DMS.Helpers.CreateFontAwesomeIcon('fa-refresh'));
    $btnRecalculate.attr("id", "btnRecalculate");
    $btnRecalculate.click(function (evt) {
        location.reload();
    });
    DMS.Helpers.AppendButtonToToolbar($btnRecalculate);

    //Close Quote - Created By : Jerome Anthony Gerero, Created On : 10/3/2016
    $closeButton = DMS.Helpers.CreateAnchorButton("btn-primary btn", '', ' CLOSE QUOTE', DMS.Helpers.CreateFontAwesomeIcon('fa-ban'));

    //Added by Ernest Sarmiento 02-21-2017
    if ($(".record-status").html() != "Draft") {
        $closeButton.addClass('hidden');
    }

    var closeModalBody = '<center><p>This Quote will be closed. Please provide a reason for closing : </p>' +
    '<div id="closeRemarksDiv"><textarea id="closeRemarks" style="height: 100px;" rows="2" cols="40"></textarea></center></div>' +
    '<div id="closeOpportunityDiv" style="padding-left: 160px"><input type="radio" name="closeOpportunity" value="1"> Close Opportunity <br>' +
    '<input type="radio" name="closeOpportunity" value="0" checked="checked"> Do not update Opportunity';

    var $closeConfirmation = DMS.Helpers.CreateModalConfirmation({ id: 'closeQuoteModal', headerTitle: 'Close Quote', Body: closeModalBody });

    $('.crmEntityFormView').append($closeConfirmation);

    $closeButton.click(function (evt) {
        $closeConfirmation.find('.confirmModal').on('click', function () {
            var closeOpportunityValue = $('input[name="closeOpportunity"]:checked').val();
            var closeRemarksValue = $('#closeRemarks').val();

            if (closeOpportunityValue == 1) $('#gsc_closeopportunity').prop('checked', true);
            else $('#gsc_closeopportunity').prop('checked', false);
            $('#gsc_closeremarks').val(closeRemarksValue);
            $('#gsc_closequote').prop('checked', true);

            $('#UpdateButton').click();
        });

        $closeConfirmation.modal('show');
    });

    DMS.Helpers.AppendButtonToToolbar($closeButton);
    //End Close Quote

    if (userId == recordOwnerId) {
        if (usertoActivate == "False") {
            $(".activate-quote-link").addClass("permanent-disabled disabled");
        }
    }

    if (managertoActivate == "False" && Userposition == 'Sales Manager')
        $(".activate-quote-link").addClass("permanent-disabled disabled");

    if (branchtoActivate == "False" && Userposition == 'Sales Lead')
        $(".activate-quote-link").addClass("permanent-disabled disabled");

    $('button.activate-quote-link').on('click', function (e) {
        if (Page_ClientValidate("")) {
        }
        else {
            e.preventDefault();
        }
    });

    //Added By: Jerome Anthony Gerero
    //Purpose : Disable 'Add' button on Cab Chassis Subgrid
    setTimeout(function () {
        var idQueryString = DMS.Helpers.GetUrlQueryString('id');
        var quoteCabChassisOdataQuery = '/_odata/gsc_sls_quotecabchassis?$filter=gsc_quoteid/Id%20eq%20(Guid%27' + idQueryString + '%27)';
        $.ajax({
            type: 'get',
            async: true,
            url: quoteCabChassisOdataQuery,
            success: function (data) {
                if (data.value.length >= 1) {
                    $('table[data-name="CABCHASSIS"] button.addnew').prop('disabled', true);
                }
                else if (data.value.length == 0) {
                    $('table[data-name="CABCHASSIS"] button.addnew').prop('disabled', false);
                }
            },
            error: function (xhr, textStatus, errorMessage) {
                console.log(errorMessage);
            }
        });
    }, 2000);

    function preventDefault(event) {
        event.preventDefault();
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }    

});

var classOdataUrl = "/_odata/gsc_class?$filter=gsc_classmaintenancepn eq 'Accessory'";
var classData = Service('GET', classOdataUrl, null, DMS.Helpers.DefaultErrorHandler);
var classId = "";
var accessoriesSelectData;

var productId = $("#gsc_productid").val();
accessoriesSelectData = DMS.Helpers.GetOptionListSet('/_odata/vehicleaccessory?$filter=gsc_productid/Id%20eq%20(Guid%27' + productId + '%27)', "gsc_itemid.Id", "gsc_itemid.Name");

var AccessroiessGridInstance = {
    initialize: function () {
        $('<div id="accessories-editablegrid" class="editable-grid"></div>').appendTo('.content-wrapper');

        var $container = document.getElementById('accessories-editablegrid');
        $container.style.display = 'none';
        var idQueryString = DMS.Helpers.GetUrlQueryString('id');
        var odataQuery = '/_odata/gsc_sls_quoteaccessory?$filter=gsc_quoteid/Id%20eq%20(Guid%27' + idQueryString + '%27)';
        var screenSize = ($(window).width() / 2) - 80;
        var options = {
            dataSchema: {
                gsc_sls_quoteaccessoryid: null, gsc_free: false,
                gsc_itemnumber: '', gsc_productid: { Id: null, Name: null }
            },
            colHeaders: [
                'Free', 'Item Number',
                'Item Description'
            ],
            columns: [
                { data: 'gsc_free', type: 'checkbox', renderer: checkboxRenderer, className: "htCenter htMiddle", width: 50 },
                { data: 'gsc_itemnumber', renderer: stringRenderer, readOnly: true, className: "htCenter htMiddle", width: 100 },
                {
                    data: 'gsc_productid', className: "htCenter htMiddle", width: 100, renderer: function (instance, td, row, col, prop, value, cellProperties) {
                        return lookupRenderer(accessoriesSelectData, instance, td, row, col, prop, value, cellProperties);
                    },
                    editor: 'select2',
                    select2Options: { // these options are the select2 initialization options 
                        data: accessoriesSelectData,
                        dropdownAutoWidth: true,
                        allowClear: true,
                        width: 'resolve'
                    }
                }
            ],
            gridWidth: screenSize,
            addNewRows: true,
            deleteRows: true
        }

        var sectionName = "ACCESSORIES";
        var attributes = [{ key: 'gsc_free', type: 'System.Boolean' },
        { key: 'gsc_productid', type: 'Microsoft.Xrm.Sdk.EntityReference', reference: 'product' },
        { key: 'gsc_quoteid', type: 'Microsoft.Xrm.Sdk.EntityReference', reference: 'quote', value: idQueryString }];
        var model = { id: 'gsc_sls_quoteaccessoryid', entity: 'gsc_sls_quoteaccessory', attr: attributes };
        var hotInstance = EditableGrid(options, $container, sectionName, odataQuery, model, {
            gsc_sls_quoteaccessoryid: null, gsc_free: false,
            gsc_itemnumber: '', gsc_productid: { Id: null, Name: '' }
        });
    }
}

var cabChassisSelectData = DMS.Helpers.GetOptionListSet('/_odata/gsc_sls_vehiclecabchassis?$filter=gsc_productid/Id%20eq%20(Guid%27' + productId + '%27)', "gsc_sls_vehiclecabchassisid", "gsc_vehiclecabchassispn");

var CabChasisGridInstance = {
    initialize: function () {
        $('<div id="cabchassis-editablegrid" class="editable-grid"></div>').appendTo('.content-wrapper');

        var $container = document.getElementById('cabchassis-editablegrid');
        $container.style.display = 'none';
        var idQueryString = DMS.Helpers.GetUrlQueryString('id');
        var odataQuery = '/_odata/gsc_sls_quotecabchassis?$filter=gsc_quoteid/Id%20eq%20(Guid%27' + idQueryString + '%27)';
        var screenSize = ($(window).width() / 2) - 80;
        var options = {
            dataSchema: {
                gsc_sls_quotecabchassisid: null, gsc_financing: null,
                gsc_itemnumber: 0, gsc_vehiclecabchassisid: { Id: null, Name: null }
            },
            colHeaders: [
                'Financing', 'Item Number',
                'Item Description'
            ],
            columns: [
                { data: 'gsc_financing', type: 'checkbox', renderer: checkboxRenderer, readOnly: true, className: "htCenter htMiddle", width: 50 },
                { data: 'gsc_itemnumber', renderer: stringRenderer, readOnly: true, className: "htCenter htMiddle", width: 100 },
                {
                    data: 'gsc_vehiclecabchassisid', className: "htCenter htMiddle", width: 100, renderer: function (instance, td, row, col, prop, value, cellProperties) {
                        return lookupRenderer(cabChassisSelectData, instance, td, row, col, prop, value, cellProperties);
                    },
                    editor: 'select2',
                    select2Options: { // these options are the select2 initialization options 
                        data: cabChassisSelectData,
                        dropdownAutoWidth: true,
                        allowClear: true,
                        width: 'resolve'
                    }
                }
            ],
            gridWidth: screenSize,
            addNewRows: true,
            deleteRows: true
        }

        var sectionName = "CABCHASSIS";
        var attributes = [{ key: 'gsc_financing', type: 'System.Boolean' },
        { key: 'gsc_vehiclecabchassisid', type: 'Microsoft.Xrm.Sdk.EntityReference', reference: 'product' },
        { key: 'gsc_quoteid', type: 'Microsoft.Xrm.Sdk.EntityReference', reference: 'quote', value: idQueryString }];
        var model = { id: 'gsc_sls_quotecabchassisid', entity: 'gsc_sls_quotecabchassis', attr: attributes };
        var hotInstance = EditableGrid(options, $container, sectionName, odataQuery, model, {
            gsc_sls_quotecabchassisid: null, gsc_financing: false,
            gsc_itemnumber: '', gsc_vehiclecabchassisid: { Id: null, Name: null }
        });

        // hotInstance.updateSettings({
        //     afterCreateRow: function (index, amount) {
        //         $('table[data-name="CABCHASSIS"] button.addnew').prop('disabled', true);
        //     }
        // });
        // hotInstance.updateSettings({
        //     afterRemoveRow: function (index, amount) {
        //         $('table[data-name="CABCHASSIS"] button.addnew').prop('disabled', false);
        //     }
        // });    

    }
}


var monthlyAmortizationGridInstance = {
    initialize: function () {

        $('<div id="monthlyamortization-editablegrid" class="editable-grid"></div>').appendTo('.content-wrapper');
        var $container = document.getElementById('monthlyamortization-editablegrid');
        $container.style.display = 'none';
        var idQueryString = DMS.Helpers.GetUrlQueryString('id');
        var odataQuery = '/_odata/gsc_sls_quotemonthlyamortization?preventCache=' + new Date().getTime() + '&$filter=gsc_quoteid/Id%20eq%20(Guid%27' + idQueryString + '%27)';
        var screenSize = ($(window).width() / 2) - 100;
        var options = {
            dataSchema: {
                gsc_isselected: null, gsc_quoteid: { Id: null, Name: null },
                gsc_financingtermid: { Id: null, Name: null }, gsc_quotemonthlyamortizationpn: null
            },
            colHeaders: [
                            'Select Term *',
                            'Financing Term',
                            'Monthly Amortization'
            ],
            columns: [
               { data: 'gsc_isselected', type: 'checkbox', renderer: checkboxRenderer, className: "htCenter htMiddle", width: 50 },
               { data: 'gsc_financingtermid', renderer: multiPropertyRenderer, readOnly: true, className: "htCenter htMiddle", width: 100 },
               { data: 'gsc_quotemonthlyamortizationpn', renderer: stringRenderer, readOnly: true, className: "htCenter htMiddle", width: 100 }
            ],
            gridWidth: screenSize,
            addNewRows: false,
            deleteRows: false
        }

        var sectionName = "MonthlyAmortization";
        var attributes = [{ key: 'gsc_isselected', type: 'System.Boolean' }];
        var model = { id: 'gsc_sls_quotemonthlyamortizationid', entity: 'gsc_sls_quotemonthlyamortization', attr: attributes };
        var hotInstance = EditableGrid(options, $container, sectionName, odataQuery, model, {
            gsc_sls_quotemonthlyamortizationid: null, gsc_isselected: false,
            gsc_financingtermid: { Id: null, Name: '' }, gsc_quotemonthlyamortizationpn: ''
        });

    }
}
