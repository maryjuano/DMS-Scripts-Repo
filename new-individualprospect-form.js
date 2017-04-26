$(document).ready(function () {

    $(".section[data-name='HideSection']").closest("fieldset").hide();
    $('#gsc_regionid_name').siblings('.input-group-btn').addClass('hidden');
    $('#gsc_age').attr('readonly', true);

    var branchId = $('#gsc_branchid').val();
    var addressOdataQuery = "/_odata/branchAddress?$filter=accountid eq (Guid'" + branchId + "')";
    $.ajax({
        type: 'get',
        async: true,
        url: addressOdataQuery,
        success: function (data) {
            var country = data.value[0].gsc_countryid;
            var province = data.value[0].gsc_provinceid;
            var city = data.value[0].gsc_cityid;
            var region = data.value[0].gsc_regionid;

            if (country != null) {
                $("#gsc_countryid").val(country.Id);
                $("#gsc_countryid_name").val(country.Name);
                $("#gsc_countryid_entityname").val("gsc_cmn_country");
                $("#gsc_countryid").siblings('div.input-group-btn').children('.clearlookupfield').show();
            }
            if (province != null) {
                $("#gsc_provinceid").val(province.Id);
                $("#gsc_provinceid_name").val(province.Name);
                $("#gsc_provinceid_entityname").val("gsc_cmn_province");
                $("#gsc_provinceid").siblings('div.input-group-btn').children('.clearlookupfield').show();
            }
            if (city != null) {
                $("#gsc_cityid").val(city.Id);
                $("#gsc_cityid_name").val(city.Name);
                $("#gsc_cityid_entityname").val("gsc_cmn_city");
                $("#gsc_cityid").siblings('div.input-group-btn').children('.clearlookupfield').show();
            }
            if (region != null) {
                $("#gsc_regionid_name").val(region.Name);
                $("#gsc_regionid").val(region.Id);
                $("#gsc_regionid_entityname").val("gsc_cmn_region");
            }
        },
        error: function (xhr, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

    var taxOdataUrl = "/_odata/gsc_cmn_taxmaintenance?$filter=gsc_isdefault eq true and gsc_branchid/Id eq (Guid'" + DMS.Settings.User.branchId + "')";
    $.ajax({
        type: "get",
        async: true,
        url: taxOdataUrl,
        success: function (data) {
            if (data.value.length != 0) {
                var tax = data.value[0];
                $("#gsc_taxid_name").val(tax.gsc_taxname);
                $("#gsc_taxid").val(tax.gsc_cmn_taxmaintenanceid);
                $("#gsc_taxid_entityname").val("gsc_cmn_taxmaintenance");
                $("#gsc_taxid").siblings('div.input-group-btn').children('.clearlookupfield').show();
            }
        },
        error: function (xhr, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

    setTimeout(function () {

        $('#birthdate').next('.datetimepicker').on('dp.change', function (e) {
            var diff = moment().diff(e.date, 'years');
            $('#gsc_age').val(Math.max(0, diff));

        });

        $("#gsc_countryid").on('change', function () {
            $("#gsc_provinceid_name").val("");
            $("#gsc_provinceid").val("");
            $("#gsc_provinceid").siblings('div.input-group-btn').children('.clearlookupfield').hide();
            $("#gsc_provinceid").trigger("change");
        });

        $("#gsc_provinceid").on('change', function () {
            $("#gsc_cityid_name").val("");
            $("#gsc_cityid").val("");
            $("#gsc_cityid").siblings('div.input-group-btn').children('.clearlookupfield').hide();

            var provinceId = $("#gsc_provinceid").val();

            if (provinceId != null && provinceId != "" && provinceId != "undefinded") {

                var odataUrl = "/_odata/gsc_cmn_province?$filter=gsc_cmn_provinceid eq (Guid'" + provinceId + "')";
                $.ajax({
                    type: "get",
                    async: true,
                    url: odataUrl,
                    success: function (data) {
                        var region = data.value[0].gsc_regionid;
                        $("#gsc_regionid_name").val(region.Name);
                        $("#gsc_regionid").val(region.Id);
                        $("#gsc_regionid_entityname").val("gsc_cmn_region");
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        console.log(errorMessage);
                    }
                });
            }
            else {
                $("#gsc_regionid_name").val("");
                $("#gsc_regionid").val("");
            }
        });

        /* Added by: Christell Ann Mataac - 2/24/2017
          this will auto populate tax rate based on the selected tax id*/
        $('#gsc_taxid').on('change', function () {
          var taxId = $('#gsc_taxid').val();
          var chargeQuery = "/_odata/gsc_cmn_taxmaintenance?$filter=gsc_cmn_taxmaintenanceid eq (Guid'" + taxId + "')";
  
          $.ajax({
            type: 'get',
            async: true,
            url: chargeQuery,
            success: function (data) {
              if (data.value.length != 0) {
                var tax = data.value[0];
                var taxRate = tax.gsc_rate;
                
                $('#gsc_taxrate').val(taxRate);
              }
            },
            error: function (xhr, textStatus, errorMessage) {
              $('#gsc_taxrate').val('');
              console.log(errorMessage);
            }
          });
        });
        

    }, 100);



    var mobilePhoneValidator = document.createElement('span');
    mobilePhoneValidator.style.display = "none";
    mobilePhoneValidator.id = "RequiredFieldValidatormobilephone";
    mobilePhoneValidator.controltovalidate = "mobilephone";
    mobilePhoneValidator.errormessage = "<a href='#mobilephone'>Mobile phone should only contain numeric values.</a>";
    mobilePhoneValidator.validationGroup = "";
    mobilePhoneValidator.initialvalue = "";
    mobilePhoneValidator.evaluationfunction = function () {
        var value = $("#mobilephone").val();
        var regex = /^[\d ()\-+]*$/;

        var matches = value.match(regex);

        if (matches != null) {
            return true;
        }
        else
            return false;
    };

    Page_Validators.push(mobilePhoneValidator);

    var faxValidator = document.createElement('span');
    faxValidator.style.display = "none";
    faxValidator.id = "RequiredFieldValidatormobilephone";
    faxValidator.controltovalidate = "fax";
    faxValidator.errormessage = "<a href='#fax'>Fax should only contain numeric values.</a>";
    faxValidator.validationGroup = "";
    faxValidator.initialvalue = "";
    faxValidator.evaluationfunction = function () {
        var value = $("#fax").val();
        var regex = /^[\d ()\-+]*$/;

        var matches = value.match(regex);

        if (matches != null) {
            return true;
        }
        else
            return false;
    };

    Page_Validators.push(faxValidator);

    var alternatePhoneValidator = document.createElement('span');
    alternatePhoneValidator.style.display = "none";
    alternatePhoneValidator.id = "RequiredFieldValidatormobilephone";
    alternatePhoneValidator.controltovalidate = "telephone1";
    alternatePhoneValidator.errormessage = "<a href='#telephone1'>Mobile phone should only contain numeric values.</a>";
    alternatePhoneValidator.validationGroup = "";
    alternatePhoneValidator.initialvalue = "";
    alternatePhoneValidator.evaluationfunction = function () {
        var value = $("#telephone1").val();
        var regex = /^[\d ()\-+]*$/;

        var matches = value.match(regex);

        if (matches != null) {
            return true;
        }
        else
            return false;
    };

    Page_Validators.push(alternatePhoneValidator);
});