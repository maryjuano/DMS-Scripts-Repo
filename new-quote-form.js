$(document).ready(function (e) {
    $('#gsc_recordownerid_name').siblings('.input-group-btn').addClass('hidden');
    $('#gsc_dealerid_name').siblings('.input-group-btn').addClass('hidden');
    $('#gsc_branchid_name').siblings('.input-group-btn').addClass('hidden');
    $('table[data-name="Summary_section_5"]').closest('fieldset').hide();

    $('#UpdateButton').click(function (event) {
        event.preventDefault();
        setTimeout(function () {
            window.parent.$('#btnRecalculate').click();

        }, 2000);
    });

    setTimeout(function () {

        $('#gsc_validuntil').next('.datetimepicker').on("dp.change", function (e) {
            $(this).data("DateTimePicker").setMinDate(new Date());
        });

        $("#opportunityid").trigger("change");
        $("#opportunityid").on('change', function () {
            var opportunityId = $("#opportunityid").val();
            if (opportunityId != "") {
                //Loading Image
                $.blockUI({ message: null, overlayCSS: { opacity: .3 } });

                var div = document.createElement("DIV");
                div.className = "view-loading message text-center loadingDiv";
                div.style.cssText = 'position: absolute; top: 50%; left: 50%;margin-right: -50%;display: block;';
                var span = document.createElement("SPAN");
                span.className = "fa fa-2x fa-spinner fa-spin";
                div.appendChild(span);
                $(".content-wrapper").append(div);

                $("#customerid").val("");
                $("#customerid_name").val("");
                $('#customerid_name').siblings('.input-group-btn').addClass('hidden');
                $("#gsc_leadsourceid").val("");
                $("#gsc_leadsourceid_name").val("");
                $('#gsc_leadsourceid_name').siblings('.input-group-btn').addClass('hidden');
                $("#gsc_paymentmode").val("");

                var countryOdataQuery = "/_odata/opportunity?$filter=opportunityid eq (Guid'" + opportunityId + "')";
                $.ajax({
                    type: 'get',
                    async: true,
                    url: countryOdataQuery,
                    success: function (data) {
                        if (data.value.length != 0) {
                            var customer = data.value[0].customerid;
                            var baseModel = data.value[0].gsc_vehiclebasemodelid;
                            var leadSource = data.value[0].gsc_leadsourceid;
                            var paymentMode = data.value[0].gsc_paymentmode;
                            if (customer != null) {
                                $("#customerid").val(customer.Id);
                                $("#customerid_name").val(customer.Name);
                            }
                            if (baseModel != null) {
                                $("#gsc_vehiclebasemodelid").val(baseModel.Id);
                                $("#gsc_vehiclebasemodelid_name").val(baseModel.Name);
                                $("#gsc_vehiclebasemodelid_entityname").val("gsc_iv_vehiclebasemodel");
                            }
                            if (leadSource != null) {
                                $("#gsc_leadsourceid").val(leadSource.Id);
                                $("#gsc_leadsourceid_name").val(leadSource.Name);
                                $("#gsc_leadsourceid_entityname").val("gsc_sls_leadsource");
                            }
                            if (paymentMode != null) {
                                $("#gsc_paymentmode").val(paymentMode.Value);
                            }
                        }
                        $.unblockUI();
                        $(".loadingDiv").remove();
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        console.log(errorMessage);
                    }
                });
            }
            else {
                $("#customerid").val("");
                $("#customerid_name").val("");
                $('#customerid_name').siblings('.input-group-btn').removeClass('hidden');
                $("#customerid").siblings('div.input-group-btn').children('.clearlookupfield').hide();
                $("#gsc_leadsourceid").val("");
                $("#gsc_leadsourceid_name").val("");
                $('#gsc_leadsourceid_name').siblings('.input-group-btn').removeClass('hidden');
                $("#gsc_leadsourceid").siblings('div.input-group-btn').children('.clearlookupfield').hide();
                $("#gsc_paymentmode").val("");
                $("#gsc_vehiclebasemodelid").val("");
                $("#gsc_productid").val("");
                $("#gsc_productid_name").val("");
                $("#gsc_productid").siblings('div.input-group-btn').children('.clearlookupfield').hide();
                $("#gsc_productid").trigger("change");
            }
        });

        $("#gsc_productid").on('change', function () {
            $('#gsc_vehiclecolorid1_name').val('');
            $('#gsc_vehiclecolorid1').val('');
            $("#gsc_vehiclecolorid1").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            $('#gsc_vehiclecolorid2_name').val("");
            $('#gsc_vehiclecolorid2').val("");
            $("#gsc_vehiclecolorid2").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            $('#gsc_vehiclecolorid3_name').val("");
            $('#gsc_vehiclecolorid3').val("");
            $("#gsc_vehiclecolorid3").siblings('div.input-group-btn').children('.clearlookupfield').hide();
        });
    }, 100);

    /* Added by: Christell Ann Mataac - 2/23/2017
      this will check duplicate preferred color */
    setTimeout(function () {
        $('#gsc_vehiclecolorid1').on('change', function () {

            if (checkPreferredColor(1)) {
                DMS.Notification.Error("Error: Cannot select preferred color twice.", true, 5000);
                $("#gsc_vehiclecolorid1_name").val("");
                $("#gsc_vehiclecolorid1").val("");
                $("#gsc_vehiclecolorid1").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            }
        });

        $('#gsc_vehiclecolorid2').on('change', function () {

            if (checkPreferredColor(2)) {
                DMS.Notification.Error("Error: Cannot select preferred color twice.", true, 5000);
                $("#gsc_vehiclecolorid2_name").val("");
                $("#gsc_vehiclecolorid2").val("");
                $("#gsc_vehiclecolorid2").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            }
        });

        $('#gsc_vehiclecolorid3').on('change', function () {

            if (checkPreferredColor(3)) {
                DMS.Notification.Error("Error: Cannot select preferred color twice.", true, 5000);
                $("#gsc_vehiclecolorid3_name").val("");
                $("#gsc_vehiclecolorid3").val("");
                $("#gsc_vehiclecolorid3").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            }
        });
    }, 100);

    function checkPreferredColor(index) {
        var colorNum = index;
        var color1 = $('#gsc_vehiclecolorid1').val();
        var color2 = $('#gsc_vehiclecolorid2').val();
        var color3 = $('#gsc_vehiclecolorid3').val();
        var isDuplicate = false;

        if (colorNum == 1) {
            if (color1 == color2)
                isDuplicate = true;
            else if (color1 == color3)
                isDuplicate = true;
        }
        else if (colorNum == 2) {
            if (color2 == color1)
                isDuplicate = true;
            else if (color2 == color3)
                isDuplicate = true;
        }
        else if (colorNum == 3) {
            if (color3 == color1)
                isDuplicate = true;
            else if (color3 == color2)
                isDuplicate = true;
        }
        else
            console.log("Unknown color");

        return isDuplicate;
    }
    /*END - Added by: Christell Ann Mataac - 2/23/2017*/

    //set page validators
    if (typeof (Page_Validators) == 'undefined') return;

    //Validator when valid until is not less than current date
    var validUntilValidator = document.createElement('span');
    validUntilValidator.style.display = "none";
    validUntilValidator.id = "RequiredFieldValidatorvaliduntil";
    validUntilValidator.errormessage = "Valid Until Date should not be less than the current date.";
    validUntilValidator.validationGroup = "";
    validUntilValidator.initialvalue = "";
    validUntilValidator.evaluationfunction = function () {
        var validDate = $("#gsc_validuntil").val() == "" ? 0 : $("#gsc_validuntil").val();
        var currentDate = new Date();

        if (new Date(validDate) >= new Date(currentDate.setHours(0, 0, 0, 0))) {
            return true;
        } else {
            return false;
        }
    };

    Page_Validators.push(validUntilValidator);

});