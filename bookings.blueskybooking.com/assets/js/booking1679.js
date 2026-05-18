/* Booking */
$(document).ready(function () {
    /* System Variables */
    var $intCompany_ID = $("input.ui-hidden-global-company_id").val();

    var $bitStartup = true;
    var $intTotalLocks = 0;
    var $decTotalWeight = 0.00;
    var $strFare_ID = "";

    /* Change Booking Fields */
    var $intExistingRoute_Class_Tier_ID = $("input.ui-hidden-booking-existing-route_class_tier_id").val();
    var $intExistingTotalLocks = parseInt($("input.ui-hidden-booking-passengers-existing-locks").val());
    var $decExistingTotalWeight = parseFloat($("input.ui-hidden-booking-passengers-existing-weight").val());

    var $objActiveBilling;
    var $objActiveSummary;

    var $intSlideTime = 250;

    // Billing
    var $decSubtotal = new Array();
    var $decTaxes = new Array();
    var $decTotal = new Array();

    $decSubtotal["Departure"] = parseFloat(0.00);
    $decTaxes["Departure"] = parseFloat(0.00);
    $decTotal["Departure"] = parseFloat(0.00);

    $decSubtotal["Return"] = parseFloat(0.00);
    $decTaxes["Return"] = parseFloat(0.00);
    $decTotal["Return"] = parseFloat(0.00);

    $decSubtotal["Change"] = parseFloat(0.00);
    $decTaxes["Change"] = parseFloat(0.00);
    $decTotal["Change"] = parseFloat(0.00);

    $decSubtotal["Total"] = parseFloat(0.00);
    $decTaxes["Total"] = parseFloat(0.00);
    $decTotal["Total"] = parseFloat(0.00);

    // Update billing summary
    // Notes: Code above procedural code call in $.fn.ScheduleManagement())
    $.fn.BookingBillingSummary = function ($strSchedule, $intRoute_Class_Tier_ID, $strFare_ID, $bitAsync) {
        var $objBookingSummarySchedule = $(".ui-booking-summary-schedules[data-schedule='" + $strSchedule + "']");
        $("span.ui-label-booking-summary-billing-subtotal-value").text("");
        $("span.ui-label-booking-summary-billing-taxes-value").text("");
        $("span.ui-label-booking-summary-billing-total-value").text("");
        $("span.ui-label-booking-summary-billing-balance-value").text("");

        //$.ajaxSetup({ async: true });

        $intBookingSummaryBillingCoupon_ID = $("input.ui-hidden-booking-summary-billing-coupon_id").val();
        $intBookingExistingCoupon_ID = $("input.ui-hidden-booking-existing-coupon_id").val();

        //var $intRoute_Class_Tier_ID = $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").first().val();
        var $intExistingRoute_Class_Tier_ID = $("input.ui-hidden-booking-existing-route_class_tier_id").val();

        var $bitValidationCoupon = 0;

        // If no coupon or change booking (same route), ignore search
        if ($intBookingSummaryBillingCoupon_ID > 0 &&
            ($intRoute_Class_Tier_ID != $intExistingRoute_Class_Tier_ID ||
                $intBookingSummaryBillingCoupon_ID != $intBookingExistingCoupon_ID)) {
            $bitValidationCoupon = 1;
        };

        var $intContact_ID = -1;

        if ($(".ui-hidden-booking-passengers-selected").length == 1) {
            $intContact_ID = $(".ui-hidden-booking-passengers-selected").val();
        }

        $.ajax({
            type: "GET",
            url: "/Search/Billing.aspx",
            async: $bitAsync,
            data: "Session=" + $strSession + "&Route_Class_Tier_ID=" + $intRoute_Class_Tier_ID + "&Fare_ID=" + $strFare_ID + "&Contact_ID=" + $intContact_ID + "&Coupon_ID=" + $intBookingSummaryBillingCoupon_ID + "&ValidationCoupon=" + $bitValidationCoupon + "&Summary=1",
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status); 
                //alert(thrownError); 
            },
            success: function (data) {
                $decSubtotal[$strSchedule] = parseFloat(data.SubTotal)
                $decTaxes[$strSchedule] = parseFloat(data.Taxes)
                $decTotal[$strSchedule] = parseFloat(data.Total)

                $decSubtotal["Total"] = ($decSubtotal["Departure"] + $decSubtotal["Return"] + $decSubtotal["Change"]);
                $decTaxes["Total"] = ($decTaxes["Departure"] + $decTaxes["Return"] + $decTaxes["Change"]);
                $decTotal["Total"] = ($decTotal["Departure"] + $decTotal["Return"] + $decTotal["Change"]);

                $(".ui-label-booking-summary-billing-subtotal-value").text("$" + formatCurrency($decSubtotal["Total"]));
                $(".ui-label-booking-summary-billing-taxes-value").text("$" + formatCurrency($decTaxes["Total"]));
                $(".ui-label-booking-summary-billing-total-value").text("$" + formatCurrency($decTotal["Total"]));

                //        $.fn.PaymentSummary(Schedule, decBillingSubTotal, decBillingTaxes, decBillingTotal);

                if ($.isFunction($.fn.ChangeTotal)) {
                    //alert("total");
                    $.fn.ChangeTotal($decSubtotal["Total"], $decTaxes["Total"], $decTotal["Total"]);
                    //$("input.ui-hidden-booking-refresh").trigger("change");
                }
            }
        });
    };

    $.fn.TransportList = function ($objTransport, $strData, $strDefault, $bitRequired) {
        var $blnFoundTransport = false;

        $lstTransport = $objTransport.find("select");

        $lstTransport.prop("disabled", !$strData.length)

        $objTransport.find(".ui-hidden-booking-summary-schedules-transport-default").val($strDefault);
        $objTransport.find(".ui-hidden-booking-summary-schedules-transport-required").val($bitRequired);

        $strTransport = $objTransport.find(".ui-hidden-booking-summary-schedules-transport").val();

        // If none assigned, use default
        if ($strTransport == "") {
            $objTransport.find(".ui-hidden-booking-summary-schedules-transport").val($strDefault);
            $strTransport = $strDefault;
        };

        $lstTransport
            .find("option:not(:first-child), optgroup")
            .remove();

        $lstTransport
            .find("option:first-child")
            .prop("selected", true);

        if (!$strData.length == 0) {
            $strTransportGroup = ""
            var arrTransport = $strData.split('\n');
            for (var i = 0; i < arrTransport.length; i++) {
                if (arrTransport[i].charAt(0) == "[" && arrTransport[i].slice(-1) == "]") {
                    $strTransportGroup = arrTransport[i].substring(1, arrTransport[i].length - 1);

                    $lstTransport
                        .append("<optgroup label='" + $strTransportGroup + "'></optgroup>")

                } else {
                    $blnSelected = (arrTransport[i] == $strTransport);
                    if ($blnSelected) { $blnFoundTransport = true; }

                    $lstTransport
                        .append("<option value='" + arrTransport[i] + "'" + ($blnSelected ? ' selected' : '') + (!$strTransportGroup == "" ? " OptionGroup='" + $strTransportGroup + "'" : "") + ">" + arrTransport[i] + "</option>")
                }
            }
        }

        if (!$blnFoundTransport) {
            $objTransport.find(".ui-hidden-booking-summary-schedules-transport").val("");
        };

        $objTransport
            .find('option:not(:first-child)').each(function () {
                $strOptionGroup = $(this).attr("optiongroup");
                $objTransport.find("optgroup[label='" + $strOptionGroup + "']").last().append($(this));
            });

        // Add change if not already exists
        $objExistingTransport = $objTransport.find(".ui-hidden-booking-existing-summary-schedules-transport");

        // If field exists (Change)
        if (!$objExistingTransport.length == 0) {
            // Has a value
            if (!$objExistingTransport.val() == "") {
                // Isn't already listed
                if ($lstTransport.find("option[value='" + $objExistingTransport.val() + "']").length == 0) {
                    $blnSelected = ($objExistingTransport.val() == $strTransport)

                    $lstTransport
                        .append("<option value='" + $objExistingTransport.val() + "'" + ($blnSelected ? ' selected' : '') + ">" + $objExistingTransport.val() + "</option>")
                }
            }
        }
    }

    $.fn.BookingSummary = function ($strSchedule, $intRoute_Class_Tier_ID) {
        // Select Complete Summary Section
        var $objBookingSummarySchedule = $(".ui-booking-summary-schedules[data-schedule='" + $strSchedule + "']");

        // Skip summary if missing (Change booking)
        if ($objBookingSummarySchedule.length == 0) {
            return false;
        }

        // Show Departure | Return section
        $objBookingSummarySchedule.show();

        if (!$bitStartup) {
            $objBookingSummarySchedule
                .find(".ui-label-booking-summary-warning")
                .hide();
        }

        // Find and remove any existing cloned schedules
        $objBookingSummarySchedule
            .find(".ui-booking-model-summary-schedules.ui-clone-global")
            .parent()
            .remove();

        // Find and clone base model to template
        var $objBookingSummaryScheduleItem = $objBookingSummarySchedule
            .find(".ui-booking-model-summary-schedules:not(.ui-clone-global)")
            .wrapAll("<div />")
            .parent()
            .clone();

        // Add ui-clone-global class to model for tracking and display: block (show())
        $objBookingSummaryScheduleItem
            .children()
            .addClass("ui-clone-global");

        // Append cloned schedule
        $objBookingSummarySchedule
            .children("ul.ui-list-booking-summary-schedules-information")
            .append($objBookingSummaryScheduleItem);

        // Find Transportation: Pickup and Dropoff
        $objPickup = $objBookingSummarySchedule
            .find(".ui-list-booking-summary-transport[data-transport='Pickup']");

        $objDropoff = $objBookingSummarySchedule
            .find(".ui-list-booking-summary-transport[data-transport='Dropoff']");

        //$objPickup = $(".ui-list-booking-summary-transport[data-schedule='" + $strSchedule + "'][data-transport='Pickup']");
        //$objDropoff = $(".ui-list-booking-summary-transport[data-schedule='" + $strSchedule + "'][data-transport='Dropoff']");

        var $intPolicy_ID = $(".ui-hidden-booking-policy_id").val();

        var $intProtocol_ID = $(".ui-hidden-booking-schedule_protocol_id").val();

        var $intRoute_Class_Tier_ID_Existing = $(".ui-hidden-booking-existing-route_class_tier_id").val();

        if ($intRoute_Class_Tier_ID == $intRoute_Class_Tier_ID_Existing) {
            $intProtocol_ID = $(".ui-hidden-booking-protocol_id").val();
        }

        // Will be disabled when request or not selected
        if ($intRoute_Class_Tier_ID == -1 || $intRoute_Class_Tier_ID == 0) {
            //// Booking Request
            //var $strRequest = $("#lblBookingDepartureRequestSchedule").text();
            //$objBookingSummaryScheduleItem.children().html($strRequest);
            //$objBookingSummaryScheduleItem.show();
            // Retrieve schedule data and display
        } else {
            // Live Booking
            $.ajax({
                type: "GET",
                url: "/Search/Routes.aspx",
                data: "Session=" + $strSession + "&Route_Class_Tier_ID=" + $intRoute_Class_Tier_ID + "&Policy_ID=" + $intPolicy_ID + "&Protocol_ID=" + $intProtocol_ID,
                async: true,
                Pickup: $objPickup,
                Dropoff: $objDropoff,
                error: function (xhr, ajaxOptions, thrownError) {
                    $objBookingSummaryScheduleItem.children().html("{Error / Network / " + xhr.status + " : " + thrownError + "}");
                    $objBookingSummaryScheduleItem.show();
                },
                success: function (data) {
                    if (parseInt(data.Route_Class_Tier_ID) !== 0) {
                        var $strScheduleDescription = data.Schedule;
                        if (data.Hops > 1) {
                            $strScheduleDescription += ' +' + (data.Hops - 1);
                        }

                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{0}", data.Date));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{1}", $strScheduleDescription));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{2}", data.Departure_Time));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{3}", data.Departure_Location));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{Departure_Map}", data.Departure_Map));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{4}", data.Arrival_Time));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{5}", data.Arrival_Location));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{Arrival_Map}", data.Arrival_Map));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{6}", data.Duration));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{7}", data.Class));
                        $objBookingSummaryScheduleItem.children().html($objBookingSummaryScheduleItem.children().html().replace("{8}", data.Tier));

                        if (data.Departure_Map != "") {
                            $objBookingSummaryScheduleItem.find(".ui-link-global-summary-schedules-map[data-Schedule='Departure']").show();
                        }

                        if (data.Arrival_Map != "") {
                            $objBookingSummaryScheduleItem.find(".ui-link-global-summary-schedules-map[data-Schedule='Arrival']").show();
                        }

                        //var $arrDescription = $strDescription.split("\n");
                        //var $objDescription = "";

                        //$objDescription = $strDescription;

                        //for (var intID = 0; intID < $arrDescription.length; intID++) {
                        //  if ($arrDescription[intID] != "") {
                        //    $objDescription = $objDescription + '<li>' + $arrDescription[intID];
                        //  }
                        //};

                        var $chrTier_Description = data.Tier_Description;
                        $chrTier_Description = decodeHtml($chrTier_Description);
                        $chrTier_Description = $chrTier_Description.replace(/\n/g, '<br />');

                        $objBookingSummaryScheduleItem.find(".ui-list-global-summary-schedules-tier-description").append($chrTier_Description);

                        var $chrPolicy_Description = data.Policy_Description;
                        $chrPolicy_Description = decodeHtml($chrPolicy_Description);
                        $chrPolicy_Description = $chrPolicy_Description.replace(/\n/g, '<br />');

                        $objBookingSummaryScheduleItem.find(".ui-list-global-summary-schedules-policy-description").append($chrPolicy_Description);

                        // Transportation: Pickup / Dropoff
                        $.fn.TransportList(this.Pickup, data.Pickup, data.PickupDefault, data.PickupRequired);
                        $.fn.TransportList(this.Dropoff, data.Dropoff, data.DropoffDefault, data.DropoffRequired);

                        if (!data.Pickup.length == 0) {
                            this.Pickup.show();
                        } else {
                            this.Pickup.hide();
                        }

                        if (!data.Dropoff.length == 0) {
                            this.Dropoff.show();
                        } else {
                            this.Dropoff.hide();
                        }

                        // Set documentation requirement
                        $("input.ui-hidden-booking-route_class_tier_id[data-Schedule='" + $strSchedule + "']").attr("data-Documentation", data.Documentation);
                        // Show Documentation, if applicable
                        $.fn.BookingDocumentation();

                        //$objPickup = $("#cboBookingSummaryDeparturePickup")
                        //alert($objPickup.length);
                        //$objPickup.show();

                        //$objPickup.find("option")
                        //  .remove()
                        //  .end()
                        //  .append("<option>A</option><option>B</option><option>C</option>")
                        //  .show();

                        //$objPickupValue = $objPickup

                        //(data.Pickup.length);
                        //alert(data.Dropoff.length);
                        //console.log(data.Pickup);
                        //console.log(data.Dropoff);

                    } else {
                        $objBookingSummaryScheduleItem.children().html("{Error / No Data / #" + $intRoute_Class_Tier_ID + "}");
                    }

                    // Fare Details
                    $objBookingSummaryScheduleItem.find(".ui-link-summary-schedules-fare").click(function (e) {
                        // $(this).hide();
                        $objBookingSummaryScheduleItem.find(".ui-list-global-summary-schedules-tier-description").slideToggle($intSlideTime);
                        $objBookingSummaryScheduleItem.find(".ui-list-global-summary-schedules-policy-description").slideToggle($intSlideTime);
                        return false;
                    });

                    $objBookingSummaryScheduleItem.children().show();
                }
            });
        };
    };

    $("input.ui-textbox-booking-passengers-documentation-number").change(function (e) {
        $(this).val($(this).val().toUpperCase());
    });

    $.fn.BookingDocumentationEnabled = function () {
        $("label.ui-labelbox-booking-passengers-documentation-change").each(function (e) {
            //alert($(this).prop("checked"));
            var $strItem = $(this).attr("data-Item");
            var $objDocument = $(this).find("input");
            //alert($("select.ui-dropdown-booking-passengers-documentation-code[data-Item='" + $strItem + "']").length);

            var $objName = $(".ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "'] .ui-labelbox-booking-passengers-documentation-name input");

            $objName.prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-first[data-Item='" + $strItem + "']").prop("disabled", !$objName.prop("checked") || !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-middle[data-Item='" + $strItem + "']").prop("disabled", !$objName.prop("checked") || !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-last[data-Item='" + $strItem + "']").prop("disabled", !$objName.prop("checked") || !$objDocument.prop("checked"));

            $("select.ui-dropdown-booking-passengers-documentation-gender[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-date_birth[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("select.ui-dropdown-booking-passengers-documentation-code[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-number[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("select.ui-dropdown-booking-passengers-documentation-nationality[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("select.ui-dropdown-booking-passengers-documentation-residence[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("select.ui-dropdown-booking-passengers-documentation-issued[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-date_activation[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-date_expiration[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));
            $("input.ui-textbox-booking-passengers-documentation-redress[data-Item='" + $strItem + "']").prop("disabled", !$objDocument.prop("checked"));

            $.fn.BookingDocumentationSetNameDefault($strItem);
        })
    };

    $("label.ui-labelbox-booking-passengers-documentation-change").click(function (e) {
        $.fn.BookingDocumentationEnabled();
    });

    $(".ui-labelbox-booking-passengers-documentation-name input").click(function (e) {
        $.fn.BookingDocumentationEnabled();
    });

    // Name change
    $.fn.BookingDocumentationSetNameDefault = function ($strItem) {
        var $objName = $(".ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "'] .ui-labelbox-booking-passengers-documentation-name input");

        $("input.ui-textbox-booking-passengers-documentation-first[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");
        $("input.ui-textbox-booking-passengers-documentation-last[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");

        if (!$objName.prop("checked")) {
            $("input.ui-textbox-booking-passengers-documentation-first[data-Item='" + $strItem + "']").val($("input.ui-textbox-booking-passengers-first[data-Item='" + $strItem + "']").val());
            $("input.ui-textbox-booking-passengers-documentation-middle[data-Item='" + $strItem + "']").val("");
            $("input.ui-textbox-booking-passengers-documentation-last[data-Item='" + $strItem + "']").val($("input.ui-textbox-booking-passengers-last[data-Item='" + $strItem + "']").val());
        }
    };

    $("input.ui-textbox-booking-passengers-first, input.ui-textbox-booking-passengers-last").change(function (e) {
        var $strItem = $(this).attr("data-Item");
        $.fn.BookingDocumentationSetNameDefault($strItem);
    });

    var $blnBookingPassengersListRequiredBirthdate = $("input.ui-hidden-booking-passengers-required-birthdate").val();

    $.fn.BookingPassengersListRequiredBirthdate = function ($objItem) {
        $strBirthdate = $objItem.val();

        if ($blnBookingPassengersListRequiredBirthdate != "1") { return; }

        if ($strBirthdate == "") {
            $objItem.addClass("ui-state-global-required");
        } else {
            $objItem.removeClass("ui-state-global-required");
        }
    }

    // Startup
    $("input.ui-textbox-booking-passengers-birthdate").each(function () {
        $.fn.BookingPassengersListRequiredBirthdate($(this));
    });

    $.fn.BookingPassengersListBirthdateValidation = function ($objItem) {
        var $objBirthdate = $objItem;
        var $strBirthdate = $objBirthdate.val().trim();

        if (!$strBirthdate) return;

        var date;

        // YYYY-MM-DD
        let match = $strBirthdate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (match) {
            const [_, y, m, d] = match;
            date = buildDate(+y, +m, +d);
            if (!date) return $objBirthdate.val("");

            // YYYYMMDD
        } else if (/^\d{8}$/.test($strBirthdate)) {
            const y = +$strBirthdate.slice(0, 4);
            const m = +$strBirthdate.slice(4, 6);
            const d = +$strBirthdate.slice(6, 8);

            date = buildDate(y, m, d);
            if (!date) return $objBirthdate.val("");

        } else {
            if (!/[a-z]/i.test($strBirthdate)) {
                return $objBirthdate.val("");
            }

            const parsed = Date.parse($strBirthdate);

            if (isNaN(parsed)) {
                return $objBirthdate.val("");
            }

            const temp = new Date(parsed);

            date = buildDate(
                temp.getFullYear(),
                temp.getMonth() + 1,
                temp.getDate()
            );

            if (!date) return $objBirthdate.val("");
        }

        // Normalize today
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        // 125 years ago
        var minDate = new Date(
            today.getFullYear() - 125,
            today.getMonth(),
            today.getDate()
        );

        if (date > today || date < minDate) {
            $objBirthdate.val("");
            return;
        }

        var formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        $objBirthdate.val(formatted);

        function buildDate(y, m, d) {
            const dt = new Date(y, m - 1, d);
            if (
                dt.getFullYear() !== y ||
                dt.getMonth() !== m - 1 ||
                dt.getDate() !== d
            ) return null;
            return dt;
        }

        function pad(n) {
            return n.toString().padStart(2, "0");
        }
    }

    // Date of Birth
    $("input.ui-textbox-booking-passengers-birthdate").on("blur", function () {
        $.fn.BookingPassengersListBirthdateValidation($(this));
        $.fn.BookingPassengersListRequiredBirthdate($(this));

        var $strItem = $(this).attr("data-Item");

        console.log($(".ui-textbox-booking-passengers-documentation-date_birth[data-Item='" + $strItem + "']").val());

        if ($(".ui-labelbox-booking-passengers-documentation-change[data-Item='" + $strItem + "'] input:checked:disabled").length > 0) {
            if ($(".ui-textbox-booking-passengers-documentation-date_birth[data-Item='" + $strItem + "']").val() == "") {
                $(".ui-textbox-booking-passengers-documentation-date_birth[data-Item='" + $strItem + "']").val($(this).val());
                $(".ui-textbox-booking-passengers-documentation-date_birth[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");
            }
        }
    });

    var $strPassengersEmail = ""
    var $strPassengersPhone = ""
    var $strPassengersMobile = ""

    // Current Field
    $(".ui-textbox-booking-passengers-email").focus(function () {
        $strPassengersEmail = $(this).val();
    });

    $(".ui-textbox-booking-passengers-phone").focus(function () {
        $strPassengersPhone = $(this).val();
    });

    $(".ui-textbox-booking-passengers-mobile").focus(function () {
        $strPassengersMobile = $(this).val();
    });

    $(".ui-textbox-booking-passengers-email").blur(function () {
        var $strEmail = $(this).val();

        if ($strPassengersEmail == $strEmail) { return; }

        if ($(".ui-textbox-booking-passengers-address-email").val() == $strPassengersEmail) {
            $(".ui-textbox-booking-passengers-address-email").val($strEmail).trigger("change");
            //$.fn.RequiredPhone();
        };
    });

    $(".ui-textbox-booking-passengers-phone").blur(function () {
        var $strNumber = $(this).val();

        if ($strPassengersPhone == $strNumber) { return; }

        if ($(".ui-textbox-booking-passengers-address-home").val() == $strPassengersPhone) {
            $(".ui-textbox-booking-passengers-address-home").val($strNumber).trigger("change");
            //$.fn.RequiredPhone();
        };
    });

    $(".ui-textbox-booking-passengers-mobile").blur(function () {
        var $strNumber = $(this).val();

        if ($strPassengersMobile == $strNumber) { return; }

        if ($(".ui-textbox-booking-passengers-address-mobile").val() == $strPassengersMobile) {
            $(".ui-textbox-booking-passengers-address-mobile").val($strNumber).trigger("change");
            //$.fn.RequiredPhone();
        };
    });

    // Documentation

    $("a.ui-link-booking-passengers-documentation-hide").click(function (e) {
        var $strItem = $(this).attr("data-Item");
        $("input.ui-hidden-booking-passengers-documentation-enabled[data-Item='" + $strItem + "']").val("0");
        $("ul.ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "']").hide();
        $("ul.ui-panel-booking-passengers-documentation-disabled[data-Item='" + $strItem + "']").show();
    });

    $("a.ui-link-booking-passengers-documentation-show").click(function (e) {
        var $strItem = $(this).attr("data-Item");
        $("input.ui-hidden-booking-passengers-documentation-enabled[data-Item='" + $strItem + "']").val("1");
        $("ul.ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "']").show();
        $("ul.ui-panel-booking-passengers-documentation-disabled[data-Item='" + $strItem + "']").hide();
    });

    $.fn.BookingDocumentationEnabled();

    $.fn.BookingDocumentation = function () {
        var $objDocumentation = $("ul.ui-panel-booking-passengers-documentation")

        if ($.fn.IsBookingDocumentation()) {
            //$objDocumentation.show();
            $objDocumentation.each(function (e) {
                var $strItem = $(this).attr("data-Item");

                if ($(this).find("input.ui-hidden-booking-passengers-documentation-enabled").val() == "0") {
                    $("ul.ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "']").hide();
                    $("ul.ui-panel-booking-passengers-documentation-disabled[data-Item='" + $strItem + "']").show();
                } else {
                    $("ul.ui-panel-booking-passengers-documentation[data-Item='" + $strItem + "']").show();
                }
            });
        } else {
            $objDocumentation.hide();
            $("ul.ui-panel-booking-passengers-documentation-disabled").hide();
        }
        $.fn.BookingDocumentationEnabled()
    }

    $.fn.IsBookingDocumentation = function () {
        var $blnIsDocumentation = false;

        $("input.ui-hidden-booking-route_class_tier_id").each(function (e) {
            if ($(this).attr("data-Documentation") == "1") {
                $blnIsDocumentation = true;
                return;
            }
        })

        return $blnIsDocumentation;
    }

    $.fn.PaymentRestrictions = function () {
        // Check Tier / Payment Restrictions

        var $arrRoute_Class_Tier_ID = new Array();

        $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").each(function (e) {
            $arrRoute_Class_Tier_ID.push($(this).val());
        });

        $intBookingSummaryBillingCoupon_ID = $("input.ui-hidden-booking-summary-billing-coupon_id").val();

        // Grab Restrictions
        $.ajax({
            type: "GET",
            url: "/Search/PaymentRestrictions.aspx",
            async: true,
            data: "Session=" + $strSession + "&Route_Class_Tier_ID=" + $arrRoute_Class_Tier_ID.join() + "&Coupon_ID=" + $intBookingSummaryBillingCoupon_ID,
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status); 
                //alert(thrownError); 
            },
            success: function (data) {
                $(".ui-radiolist-booking-payment input[type='radio']").each(function (e) {
                    $(this).removeAttr("disabled");
                });

                $(".ui-listitem-booking-payment-warning").hide()

                for (var intRow = 0; intRow < data.Payment_ID.length; intRow++) {
                    $(".ui-radiolist-booking-payment input[type='radio'][value='" + data.Payment_ID[intRow] + "']").each(function (e) {
                        if ($(this).prop("checked")) {
                            $(".ui-booking-payment-method > li.ui-booking-payment-method-control").hide();
                        }
                        $(this).attr("disabled", "disabled");
                        $(this).prop("checked", false);

                        $(".ui-listitem-booking-payment-warning").show()
                    });
                }

                if (data.Contact_ID > 0) {
                    $(".ui-radiolist-booking-payment input[type='radio'][value='0']").each(function (e) {
                        if ($(this).prop("checked")) {
                            $(".ui-booking-payment-method > li.ui-booking-payment-method-control").hide();
                        }
                        $(this).attr("disabled", "disabled");
                        $(this).prop("checked", false);

                        $(".ui-listitem-booking-payment-warning").show()
                    });
                }

                // Reset the selected payment, if disabled
                if ($(".ui-radiolist-booking-payment input[type='radio']:checked").length == 0) {
                    $.fn.PaymentSelected($(".ui-radiolist-booking-payment input[type='radio']:checked"));
                }
            }
        });
    };

    $.fn.SchedulesShowWaitingList = function ($strSchedule, $intRoute_Class_ID, $intRoute_Class_Tier_ID, $bitScroll, $bitAnimate) {
        $("tr.ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']").show();

        //$("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
        //  .has("input:checked")
        //  .parent()
        //  .find("tr.ui-tablerow-global-schedules[data-route_class_id!='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
        //  .first()
        //  .before($(".ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']"));

        //var $objWaiting =
        //  $("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
        //    .has("input[value='" + $intRoute_Class_Tier_ID + "']");

        //while ($objWaiting.next().has("span.ui-booking-schedules-radio-route_class_tier_id[data-route_class_id='" + $intRoute_Class_ID + "']").length != 0 &&
        //       $objWaiting.next().has(".ui-tablecolumn-global-schedules-sorting").length == 0) {
        //  $objWaiting = $objWaiting.next();
        //}

        var $objWaiting =
            $("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                .has("input[value='" + $intRoute_Class_Tier_ID + "']");

        while (($objWaiting.next().has("span.ui-booking-schedules-radio-route_class_tier_id[data-route_class_id='" + $intRoute_Class_ID + "']").length != 0 ||
            $objWaiting.next().has(".ui-tablecolumn-global-schedules-connections").length != 0 ||
            $objWaiting.next().has(".ui-tablecolumn-global-schedules-advisory-web").length != 0) &&
            $objWaiting.next().has(".ui-tablecolumn-global-schedules-sorting").length == 0
        ) {
            $objWaiting = $objWaiting.next();
        }

        $objWaiting
            .after($(".ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']"));

        if ($bitScroll &&
            $(window).scrollTop() > $objWaiting.offset().top
        ) {
            $('html, body').animate({ scrollTop: $objWaiting.offset().top - 10 }, 0);
        }

        //$("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
        //  .last()
        //  .after($(".ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']"));

        if (true || $bitAnimate) {
            $("tr.ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "'] div.ui-section-global-schedules-waiting")
                .animate({ height: '0px' }, 0)
                .animate({
                    height: '45px',
                    padding: '5px 0px 5px'
                }, ($bitStartup == true) ? 0 : 2 * $intSlideTime);
        }
    }

    $.fn.SchedulesMoveNext = function ($strSchedule, $bitMoveNext) {
        if ($bitMoveNext == true) {
            var $objAutoScrollSection = $(".ui-schedules-global[data-schedule='Return']")

            if (!$objAutoScrollSection.length > 0 ||
                $strSchedule == "Return") {
                $objAutoScrollSection = $(".ui-booking-passengers")
            }

            if (!$objAutoScrollSection.length > 0 ||
                $strSchedule == "Change") {
                $objAutoScrollSection = $(".ui-change-passengers")
            }

            $('html, body').animate({ scrollTop: $objAutoScrollSection.offset().top - 10 }, 1000);
        }
    }

    // Move request to bottom of table
    var $objSchedule = new Array("Departure", "Return", "Change")

    for (var i = 0; i < $objSchedule.length; i++) {
        $(".ui-tablerow-global-schedules-request-section[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
        $(".ui-tablerow-global-request-schedules[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
        //$("#trBookingDepartureRequest[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
        //$("#trBookingDepartureRequestConnections[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
        //$("#trBookingDepartureRequestAdvisory[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
        //$("#trBookingDepartureRequestInformation[data-schedule='" + $objSchedule[i] + "']").insertAfter($("table.ui-table-global-schedules[data-schedule='" + $objSchedule[i] + "'] tr:last"));
    }

    // Booking Request
    $.fn.BookingRequestShow = function ($strSchedule, $blnActive) {
        //$(".ui-tablerow-global-schedules-request-section")
        //$(".ui-tablerow-global-request-schedules")

        if ($strSchedule == "Departure") {
            var $objBookingRequest = $(".ui-panel-booking-passengers-flags, .ui-booking-summary, .ui-booking-payment, .ui-booking-confirmation, .ui-agreement");
            var $blnRequestReturn = ($(".ui-hidden-booking-request[data-Schedule='Return']").val() == 1);

            if ($blnActive) {
                $objBookingRequest.hide();

                if (!$blnRequestReturn) { $(".ui-booking-return").hide(); }

                $(".ui-booking-return .ui-tablerow-global-schedules-request-section, .ui-booking-return .ui-tablerow-global-request-schedules").show();

                $(".ui-booking-return .ui-tablerow-global-schedules:not(.ui-tablerow-global-schedules-request-section, .ui-tablerow-global-request-schedules)").hide();

                $(".ui-booking-return .ui-tablerow-global-schedules-sorting").hide();
                $(".ui-booking-return .ui-tablerow-global-schedules-conditions").hide();
                $(".ui-booking-return .ui-tablerow-global-schedules-waitinglist").hide();

                if (!$bitStartup) {
                    if ($("input.ui-hidden-booking-route_class_tier_id[data-schedule='Return']").val() == -1) {
                        //$(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='Return'] input[type=radio]:checked").prop("checked", true);
                        $("input.ui-hidden-booking-route_class_tier_id[data-schedule='Return']").val("0");
                    }

                    $("tr.ui-tablerow-global-schedules[data-Schedule='Return'] td.ui-tablecolumn-global-schedules-selection-group").last().trigger("click");
                }

                $(".ui-labelbox-booking-passengers-request-option").show();
                $(".ui-button-booking-book").hide();
                $(".ui-button-booking-request").show();
            } else {
                $objBookingRequest.show();

                if (!$blnRequestReturn) { $(".ui-booking-return").show(); }

                $(".ui-booking-return .ui-tablerow-global-schedules-sorting").show();

                $(".ui-booking-return .ui-tablerow-global-schedules-request-section, .ui-booking-return .ui-tablerow-global-request-schedules").hide();
                $(".ui-booking-return .ui-tablerow-global-schedules:not(.ui-tablerow-global-schedules-request-section, .ui-tablerow-global-request-schedules)").show();

                if (!$bitStartup) {
                    $(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='Return'] input[type=radio]:checked").prop("checked", false);
                    $("input.ui-hidden-booking-route_class_tier_id[data-schedule='Return']").val("0");
                }

                $(".ui-labelbox-booking-passengers-request-option").hide();
                $(".ui-button-booking-book").show();
                $(".ui-button-booking-request").hide();
            }

            $.fn.BookingRequestShowName($blnActive);

            $("INPUT.ui-textbox-booking-passengers-first").removeClass("ui-state-global-error");
            $("INPUT.ui-textbox-booking-passengers-last").removeClass("ui-state-global-error");

            $("INPUT.ui-textbox-booking-passengers-address-request-name").removeClass("ui-state-global-error");
        }

        if ($blnActive) {
            // $(".ui-tablerow-global-schedules-information").show();
            // If more than one option
            //if ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-time select option").length > 1) { $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-time select").prop("disabled", false); }
            //if ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-location select option").length > 1) { $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-location select").prop("disabled", false); }
            //if ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-time select option").length > 1) { $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-time select").prop("disabled", false); }
            //if ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-location select option").length > 1) { $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-location select").prop("disabled", false); }

            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-time select").prop("disabled", ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-time select option").length <= 1));
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-location select").prop("disabled", ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-location select option").length <= 1));
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-time select").prop("disabled", ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-time select option").length <= 1));
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-location select").prop("disabled", ($(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-location select option").length <= 1));

            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-radiolist-booking-request-options input").prop("disabled", false);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-label-booking-request-information").removeClass("ui-global-disabled");
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-textbox-booking-request-comments").prop("disabled", false);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-checkboxlist-booking-request-features input").prop("disabled", false);

            //var $objRoute_Class_Tier_ID_Current = $(".ui-hidden-booking-route_class_tier_id[data-Schedule='Return']").val();

            ////$(".ui-booking-return tr.ui-tablerow-global-schedules td.ui-tablecolumn-global-schedules-selection SPAN[data-route_class_tier_id='" + $objRoute_Class_Tier_ID_Current.val() + "']")
            ////    .parent()
            ////    .parent()
            ////    .find("td.ui-tablecolumn-global-schedules-selection-group")
            ////    .removeClass("ui-state-global-hover-disabled")
            ////    .removeClass("ui-state-global-listing-selected");

            //// Removing "greying" from current schedule
            //$("tr.ui-tablerow-global-schedules[data-schedule='" + 'Return' + "']")
            //    .removeClass("ui-state-global-hover");

            //$(".ui-hidden-booking-route_class_tier_id[data-Schedule='Return']").val("0");
        } else {
            // $(".ui-tablerow-global-schedules-information").hide();
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-time select").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-departure-location select").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-time select").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-tablecolumn-global-schedules-arrival-location select").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-radiolist-booking-request-options input").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-label-booking-request-information").addClass("ui-global-disabled");
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-textbox-booking-request-comments").prop("disabled", true);
            $(".ui-tablerow-global-request-schedules[data-Schedule='" + $strSchedule + "'] .ui-checkboxlist-booking-request-features input").prop("disabled", true);
        }
    }

    $.fn.BookingRequestShowName = function ($blnActive) {
        var $objRequestOption = $(".ui-labelbox-booking-passengers-request-option INPUT").prop("checked");

        if ($blnActive && $objRequestOption) {
            $(".ui-dropdown-booking-passengers-address-primary").hide();
            $(".ui-textbox-booking-passengers-address-request-name").show();
        } else {
            $(".ui-dropdown-booking-passengers-address-primary").show();
            $(".ui-textbox-booking-passengers-address-request-name").hide();
        }
    }

    $(".ui-labelbox-booking-passengers-request-option INPUT").click(function (e) {
        $.fn.BookingRequestShowName($(".ui-hidden-booking-route_class_tier_id[data-Schedule='Departure']").val());

        $("INPUT.ui-textbox-booking-passengers-first").removeClass("ui-state-global-error");
        $("INPUT.ui-textbox-booking-passengers-last").removeClass("ui-state-global-error");

        $("INPUT.ui-textbox-booking-passengers-address-request-name").removeClass("ui-state-global-error");
    })

    // 1: Departure | Return | Change
    $.fn.ScheduleManagement = function () {

        // Startup: Reset Waiting List option/flag, re-validation
        $("input.ui-hidden-global-schedules-conditions-option").val("0");
        $("input.ui-hidden-global-schedules-waiting-option").val("0");

        // Departure | Return Schedules: Hover()
        // .ui-listings-global-schedules
        //$("tr.ui-tablerow-global-schedules").hover(
        $("tr.ui-tablerow-global-schedules td.ui-tablecolumn-global-schedules-selection-group").hover(
            function (e) { // Add hover class (hightlighting) to <tr>, exclude ui-state-global-hover-disabled <tr>

                //				  var $intRoute_Class_Tier_ID =
                //            $(this)
                //            .parent()
                //            .find("td.ui-tablecolumn-global-schedules-selection SPAN")
                //            .attr("data-route_class_tier_id");

                //console.log($intRoute_Class_Tier_ID);

                $(this)
                    .parent()
                    .find("td.ui-tablecolumn-global-schedules-selection-group:not(.ui-state-global-hover-disabled)")
                    .addClass("ui-state-global-hover");

                //          $("tr.ui-tablerow-global-schedules td.ui-tablecolumn-global-schedules-selection-group[data-route_class_tier_id='" + $intRoute_Class_Tier_ID + "']:not(.ui-state-global-hover-disabled)")
                //            .addClass("ui-state-global-hover");

            },
            function (e) { // Remove hover class from <tr>
                //				  var $intRoute_Class_Tier_ID = $(this).attr("data-route_class_tier_id");

                $(this)
                    .parent()
                    .find("td.ui-tablecolumn-global-schedules-selection-group:not(.ui-state-global-hover-disabled)")
                    .removeClass("ui-state-global-hover");

                //				  $("tr.ui-tablerow-global-schedules td.ui-tablecolumn-global-schedules-selection-group[data-route_class_tier_id='" + $intRoute_Class_Tier_ID + "']")
                //            .removeClass("ui-state-global-hover");
            }
        )
            .click(function (e) { // Departure | Return Schedules: Click()
                var $bitMoveNext = true;

                var $objSelection =
                    $(this)
                        .parent()
                        .find("td.ui-tablecolumn-global-schedules-selection SPAN");

                var $intRoute_Class_Tier_ID = $objSelection.attr("data-route_class_tier_id");
                var $intRoute_Class_ID = $objSelection.attr("data-route_class_id");
                var $strSchedule = $objSelection.attr("data-schedule");
                var $radRoute_Class_Tier_ID = $objSelection.find("input[value='" + $intRoute_Class_Tier_ID + "']");

                var $objRoute_Class_Tier_ID_Current = $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $strSchedule + "']");

                //        var $objSchedules = $(this);
                //        var $strSchedule = $objSchedules.attr("data-schedule");
                //        var $intRoute_Class_Tier_ID = $objSchedules.attr("data-route_class_tier_id");
                //        var $radRoute_Class_Tier_ID = $(".ui-booking-schedules-radio-route_class_tier_id input[value='" + $intRoute_Class_Tier_ID + "']");
                //        var $objRoute_Class_Tier_ID = $radRoute_Class_Tier_ID.parent();
                //        var $objRoute_Class_Tier_ID_Current = $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $strSchedule + "']");

                //        var $intRoute_Class_Tier_ID_Existing = $(".ui-hidden-booking-existing-route_class_tier_id").val();

                // Check radio input for "data-active", exit if Active=0
                if ($objSelection.attr("data-active") == "0") {
                    return false;
                }

                // Booking Request / Change
                if (!$bitStartup) {
                    //if ($strSchedule == "Return" && $intRoute_Class_Tier_ID == -1) {
                    if ($intRoute_Class_Tier_ID == -1) {
                        if ($objRoute_Class_Tier_ID_Current.val() == -1) {
                            //alert($objSelection.find("input[type=radio]:checked").length);
                            $radRoute_Class_Tier_ID.prop("checked", false);
                            //$objSelection.find("input[type=radio]:checked").prop("checked", false);
                            $intRoute_Class_Tier_ID = 0;
                            $intRoute_Class_ID = 0;
                            $bitMoveNext = false;
                        }
                    }

                    if (($objRoute_Class_Tier_ID_Current.val() == -1 ? -1 : 1) != ($intRoute_Class_Tier_ID == -1 ? -1 : 1)) {
                        $.fn.BookingRequestShow($strSchedule, $intRoute_Class_Tier_ID == -1);
                    }
                }

                var $intValidLocks = $intTotalLocks;
                var $decValidWeight = $decTotalWeight;

                // Adjust Locks/Weight if currently selected booking (Change booking)
                if ($intRoute_Class_Tier_ID == $intExistingRoute_Class_Tier_ID) {
                    $intValidLocks -= $intExistingTotalLocks;
                    $decValidWeight -= $decExistingTotalWeight;
                }

                // Show Summary: Full Breakdown
                $("tr.ui-tablerow-global-summary-billing-summary").show();

                if ($bitStartup == false) {
                    if ($intRoute_Class_Tier_ID == $objRoute_Class_Tier_ID_Current.val()) {
                        return false;
                    };
                };

                // Remove error class
                $("tr.ui-tablerow-global-schedules-error[data-schedule='" + $strSchedule + "']").hide();

                // Reset Conditions button to normal active state
                $("input.ui-button-global-schedules-conditions[data-schedule='" + $strSchedule + "']")
                    .addClass("ui-button-global-schedules-conditions-active")
                    .removeClass("ui-button-global-schedules-conditions-disabled")
                    .removeAttr("disabled")
                    .attr("value", $(".ui-label-global-schedules-conditions-active").attr("value"));

                // Reset Waiting List button to normal active state
                $("input.ui-button-global-schedules-waiting[data-schedule='" + $strSchedule + "']")
                    .addClass("ui-button-global-schedules-waiting-active")
                    .removeClass("ui-button-global-schedules-waiting-disabled")
                    .removeAttr("disabled")
                    .attr("value", $(".ui-label-global-schedules-waiting-active").attr("value"));

                // Reset Conditions and Waiting List options
                if ($bitStartup == false) {
                    $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']").hide();
                    $("input.ui-hidden-global-schedules-conditions-option[data-schedule='" + $strSchedule + "']").val("0");
                    $("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val("0");

                    $("tr.ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']").hide();
                    $("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val("0");
                    $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val("0");
                }

                if ($("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val() == "1") {
                    $("input.ui-button-global-schedules-conditions[data-schedule='" + $strSchedule + "']").trigger("click");
                }

                if ($("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val() == "1") {
                    $("input.ui-button-global-schedules-waiting[data-schedule='" + $strSchedule + "']").trigger("click");
                }

                // Enable Waiting List if Locks or Weight is over current passenger list
                // -1: NULL, no limit
                //        console.log("---")
                //        console.log(parseInt($objRoute_Class_Tier_ID.attr("data-locks")))
                //        console.log($intValidLocks)
                //        console.log(parseFloat($objRoute_Class_Tier_ID.attr("data-weight")))
                //        console.log($decValidWeight);

                var blnIsConditions = false;
                var blnIsConditionsOption = ($("input.ui-hidden-global-schedules-conditions-option[data-schedule='" + $strSchedule + "']").val() == "1");
                var blnIsConditionsFlag = ($("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val() == "1");

                var blnIsWaitingList = false;
                var blnIsWaitingOption = ($("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val() == "1");
                var blnIsWaitingFlag = ($("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val() == "1");

                if ($objSelection.attr("data-acceptconditions") == "1") {
                    blnIsConditions = true;
                }

                if ((parseInt($objSelection.attr("data-locks")) != "-1" && parseInt($objSelection.attr("data-locks")) < $intValidLocks) ||
                    (parseFloat($objSelection.attr("data-weight")) != "-1" && parseFloat($objSelection.attr("data-weight")) < $decValidWeight)) {
                    if ($objSelection.attr("data-allowwaitinglist") == "1") {
                        blnIsWaitingList = true;
                    }
                };

                //if ($objSelection.attr("data-acceptconditions") == "1") {

                // TEMPORARY "false &&"
                if (blnIsConditions && !blnIsConditionsFlag) {
                    var $intTier_ID = $objSelection.attr("data-tier_id");

                    var $objTier = $("ul.ui-hidden-booking-tiers-description input[value='" + $intTier_ID + "']");
                    var $chrTier_Description = $("ul.ui-hidden-booking-tiers-description label[for='" + $objTier.attr("id") + "']").html();

                    if ($chrTier_Description === undefined) { $chrTier_Description = ""; }
                    $chrTier_Description = decodeHtml($chrTier_Description);
                    $chrTier_Description = $chrTier_Description.replace(/\n/g, '<br />');

                    //alert($objSelection.attr("data-policy_id"));
                    //alert($objSelection.attr("data-policy_conditions"));
                    //alert($objSelection.attr("data-policy_filter_id"));

                    var $intPolicy_Filter_ID = $objSelection.attr("data-policy_filter_id");

                    var $intRoute_Class_Tier_ID_Existing = $(".ui-hidden-booking-existing-route_class_tier_id").val();

                    if ($intRoute_Class_Tier_ID == $intRoute_Class_Tier_ID_Existing) {
                        $intPolicy_Filter_ID = $(".ui-hidden-booking-policy_filter_id").val();
                    }

                    //var $intPolicy_ID = $objSelection.attr("data-policy_id");

                    //if (parseInt($(".ui-hidden-booking-policy_id").val()) > 0) {
                    //    $intPolicy_ID = $(".ui-hidden-booking-policy_id").val();
                    //}

                    var $objPolicyFilter = $("ul.ui-hidden-booking-policies-filters-description input[value='" + $intPolicy_Filter_ID + "']");
                    var $chrPolicyFilter_Description = $("ul.ui-hidden-booking-policies-filters-description label[for='" + $objPolicyFilter.attr("id") + "']").html();

                    if ($chrPolicyFilter_Description === undefined) { $chrPolicyFilter_Description = ""; }
                    $chrPolicyFilter_Description = decodeHtml($chrPolicyFilter_Description);
                    $chrPolicyFilter_Description = $chrPolicyFilter_Description.replace(/\n/g, '<br />');

                    if ($objSelection.attr("data-policy_conditions") == "0") {
                        $chrTier_Description = $chrPolicyFilter_Description;
                        $chrPolicyFilter_Description = "";
                    }

                    $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "'] span.ui-label-global-schedules-conditions-tier").html($chrTier_Description);

                    $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "'] span.ui-label-global-schedules-conditions-policy").html($chrPolicyFilter_Description);

                    $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']").show();

                    //$("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                    //  .has("input:checked")
                    //  .parent()
                    //  .find("tr.ui-tablerow-global-schedules[data-route_class_id!='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                    //  .first()
                    //  .before($(".ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']"));

                    //          $("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                    //            .last()
                    //            .after($(".ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']"));


                    //var $objConditions =
                    //  $("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                    //    .has("input[value='" + $intRoute_Class_Tier_ID + "']");

                    //while ($objConditions.next().has("span.ui-booking-schedules-radio-route_class_tier_id[data-route_class_id='" + $intRoute_Class_ID + "']").length != 0 &&
                    //       $objConditions.next().has(".ui-tablecolumn-global-schedules-sorting").length == 0
                    //      ) {
                    //  $objConditions = $objConditions.next();
                    //}

                    var $objConditions =
                        $("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                            .has("input[value='" + $intRoute_Class_Tier_ID + "']");

                    while (($objConditions.next().has("span.ui-booking-schedules-radio-route_class_tier_id[data-route_class_id='" + $intRoute_Class_ID + "']").length != 0 ||
                        $objConditions.next().has(".ui-tablecolumn-global-schedules-connections").length != 0 ||
                        $objConditions.next().has(".ui-tablecolumn-global-schedules-advisory-web").length != 0) &&
                        $objConditions.next().has(".ui-tablecolumn-global-schedules-sorting").length == 0
                    ) {
                        $objConditions = $objConditions.next();
                    }

                    $objConditions
                        .after($(".ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']"));

                    //          alert("showconditions");
                    //$("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "'] div.ui-section-global-schedules-waiting")
                    //  .animate({ height: '0px' }, 0)
                    //  .animate({
                    //    height: '45px',
                    //    padding: '5px 0px 5px'
                    //  }, ($bitStartup == true) ? 0 : 2 * $intSlideTime);

                    $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "'] div.ui-section-global-schedules-waiting").show();

                    $("input.ui-hidden-global-schedules-conditions-option[data-schedule='" + $strSchedule + "']").val("1");

                    if ($bitStartup == false) {
                        $("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val("0");
                        $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val("0");
                        $bitMoveNext = false;
                    }
                }

                //else if ((parseInt($objSelection.attr("data-locks")) != "-1" && parseInt($objSelection.attr("data-locks")) < $intValidLocks) ||
                //    (parseFloat($objSelection.attr("data-weight")) != "-1" && parseFloat($objSelection.attr("data-weight")) < $decValidWeight)) {
                //  if ($objSelection.attr("data-allowwaitinglist") == "1") {
                if (blnIsWaitingList) {

                    // TEMPORARY "true ||"
                    if (blnIsConditions && !blnIsConditionsFlag) {
                    } else {
                        $.fn.SchedulesShowWaitingList($strSchedule, $intRoute_Class_ID, $intRoute_Class_Tier_ID, false, true);
                        //$("tr.ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']").show();

                        ////$("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                        ////  .has("input:checked")
                        ////  .parent()
                        ////  .find("tr.ui-tablerow-global-schedules[data-route_class_id!='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                        ////  .first()
                        ////  .before($(".ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']"));

                        //$("tr.ui-tablerow-global-schedules[data-route_class_id='" + $intRoute_Class_ID + "'][data-schedule='" + $strSchedule + "']")
                        //  .last()
                        //  .after($(".ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "']"));

                        //$("tr.ui-tablerow-global-schedules-waiting[data-schedule='" + $strSchedule + "'] div.ui-section-global-schedules-waiting")
                        //  .animate({ height: '0px' }, 0)
                        //  .animate({
                        //    height: '45px',
                        //    padding: '5px 0px 5px'
                        //  }, ($bitStartup == true) ? 0 : 2 * $intSlideTime);
                    }

                    $("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val("1");

                    if ($bitStartup == false) {
                        $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val("0");
                        $bitMoveNext = false;
                    }
                }

                //console.log($intRoute_Class_Tier_ID + " : " + $objRoute_Class_Tier_ID_Current.val());

                // Remove highlighting/classes from last selected
                //$("tr.ui-tablerow-global-schedules[data-route_class_tier_id='" + $objRoute_Class_Tier_ID_Current.val() + "']")
                $("tr.ui-tablerow-global-schedules[data-schedule='" + $strSchedule + "'] td.ui-tablecolumn-global-schedules-selection SPAN[data-route_class_tier_id='" + $objRoute_Class_Tier_ID_Current.val() + "']")
                    .parent()
                    .parent()
                    .find("td.ui-tablecolumn-global-schedules-selection-group")
                    .removeClass("ui-state-global-hover-disabled")
                    .removeClass("ui-state-global-listing-selected");

                // Removing "greying" from current schedule
                $("tr.ui-tablerow-global-schedules[data-schedule='" + $strSchedule + "']")
                    .removeClass("ui-state-global-hover");

                // Add highlighting to current selection
                $("tr.ui-tablerow-global-schedules[data-schedule='" + $strSchedule + "'] td.ui-tablecolumn-global-schedules-selection SPAN[data-route_class_tier_id='" + $intRoute_Class_Tier_ID + "']")
                    .parent()
                    .parent()
                    .find("td.ui-tablecolumn-global-schedules-selection-group")
                    .removeClass("ui-state-global-hover")
                    .addClass("ui-state-global-hover-disabled")
                    .addClass("ui-state-global-listing-selected")
                    .find(".ui-booking-schedules-radio-route_class_tier_id input").prop("checked", true);

                // Add "greying" to current schedule
                $("tr.ui-tablerow-global-schedules[data-schedule='" + $strSchedule + "'][data-route_class_id='" + $intRoute_Class_ID + "']:not([data-route_class_tier_id])")
                    .addClass("ui-state-global-hover");

                if ($intRoute_Class_Tier_ID != -1) {
                    // Payment Restrictions
                    $.fn.PaymentRestrictions()
                    // Summary: Schedule
                    $.fn.BookingSummary($strSchedule, $intRoute_Class_Tier_ID);
                    // Summary: Billing
                    $.fn.BookingBillingSummary($strSchedule, $intRoute_Class_Tier_ID, $strFare_ID, true);

                    if (!$bitStartup) {
                        $.fn.BookingBillingSummaryCoupon();
                    }
                }

                // Set new current value in input holder
                $objRoute_Class_Tier_ID_Current.val($intRoute_Class_Tier_ID).trigger("change");

                // Request Schedule
                if ($intRoute_Class_Tier_ID == -1) { $bitMoveNext = false; };

                if ($bitStartup == true) { $bitMoveNext = false; };

                $.fn.SchedulesMoveNext($strSchedule, $bitMoveNext);

                //if ($bitMoveNext == true) {
                //  var $objAutoScrollSection = $(".ui-schedules-global[data-schedule='Return']")

                //  if (!$objAutoScrollSection.length > 0 ||
                //      $strSchedule == "Return") {
                //    $objAutoScrollSection = $(".ui-booking-passengers")
                //  }

                //  if (!$objAutoScrollSection.length > 0 ||
                //      $strSchedule == "Change") {
                //    $objAutoScrollSection = $(".ui-change-passengers")
                //  }

                //  $('html, body').animate({ scrollTop: $objAutoScrollSection.offset().top - 10 }, 1000);
                //}

            });

        $("input.ui-button-global-schedules-conditions").click(function (e) {
            e.preventDefault();

            //var $objSelection =
            //  $(this)
            //  .parent()
            //  .find("td.ui-tablecolumn-global-schedules-selection SPAN");

            //var $strSchedule = $objSelection.attr("data-schedule");
            //var $intRoute_Class_Tier_ID = $objSelection.attr("data-route_class_tier_id");
            //var $intRoute_Class_ID = $objSelection.attr("data-route_class_id");

            var $btnConditions = $(this);
            var $strSchedule = $btnConditions.attr("data-schedule");

            var $objSelection = $(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='" + $strSchedule + "'] input:checked").parent();
            var $intRoute_Class_ID = $objSelection.attr("data-route_class_id");
            var $intRoute_Class_Tier_ID = $objSelection.attr("data-route_class_tier_id");

            //var $objRoute_Class_Tier_ID_Current = $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $strSchedule + "']");
            //var $intRoute_Class_ID = $objRoute_Class_Tier_ID_Current.val();

            //var $intRoute_Class_Tier_ID = $objSelection.attr("data-route_class_tier_id");
            //var $intRoute_Class_ID = $objSelection.attr("data-route_class_id");
            //var $strSchedule = $objSelection.attr("data-schedule");
            //var $radRoute_Class_Tier_ID = $objSelection.find("input[value='" + $intRoute_Class_Tier_ID + "']");

            //var $objRoute_Class_Tier_ID_Current = $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $strSchedule + "']");

            //var $intRoute_Class_ID = $btnConditions.attr("data-route_class_id");

            //alert($strSchedule);
            //alert($intRoute_Class_ID);

            $("tr.ui-tablerow-global-schedules-conditions[data-schedule='" + $strSchedule + "']").hide();

            $("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val("1");

            var $bitMoveNext = !$bitStartup;
            if ($("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val() == "1") {
                $.fn.SchedulesShowWaitingList($strSchedule, $intRoute_Class_ID, $intRoute_Class_Tier_ID, true, false);
                $bitMoveNext = false;
            }

            //alert($bitMoveNext);

            $.fn.SchedulesMoveNext($strSchedule, $bitMoveNext);
        });

        $("input.ui-button-global-schedules-waiting").click(function (e) {
            e.preventDefault();
            // e.stopPropagation();

            var $btnWaiting = $(this);
            var $strSchedule = $btnWaiting.attr("data-schedule");
            $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val("1");

            $btnWaiting
                .removeClass("ui-button-global-schedules-waiting-active")
                .addClass("ui-button-global-schedules-waiting-disabled")
                .attr("disabled", "disabled")
                .attr("value", $(".ui-label-global-schedules-waiting-disabled").attr("value"));

            var $bitMoveNext = true;

            if ($bitStartup == true) { $bitMoveNext = false; }

            if ($bitMoveNext == true) {
                var $objAutoScrollSection = $(".ui-schedules-global[data-schedule='Return']")

                if (!$objAutoScrollSection.length > 0 ||
                    $strSchedule == "Return") {
                    $objAutoScrollSection = $(".ui-booking-passengers")
                }

                if (!$objAutoScrollSection.length > 0 ||
                    $strSchedule == "Change") {
                    $objAutoScrollSection = $(".ui-change-passengers")
                }

                $('html, body').animate({ scrollTop: $objAutoScrollSection.offset().top - 10 }, 1000);
            }

        });
    };

    // Schedule Setup: Automatically calculate total locks/weight, then set <tr> classes based on active, and locks/weight restrictions
    $.fn.ScheduleSetup = function () { // Startup validation of schedules
        // Calculate Total Locks, Weight and Fare (string) by looping through passenger list
        $intTotalLocks = 0;
        $decTotalWeight = 0.00;
        $strFare_ID = "";

        // Total Passenger Locks
        $("input.ui-hidden-booking-passengers-locks:not(.ui-global-disabled)").each(function () {
            $intTotalLocks = $intTotalLocks + parseInt($(this).val());
        });
        // Total Passenger Weight
        $("input.ui-hidden-booking-passengers-weight:not(.ui-global-disabled)").each(function () {
            $decTotalWeight = $decTotalWeight + parseFloat($(this).val());
        });

        // Fare String
        $("input.ui-hidden-booking-passengers-fare_id:not(.ui-global-disabled)").each(function () {
            $strFare_ID = $strFare_ID + $(this).val() + ',';
        });

        if ($strFare_ID !== "") {
            $strFare_ID = $strFare_ID.substring(0, $strFare_ID.length - 1);
        };

        //    console.log($intTotalLocks + " : " + $decTotalWeight + " : " + $strFare_ID);

        // Setup Schedules
        // Validate Active, Locks and Weight
        // Classes:
        // .ui-state-global-listing-inactive {} // Active=0: Closed or history
        // .ui-state-global-listing-disabled {} // Active=1, Locks/Weight < 0: No space
        // .ui-state-global-listing-enabled {} // Active=1, Locks/Weight > 0: Available
        // .ui-state-global-listing-selected {} // Selected

        $(".ui-booking-schedules-radio-route_class_tier_id input[type=radio]").each(function (e) {
            var $radRoute_Class_Tier_ID = $(this);
            var $intRoute_Class_Tier_ID = $radRoute_Class_Tier_ID.val();
            var $objRoute_Class_Tier_ID = $radRoute_Class_Tier_ID.parent();
            //var $objSchedule = $("tr.ui-tablerow-global-schedules[data-route_class_tier_id='" + $intRoute_Class_Tier_ID + "']");

            var $objSelection =
                $(this)
                    .parent()
                    .parent()
                    .parent()
                    .find("td.ui-tablecolumn-global-schedules-selection-group");

            //        .find("td.ui-tablecolumn-global-schedules-selection-group");
            //$("tr.ui-tablerow-global-schedules[data-route_class_tier_id='" + $intRoute_Class_Tier_ID + "']");
            //$("tr.ui-tablerow-global-schedules td.ui-tablecolumn-global-schedules-selection SPAN");

            var $intValidLocks = $intTotalLocks;
            var $decValidWeight = $decTotalWeight;

            // Change Booking (ignore current selected/existing route)
            if ($intRoute_Class_Tier_ID == $intExistingRoute_Class_Tier_ID) {
                $intValidLocks -= $intExistingTotalLocks;
                $decValidWeight -= $decExistingTotalWeight;
            }

            if ($objRoute_Class_Tier_ID.attr("data-active") == "0") {
                $radRoute_Class_Tier_ID.attr("disabled", "disabled");
                $objSelection
                    .addClass("ui-state-global-hover-disabled")
                    .addClass("ui-state-global-listing-inactive");
                // -1: NULL, no limit
            } else if ((parseInt($objRoute_Class_Tier_ID.attr("data-locks")) != "-1" && parseInt($objRoute_Class_Tier_ID.attr("data-locks")) < $intValidLocks) ||
                (parseFloat($objRoute_Class_Tier_ID.attr("data-weight")) != "-1" && parseFloat($objRoute_Class_Tier_ID.attr("data-weight")) < $decValidWeight)) {
                $objSelection
                    .addClass("ui-state-global-listing-disabled");
            } else {
                //        $objSelection
                //          .addClass("ui-state-global-listing-enabled");
            }

            if ($radRoute_Class_Tier_ID.prop("checked") == true) {
                $radRoute_Class_Tier_ID.trigger("click");
            };

        });

        // Loop through schedules and set empty row if applicable
        var $objSchedule = new Array("Departure", "Return", "Change")

        for (var i = 0; i < $objSchedule.length; i++) {
            //$.fn.BookingRequestShow($objSchedule[i], $("input.ui-hidden-booking-route_class_tier_id[data-Schedule='" + $objSchedule[i] + "']").val() == -1);

            if ($(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='" + $objSchedule[i] + "'] input[type=radio]").length == 0) {
                $("tr.ui-tablerow-global-schedules-empty[data-schedule='" + $objSchedule[i] + "']").show();
            };
        }

        //$("tr.ui-tablerow-global-request-schedules").show();

        //$("tr.ui-tablerow-global-schedules").not("tr.ui-tablerow-global-schedules[data-Schedule!='Departure']").show();
        //$("tr.ui-tablerow-global-schedules-sorting").show();
        //$("tr.ui-tablerow-global-schedules-request-section").not("tr.ui-tablerow-global-schedules-request-section[data-Schedule!='Departure']").show();

        // Hide the "formatting schedule" <tr>
        $("tr.ui-tablerow-global-schedules-loading").hide();
    };

    // Enable Hovering / Clicks / Highlighting
    $.fn.ScheduleManagement();

    // Run Schedule Setup
    $.fn.ScheduleSetup();

    // Startup
    $("tr.ui-tablerow-global-request-schedules[data-Schedule='Departure']").show();
    //$("tr.ui-tablerow-global-request-schedules[data-Schedule='Return']").show();

    //$.fn.BookingRequestShow($objSchedule[i], $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $objSchedule[i] + "']").val() == -1);
    //$.fn.BookingRequestShow("Return", $("input.ui-hidden-booking-route_class_tier_id[data-schedule='Return']").val() == -1);

    var $objSchedule = new Array("Departure", "Return")

    for (var i = 0; i < $objSchedule.length; i++) {
        $.fn.BookingRequestShow($objSchedule[i], $("input.ui-hidden-booking-route_class_tier_id[data-schedule='" + $objSchedule[i] + "']").val() == -1);

        // Set first option is none are selected
        if ($(".ui-tablerow-global-schedules-information[data-Schedule='" + $objSchedule[i] + "'] .ui-radiolist-booking-request-options input[type=radio]:checked").length == 0) {
            $(".ui-tablerow-global-schedules-information[data-Schedule='" + $objSchedule[i] + "'] .ui-radiolist-booking-request-options input[type=radio]").first().prop("checked", true);
        }
    }

    // Disabling credit card icons when not in use
    if ($("ul.ui-radiolist-booking-payment span[data-control='AuthorizeNet'][data-reference='American Express'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-authorizenet-cards li.amex").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='AuthorizeNet'][data-reference='Discover'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-authorizenet-cards li.discover").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='AuthorizeNet'][data-reference='Master Card'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-authorizenet-cards li.mastercard").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='AuthorizeNet'][data-reference='Visa'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-authorizenet-cards li.visa").hide();
    }

    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='UnionPay'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.china_unionpay").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='American Express'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.amex").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='Discover'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.discover").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='Master Card'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.mastercard").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='Visa'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.visa").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='UnionPay'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-charge-cards li.china_unionpay").hide();
    }

    //if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='Auto'] input[type='radio']").not(":disabled").length == 0) {
    //}

    // Disabling credit card icons when not in use
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='American Express'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-miraserv-cards li.amex").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='Discover'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-miraserv-cards li.discover").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='Master Card'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-miraserv-cards li.mastercard").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='Visa'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-miraserv-cards li.visa").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='UnionPay'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-miraserv-cards li.china_unionpay").hide();
    }

    // Disabling credit card icons when not in use
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='American Express'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-mirasecure-cards li.amex").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='Discover'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-mirasecure-cards li.discover").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='Master Card'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-mirasecure-cards li.mastercard").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='Visa'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-mirasecure-cards li.visa").hide();
    }
    if ($("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='UnionPay'] input[type='radio']").not(":disabled").length == 0) {
        $("ul.ui-list-booking-payment-mirasecure-cards li.china_unionpay").hide();
    }

    $bitStartup = false;

    // Fare Breakdown / Total Link
    $("a.ui-link-global-schedules-dialog-fare").click(function (e) {
        e.stopPropagation();

        var $objBookingSchedulesTotal = $(this);
        $.fn.BookingSchedulesFareDialog(e, [$objBookingSchedulesTotal.attr("data-route_class_tier_id")], -1);
    });

    // 2: Passengers

    // Credentials

    // Login: Show/Hide
    $.fn.PassengersCredentialsAccountClick = function ($objLogin, $objLoginButton) {
        if ($objLogin.is(":checked")) {
            $(".ui-booking-passengers-credentials-login").slideDown($intSlideTime);
            $objLoginButton
                .removeClass("ui-link-booking-passengers-credentials-account-active")
                .addClass("ui-link-booking-passengers-credentials-account-disabled");
        } else {
            $(".ui-booking-passengers-credentials-login").slideUp($intSlideTime);
            $objLoginButton
                .addClass("ui-link-booking-passengers-credentials-account-active")
                .removeClass("ui-link-booking-passengers-credentials-account-disabled");
        }
    };

    // [ ] Login to your account: Click()
    $(".ui-labelbox-booking-passengers-credentials-account input[type='checkbox']").click(function (e) {
        $.fn.PassengersCredentialsAccountClick($(this), $("a.ui-link-booking-passengers-credentials-account"));
    }).each(function (e) {
        $.fn.PassengersCredentialsAccountClick($(this), $("a.ui-link-booking-passengers-credentials-account"));
    });

    // Login Now button: Click()
    $("a.ui-link-booking-passengers-credentials-account").click(function (e) {
        $(".ui-labelbox-booking-passengers-credentials-account input[type='checkbox']").trigger("click");
    });

    // Automatic Credentials Styling (Customer #, Email, Agent) of Radio and Inputs
    var $strPassengersLoginOption = "";

    $.fn.PassengersCredentialsSelection = function ($strOption) {
        // Prevent drop-down selection issues with Agent
        if ($strPassengersLoginOption == $strOption) {
            return;
        };

        if ($strOption == 'Contact_ID') {
            $(".ui-textbox-booking-passengers-credentials-contact_id")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-textbox-booking-passengers-credentials-contact_id")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        if ($strOption == 'Email') {
            $(".ui-textbox-booking-passengers-credentials-email")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-textbox-booking-passengers-credentials-email")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        if ($strOption == 'Agent') {
            $(".ui-dropdown-booking-passengers-credentials-agent-service, .ui-textbox-booking-passengers-credentials-agent-member")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-dropdown-booking-passengers-credentials-agent-service, .ui-textbox-booking-passengers-credentials-agent-member")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        $strPassengersLoginOption = $strOption;
    };

    // Credentials Option: Click()
    $(".ui-radio-booking-passengers-credentials-login input[type='radio']").change(function (e) {
        var $objPassengersLoginOption = $(this);
        $.fn.PassengersCredentialsSelection($objPassengersLoginOption.parent().attr("data-option"));
    }).each(function (e) { // Startup
        var $objPassengersLoginOption = $(this);
        if ($objPassengersLoginOption.is(":checked") == true) {
            $.fn.PassengersCredentialsSelection($objPassengersLoginOption.parent().attr("data-option"));
        }
    });

    // Credentials Input: MouseDown()
    $(".ui-input-booking-passengers-credentials").mousedown(function (e) {
        $objPassengersLoginInput = $(this);
        $(".ui-radio-booking-passengers-credentials-login[data-option='" + $objPassengersLoginInput.attr("data-option") + "'] input[type='radio']").trigger("click");
    });

    // Remember my login account: Click()
    $(".ui-labelbox-booking-passengers-credentials-option-remember input[type='checkbox']").click(function (e) {
        var $objPassengersLoginRemember = $(this)
        if ($objPassengersLoginRemember.is(":checked")) {
            $(".ui-labelbox-booking-passengers-credentials-option-automatic input[type='checkbox']").removeAttr("disabled");
        } else {
            $(".ui-labelbox-booking-passengers-credentials-option-automatic input[type='checkbox']")
                .attr("disabled", "disabled")
                .removeAttr("checked");
        };
    });

    // <Enter> on Password
    $("input.ui-textbox-booking-passengers-credentials-password").keydown(function (e) {
        if (e.which == 13) {
            $(".ui-button-booking-passengers-credentials-login").focus();
            $(".ui-button-booking-passengers-credentials-login").trigger("click");
        };
    });

    // Password Recovery : Modal
    $(".ui-link-booking-passengers-credentials-password-recovery").click(function (e) {
        e.preventDefault();
        //e.stopPropagation();
        $.fn.BookingCredentialsPasswordRecoveryDialog(e);
    });

    // Login | Logout
    $(".ui-button-booking-passengers-credentials-login, .ui-link-global-logout").click(function (e) {
        //e.preventDefault();

        $.Watermark.HideAll();

        $.fn.Processing();
        //$.fn.Submit($(this).attr("ID"), true, true, false);
    });

    // Primary Address: Show/Hide
    $.fn.PassengersAddressShow = function () {
        if ($(".ui-hidden-global-contact").val() == -1) {
            $(".ui-booking-passengers-address").hide();
            $(".ui-booking-passengers-exemptions").hide();
        }
        // Travel Agents | New Customer | My Account | Customers : Click()
        else if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option input[type='radio']:checked").val() != 1) {
            $(".ui-booking-passengers-address").hide();
            $(".ui-booking-passengers-exemptions").hide();
        } else {
            $(".ui-booking-passengers-address").show();
            if ($(".ui-hidden-global-agent").val() == -1) {
                $(".ui-booking-passengers-exemptions").show();
            }
        }
    };

    $.fn.PassengersAddressShow();

    // Agents: New Customer, My Account: Click()
    $(".ui-radio-booking-passengers-agents-option input[type='radio']").click(function (e) {
        var $objPassengersAgentOption = $(this);

        if ($objPassengersAgentOption.attr("value") == 1 ||
            $objPassengersAgentOption.attr("value") == 0 ||
            $objPassengersAgentOption.attr("value") == 3) {
            if ($("select.ui-dropdown-booking-passengers-agents-contact_id").val() != 0) {
                $("select.ui-dropdown-booking-passengers-agents-contact_id")
                    .val(0)
                    .trigger("change");
            };
        };
        //    $.fn.PassengersAgentsOption($objPassengersAgentOption.attr("value"));
        $.fn.PassengersAddressShow();

    }).each(function (e) {
        var $objPassengersAgentOption = $(this);
        if ($objPassengersAgentOption.is(":checked")) {
            //$.fn.PassengersAgentsOption($objPassengersAgentOption.attr("value"));
            $.fn.PassengersAddressShow();
        }
    });
    // Agents: Customers/Existing: MouseDown()
    $("select.ui-dropdown-booking-passengers-agents-contact_id").mousedown(function (e) {
        $(".ui-radio-booking-passengers-agents-option-agent_contact_id input[type='radio']").prop("checked", true);
        $(".ui-radio-booking-passengers-agents-option-agent_contact_id input[type='radio']").trigger("click");
    });

    // Agents: Customers/Existing: Change()
    $("select.ui-dropdown-booking-passengers-agents-contact_id").change(function (e) {
        var $objPassengersAgentOptionContact_ID = $(this);

        if ($objPassengersAgentOptionContact_ID.val() == 0) {
            $("input.ui-button-booking-passengers-clear").first().trigger("click");
        } else {
            // Agent Customer: Automatically set the .first() Contact ID in the passenger list, trigger Click()

            var $intAgent_Contact_ID = $objPassengersAgentOptionContact_ID.val();
            var $intContact_ID = 0;

            if ($.isNumeric($intAgent_Contact_ID) == true) {
                $.ajax({
                    type: "GET",
                    url: "/Search/AgentsMembers.aspx",
                    data: "Session=" + $strSession + "&Agent_Contact_ID=" + $intAgent_Contact_ID,
                    async: false,
                    success: function ($data) {
                        if (parseInt($data.Contact_ID) !== 0) {
                            $intContact_ID = $data.Contact_ID;
                            //              $("input.ui-textbox-booking-passengers-contact_id-selected[data-Item='" + $strItem + "']").val($data.Contact_ID);
                            //              $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").val($data.Contact_ID);
                            //              $("input.ui-textbox-booking-passengers-first[data-Item='" + $strItem + "']").val($data.First);
                            //              $("input.ui-textbox-booking-passengers-last[data-Item='" + $strItem + "']").val($data.Last);
                            $bitValid = true;
                        }
                    },
                    error: function () { $bitValid = false; }
                });
            };

            $("input.ui-hidden-booking-passengers-activated").first().val("0");
            $("input.ui-textbox-booking-passengers-contact_id").first().removeAttr("disabled")
                .val($intContact_ID);
            //  .val($objPassengersAgentOptionContact_ID.val());

            $("input.ui-hidden-booking-passengers-selected").first().val($intContact_ID);
            $("input.ui-button-booking-passengers-search").first().trigger("click");
        }
    });

    // Agents: Existing Customer: Click()
    $(".ui-radio-booking-passengers-agents-option-existing").click(function (e) {
        $("input.ui-textbox-booking-passengers-contact_id").first().focus();
    });

    // Passengers Search: Click()
    $("input.ui-textbox-booking-passengers-contact_id").keydown(function (e) {
        var $objContact_ID = $(this);
        var $strItem = $objContact_ID.attr("data-item");

        //e.stopPropagation();
        $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");
        $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");

        if (e.which == 13) {
            $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").trigger("click");
            return false;
        };
    });

    $("input.ui-button-booking-passengers-search").click(function (e) {
        var $objBookingPassengersListSearch = $(this);
        var $strItem = $objBookingPassengersListSearch.attr("data-Item");
        var $intContact_ID = $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").val();
        var $bitValid = false;

        if ($.isNumeric($intContact_ID) == true) {
            $.ajax({
                type: "GET",
                url: "/Search/Contacts.aspx",
                data: "Session=" + $strSession + "&Contact_ID=" + $intContact_ID,
                async: false,
                success: function ($data) {
                    if (parseInt($data.Contact_ID) !== 0) {

                        $("input.ui-textbox-booking-passengers-contact_id-selected[data-Item='" + $strItem + "']").val($data.Contact_ID);
                        $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").val($data.Contact_ID);
                        $("input.ui-textbox-booking-passengers-first[data-Item='" + $strItem + "']").val($data.First);
                        $("input.ui-textbox-booking-passengers-last[data-Item='" + $strItem + "']").val($data.Last);

                        $bitValid = true;
                    }
                },
                error: function () { $bitValid = false; }
            });
        };

        // Show .ui-state-global-error on failed lookup
        if (!$bitValid) {
            $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").addClass("ui-state-global-error");
            $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").addClass("ui-state-global-error");
            e.preventDefault();
            return false;
        }

        // Show Progress Bar on Success
        //$.fn.Submit('', false, true, false);
        $.fn.Processing();
        return;
    });

    $("input.ui-button-booking-passengers-clear").click(function (e) {
        //$.fn.Submit('', false, true, false);
        $.fn.Processing();
        return;
    });

    // Passenger Gender: Change() -- automatically submit()
    $("select.ui-dropdown-booking-passengers-gender:not(.ui-global-disabled)").change(function (e) {
        //$.fn.Submit("", true, true, false);
        $.fn.Processing();
    });

    // Change Booking : Add Passenger
    $(".ui-link-booking-passengers-add").click(function (e) {
        //e.preventDefault();

        $.Watermark.HideAll();

        var $objPassengerAdd = $(this);
        var $strItem = $objPassengerAdd.attr("data-item");

        var $bitValidated = true;

        if ($("input.ui-textbox-booking-passengers-first[data-item='" + $strItem + "']").val() == "") {
            $("input.ui-textbox-booking-passengers-first[data-item='" + $strItem + "']").addClass("ui-state-global-error");
            $bitValidated = false;
        };

        if ($("input.ui-textbox-booking-passengers-last[data-item='" + $strItem + "']").val() == "") {
            $("input.ui-textbox-booking-passengers-last[data-item='" + $strItem + "']").addClass("ui-state-global-error");
            $bitValidated = false;
        };

        // Validate Email, if exists
        if ($("input.ui-textbox-booking-passengers-email[data-item='" + $strItem + "']").val() != "") {
            if ($.fn.IsEmail($("input.ui-textbox-booking-passengers-email[data-item='" + $strItem + "']").val(), true) == false) {
                $("input.ui-textbox-booking-passengers-email[data-item='" + $strItem + "']").addClass("ui-state-global-error");
                $bitValidated = false;
            }
        };

        $blnRequiredBirthdate = $(".ui-hidden-booking-passengers-required-birthdate").val();

        var $objValidation = $(".ui-textbox-booking-passengers-birthdate[data-item='" + $strItem + "']");

        if ($(".ui-hidden-booking-passengers-activated[data-item='" + $objValidation.attr("data-item") + "']").val() == "-1") {
            // Activated / Ignore
        } else if ($blnRequiredBirthdate == "0") {
        } else if ($objValidation.val() == "") {
            $objValidation.addClass("ui-state-global-error");
            $bitValidated = false;
        };

        //alert($("input.ui-textbox-booking-passengers-last[data-item='" + $strItem + "']").val())

        if ($bitValidated == false) {
            e.preventDefault();

            $.Watermark.ShowAll();

            return false;
        }

        //$.fn.Submit($(this).attr("ID"), true, true, false);
        $.fn.Processing();
    });

    $(".ui-link-booking-passengers-delete").click(function (e) {
        $.Watermark.HideAll();

        $.fn.Processing();
    });

    // Travel Documentation
    $("select.ui-dropdown-booking-passengers-documentation-issued").change(function (e) {
        var $objCountry = $(this);
        $("select.ui-dropdown-booking-passengers-documentation-nationality[data-item='" + $objCountry.attr("data-Item") + "']").val($objCountry.val());
        $("select.ui-dropdown-booking-passengers-documentation-residence[data-item='" + $objCountry.attr("data-Item") + "']").val($objCountry.val());
    });

    $("input.ui-datebox-global").change(function (e) {
        $(this).val(DateISOFormat($(this).val()));
    });

    // Flags
    $.fn.SetFlagOption = function ($objFlag) {
        $chkFlag = $objFlag.find(".ui-checkbox-booking-passengers-flags-flag input[type='checkbox']");
        $objOptions = $objFlag.find(".ui-dropdown-booking-passengers-flags-options");

        $objOptions.attr("disabled", !$chkFlag.is(':checked'));

        if (// $chkFlag.is(':checked') &&
            $objOptions.attr("optionsrequired") == "true" && $objOptions.val() == "") {
            $objOptions.addClass("ui-state-global-required");
        } else {
            $objOptions.removeClass("ui-state-global-required");
        }

        $objOptions.removeClass("ui-state-global-error");
    }

    $(".ui-checkbox-booking-passengers-flags-flag input[type='checkbox']").click(function (e) {
        $.fn.SetFlagOption($(this).parent().parent());
    }).each(function (e) {
        $.fn.SetFlagOption($(this).parent().parent());
    })

    $(".ui-dropdown-booking-passengers-flags-options").change(function (e) {
        $.fn.SetFlagOption($(this).parent());
    })

    $.fn.mValidateTransport = function ($objSchedules) {
        var $bitValid = true;

        // Pickup and Dropoff Requirements
        var $objTransportOptions = ["Pickup", "Dropoff"];

        for (var $intSchedule in $objSchedules) {
            // Grab the Schedule identifier
            var $strSchedule = $objSchedules[$intSchedule];

            //if (typeof $(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='" + $strSchedule + "'] input[type=radio]:checked").val() === "undefined") {

            if ($(".ui-hidden-booking-route_class_tier_id[data-Schedule='" + $strSchedule + "']").val() > 0) {
                for (var $optTransport in $objTransportOptions) {
                    var $strTransport = $objTransportOptions[$optTransport];

                    var $objTransport = $(".ui-list-booking-summary-transport[data-schedule='" + $strSchedule + "'][data-transport='" + $strTransport + "']")
                    var $objTransportList = $objTransport.find(".ui-dropdown-booking-summary-schedules-transport");
                    var $strTransportValue = $objTransport.find(".ui-hidden-booking-summary-schedules-transport").val();
                    var $bitTransportRequired = $objTransport.find(".ui-hidden-booking-summary-schedules-transport-required").val();

                    //alert($strSchedule);
                    //alert($strTransportValue);
                    //alert($bitTransportRequired);

                    if ($bitTransportRequired == "1") {
                        if ($strTransportValue == "") {
                            $objTransportList.addClass("ui-state-global-error");
                            $bitValid = false;
                        }
                    }
                }
            }
        }

        return $bitValid;
    };

    function IsValidISODate(strDate, minDate, maxDate) {
        var bits = strDate.split('-');
        if (bits[0].length == 2) { bits[0] = '20' + bits[0]; }
        var d = new Date(bits[0], bits[1] - 1, bits[2]);

        if (d.getFullYear() < 1900) { return false; }
        if (d.getFullYear() > 2099) { return false; }
        if (d < minDate && minDate !== undefined) { return false; }
        if (d > maxDate && maxDate !== undefined) { return false; }
        if (d.getFullYear() == parseInt(bits[0]) && d.getMonth() + 1 == parseInt(bits[1]) && d.getDate() == parseInt(bits[2])) {
            return true;
        }
        return false;
    }

    function DateISOFormat(strDate) {
        if (IsValidISODate(strDate, void 0, void 0)) {
            var bits = strDate.split('-');
            if (bits[0].length == 2) { bits[0] = '20' + bits[0]; }
            var d = new Date(bits[0], bits[1] - 1, bits[2]);
            //return d.getFullYear + '-' + d.getMonth + '-' + d.getDay;

            var
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
            //return d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]);
        } else {
            return strDate;
        }
    }

    // Change Booking : Update Booking
    $(".ui-button-booking-update").click(function (e) {
        //    e.preventDefault();

        $.Watermark.HideAll();

        var $intScroll = 99;
        var $intScrollOption = 0;

        var $bitValidated = true;
        var $arrValidationErrors = [];

        // Departure | Return Selections
        // Check if schedule is enabled
        var $objSchedules = ["Change"]

        for (var i in $objSchedules) {
            // Grab the Schedule identifier
            var $strSchedule = $objSchedules[i];

            if ($(".ui-panel-global-schedules[data-schedule='" + $strSchedule + "']").length == 1) {
                if (typeof $(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='" + $strSchedule + "'] input[type=radio]:checked").val() === "undefined") {

                    $("tr.ui-tablerow-global-schedules-error[data-schedule='" + $strSchedule + "']").show();

                    $bitValidated = false;
                    $intScroll = Math.min((i * 2) + 1, $intScroll);
                    $arrValidationErrors.push($(".ui-label-booking-book-error-schedules[data-schedule='" + $strSchedule + "']").val());
                }

                if ($("input.ui-hidden-global-schedules-conditions-option[data-schedule='" + $strSchedule + "']").val() == 1 &&
                    $("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val() == 0) {

                    if ($.fn.browserEnhanced() == true) {
                        $(".ui-button-global-schedules-conditions[data-schedule='" + $strSchedule + "']").effect("pulsate", { times: 2 }, 2500);
                    };

                    $bitValidated = false;
                    $intScroll = Math.min((i * 2) + 2, $intScroll)
                    $intScrollOption = 1;
                }

                if ($("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val() == 1 &&
                    $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val() == 0) {

                    if ($.fn.browserEnhanced() == true) {
                        $(".ui-button-global-schedules-waiting[data-schedule='" + $strSchedule + "']").effect("pulsate", { times: 2 }, 2500);
                    };

                    $bitValidated = false;
                    $intScroll = Math.min((i * 2) + 2, $intScroll)
                    $intScrollOption = 2;
                }
            };
        }

        if ($(".ui-change-passengers").length) {
            // Ensure at least one passenger
            if ($(".ui-hidden-booking-passengers-locks:not(.ui-global-disabled)").length == 0) {
                //$(".ui-textbox-booking-passengers-first").addClass("ui-state-global-error");
                //$(".ui-textbox-booking-passengers-last").addClass("ui-state-global-error");
                $(".ui-link-booking-passengers-add").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(3, $intScroll)
            }

            var $objPassengerAdd = $(".ui-link-booking-passengers-add")
            var $strItemAdd = $objPassengerAdd.attr("data-item");

            if ($("input.ui-textbox-booking-passengers-first[data-item='" + $strItemAdd + "']").val() != "") {
                //$("input.ui-textbox-booking-passengers-first[data-item='" + $strItemAdd + "']").addClass("ui-state-global-error");
                $(".ui-link-booking-passengers-add").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(3, $intScroll)
            };

            if ($("input.ui-textbox-booking-passengers-last[data-item='" + $strItemAdd + "']").val() != "") {
                //$("input.ui-textbox-booking-passengers-last[data-item='" + $strItemAdd + "']").addClass("ui-state-global-error");
                $(".ui-link-booking-passengers-add").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(3, $intScroll)
            };

            if ($.fn.IsBookingDocumentation()) {
                var $bitValidatedDocumentation = true;

                $(".ui-panel-booking-passengers-documentation[data-Item!='" + $strItemAdd + "']").each(function (e) {
                    //$(".ui-labelbox-booking-passengers-documentation-change[data-Item!='" + $strItemAdd + "']").each(function (e) {
                    //debugger;
                    //var $objDocumentation = $(this);

                    var $strItem = $(this).attr("data-Item");
                    if ($(this).find("input.ui-hidden-booking-passengers-documentation-enabled").val() == "0") { return true; }

                    var $bitDocumentationChecked = $(this).find(".ui-labelbox-booking-passengers-documentation-change input").prop("checked");

                    if ($bitDocumentationChecked) {
                        // Ignore add passenger section
                        var $objName = $(this).find(".ui-labelbox-booking-passengers-documentation-name input");

                        if ($objName.prop("checked")) {
                            var $objNameFirst = $(this).find("input.ui-textbox-booking-passengers-documentation-first[data-Item='" + $strItem + "']");
                            var $objNameMiddle = $(this).find("input.ui-textbox-booking-passengers-documentation-middle[data-Item='" + $strItem + "']");
                            var $objNameLast = $(this).find("input.ui-textbox-booking-passengers-documentation-last[data-Item='" + $strItem + "']");

                            if ($objNameFirst.val() == "") {
                                $objNameFirst.addClass("ui-state-global-error");
                                $bitValidatedDocumentation = false;
                            }

                            if ($objNameLast.val() == "") {
                                $objNameLast.addClass("ui-state-global-error");
                                $bitValidatedDocumentation = false;
                            }
                        }

                        $(this).find("select.ui-dropdown-booking-passengers-documentation-gender").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("input.ui-textbox-booking-passengers-documentation-date_birth").each(function () {
                            if (!IsValidISODate($(this).val(), void 0, new Date())) {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("select.ui-dropdown-booking-passengers-documentation-code").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("input.ui-textbox-booking-passengers-documentation-number").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("select.ui-dropdown-booking-passengers-documentation-nationality").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("select.ui-dropdown-booking-passengers-documentation-residence").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("select.ui-dropdown-booking-passengers-documentation-issued").each(function () {
                            if ($(this).val() == "") {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })

                        $(this).find("input.ui-textbox-booking-passengers-documentation-date_activation").each(function () {
                            if ($(this).val() != '') {
                                if (!IsValidISODate($(this).val(), new Date(1900, 0, 0), void 0)) {
                                    $bitValidatedDocumentation = false;
                                    $(this).addClass("ui-state-global-error");
                                }
                            }
                        })

                        $(this).find("input.ui-textbox-booking-passengers-documentation-date_expiration").each(function () {
                            if (!IsValidISODate($(this).val(), new Date(), void 0)) {
                                $bitValidatedDocumentation = false;
                                $(this).addClass("ui-state-global-error");
                            }
                        })
                    }

                });

                if (!$bitValidatedDocumentation) {
                    $bitValidated = false;
                    $intScroll = Math.min(3, $intScroll);
                }
            }
        }

        if ($(".ui-change-summary").length) {
            if (!$.fn.mValidateTransport($objSchedules)) {
                $bitValidated = false;
                $intScroll = Math.min(4, $intScroll);
            }
        }

        if (!$.fn.ValidationConfirmation()) {
            $bitValidated = false;
            $intScroll = Math.min(5, $intScroll)
        }

        var $objAgreement = $(".ui-labelbox-agreement-confirmation input[type='checkbox']")

        if ($objAgreement.length == 1) {
            if ($objAgreement.is(":checked") == false) {
                $(".ui-agreement-confirmation").addClass("ui-state-global-error");
                //$(".ui-agreement-legal").slideDown($intSlideTime);

                //$(".ui-button-confirmation-agreement").delay(500).effect("pulsate", { times: 2 }, 1000);
                $bitValidated = false;
                $intScroll = Math.min(11, $intScroll)
            }
        }

        if ($bitValidated == false) {
            var $intOffset = $("html, body").offset().top;

            //alert($intScroll);

            if ($intScroll == 1) { $intOffset = $(".ui-panel-global-schedules[data-Schedule='Change']").offset().top - 20; }
            if ($intScroll == 2) {
                if ($intScrollOption == 1) {
                    if ($(".ui-tablerow-global-schedules-conditions[data-schedule='Change']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-conditions[data-schedule='Change']").offset().top - 100;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Change']").offset().top - 20;
                    }
                }

                if ($intScrollOption == 2) {
                    if ($(".ui-tablerow-global-schedules-waiting[data-schedule='Change']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-waiting[data-schedule='Change']").offset().top - 100;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Change']").offset().top - 20;
                    }
                }
            }

            if ($intScroll == 3) { $intOffset = $(".ui-change-passengers").offset().top - 20; }
            if ($intScroll == 4) { $intOffset = $(".ui-change-summary").offset().top - 20; }
            if ($intScroll == 5) { $intOffset = $(".ui-change-confirmation").offset().top - 20; }
            if ($intScroll == 11) { $intOffset = $(".ui-agreement").offset().top - 20; }

            //$intOffset = $("[data-Schedule='Return']")

            $('html, body').animate({ scrollTop: $intOffset }, 'slow');

            $.Watermark.ShowAll();

            e.preventDefault();

            return false;
        }

        //$.fn.Submit($(this).attr("ID"), true, true, false);

        $.fn.Processing();

        return true;
    });

    // Validations
    $.fn.ValidationConfirmation = function () {
        var $strConfirmationMethod = $(".ui-radio-booking-confirmation-option input[type='radio']:checked").closest("span").attr("data-option");

        if ($strConfirmationMethod == "Email") {
            // Validate Primary Email Address
            if ($.fn.IsEmail($("input.ui-textbox-booking-confirmation-email-primary").val(), true) == false) {
                $("input.ui-textbox-booking-confirmation-email-primary").addClass("ui-state-global-error");
                return false;
            }
            // Validate Alternate Email, if exists
            if ($("input.ui-textbox-booking-confirmation-email-alternate").val() != "") {
                if ($.fn.IsEmail($("input.ui-textbox-booking-confirmation-email-alternate").val(), true) == false) {
                    $("input.ui-textbox-booking-confirmation-email-alternate").addClass("ui-state-global-error");
                    return false;
                }
            }
        } else if ($strConfirmationMethod == "Text") {
            // Validate text number
            if ($("input.ui-textbox-booking-confirmation-text").val() == "") {
                $("input.ui-textbox-booking-confirmation-text").addClass("ui-state-global-error");
                return false;
            }
        } else if ($strConfirmationMethod == "Phone") {
            // Validate phone number
            if ($("input.ui-textbox-booking-confirmation-phone").val() == "") {
                $("input.ui-textbox-booking-confirmation-phone").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-confirmation-phone-method").addClass("ui-state-global-error");
                return false;
            }
        } else if ($strConfirmationMethod == "None") {
        }

        return true;
    }

    // $.fn.SummaryFlags = function () {
    //     var $objSummaryFlags = $(".ui-booking-summary-flags")
    //     var $bitFlags = false;

    //     // Hide the flag list
    //     $objSummaryFlags.hide();

    //     // Remove Summary Flags List
    //     $(".ui-booking-summary-flags-information li.ui-clone-global").remove();

    //     var $strDescription = "" // $objFlag.find("label[for]").text();

    //     $(".ui-checkboxlist-passengers-flags li").each(function (e) {
    //         var $objFlag = $(this);

    //         var $objCheckBox = $objFlag.find("input[type='checkbox']");

    //         if ($objCheckBox.prop("checked") == true) {
    //             $bitFlags = true;
    //             $strDescription = $objFlag.find("label[for]").text();

    //             // Find and clone the appropriate activated[0/1] <li>
    //             var $objSummaryFlagsItem =
    //                 $objSummaryFlags
    //                     .find("li.ui-global-model-summary-flags:not(.ui-clone-global)")
    //                     .wrapAll("<div />")
    //                     .parent()
    //                     .clone();

    //             $objSummaryFlagsItem
    //                 .children()
    //                 .addClass("ui-clone-global")
    //                 .show();

    //             $objSummaryFlagsItem.children().html($objSummaryFlagsItem.children().html().replace("{0}", $strDescription));

    //             $objSummaryFlags
    //                 .children("ul.ui-booking-summary-flags-information")
    //                 .append($objSummaryFlagsItem);
    //         }
    //     });

    //     // Show the Flags List
    //     if ($bitFlags == true) { $objSummaryFlags.show(); }
    // }

    // Show flag options in summary
    // $(".ui-checkboxlist-passengers-flags li input[type='checkbox']").click(function (e) {
    //     $.fn.SummaryFlags();
    // });

    // $.fn.SummaryFlags();

    //  // Capital First Letter
    //  $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last, .ui-textbox-booking-passengers-address-company, .ui-textbox-booking-passengers-address-address, .ui-textbox-booking-passengers-address-city").change(function (e) {
    //    var $objBookingPassengerName = $(this);
    //    $objBookingPassengerName.val($.fn.CapsFirst($objBookingPassengerName.val()));
    //  });

    //  // Capital First Letter
    //  $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last, .ui-textbox-booking-passengers-address-company, .ui-textbox-booking-passengers-address-address, .ui-textbox-booking-passengers-address-city").change(function (e) {
    //    var $objBookingPassengerName = $(this);
    //    $objBookingPassengerName.val($.fn.CapsFirst($objBookingPassengerName.val()));
    //  });

    //  // Upper Case
    //  $(".ui-textbox-booking-passengers-address-state, .ui-textbox-booking-passengers-address-zip").change(function (e) {
    //    var $objBookingPassengerName = $(this);
    //    $objBookingPassengerName.val($objBookingPassengerName.val().toUpperCase());
    //  });

    //  // Lower Case
    //  $(".ui-type-global-email").change(function (e) {
    //    var $objBookingPassengerName = $(this);
    //    $objBookingPassengerName.val($objBookingPassengerName.val().toLowerCase());
    //  });

    //  // Phone formatting
    //  $(".ui-type-global-phone").change(function (e) {
    //    var $objPhone = $(this);
    //    var $objNumber = $objPhone.val().replace(/[^0-9]/g, '');

    //    if ($objNumber.length == 10) {
    //      $objNumber = $objNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    //    };

    //    $objPhone.val($objNumber);
    //  });

    // List Primary Passengers
    $.fn.PassengersAddressPrimary = function () {
        // Disable Watermakering : Avoids "First Name", "Last Name" issues in Primary List
        $.Watermark.HideAll();

        // Get the passenger list
        var $objSummaryPassengers = $(".ui-booking-summary-passengers")

        // Hide the passenger list
        $objSummaryPassengers.hide();

        // Remove Summary Passengers List
        $(".ui-booking-summary-passengers-information li.ui-clone-global").remove();

        // Loop through all Primary Passengers (Name) list
        $("select.ui-dropdown-booking-passengers-address-primary option").each(function (e) {
            $objPassengersAddressPrimary = $(this);

            // Find related First/Last Name
            var $bitActivated = $("input.ui-hidden-booking-passengers-activated[data-item='" + $objPassengersAddressPrimary.val() + "']").val();
            var $intContact_ID = $("input.ui-textbox-booking-passengers-contact_id[data-item='" + $objPassengersAddressPrimary.val() + "']").val();
            var $strFirst = $("input.ui-textbox-booking-passengers-first[data-item='" + $objPassengersAddressPrimary.val() + "']").val();
            var $strLast = $("input.ui-textbox-booking-passengers-last[data-item='" + $objPassengersAddressPrimary.val() + "']").val();
            var $strGender = $("select.ui-dropdown-booking-passengers-gender[data-item='" + $objPassengersAddressPrimary.val() + "'] option:selected").text();

            // Primary Passenger: Update text in drop-down option
            $objPassengersAddressPrimary.text($strFirst + ' ' + $strLast);

            if ($bitActivated == 0) {
                $objPassengersAddressPrimary.removeAttr("disabled");
            } else {
                $objPassengersAddressPrimary.attr("disabled", "disabled");
            }

            // Populate Summary Passenger List, requires first or last name
            if ($strFirst != "" || $strLast != "") {

                // Find and clone the appropriate activated[0/1] <li>
                var $objSummaryPassengersItem =
                    $objSummaryPassengers
                        .find("li.ui-global-model-summary-passengers:not(.ui-clone-global)[data-activated='" + $bitActivated + "']")
                        .wrapAll("<div />")
                        .parent()
                        .clone();

                $objSummaryPassengersItem
                    .children()
                    .addClass("ui-clone-global")
                    .show();

                $objSummaryPassengersItem.children().html($objSummaryPassengersItem.children().html().replace("{0}", $intContact_ID));
                $objSummaryPassengersItem.children().html($objSummaryPassengersItem.children().html().replace("{1}", $strFirst));
                $objSummaryPassengersItem.children().html($objSummaryPassengersItem.children().html().replace("{2}", $strLast));
                $objSummaryPassengersItem.children().html($objSummaryPassengersItem.children().html().replace("{3}", $strGender));

                $objSummaryPassengers
                    .children("ul.ui-booking-summary-passengers-information")
                    .append($objSummaryPassengersItem);

                // Show the Passenger List
                $objSummaryPassengers.show();
            }

        });


        var $objPassengersAddressRequest = $("select.ui-dropdown-booking-passengers-address-primary option").first();

        var $strRequestFirst = $("input.ui-textbox-booking-passengers-first[data-item='" + $objPassengersAddressRequest.val() + "']").val();
        var $strRequestLast = $("input.ui-textbox-booking-passengers-last[data-item='" + $objPassengersAddressRequest.val() + "']").val();

        $(".ui-textbox-booking-passengers-address-request-name").val(($strRequestFirst + ' ' + $strRequestLast).trim()).trigger("change");

        // Re-enable Watermarking
        $.Watermark.ShowAll();
    }

    $("select.ui-dropdown-booking-passengers-address-primary").change(function (e) {
        var $objPassengersAddressPrimary = $(this);
        $("input.ui-hidden-booking-passengers-address-primary").val($objPassengersAddressPrimary.val());
    }).focus(function (e) {
        var $objPassengersAddressPrimary = $(this);
    });

    //$.fn.PassengersAddressPrimary();

    $("input.ui-textbox-booking-passengers-first, input.ui-textbox-booking-passengers-last").change(function (e) {
        $.fn.PassengersAddressPrimary();
    });

    var $strPrimaryEmailExisting = $(".ui-textbox-booking-passengers-address-email").val();

    $(".ui-textbox-booking-passengers-address-email").change(function (e) {
        var $objPrimaryEmail = $(this);

        $.Watermark.HideAll();

        var $objConfirmationEmail = $(".ui-textbox-booking-confirmation-email-primary");

        //    alert($objConfirmationEmail.val());
        //    alert($strPrimaryEmailExisting);

        // If existing/previous email equals confirmation email or empty, change it
        if ($objConfirmationEmail.val() == $strPrimaryEmailExisting ||
            $objConfirmationEmail.val() == "") {
            $objConfirmationEmail.val($objPrimaryEmail.val())
            $strPrimaryEmailExisting = $(".ui-textbox-booking-confirmation-email-primary").val();

            $.fn.RequiredEmail($objConfirmationEmail);
            $objConfirmationEmail.removeClass("ui-state-global-error");
        }

        //$(".ui-textbox-booking-confirmation-email").val();

        $.Watermark.ShowAll();
    });

    // Payments

    // Credit Card formatting
    $(".ui-textbox-booking-payment-method-authorizenet-number, .ui-textbox-booking-payment-method-charge-number, .ui-textbox-booking-payment-method-eigen-number, .ui-textbox-booking-payment-method-miraserv-number").change(function (e) {
        var $objBookingPaymentMethodNumber = $(this);

        var $objNumber = $objBookingPaymentMethodNumber.val().replace(/[^0-9]/g, '');

        // 0000 0000 0000 000000
        if ($objNumber.length == 17) {
            $objNumber = $objNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{5})/, "$1 $2 $3 $4");
        } else if ($objNumber.length == 16) {
            $objNumber = $objNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
        } else if ($objNumber.length == 15) {
            $objNumber = $objNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, "$1 $2 $3 $4");
        } else if ($objNumber.length == 14) {
            $objNumber = $objNumber.replace(/(\d{4})(\d{4})(\d{3})(\d{3})/, "$1 $2 $3 $4");
        } else if ($objNumber.length == 13) {
            $objNumber = $objNumber.replace(/(\d{4})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
        };

        $objBookingPaymentMethodNumber.val($objNumber);
    }).focus(function (e) {
        // Replace spaces with blank
        //$(this).val($(this).val().replace(new RegExp(" ","gm"), ""));
    });

    $.fn.SetBank = function ($strPaymentControl, $objPayment) {
        if ($strPaymentControl == 'Bank') {
            if ($objPayment.attr("data-balance") == null) {
                // Get Balance
                var $intPayment_ID = $objPayment.val(); // ("data-payment_id");

                $.ajax({
                    type: "GET",
                    url: "/Search/Bank.aspx",
                    data: "Session=" + $strSession + "&Payment_ID=" + $intPayment_ID,
                    async: false,
                    success: function ($decBalance) {
                        $objPayment.attr("data-balance", '$' + formatCurrency(parseFloat($decBalance)));
                    },
                    error: function () {
                        $objPayment.attr("data-balance", "$0.00");
                    }
                });
            }

            $(".ui-label-booking-payment-method-bank-balance").text($objPayment.attr("data-balance"));
        }
    }

    $.fn.SetCustomersService = function ($strPaymentControl, $strPaymentReference) {
        if ($strPaymentControl == 'Customers') {
            $(".ui-dropdown-booking-payment-method-customers-service option").prop("disabled", false);
            if ($strPaymentReference != '') {
                //$(".ui-dropdown-booking-payment-method-customers-service").prop("disabled", true)
                $(".ui-dropdown-booking-payment-method-customers-service").val($strPaymentReference)
                $('.ui-dropdown-booking-payment-method-customers-service option:not(:selected)').attr('disabled', true);
            }
        }
    }

    $.fn.PaymentSelected = function ($objPaymentList) {
        // Hide payment details
        $(".ui-booking-payment-method > li.ui-booking-payment-method-control").hide();
        $(".ui-section-booking-payment-description").html("");

        if ($objPaymentList == null) { return; }

        // Show payment details of selected payment
        $(".ui-booking-payment-method > li.ui-booking-payment-method-control[data-control='" + $objPaymentList.parent().attr("data-control") + "']").show();
        $(".ui-section-booking-payment-description").html($objPaymentList.parent().attr("data-description"));

        $.fn.SetBank($objPaymentList.parent().attr("data-control"), $objPaymentList);
        $.fn.SetCustomersService($objPaymentList.parent().attr("data-control"), $objPaymentList.parent().attr("data-reference"));
    }

    $(".ui-radiolist-booking-payment input[type='radio']").click(function (e) {
        $.fn.PaymentSelected($(this));

        //var $objPaymentList = $(this);

        ////    if ($("input.ui-hidden-booking-payment-pricing").val() != $objPaymentList.parent().attr("data-pricing")) {
        ////      $("input.ui-hidden-booking-payment-pricing").val($objPaymentList.parent().attr("data-pricing"));

        ////      // Submit Form
        ////      $.fn.Processing();

        ////      // lnkBookingPassengersCredentialsPasswordRecoveryEmail"
        ////      __doPostBack($(".ui-button-booking-payment-pricing").attr("ID"), "")

        ////      //$.fn.Submit($(".ui-button-booking-payment-pricing").attr("ID"), true, true, false);
        ////      return;
        ////    }

        //$(".ui-booking-payment-method > li.ui-booking-payment-method-control").hide();
        //$(".ui-booking-payment-method > li.ui-booking-payment-method-control[data-control='" + $objPaymentList.parent().attr("data-control") + "']").show();

        //$.fn.SetBank($objPaymentList.parent().attr("data-control"), $objPaymentList);
        //$.fn.SetCustomersService($objPaymentList.parent().attr("data-control"), $objPaymentList.parent().attr("data-reference"));

        //$(".ui-mobile-label-booking-summary-payment-method-bank-error").hide();
        $(".ui-label-booking-payment-method-error").hide();
    });

    // Startup
    $(".ui-radiolist-booking-payment input[type='radio']:checked").each(function (e) {
        $.fn.PaymentSelected($(this));
        //var $objPaymentList = $(this);

        //$(".ui-booking-payment-method > li.ui-booking-payment-method-control").hide();
        //$(".ui-booking-payment-method > li.ui-booking-payment-method-control[data-control='" + $objPaymentList.parent().attr("data-control") + "']").show();

        //$.fn.SetBank($objPaymentList.parent().attr("data-control"), $objPaymentList);
        //$.fn.SetCustomersService($objPaymentList.parent().attr("data-control"), $objPaymentList.parent().attr("data-reference"));
    });

    // Payments : Vouchers : Find Tickets
    $(".ui-link-booking-payment-method-voucher-ticket-search").click(function (e) {
        var $intPayment_ID = $(".ui-radiolist-booking-payment input[type='radio']:checked").val();

        var $objBookingDialogPaymentMethodTicketSearch =
            $(".ui-dialog-booking-payment-method-voucher-ticket-search")
                .clone();

        $objBookingDialogPaymentMethodTicketSearch
            .find(".ui-link-booking-payment-method-voucher-ticket-search-cancel").click(function (e) {
                $objBookingDialogPaymentMethodTicketSearch.dialog("close");
            });

        $objBookingDialogPaymentMethodTicketSearch.dialog({
            height: 400,
            width: 650,
            draggable: false,
            resizable: false,
            modal: true,
            //      buttons: {
            //        Close: function () {
            //          $(this).dialog("close");
            //        }
            //      },
            create: function (ev, ui) {
                $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
                $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
            },
            close: function (ev, ui) {
                $objBookingDialogPaymentMethodTicketSearch.remove();
            }
        });

        $.ajax({
            type: "GET",
            url: "/Search/VouchersLookup.aspx",
            data: "Session=" + $strSession + "&Payment_ID=" + $intPayment_ID,
            async: false,
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            },
            success: function (data) {

                // Tickets
                for (var intRow = 0; intRow < data.Vouchers.length; intRow++) {
                    var $strInventory = data.Vouchers[intRow].Inventory;
                    var $strQuantity = parseInt(data.Vouchers[intRow].Quantity);
                    var $strTotal = '$' + formatCurrency(parseFloat(data.Vouchers[intRow].Total));

                    $objHTML = $objBookingDialogPaymentMethodTicketSearch
                        .find("tr.ui-tablerow-booking-payment-method-voucher-ticket-search:not(.ui-clone-global)")
                        .wrapAll("<div />").parent().clone();

                    $objHTML.children().addClass("ui-clone-global").show();

                    // $objHTML.html($objHTML.html().replace("{1}", "<a onClick=\"alert('" + data.Vouchers[intRow].Ticket + "');\" style=\"color: #4379c3; text-decoration: underline !important;\">" + data.Vouchers[intRow].Ticket + "</a>"));

                    $objHTML.html($objHTML.html().replace("{0}", data.Vouchers[intRow].Service));
                    $objHTML.html($objHTML.html().replace("{1}", data.Vouchers[intRow].Ticket));
                    $objHTML.html($objHTML.html().replace("{2}", data.Vouchers[intRow].Date_Activation));
                    $objHTML.html($objHTML.html().replace("{3}", data.Vouchers[intRow].Date_Expiration));
                    $objHTML.html($objHTML.html().replace("{4}", "$" + formatCurrency(parseFloat(data.Vouchers[intRow].Total))));

                    $objBookingDialogPaymentMethodTicketSearch
                        .find("table.ui-table-booking-payment-method-voucher-ticket-search")
                        .append($objHTML.html());
                }

                if (data.Vouchers.length == 0) {
                    $objBookingDialogPaymentMethodTicketSearch
                        .find("tr.ui-tablerow-booking-payment-method-voucher-ticket-search-empty")
                        .show();
                }
            }
        });
    });

    $(".ui-dropdown-booking-summary-schedules-transport").change(function (e) {
        $objTransport = $(this);

        // Save the current selection
        $objTransport
            .parent()
            .find(".ui-hidden-booking-summary-schedules-transport")
            .val(!$objTransport.prop("selectedIndex") == 0 ? $objTransport.val() : "");
    });

    // Summary: Full Breakdown
    $(".ui-booking-summary-billing-fare-link").click(function (e) {
        e.stopPropagation();

        var $arrRoute_Class_Tier_ID = new Array();

        $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").each(function (e) {
            $arrRoute_Class_Tier_ID.push($(this).val());
        });

        $intBookingSummaryBillingCoupon_ID = $("input.ui-hidden-booking-summary-billing-coupon_id").val();

        //var $objBookingSchedulesTotal = $(this);
        $.fn.BookingSchedulesFareDialog(e, $arrRoute_Class_Tier_ID, $intBookingSummaryBillingCoupon_ID);
    });

    // Summary: Link to Travel Agent
    $.fn.SummaryBillingAgentOption = function () {
        var $objSummaryBillingAgent = $(".ui-labelbox-booking-summary-billing-agent input[type='checkbox']");

        if ($objSummaryBillingAgent.is(":checked")) {
            $(".ui-dropdown-booking-summary-billing-agent-service, .ui-textbox-booking-summary-billing-agent-member, .ui-label-booking-summary-billing-agent-error")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled")
                .slideDown(100);
        } else {
            $(".ui-dropdown-booking-summary-billing-agent-service, .ui-textbox-booking-summary-billing-agent-member, .ui-label-booking-summary-billing-agent-error")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled")
                .slideUp(100);
        }
    };

    $(".ui-labelbox-booking-summary-billing-agent input[type='checkbox']").click(function (e) {
        $.fn.SummaryBillingAgentOption();
    }).each(function (e) {
        $.fn.SummaryBillingAgentOption();
    });

    // Automatically enable agent when field clicked
    $(".ui-dropdown-booking-summary-billing-agent-service, .ui-textbox-booking-summary-billing-agent-member").mousedown(function (e) {
        $(".ui-labelbox-booking-summary-billing-agent input[type='checkbox']").prop("checked", true)
        $.fn.SummaryBillingAgentOption();
    }).blur(function (e) {
    });

    $(".ui-link-booking-passengers-credentials-account").click(function (e) {
        $(".ui-booking-passengers-credentials-label-account input[type='checkbox']").trigger("click");
    });

    //  $(".ui-field-email, .ui-field-confirmation-email").change(function () {
    //    var $this = $(this)
    //    $.fn.ValidationEmail($this);
    //  });

    //  $(".ui-field-address-email").change(function () {
    //    var $objEmail = $(this);
    //    var $objConfirmationEmail = $(".ui-field-confirmation-email");

    //    if ($(".ui-field-login-agent").val() == -1) {
    //    } else if ($.fn.IsEmail($objEmail.val()) == true) {
    //      if ($objConfirmationEmail.val() !== "") {
    //        if ($bitBrowserEnhanced == true) {
    //          $objConfirmationEmail.effect("highlight", { color: 'crimson' }, 2000);
    //        }
    //      };

    //      $objConfirmationEmail.val($objEmail.val());
    //      $objConfirmationEmail.removeClass("ui-state-error");
    //      $objConfirmationEmail.removeClass("ui-field-required-highlight");
    //    };
    //  });

    // Payments
    // Eigen Card Validation
    // $bitUpdatePaymentMethod : Automatically sets the corresponding payment based on the number
    $.fn.AuthorizeNetCardValidation = function ($objNumber, $bitUpdatePaymentMethod) {
        var $bitReturn;
        $objNumber.validateCreditCard(function (result) {
            $("ul.ui-list-booking-payment-authorizenet-cards li").removeClass("ui-card-disabled");

            //      console.log("");
            //      console.log("result.card_type: " + result.card_type);
            if (result.card_type != null) {
                //        console.log("result.card_type.name: " + result.card_type.name);
                //        console.log("result.card_type.pattern: " + result.card_type.pattern);
                //        console.log("result.card_type.length: " + result.card_type.length);

                var $strReference = "";
                if (result.card_type.name == 'amex') { $strReference = "American Express" }
                if (result.card_type.name == 'discover') { $strReference = "Discover" }
                if (result.card_type.name == 'mastercard') { $strReference = "Master Card" }
                if (result.card_type.name == 'visa') { $strReference = "Visa" }
                if (result.card_type.name == 'china_unionpay') { $strReference = "UnionPay" }

                // Set Payment Method
                if ($bitUpdatePaymentMethod == true) {
                    $("ul.ui-radiolist-booking-payment span[data-control='AuthorizeNet'][data-reference='" + $strReference + "'] input[type='radio']").not(":disabled").prop("checked", true);
                };

                $("ul.ui-list-booking-payment-authorizenet-cards li:not(." + result.card_type.name + ")").addClass("ui-card-disabled");

                // Set Card Image
            } else {
                //        $("ul.ui-list-booking-payment-eigen-cards li").removeClass("off");
                // Reset Card Image
            }
            //      console.log("result.length_valid: " + result.length_valid);
            //      console.log("result.luhn_valid: " + result.luhn_valid);

            $bitReturn = result;
        }, { accept: ['amex', 'discover', 'mastercard', 'visa', 'china_unionpay'] })
        return $bitReturn;
    };

    $.fn.ChargeCardValidation = function ($objNumber, $bitUpdatePaymentMethod) {
        var $bitReturn;
        $objNumber.validateCreditCard(function (result) {
            $("ul.ui-list-booking-payment-charge-cards li").removeClass("ui-card-disabled");

            //      console.log("");
            //      console.log("result.card_type: " + result.card_type);
            if (result.card_type != null) {
                //        console.log("result.card_type.name: " + result.card_type.name);
                //        console.log("result.card_type.pattern: " + result.card_type.pattern);
                //        console.log("result.card_type.length: " + result.card_type.length);

                var $strReference = "";
                if (result.card_type.name == 'amex') { $strReference = "American Express" }
                if (result.card_type.name == 'discover') { $strReference = "Discover" }
                if (result.card_type.name == 'mastercard') { $strReference = "Master Card" }
                if (result.card_type.name == 'visa') { $strReference = "Visa" }
                if (result.card_type.name == 'china_unionpay') { $strReference = "UnionPay" }

                // Set Payment Method
                if ($bitUpdatePaymentMethod == true) {
                    $("ul.ui-radiolist-booking-payment span[data-control='Charge'][data-reference='" + $strReference + "'] input[type='radio']").not(":disabled").prop("checked", true);
                };

                $("ul.ui-list-booking-payment-charge-cards li:not(." + result.card_type.name + ")").addClass("ui-card-disabled");

                // Set Card Image
            } else {
                //        $("ul.ui-list-booking-payment-eigen-cards li").removeClass("off");
                // Reset Card Image
            }
            //      console.log("result.length_valid: " + result.length_valid);
            //      console.log("result.luhn_valid: " + result.luhn_valid);

            $bitReturn = result;
        }, { accept: ['amex', 'discover', 'mastercard', 'visa', 'china_unionpay'] })
        return $bitReturn;
    };

    $.fn.EigenCardValidation = function ($objNumber, $bitUpdatePaymentMethod) {
        var $bitReturn;
        $objNumber.validateCreditCard(function (result) {
            $("ul.ui-list-booking-payment-eigen-cards li").removeClass("ui-card-disabled");

            //      console.log("");
            //      console.log("result.card_type: " + result.card_type);
            if (result.card_type != null) {
                //        console.log("result.card_type.name: " + result.card_type.name);
                //        console.log("result.card_type.pattern: " + result.card_type.pattern);
                //        console.log("result.card_type.length: " + result.card_type.length);

                var $strReference = "";
                if (result.card_type.name == 'amex') { $strReference = "American Express" }
                if (result.card_type.name == 'discover') { $strReference = "Discover" }
                if (result.card_type.name == 'mastercard') { $strReference = "Master Card" }
                if (result.card_type.name == 'visa') { $strReference = "Visa" }
                if (result.card_type.name == 'china_unionpay') { $strReference = "UnionPay" }

                // Set Payment Method
                if ($bitUpdatePaymentMethod == true) {
                    $("ul.ui-radiolist-booking-payment span[data-control='Eigen'][data-reference='" + $strReference + "'] input[type='radio']").not(":disabled").prop("checked", true);
                };

                $("ul.ui-list-booking-payment-eigen-cards li:not(." + result.card_type.name + ")").addClass("ui-card-disabled");

                // Set Card Image
            } else {
                //        $("ul.ui-list-booking-payment-eigen-cards li").removeClass("off");
                // Reset Card Image
            }
            //      console.log("result.length_valid: " + result.length_valid);
            //      console.log("result.luhn_valid: " + result.luhn_valid);

            $bitReturn = result;
        }, { accept: ['amex', 'discover', 'mastercard', 'visa', 'china_unionpay'] })
        return $bitReturn;
    };

    $.fn.MiraServCardValidation = function ($objNumber, $bitUpdatePaymentMethod) {
        var $bitReturn;
        $objNumber.validateCreditCard(function (result) {
            $("ul.ui-list-booking-payment-miraserv-cards li").removeClass("ui-card-disabled");

            //      console.log("");
            //      console.log("result.card_type: " + result.card_type);
            if (result.card_type != null) {
                //        console.log("result.card_type.name: " + result.card_type.name);
                //        console.log("result.card_type.pattern: " + result.card_type.pattern);
                //        console.log("result.card_type.length: " + result.card_type.length);

                var $strReference = "";
                if (result.card_type.name == 'amex') { $strReference = "American Express" }
                if (result.card_type.name == 'discover') { $strReference = "Discover" }
                if (result.card_type.name == 'mastercard') { $strReference = "Master Card" }
                if (result.card_type.name == 'visa') { $strReference = "Visa" }
                if (result.card_type.name == 'china_unionpay') { $strReference = "UnionPay" }

                // Set Payment Method
                if ($bitUpdatePaymentMethod == true) {
                    if (!(($(".ui-radiolist-booking-payment input[type='radio']:checked").parent().attr("data-control") === "MiraServ") &&
                        $(".ui-radiolist-booking-payment input[type='radio']:checked").parent().attr("data-reference") === "Auto")) {
                        $("ul.ui-radiolist-booking-payment span[data-control='MiraServ'][data-reference='" + $strReference + "'] input[type='radio']").not(":disabled").prop("checked", true);
                    }
                };

                $("ul.ui-list-booking-payment-miraserv-cards li:not(." + result.card_type.name + ")").addClass("ui-card-disabled");

                // Set Card Image
            } else {
                //        $("ul.ui-list-booking-payment-eigen-cards li").removeClass("off");
                // Reset Card Image
            }
            //      console.log("result.length_valid: " + result.length_valid);
            //      console.log("result.luhn_valid: " + result.luhn_valid);

            $bitReturn = result;
        }, { accept: ['amex', 'discover', 'mastercard', 'visa', 'china_unionpay'] })
        return $bitReturn;
    };

    // Change Eigen Credit Card Number
    $(".ui-textbox-booking-payment-method-authorizenet-number").change(function (e) {
        $.Watermark.HideAll();
        $.fn.AuthorizeNetCardValidation($(this), true);
        $.Watermark.ShowAll();
    }).keyup(function (e) {
        $.fn.AuthorizeNetCardValidation($(this), true);
    }).each(function (e) {
        // Startup
        $.fn.AuthorizeNetCardValidation($(this), false);
    });

    $(".ui-textbox-booking-payment-method-charge-number").change(function (e) {
        $.Watermark.HideAll();
        $.fn.ChargeCardValidation($(this), true);
        $.Watermark.ShowAll();
    }).keyup(function (e) {
        $.fn.ChargeCardValidation($(this), true);
    }).each(function (e) {
        // Startup
        $.fn.ChargeCardValidation($(this), false);
    });

    // Change Eigen Credit Card Number
    $(".ui-textbox-booking-payment-method-eigen-number").change(function (e) {
        $.Watermark.HideAll();
        $.fn.EigenCardValidation($(this), true);
        $.Watermark.ShowAll();
    }).keyup(function (e) {
        $.fn.EigenCardValidation($(this), true);
    }).each(function (e) {
        // Startup
        $.fn.EigenCardValidation($(this), false);
    });

    $(".ui-textbox-booking-payment-method-miraserv-number").change(function (e) {
        $.Watermark.HideAll();
        $.fn.MiraServCardValidation($(this), true);
        $.Watermark.ShowAll();
    }).keyup(function (e) {
        $.fn.MiraServCardValidation($(this), true);
    }).each(function (e) {
        // Startup
        $.fn.MiraServCardValidation($(this), false);
    });

    // Great Plains | Voucher : UpperCase()
    $(".ui-textbox-booking-payment-method-greatplains-number, .ui-textbox-booking-payment-method-voucher-ticket").change(function (e) {
        var $this = $(this);
        $this.val($this.val().toUpperCase());
    });

    //  // Vouchers Validation
    //  $.fn.VoucherLookupTicket = function ($strTicket) {
    //    var $intPayment_ID = $(".ui-radiolist-booking-payment input[type='radio']:checked").val();

    //    $(".ui-label-booking-payment-method-voucher-password")
    //      .addClass("ui-state-global-disabled")
    //      .attr("disabled", true);

    //    $("input.ui-textbox-booking-payment-method-voucher-password")
    //      .attr("disabled", true)
    //      //.removeClass("ui-state-global-error")
    //      .removeClass("ui-state-global-required");

    //    if ($strTicket != "") {
    //      $.ajax({
    //        type: "GET",
    //        url: "/Search/VouchersLookup.aspx",
    //        data: "Session=" + $strSession + "&Payment_ID=" + $intPayment_ID + "&Ticket=" + $strTicket,
    //        async: true,
    //        error: function (xhr, ajaxOptions, thrownError) {
    //          //alert(xhr.status);
    //          //alert(thrownError);
    //        },
    //        success: function (data) {
    //          if (data.Vouchers.length > 0) {
    //            if (data.Vouchers[0].hasPassword == 'True') {
    //              $(".ui-label-booking-payment-method-voucher-password")
    //                .removeClass("ui-state-global-disabled")
    //                .attr("disabled", false);

    //              $("input.ui-textbox-booking-payment-method-voucher-password")
    //                .attr("disabled", false);

    //              if ($("input.ui-textbox-booking-payment-method-voucher-password").val() == "") {
    //                $("input.ui-textbox-booking-payment-method-voucher-password")
    //                  .addClass("ui-state-global-required");
    //              }
    //            }
    //          } else {
    //            $("input.ui-textbox-booking-payment-method-voucher-ticket")
    //              .addClass("ui-state-global-error");
    //          }

    //          //        // Tickets
    //          //        for (var intRow = 0; intRow < data.Vouchers.length; intRow++) {
    //          //          var $strInventory = data.Vouchers[intRow].Inventory;
    //          //          var $strQuantity = parseInt(data.Vouchers[intRow].Quantity);
    //          //          var $strTotal = '$' + formatCurrency(parseFloat(data.Vouchers[intRow].Total));

    //          //          $objHTML = $objBookingDialogPaymentMethodTicketSearch
    //          //            .find("tr.ui-tablerow-booking-payment-method-voucher-ticket-search:not(.ui-clone-global)")
    //          //            .wrapAll("<div />").parent().clone();

    //          //          $objHTML.children().addClass("ui-clone-global").show();

    //          //          $objHTML.html($objHTML.html().replace("{0}", data.Vouchers[intRow].Service));
    //          //          $objHTML.html($objHTML.html().replace("{1}", data.Vouchers[intRow].Ticket));
    //          //          $objHTML.html($objHTML.html().replace("{2}", data.Vouchers[intRow].Date_Activation));
    //          //          $objHTML.html($objHTML.html().replace("{3}", data.Vouchers[intRow].Date_Expiration));
    //          //          $objHTML.html($objHTML.html().replace("{4}", "$" + formatCurrency(parseFloat(data.Vouchers[intRow].Total))));

    //          //          $objBookingDialogPaymentMethodTicketSearch
    //          //            .find("table.ui-table-booking-payment-method-voucher-ticket-search")
    //          //            .append($objHTML.html());
    //          //        }

    //          //        if (data.Vouchers.length == 0) {
    //          //          $objBookingDialogPaymentMethodTicketSearch
    //          //            .find("tr.ui-tablerow-booking-payment-method-voucher-ticket-search-empty")
    //          //            .show();
    //          //        }
    //        }
    //      });
    //    };
    //  }

    //  $("input.ui-textbox-booking-payment-method-voucher-ticket").bind("blur", function (e) {
    //    $.fn.VoucherLookupTicket($(this).val());
    //  });

    $.fn.BookingBillingSummaryCoupon = function () {
        // Get List

        // If hard move, ignore coupon
        if ($(".ui-hidden-booking-policy-schedule-billing").val() == "1") { return; }

        var $arrRoute_Class_Tier_ID = new Array();

        $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").each(function (e) {
            $arrRoute_Class_Tier_ID.push($(this).val());
        });

        $intBookingSummaryBillingCoupon_ID = $("input.ui-hidden-booking-summary-billing-coupon_id").val();
        $intBookingExistingCoupon_ID = $("input.ui-hidden-booking-existing-coupon_id").val();

        var $intRoute_Class_Tier_ID = $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").first().val();
        var $intExistingRoute_Class_Tier_ID = $("input.ui-hidden-booking-existing-route_class_tier_id").val();

        //alert($intRoute_Class_Tier_ID);
        //alert($intExistingRoute_Class_Tier_ID);

        $(".ui-tablerow-global-summary-billing-coupon-warning").hide();

        // If no coupon or change booking (same route), ignore search
        if ($intBookingSummaryBillingCoupon_ID > 0 &&
            ($intRoute_Class_Tier_ID != $intExistingRoute_Class_Tier_ID ||
                $intBookingSummaryBillingCoupon_ID != $intBookingExistingCoupon_ID)) {

            var $intContact_ID = -1;

            if ($(".ui-hidden-booking-passengers-selected").length == 1) {
                $intContact_ID = $(".ui-hidden-booking-passengers-selected").val();
            }

            // Grab Restrictions
            $.ajax({
                type: "GET",
                url: "/Search/CouponRestrictions.aspx",
                async: true,
                data: "Session=" + $strSession + "&Coupon_ID=" + $intBookingSummaryBillingCoupon_ID + "&Route_Class_Tier_ID=" + $arrRoute_Class_Tier_ID.join() + "&Contact_ID=" + $intContact_ID,
                async: true,
                success: function ($data) {
                    if ($data.length > 0) {
                        $(".ui-tablerow-global-summary-billing-coupon-warning").show();
                    };
                },
                error: function () { }
            });
        };
    };

    $.fn.BookingBillingSummaryRefresh = function ($bitAsync) {
        $(".ui-booking-schedules-radio-route_class_tier_id input[type='radio']:checked").each(function (e) {

            $objRoute_Class_Tier_ID = $(this);
            $strSchedule = $objRoute_Class_Tier_ID.parent().attr("data-schedule");
            $intRoute_Class_Tier_ID = $objRoute_Class_Tier_ID.val();

            $.fn.BookingBillingSummary($strSchedule, $intRoute_Class_Tier_ID, $strFare_ID, $bitAsync);
        });
        $.fn.BookingBillingSummaryCoupon();
    };

    // Coupon
    $("input.ui-button-booking-summary-billing-coupon-search").click(function (e) {
        var $objBookingSummaryCouponSearch = $(this);
        var $strCoupon = encodeURIComponent($("input.ui-textbox-booking-summary-billing-coupon").val().trim());
        var $bitValid = false;

        $intBookingExistingCoupon_ID = $("input.ui-hidden-booking-existing-coupon_id").val();

        if ($strCoupon !== "") {
            $.ajax({
                type: "GET",
                url: "/Search/Coupon.aspx",
                data: "Session=" + $strSession + "&Coupon=" + $strCoupon + "&Coupon_ID=" + $intBookingExistingCoupon_ID,
                async: false,
                success: function ($data) {
                    if (parseInt($data.Coupon_ID) > 0) {

                        $("input.ui-hidden-booking-summary-billing-coupon_id").val($data.Coupon_ID);
                        $("input.ui-textbox-booking-summary-billing-coupon").val($data.Coupon);
                        $("SPAN.ui-label-booking-summary-billing-coupon-value").html($data.Discount_Rate + "%");

                        $("input.ui-textbox-booking-summary-billing-coupon").attr("disabled", "disabled");

                        $("input.ui-button-booking-summary-billing-coupon-search").hide();
                        $("input.ui-button-booking-summary-billing-coupon-clear").show();

                        $bitValid = true;
                    }
                },
                error: function () { $bitValid = false; }
            });
        };

        // Show .ui-state-global-error on failed lookup
        if (!$bitValid) {
            $("input.ui-textbox-booking-summary-billing-coupon").addClass("ui-state-global-error");
            $("input.ui-button-booking-summary-billing-coupon-search").addClass("ui-state-global-error");

            e.preventDefault();
            return false;
        }

        $.fn.PaymentRestrictions();

        $.fn.BookingBillingSummaryRefresh(false);

        e.preventDefault();
        return false;
    });

    $("input.ui-button-booking-summary-billing-coupon-clear").click(function (e) {
        $("input.ui-hidden-booking-summary-billing-coupon_id").val(-1);

        $("input.ui-textbox-booking-summary-billing-coupon").val("");
        $("input.ui-textbox-booking-summary-billing-coupon").trigger("blur");

        $("SPAN.ui-label-booking-summary-billing-coupon-value").html("");

        $("input.ui-textbox-booking-summary-billing-coupon").removeAttr("disabled");

        $("input.ui-button-booking-summary-billing-coupon-search").show();
        $("input.ui-button-booking-summary-billing-coupon-clear").hide();

        $(".ui-tablerow-global-summary-billing-coupon-warning").hide();

        $.fn.PaymentRestrictions();

        $.fn.BookingBillingSummaryRefresh(false);

        e.preventDefault();
        return false;
    });

    $("input.ui-textbox-booking-summary-billing-coupon").keydown(function (e) {
        $("input.ui-textbox-booking-summary-billing-coupon").removeClass("ui-state-global-error");
        $("input.ui-button-booking-summary-billing-coupon-search").removeClass("ui-state-global-error");

        if (e.which == 13) {
            $("input.ui-button-booking-summary-billing-coupon-search").trigger("click");
        };
    }).focus(function (e) {
        //    var $objContact_ID = $(this);
        //    var $strItem = $objContact_ID.attr("data-item");

        $("input.ui-textbox-booking-summary-billing-coupon").removeClass("ui-state-global-error");
        $("input.ui-button-booking-summary-billing-coupon-search").removeClass("ui-state-global-error");
    });

    // Startup - Coupon
    if ($(".ui-hidden-booking-summary-billing-coupon_id").val() == -1) {
        $("input.ui-button-booking-summary-billing-coupon-clear").hide();
    } else {
        $("input.ui-button-booking-summary-billing-coupon-search").trigger("click");
    };

    // Confirmation
    // Automatic Confirmation Styling (Email, Phone, None) of Radio and Inputs
    var $strConfirmationOption = "";

    $.fn.ConfirmationSelection = function ($strOption) {
        // Prevent drop-down selection issues with Agent
        if ($strConfirmationOption == $strOption) {
            return;
        };

        if ($strOption == 'Email') {
            $(".ui-textbox-booking-confirmation-email")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-textbox-booking-confirmation-email")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        if ($strOption == 'Text') {
            $(".ui-textbox-booking-confirmation-text")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-textbox-booking-confirmation-text")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        if ($strOption == 'Phone') {
            $(".ui-textbox-booking-confirmation-phone, .ui-dropdown-booking-confirmation-phone-method")
                .removeAttr("tabindex")
                .removeClass("ui-state-global-disabled");
        } else {
            $(".ui-textbox-booking-confirmation-phone, .ui-dropdown-booking-confirmation-phone-method")
                .attr("tabindex", "-1")
                .addClass("ui-state-global-disabled");
        };

        if ($strOption == 'None') {
        };

        $strConfirmationOption = $strOption;
    };

    // Confirmation Option: Click()
    $(".ui-radio-booking-confirmation-option input[type='radio']").change(function (e) {
        var $objConfirmationOption = $(this);
        $.fn.ConfirmationSelection($objConfirmationOption.parent().attr("data-option"));
    }).each(function (e) { // Startup
        var $objConfirmationOption = $(this);
        if ($objConfirmationOption.is(":checked") == true) {
            $.fn.ConfirmationSelection($objConfirmationOption.parent().attr("data-option"));
        }
    });

    // Confirmation Input: MouseDown()
    $(".ui-textbox-booking-confirmation-email, .ui-textbox-booking-confirmation-text, .ui-textbox-booking-confirmation-phone, .ui-dropdown-booking-confirmation-phone-method").mousedown(function (e) {
        $objConfirmationInput = $(this);
        $(".ui-radio-booking-confirmation-option[data-option='" + $objConfirmationInput.attr("data-option") + "'] input[type='radio']").trigger("click");
    });

    // Legal Agreement
    $(".ui-link-agreement-confirmation").click(function (e) {
        e.preventDefault();
        $objAgreement = $(".ui-agreement-legal");
        $objAgreement.slideToggle($intSlideTime);
        $('html, body').animate({ scrollTop: $objAgreement.offset().top }, 500, function () { offset = 0; });
    });

    $(".ui-link-agreement-legal-cancel").click(function (e) {
        e.preventDefault();
        $objAgreement = $(this).parent(".ui-agreement-legal");
        $objAgreement.slideUp($intSlideTime);
        //$(this).parent(Confirmation_Legal_Agreement).slideUp();
    });

    // Show the Fare Breakdown
    $.fn.BookingSchedulesFareDialog = function (e, $arrRoute_Class_Tier_ID, $intCoupon_ID) {
        //var $objBookingDialogSchedulesFare = $(".ui-dialog-global-schedules-fare").clone();

        // Clone the Dialog box, populate, display and dispose on closing
        var $objBookingDialogSchedulesFare = $(".ui-dialog-global-schedules-fare")
            //      .wrapAll("<div></div>")
            //      .parent()
            .clone();

        //    // Clear cloned copy for schedule-by-schedule entry
        //    $objBookingDialogSchedulesFare
        //      .find(".ui-content-global-dialog")
        //      .empty();

        var $intPolicy_ID = $(".ui-hidden-booking-policy_id").val();

        var $intProtocol_ID = $(".ui-hidden-booking-schedule_protocol_id").val();

        var $intRoute_Class_Tier_ID_Existing = $(".ui-hidden-booking-existing-route_class_tier_id").val();

        // Loop through list of fares
        for (var intID = 0; intID < $arrRoute_Class_Tier_ID.length; intID++) {
            // Get cloned copy of fare details/pricing for editing
            //var $objBookingDialogSchedulesFareBreakdown = $(".ui-dialog-global-schedules-fare .ui-content-global-dialog").children().clone()

            var $chrTier_Description = "";
            var $chrPolicy_Description = "";

            var $objBookingDialogSchedulesFareBreakdown = $objBookingDialogSchedulesFare
                .find(".ui-dialog-booking-schedules-fare-breakdown:not(.ui-clone-global)")
                .clone();

            $objBookingDialogSchedulesFareBreakdown
                .addClass("ui-clone-global")
                .show();

            // Update Schedule Description
            var $objHTML = $objBookingDialogSchedulesFareBreakdown
                .find(".ui-label-global-schedules-fare-description:not(.ui-clone-global)");

            //$objHTML.html($objHTML.html().replace("{0}", "go, go, go!"));

            $objHTML.addClass("ui-clone-global");

            if ($arrRoute_Class_Tier_ID[intID] == $intRoute_Class_Tier_ID_Existing) {
                $intProtocol_ID = $(".ui-hidden-booking-protocol_id").val();
            }

            $.ajax({
                type: "GET",
                url: "/Search/Routes.aspx",
                data: "Session=" + $strSession + "&Route_Class_Tier_ID=" + $arrRoute_Class_Tier_ID[intID] + "&Policy_ID=" + $intPolicy_ID + "&Protocol_ID=" + $intProtocol_ID,
                async: false,
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.status); 
                    //alert(thrownError); 
                },
                success: function (data) {
                    if (parseInt(data.Route_Class_Tier_ID) !== 0) {
                        var $strSchedule = data.Schedule;
                        if (data.Hops > 1) {
                            $strSchedule += ' +' + (data.Hops - 1);
                        }

                        $objHTML.html($objHTML.html().replace("{0}", data.Date));
                        $objHTML.html($objHTML.html().replace("{1}", $strSchedule));
                        $objHTML.html($objHTML.html().replace("{2}", data.Departure_Time));
                        $objHTML.html($objHTML.html().replace("{3}", data.Departure_Location));
                        $objHTML.html($objHTML.html().replace("{Departure_Map}", data.Departure_Map));
                        $objHTML.html($objHTML.html().replace("{4}", data.Arrival_Time));
                        $objHTML.html($objHTML.html().replace("{5}", data.Arrival_Location));
                        $objHTML.html($objHTML.html().replace("{Arrival_Map}", data.Arrival_Map));
                        $objHTML.html($objHTML.html().replace("{6}", data.Duration));
                        $objHTML.html($objHTML.html().replace("{7}", data.Class));
                        $objHTML.html($objHTML.html().replace("{8}", data.Tier));


                        if (data.Departure_Map != "") {
                            $objHTML.find(".ui-link-global-summary-schedules-map[data-Schedule='Departure']").show();
                        }

                        if (data.Arrival_Map != "") {
                            $objHTML.find(".ui-link-global-summary-schedules-map[data-Schedule='Arrival']").show();
                        }

                        $chrTier_Description = data.Tier_Description;
                        $chrPolicy_Description = data.Policy_Description;
                    }
                }
            });

            $objBookingDialogSchedulesFareBreakdown
                .find(".ui-label-global-schedules-fare-description")
                .html($objHTML.html());

            $intBookingSummaryBillingCoupon_ID = $intCoupon_ID;
            $intBookingExistingCoupon_ID = $("input.ui-hidden-booking-existing-coupon_id").val();

            var $intExistingRoute_Class_Tier_ID = $("input.ui-hidden-booking-existing-route_class_tier_id").val();

            var $bitValidationCoupon = 0;

            // If no coupon or change booking (same route), ignore search
            if ($intBookingSummaryBillingCoupon_ID > 0 &&
                ($arrRoute_Class_Tier_ID[intID] != $intExistingRoute_Class_Tier_ID ||
                    $intBookingSummaryBillingCoupon_ID != $intBookingExistingCoupon_ID)) {
                $bitValidationCoupon = 1;
            };

            var $intContact_ID = -1;

            if ($(".ui-hidden-booking-passengers-selected").length == 1) {
                $intContact_ID = $(".ui-hidden-booking-passengers-selected").val();
            }

            // Update Fare Details
            $.ajax({
                type: "GET",
                url: "/Search/Billing.aspx",
                data: "Session=" + $strSession + "&Route_Class_Tier_ID=" + $arrRoute_Class_Tier_ID[intID] + "&Fare_ID=" + $strFare_ID + "&Contact_ID=" + $intContact_ID + "&Coupon_ID=" + $intCoupon_ID + "&ValidationCoupon=" + $bitValidationCoupon + "&Summary=0",
                async: false,
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.status); 
                    //alert(thrownError); 
                },
                success: function (data) {

                    // Generate a list of categories
                    var arrService = [];

                    for (var intRow = 0; intRow < data.Billing.length; intRow++) {
                        if (arrService.indexOf(data.Billing[intRow].Service) < 0) {
                            arrService.push(data.Billing[intRow].Service);
                        };
                    };

                    for (var intRow = 0; intRow < data.Taxes.length; intRow++) {
                        if (arrService.indexOf(data.Taxes[intRow].Service) < 0) {
                            arrService.push(data.Taxes[intRow].Service);
                        };
                    };

                    // Sort the categories
                    arrService.sort();

                    // Loop through each category and display the inventory/tax
                    for (var intService = 0; intService < arrService.length; intService++) {
                        var $strService = arrService[intService];

                        if ($strService != "") {
                            $objHTML = $objBookingDialogSchedulesFareBreakdown
                                .find("tr.ui-tablerow-global-schedules-fare-billing-service:not(.ui-clone-global)")
                                .wrapAll("<div />").parent().clone();

                            $objHTML.children().addClass("ui-clone-global").show();

                            $objHTML.html($objHTML.html().replace("{0}", $strService));

                            $objBookingDialogSchedulesFareBreakdown
                                .find("table.ui-table-global-schedules-fare-billing")
                                .append($objHTML.html());
                        };

                        // Inventories
                        for (var intRow = 0; intRow < data.Billing.length; intRow++) {
                            // List inventory with matching category
                            if (data.Billing[intRow].Service == $strService) {
                                var $strInventory = data.Billing[intRow].Inventory;
                                var $strQuantity = parseInt(data.Billing[intRow].Quantity);
                                var $strDiscount_Rate = "";

                                if (parseInt(data.Billing[intRow].Discount_Rate) > 0) {
                                    $strDiscount_Rate = parseFloat(data.Billing[intRow].Discount_Rate) + "%";
                                }

                                var $strTotal = '$' + formatCurrency(parseFloat(data.Billing[intRow].Total));

                                $objHTML = $objBookingDialogSchedulesFareBreakdown
                                    .find("tr.ui-tablerow-global-schedules-fare-billing:not(.ui-clone-global)")
                                    .wrapAll("<div />").parent().clone();

                                $objHTML.children().addClass("ui-clone-global").show();

                                $objHTML.html($objHTML.html().replace("{0}", $strInventory));
                                $objHTML.html($objHTML.html().replace("{1}", $strQuantity));
                                $objHTML.html($objHTML.html().replace("{2}", $strDiscount_Rate));
                                $objHTML.html($objHTML.html().replace("{3}", $strTotal));

                                $objBookingDialogSchedulesFareBreakdown
                                    .find("table.ui-table-global-schedules-fare-billing")
                                    .append($objHTML.html());
                            };
                        };

                        // Taxes
                        for (var intRow = 0; intRow < data.Taxes.length; intRow++) {
                            // List inventory with matching category
                            if (data.Taxes[intRow].Service == $strService) {
                                var $strTax = data.Taxes[intRow].Tax;
                                var $strTotal = '$' + formatCurrency(parseFloat(data.Taxes[intRow].Total));

                                $objHTML = $objBookingDialogSchedulesFareBreakdown
                                    .find("tr.ui-tablerow-global-schedules-fare-billing-taxes:not(.ui-clone-global)")
                                    .wrapAll("<div />").parent().clone();

                                $objHTML.children().addClass("ui-clone-global").show();

                                $objHTML.html($objHTML.html().replace("{0}", $strTax));
                                $objHTML.html($objHTML.html().replace("{1}", $strTotal));

                                $objBookingDialogSchedulesFareBreakdown
                                    .find("table.ui-table-global-schedules-fare-billing")
                                    .append($objHTML.html());
                            };
                        };
                    };


                    // Add Split
                    $objHTML = $objBookingDialogSchedulesFareBreakdown
                        .find("tr.ui-tablerow-global-schedules-fare-billing-split:not(.ui-clone-global)")
                        .wrapAll("<div />").parent().clone();

                    $objHTML.children().addClass("ui-clone-global").show();

                    $objHTML.html($objHTML.html().replace("{0}", $strTotal));

                    $objBookingDialogSchedulesFareBreakdown
                        .find("table.ui-table-global-schedules-fare-billing")
                        .append($objHTML.html());

                    // Grand Total
                    var $strTotal = '$' + formatCurrency(parseFloat(data.Total));

                    $objHTML = $objBookingDialogSchedulesFareBreakdown
                        .find("tr.ui-tablerow-global-schedules-fare-billing-total:not(.ui-clone-global)")
                        .wrapAll("<div />").parent().clone();

                    $objHTML.children().addClass("ui-clone-global").show();

                    $objHTML.html($objHTML.html().replace("{0}", $strTotal));

                    $objBookingDialogSchedulesFareBreakdown
                        .find("table.ui-table-global-schedules-fare-billing")
                        .append($objHTML.html());

                }
            });

            // Add Tier Description
            //if ($chrDescription != "") {
            $objHTML = $objBookingDialogSchedulesFareBreakdown
                .find("tr.ui-tablerow-global-schedules-tier-billing-split:not(.ui-clone-global)")
                .wrapAll("<div />").parent().clone();

            $objHTML.children().addClass("ui-clone-global").show();

            $objBookingDialogSchedulesFareBreakdown
                .find("table.ui-table-global-schedules-fare-billing")
                .append($objHTML.html());

            $objHTML = $objBookingDialogSchedulesFareBreakdown
                .find("tr.ui-tablerow-global-schedules-tier-billing-description:not(.ui-clone-global)")
                .wrapAll("<div />").parent().clone();

            $objHTML.children().addClass("ui-clone-global").show();

            // Old method
            //$objHTML.html($objHTML.html().replace("{0}", $strDescription));


            //alert($chrDescription);

            //$chrDescription = decodeURI($chrDescription);

            //alert($chrDescription);

            //alert($strDescription);

            //var $arrDescription = $strDescription.split("\n");
            //var $objDescription = "";
            //
            ////$objDescription = $strDescription;
            //
            //for (var intDescriptionID = 0; intDescriptionID < $arrDescription.length; intDescriptionID++) {
            //  if ($arrDescription[intDescriptionID] != "") {
            //    $objDescription = $objDescription + '<li>' + $arrDescription[intDescriptionID];
            //    //$objDescription = $objDescription + '<br />' + $arrDescription[intDescriptionID];
            //  }
            //};

            $chrTier_Description = decodeHtml($chrTier_Description);
            $chrTier_Description = $chrTier_Description.replace(/\n/g, '<br />');

            $objHTML.find(".ui-label-global-schedules-tier-description").html($chrTier_Description);

            $chrPolicy_Description = decodeHtml($chrPolicy_Description);
            $chrPolicy_Description = $chrPolicy_Description.replace(/\n/g, '<br />');

            $objHTML.find(".ui-label-global-schedules-policy-description").html($chrPolicy_Description);

            //$objHTML.find(".ui-label-global-schedules-policy-description").append($chrDescription);

            $objBookingDialogSchedulesFareBreakdown
                .find("table.ui-table-global-schedules-fare-billing")
                .append($objHTML.html());
            //}

            //$objBookingDialogSchedulesFare.append($objBookingDialogSchedulesFareBreakdown);
            //$objBookingDialogSchedulesFare.find("xx.ui-navigation-global-dialog").before($objBookingDialogSchedulesFareBreakdown);

            $objBookingDialogSchedulesFare
                .find(".ui-dialog-booking-schedules-fare-breakdown")
                .last()
                .after($objBookingDialogSchedulesFareBreakdown);
        };

        //    alert($objBookingDialogSchedulesFare.html());
        //    $objDialog.append($objBookingDialogSchedulesFare.html());
        //    alert($objDialog.html());

        // Show Fare Dialog, delete clone after closing
        //alert($objBookingDialogSchedulesFare.html());

        //    $objBookingDialogSchedulesFare
        //      .find(".ui-link-global-schedules-fare-cancel").click(function (e) {
        //        alert("X");
        //        $objBookingDialogSchedulesFare.dialog("close");
        //      });

        $objBookingDialogSchedulesFare.animate({ scrollTop: 0 });

        $objBookingDialogSchedulesFare.dialog({
            //height: 400,
            //width: 650,
            modal: true,
            draggable: false,
            resizable: false,


            //      buttons: {
            //        Close: function () {
            //          $(this).dialog("close");
            //        }
            //      },
            create: function (ev, ui) {
                //$(this).parent().appendTo("form");
                $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
                $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
            },
            close: function (ev, ui) {
                $(this).remove();
            }
        });

    };

    $.fn.BookingCredentialsPasswordRecoveryDialog = function (e) {
        $("input.ui-textbox-booking-passengers-credentials-password-recovery-email")
            .val($("input.ui-textbox-booking-passengers-credentials-email").val());

        var $objDialog = $(".ui-dialog-booking-passengers-credentials-password-recovery");

        $objDialog.dialog({
            //height: 200,
            width: 650,
            draggable: false,
            resizable: false,
            modal: true,
            create: function (ev, ui) {
                $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
                $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
            }
        });

    }

    $(".ui-link-booking-passengers-credentials-password-recovery-update").click(function (e) {
        $.Watermark.HideAll();

        var $bitValid = $.fn.IsEmail($(".ui-textbox-booking-passengers-credentials-password-recovery-email").val());

        $.Watermark.ShowAll();

        if ($bitValid == false) {
            $(".ui-textbox-booking-passengers-credentials-password-recovery-email").addClass("ui-state-global-error");
            e.preventDefault();

            return false;
        } else {
            $(".ui-radio-booking-passengers-credentials-login[data-option='Email'] input[type='radio']").trigger("click"); // attr("checked", "checked");
            $("input.ui-textbox-booking-passengers-credentials-email").val($("input.ui-textbox-booking-passengers-credentials-password-recovery-email").val());

            // Submit()
            //$.fn.Submit($(".ui-link-booking-passengers-credentials-password-recovery").attr("ID"), true, false, false);

            $(".ui-dialog-booking-passengers-credentials-password-recovery").dialog("close");

            //$.fn.SetEvent($(".ui-link-booking-passengers-credentials-password-recovery").attr("ID"))

            //$(".ui-link-booking-passengers-credentials-password-recovery-email").submit();

            $.fn.Processing();

            // lnkBookingPassengersCredentialsPasswordRecoveryEmail"
            __doPostBack($(".ui-link-booking-passengers-credentials-password-recovery-email").attr("id"), "")

            return;
            //return showProgress(false, false);
        };
    });

    $(".ui-link-booking-passengers-credentials-password-recovery-cancel").click(function (e) {
        $(".ui-dialog-booking-passengers-credentials-password-recovery").dialog("close");
    });

    // Clears out any non-numerics from Contact_ID in passengers
    $("input.ui-textbox-booking-passengers-contact_id").change(function (e) {
        var $objContact_ID = $(this);
        var $strNumber = $objContact_ID.val().replace(/[^0-9]/g, '');
        $objContact_ID.val($strNumber);
    });

    // Required fields
    $.fn.RequiredName = function ($objName) {
        var $strItem = $objName.attr("data-item");
        var $bitActivated = $("input.ui-hidden-booking-passengers-activated[data-item='" + $strItem + "']").val();

        $.Watermark.HideAll();

        if ($bitActivated == "0" && $objName.val() == "") {
            $objName.addClass("ui-state-global-required");
        } else {
            $objName.removeClass("ui-state-global-required");
        };

        $.Watermark.ShowAll();
    };

    $("input.ui-textbox-booking-passengers-first, input.ui-textbox-booking-passengers-last").bind("change", function (e) {
        $.fn.RequiredName($(this));
    }).each(function (e) {
        $.fn.RequiredName($(this));
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredName($(this));
    });

    $.fn.RequiredRequestName = function ($objName) {
        if ($objName.val() == "") {
            $objName.addClass("ui-state-global-required");
        } else {
            $objName.removeClass("ui-state-global-required");
        }
    }

    $("input.ui-textbox-booking-passengers-address-request-name").bind("change", function (e) {
        $.fn.RequiredRequestName($(this));
    }).each(function (e) {
        $.fn.RequiredRequestName($(this));
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredRequestName($(this));
    });

    $.fn.RequiredPhone = function () {
        var $bitValidatedPhone = false;

        //$.Watermark.HideAll();

        // Ensure at least one phone number
        $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").each(function (e) {
            var $objPhone = $(this);

            if ($objPhone.val() == $("input.ui-label-global-watermark-phone").val()) {
            } else if ($objPhone.val().replace(/[_ -]/g, "") !== "") {
                $bitValidatedPhone = true;
            }
            //console.log("Phone: " + $objPhone.attr("id"))
        });

        if (!$bitValidatedPhone) {
            $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").addClass("ui-state-global-required");
        } else {
            $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").removeClass("ui-state-global-required");
        }

        //$.Watermark.ShowAll();
    };

    $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").bind("change", function (e) {
        $.fn.RequiredPhone();
    }).each(function (e) {
        $.fn.RequiredPhone();
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredPhone();
    });

    $.fn.RequiredField = function ($objField) {
        if ($objField.val() == "") {
            $objField.addClass("ui-state-global-required");
        } else {
            $objField.removeClass("ui-state-global-required");
        }
    }

    $(".ui-type-global-address[data-required='True'], .ui-type-global-city[data-required='True'], .ui-type-global-state[data-required='True'], .ui-type-global-zip[data-required='True'], .ui-type-global-country[data-required='True']").bind("change", function (e) {
        $.fn.RequiredField($(this));
    }).each(function (e) {
        $.fn.RequiredField($(this));
    })

    $.fn.RequiredEmail = function ($objEmail) {
        $.Watermark.HideAll();

        if ($.fn.IsEmail($objEmail.val(), false) == false) {
            $objEmail.addClass("ui-state-global-required");
        } else {
            $objEmail.removeClass("ui-state-global-required");
        }

        $.Watermark.ShowAll();
    };

    $("input.ui-textbox-booking-passengers-address-email, input.ui-textbox-booking-confirmation-email-primary").bind("change", function (e) {
        $.fn.RequiredEmail($(this));
    }).each(function (e) {
        $.fn.RequiredEmail($(this));
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredEmail($(this));
    });

    $.fn.RequiredPaymentEigenNumber = function ($objNumber) {
        $.Watermark.HideAll();

        if (!$.fn.EigenCardValidation($objNumber, false).valid) {
            $objNumber.addClass("ui-state-global-required");
        } else {
            $objNumber.removeClass("ui-state-global-required");
        }

        $.Watermark.ShowAll();
    };

    $("input.ui-textbox-booking-payment-method-authorizenet-number, input.ui-textbox-booking-payment-method-charge-number, input.ui-textbox-booking-payment-method-eigen-number, input.ui-textbox-booking-payment-method-miraserv-number").bind("change", function (e) {
        $.fn.RequiredPaymentEigenNumber($(this));
    }).each(function (e) {
        $.fn.RequiredPaymentEigenNumber($(this));
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredPaymentEigenNumber($(this));
    });

    $.fn.RequiredPaymentInput = function ($objInput) {
        $.Watermark.HideAll();

        if ($objInput.val() == "") {
            $objInput.addClass("ui-state-global-required");
        } else {
            $objInput.removeClass("ui-state-global-required");
        }

        $.Watermark.ShowAll();
    };

    $("input.ui-textbox-booking-payment-method-customers-member, input.ui-textbox-booking-payment-method-greatplains-number, input.ui-textbox-booking-payment-method-voucher-ticket").bind("change", function (e) {
        $.fn.RequiredPaymentInput($(this));
    }).each(function (e) {
        $.fn.RequiredPaymentInput($(this));
    }).focus(function (e) {
        //    $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredPaymentInput($(this));
    });

    // Remove Error Class
    $(".ui-textbox-global, .ui-dropdown-global").focus(function (e) {
        $(this).removeClass("ui-state-global-error");
    });

    // Passengers: Agent (Any Option)
    $(".ui-radio-booking-passengers-agents-option input[type='radio']").click(function (e) {
        $("select.ui-dropdown-booking-passengers-agents-contact_id").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-booking-passengers-contact_id").focus(function (e) {
        var $objContact_ID = $(this);
        var $strItem = $objContact_ID.attr("data-item");

        $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");
        $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").removeClass("ui-state-global-error");
    });

    // If any Address phone number is focused
    $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").focus(function (e) {
        // Remove all related phone number error class
        $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").removeClass("ui-state-global-error");
    });

    // Add New Passenger
    $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last, .ui-link-booking-passengers-add").focus(function (e) {
        $(".ui-link-booking-passengers-add").removeClass("ui-state-global-error");
    });

    $(".ui-textbox-booking-passengers-birthdate").focus(function (e) {
        $(this).removeClass("ui-state-global-error");
    });

    // Pickup and Dropoff
    $(".ui-dropdown-booking-summary-schedules-transport").focus(function (e) {
        // Remove both month and year error class
        $(this).removeClass("ui-state-global-error");
    });

    $(".ui-dropdown-booking-payment-method-authorizenet-expiration-month, .ui-dropdown-booking-payment-method-authorizenet-expiration-year").focus(function (e) {
        // Remove both month and year error class
        $(".ui-dropdown-booking-payment-method-authorizenet-expiration-month, .ui-dropdown-booking-payment-method-authorizenet-expiration-year").removeClass("ui-state-global-error");
    });

    $(".ui-dropdown-booking-payment-method-charge-expiration-month, .ui-dropdown-booking-payment-method-charge-expiration-year").focus(function (e) {
        // Remove both month and year error class
        $(".ui-dropdown-booking-payment-method-charge-expiration-month, .ui-dropdown-booking-payment-method-charge-expiration-year").removeClass("ui-state-global-error");
    });

    $(".ui-dropdown-booking-payment-method-eigen-expiration-month, .ui-dropdown-booking-payment-method-eigen-expiration-year").focus(function (e) {
        // Remove both month and year error class
        $(".ui-dropdown-booking-payment-method-eigen-expiration-month, .ui-dropdown-booking-payment-method-eigen-expiration-year").removeClass("ui-state-global-error");
    });

    $(".ui-dropdown-booking-payment-method-miraserv-expiration-month, .ui-dropdown-booking-payment-method-miraserv-expiration-year").focus(function (e) {
        // Remove both month and year error class
        $(".ui-dropdown-booking-payment-method-miraserv-expiration-month, .ui-dropdown-booking-payment-method-miraserv-expiration-year").removeClass("ui-state-global-error");
    });

    // Summary, Travel Agent checkbox and select/inputs, remove error class
    $(".ui-labelbox-booking-summary-billing-agent input[type='checkbox']").click(function (e) {
        $("select.ui-dropdown-booking-summary-billing-agent-service, input.ui-textbox-booking-summary-billing-agent-member").removeClass("ui-state-global-error");
    });

    $("select.ui-dropdown-booking-summary-billing-agent-service, input.ui-textbox-booking-summary-billing-agent-member").focus(function (e) {
        $("select.ui-dropdown-booking-summary-billing-agent-service, input.ui-textbox-booking-summary-billing-agent-member").removeClass("ui-state-global-error");
    });

    // Confirmation: All Fields
    $(".ui-radio-booking-confirmation-option input[type='radio']").change(function (e) {
        $("input.ui-textbox-booking-confirmation-email, input.ui-textbox-booking-confirmation-text, input.ui-textbox-booking-confirmation-phone, select.ui-dropdown-booking-confirmation-phone-method").removeClass("ui-state-global-error");
    });

    // Agreement
    $(".ui-agreement-confirmation").click(function (e) {
        $(".ui-agreement-confirmation").removeClass("ui-state-global-error");
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Click: Request / Book Now / Validation
    $(".ui-button-booking-book").click(function (e) {

        // Force Refresh    
        if ($(".ui-radiolist-booking-payment input:checked").closest("span").attr("data-Control") == "MiraSecure") {
            $("iframe.ui-iframe-booking-payment-method-mirasecure").focus().blur();
        }

        mBookNowStart(e);

        //stop e.preventDefault();
        return false;
    });

    //var mBookNowStart = function(e) {
    //  if (bitMiraSecureIsFocused) {
    //    console.log("Waiting...")
    //    setTimeout(function () { console.log("iterate"); mBookNowStart(e) }, 1);
    //  } else {
    //    console.log("CardValid: " + bitMiraSecureCardValid);
    //    //mBookingNowValidation(e)
    //    e.preventDefault();
    //    return false;
    //  };
    //};

    function mBookNowStart(e) {
        //console.log("waitForIt: " + bitMiraSecureIsFocused);
        if (bitMiraSecureIsFocused) {
            // Loop until MiraSecure focus is blurred
            setTimeout(function () { mBookNowStart(e); }, 10);
        } else {
            //console.log("CardValid: " + bitMiraSecureCardValid);
            mBookingNowValidation(e);
            //e.preventDefault();
            //return false;
        };
    }

    function mBookingNowValidation(e) {
        var $bitValidated = true;
        var $strCardProcess = "";
        var $intScroll = 99;
        var $intScrollOption = 0;

        //.effect("highlight", {color: 'crimson'}, 2000);
        //$(".ui-schedule-confirmation-waitinglist[data-Schedule='Departure'][data-Section='WaitingList']").effect("shake", {color: 'crimson'}, 2000);
        //      $(".ui-schedule-confirmation-waitinglist[data-Schedule='Departure'][data-Section='WaitingList']").effect("pulsate", { times: 2 }, 600);
        //      $(".Route_Class_Tier_ID[data-Schedule='Departure']").closest("tr").children("td").effect("highlight", {color: 'crimson'}, 2500);

        //      $(".ui-field-address-phone").addClass("ui-state-error");
        //      $(".ui-field-address-email").addClass("ui-state-error");

        //return false;

        // Hide watermarks
        $.Watermark.HideAll();

        var $arrValidationErrors = [];

        // Departure | Return Selections
        // Check if schedule is enabled
        var $objSchedules = ["Departure", "Return", "Change"]

        for (var $intSchedule in $objSchedules) {
            // Grab the Schedule identifier
            var $strSchedule = $objSchedules[$intSchedule];

            if ($(".ui-panel-global-schedules[data-schedule='" + $strSchedule + "']").length == 1) {
                if (typeof $(".ui-booking-schedules-radio-route_class_tier_id[data-schedule='" + $strSchedule + "'] input[type=radio]:checked").val() === "undefined") {

                    $("tr.ui-tablerow-global-schedules-error[data-schedule='" + $strSchedule + "']").show();

                    $bitValidated = false;
                    $intScroll = Math.min(($intSchedule * 2) + 1, $intScroll);
                    $arrValidationErrors.push($(".ui-label-booking-book-error-schedules[data-schedule='" + $strSchedule + "']").val());
                }

                if ($("input.ui-hidden-global-schedules-conditions-option[data-schedule='" + $strSchedule + "']").val() == 1 &&
                    $("input.ui-hidden-global-schedules-conditions-flag[data-schedule='" + $strSchedule + "']").val() == 0) {

                    if ($.fn.browserEnhanced() == true) {
                        $(".ui-button-global-schedules-conditions[data-schedule='" + $strSchedule + "']").effect("pulsate", { times: 2 }, 2500);
                    };

                    $bitValidated = false;
                    $intScroll = Math.min(($intSchedule * 2) + 2, $intScroll)
                    $intScrollOption = 1;
                }

                if ($("input.ui-hidden-global-schedules-waiting-option[data-schedule='" + $strSchedule + "']").val() == 1 &&
                    $("input.ui-hidden-global-schedules-waiting-flag[data-schedule='" + $strSchedule + "']").val() == 0) {

                    if ($.fn.browserEnhanced() == true) {
                        $(".ui-button-global-schedules-waiting[data-schedule='" + $strSchedule + "']").effect("pulsate", { times: 2 }, 2500);
                    };

                    $bitValidated = false;
                    $intScroll = Math.min(($intSchedule * 2) + 2, $intScroll)
                    $intScrollOption = 2;
                }
            };
        }

        // Passengers Contact_ID, if number entered by not searched on
        $(".ui-textbox-booking-passengers-contact_id").each(function (e) {
            var $objValidation = $(this);
            var $strItem = $objValidation.attr("data-item");

            if ($objValidation.val() != "") {
                if ($(".ui-hidden-booking-passengers-activated[data-item='" + $strItem + "']").val() == 0) {

                    $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").addClass("ui-state-global-error");
                    $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").addClass("ui-state-global-error");

                    $bitValidated = false;
                    $intScroll = Math.min(5, $intScroll)
                }
            }
        });

        // Passengers First and Last Name
        $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last").each(function () {
            var $objValidation = $(this);

            if ($(".ui-hidden-booking-passengers-activated[data-item='" + $objValidation.attr("data-item") + "']").val() == "-1") {
                // Activated / Ignore
            } else if ($objValidation.val() == "") {
                $objValidation.addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll)
            };
        });

        $(".ui-textbox-booking-passengers-email").each(function () {
            var $objValidation = $(this);

            if ($(".ui-hidden-booking-passengers-activated[data-item='" + $objValidation.attr("data-item") + "']").val() == "-1") {
                // Activated / Ignore
            } else if ($objValidation.val() == "") {
            } else if ($.fn.IsEmail($objValidation.val(), true) == false) {
                $objValidation.addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll)
            };
        });

        $blnRequiredBirthdate = $(".ui-hidden-booking-passengers-required-birthdate").val();

        $(".ui-textbox-booking-passengers-birthdate").each(function () {
            var $objValidation = $(this);

            if ($(".ui-hidden-booking-passengers-activated[data-item='" + $objValidation.attr("data-item") + "']").val() == "-1") {
                // Activated / Ignore
            } else if ($blnRequiredBirthdate == "0") {
            } else if ($objValidation.val() == "") {
                $objValidation.addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll)
            };
        });


        // Agents

        // If Agent, Existing Customer Radio selected, no drop-down selected
        if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-agent_contact_id input[type='radio']").is(":checked") == true &&
            $(".ui-dropdown-booking-passengers-agents-contact_id").val() == 0) {

            $("select.ui-dropdown-booking-passengers-agents-contact_id").addClass("ui-state-global-error");

            $bitValidated = false;
            $intScroll = Math.min(5, $intScroll)
        }

        // If Agent, Existing Customer # selected, no Customer # entered
        if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-existing input[type='radio']").is(":checked") == true &&
            $("input.ui-hidden-booking-passengers-activated").first().val() == "0") {

            $("input.ui-textbox-booking-passengers-contact_id").first().addClass("ui-state-global-error");
            $("input.ui-button-booking-passengers-search").first().addClass("ui-state-global-error");

            $bitValidated = false;
            $intScroll = Math.min(5, $intScroll)
        }

        if ($.fn.IsBookingDocumentation()) {
            var $bitValidatedDocumentation = true;

            $(".ui-panel-booking-passengers-documentation").each(function () {
                //debugger;

                var $strItem = $(this).attr("data-Item");
                if ($(this).find("input.ui-hidden-booking-passengers-documentation-enabled").val() == "0") { return true; }

                var $objName = $(this).find(".ui-labelbox-booking-passengers-documentation-name input");

                if ($objName.prop("checked")) {
                    var $objNameFirst = $(this).find("input.ui-textbox-booking-passengers-documentation-first");
                    var $objNameMiddle = $(this).find("input.ui-textbox-booking-passengers-documentation-middle");
                    var $objNameLast = $(this).find("input.ui-textbox-booking-passengers-documentation-last");

                    if ($objNameFirst.val() == "") {
                        $objNameFirst.addClass("ui-state-global-error");
                        $bitValidatedDocumentation = false;
                    }

                    if ($objNameLast.val() == "") {
                        $objNameLast.addClass("ui-state-global-error");
                        $bitValidatedDocumentation = false;
                    }
                }

                $(this).find("select.ui-dropdown-booking-passengers-documentation-gender").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_birth").each(function () {
                    if (!IsValidISODate($(this).val(), void 0, new Date())) {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-code").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-number").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-nationality").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-residence").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-issued").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_activation").each(function () {
                    if ($(this).val() != '') {
                        if (!IsValidISODate($(this).val(), new Date(1900, 0, 0), void 0)) {
                            $bitValidatedDocumentation = false;
                            $(this).addClass("ui-state-global-error");
                        }
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_expiration").each(function () {
                    if (!IsValidISODate($(this).val(), new Date(), void 0)) {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })
            })

            if (!$bitValidatedDocumentation) {
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll);
            }
        }

        // Flags
        $(".ui-card-booking-passengers-flags").each(function (e) {
            $objFlag_ID = $(this).find(".ui-checkbox-booking-passengers-flags-flag input[type='checkbox']");
            if ($objFlag_ID.is(':checked')) {
                $objOptions = $(this).find(".ui-dropdown-booking-passengers-flags-options");

                if ($objOptions.attr("optionsrequired") == "true") {
                    if ($objOptions.val() == "") {
                        $objOptions.addClass("ui-state-global-error");

                        $bitValidated = false;
                        $intScroll = Math.min(6, $intScroll);
                    }
                }
            }
        });

        // Address

        // If logged in as contact, ignore
        if ($(".ui-hidden-global-contact").val() == -1) {
            // If logged in as agent, and new customer not selected
        } else if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-new input[type='radio']").is(":checked") == false) {
        } else {
            // Validate Address
            var $bitValidatedPhone = false;

            if ($("select.ui-dropdown-booking-passengers-address-primary").val() == null) {
                $objLogin = $(".ui-labelbox-booking-passengers-credentials-account input[type='checkbox']");
                $objLogin.prop("checked", true);

                $.fn.PassengersCredentialsAccountClick($objLogin, $("a.ui-link-booking-passengers-credentials-account"));

                $objContact_ID = $(".ui-hidden-booking-passengers-selected[Value!='0']")

                $(".ui-textbox-booking-passengers-credentials-contact_id").val($objContact_ID.val());
                //$(".ui-textbox-booking-passengers-credentials-contact_id").focus();

                //$("select.ui-dropdown-booking-passengers-address-primary").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll)
            }

            // Add error state to all required address fields
            $(".ui-textbox-booking-passengers-address-address[data-required='True'], .ui-textbox-booking-passengers-address-city[data-required='True'], .ui-textbox-booking-passengers-address-state[data-required='True'], .ui-textbox-booking-passengers-address-zip[data-required='True'], .ui-textbox-booking-passengers-address-country[data-required='True']").each(function (e) {

                $objField = $(this);

                if ($objField.val() == "") {
                    $objField.addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(7, $intScroll)
                }
            });

            // Ensure at least one phone number
            $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").each(function (e) {
                var $objPhone = $(this);

                if ($objPhone.val().replace(/[_ -]/g, "") !== "") {
                    $bitValidatedPhone = true;
                }
            });

            // Add error state to all address phone fields
            if ($bitValidatedPhone == false) {
                $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(7, $intScroll)
            };

            // Validate email address
            if ($.fn.IsEmail($(".ui-textbox-booking-passengers-address-email").val(), false) == false) {
                //if ($(".ui-field-address-email").val() == "") {
                $(".ui-textbox-booking-passengers-address-email").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(7, $intScroll)
            }
        };

        if (!$.fn.mValidateTransport($objSchedules)) {
            $bitValidated = false;
            $intScroll = Math.min(8, $intScroll);
        }

        // Ensure payment is selected
        if (typeof $(".ui-radiolist-booking-payment input:checked").val() === "undefined") {
            $bitValidated = false;
            $intScroll = Math.min(9, $intScroll);
        };

        var $strPaymentControl = $(".ui-radiolist-booking-payment input:checked").closest("span").attr("data-Control");

        $strCardProcess = $strPaymentControl;

        if ($strPaymentControl == "AuthorizeNet") {
            if (!$.fn.AuthorizeNetCardValidation($("input.ui-textbox-booking-payment-method-authorizenet-number"), false).valid) {
                $("input.ui-textbox-booking-payment-method-authorizenet-number").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            // Validate Expiration Year and Month
            var $dtmDateCurrent = new Date();

            if (parseInt($("select.ui-dropdown-booking-payment-method-authorizenet-expiration-year").val()) < parseInt($dtmDateCurrent.getFullYear())) {
                $("select.ui-dropdown-booking-payment-method-authorizenet-expiration-month").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-payment-method-authorizenet-expiration-year").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }
            if (parseInt($("select.ui-dropdown-booking-payment-method-authorizenet-expiration-year").val()) == parseInt($dtmDateCurrent.getFullYear())) {
                if (parseInt($("select.ui-dropdown-booking-payment-method-authorizenet-expiration-month").val()) < parseInt($dtmDateCurrent.getMonth() + 1)) {
                    $("select.ui-dropdown-booking-payment-method-authorizenet-expiration-month").addClass("ui-state-global-error");
                    $("select.ui-dropdown-booking-payment-method-authorizenet-expiration-year").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(9, $intScroll)
                }
            }

        } else if ($strPaymentControl == "Charge") {
            if (!$.fn.ChargeCardValidation($("input.ui-textbox-booking-payment-method-charge-number"), false).valid) {
                $("input.ui-textbox-booking-payment-method-charge-number").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            // Validate Expiration Year and Month
            var $dtmDateCurrent = new Date();

            if (parseInt($("select.ui-dropdown-booking-payment-method-charge-expiration-year").val()) < parseInt($dtmDateCurrent.getFullYear())) {
                $("select.ui-dropdown-booking-payment-method-charge-expiration-month").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-payment-method-charge-expiration-year").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }
            if (parseInt($("select.ui-dropdown-booking-payment-method-charge-expiration-year").val()) == parseInt($dtmDateCurrent.getFullYear())) {
                if (parseInt($("select.ui-dropdown-booking-payment-method-charge-expiration-month").val()) < parseInt($dtmDateCurrent.getMonth() + 1)) {
                    $("select.ui-dropdown-booking-payment-method-charge-expiration-month").addClass("ui-state-global-error");
                    $("select.ui-dropdown-booking-payment-method-charge-expiration-year").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(9, $intScroll)
                }
            }

        } else if ($strPaymentControl == "Eigen") {

            // Validate Credit Card Number
            if (!$.fn.EigenCardValidation($("input.ui-textbox-booking-payment-method-eigen-number"), false).valid) {
                $("input.ui-textbox-booking-payment-method-eigen-number").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            //            if ($(".ui-field-payment-eigen-validated").val() !== "1") {
            //              $(".ui-field-payment-eigen-number").addClass("ui-state-error");
            //              $bitValidated = false;
            //              $intScroll = Math.min(9, $intScroll)
            //            }

            //            if ($(".ui-field-payment-eigen-ccv").val() == "") {
            //              $(".ui-field-payment-eigen-ccv").addClass("ui-state-error");
            //              $bitValidated = false;
            //              $intScroll = Math.min(9, $intScroll)
            //            }

            // Validate Expiration Year and Month
            var $dtmDateCurrent = new Date();

            if (parseInt($("select.ui-dropdown-booking-payment-method-eigen-expiration-year").val()) < parseInt($dtmDateCurrent.getFullYear())) {
                $("select.ui-dropdown-booking-payment-method-eigen-expiration-month").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-payment-method-eigen-expiration-year").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }
            if (parseInt($("select.ui-dropdown-booking-payment-method-eigen-expiration-year").val()) == parseInt($dtmDateCurrent.getFullYear())) {
                if (parseInt($("select.ui-dropdown-booking-payment-method-eigen-expiration-month").val()) < parseInt($dtmDateCurrent.getMonth() + 1)) {
                    $("select.ui-dropdown-booking-payment-method-eigen-expiration-month").addClass("ui-state-global-error");
                    $("select.ui-dropdown-booking-payment-method-eigen-expiration-year").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(9, $intScroll)
                }
            }
        } else if ($strPaymentControl == "MiraServ") {
            // Validate Credit Card Number
            if (!$.fn.MiraServCardValidation($("input.ui-textbox-booking-payment-method-miraserv-number"), false).valid) {
                $("input.ui-textbox-booking-payment-method-miraserv-number").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            // Validate Expiration Year and Month
            var $dtmDateCurrent = new Date();

            if (parseInt($("select.ui-dropdown-booking-payment-method-miraserv-expiration-year").val()) < parseInt($dtmDateCurrent.getFullYear())) {
                $("select.ui-dropdown-booking-payment-method-miraserv-expiration-month").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-payment-method-miraserv-expiration-year").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }
            if (parseInt($("select.ui-dropdown-booking-payment-method-miraserv-expiration-year").val()) == parseInt($dtmDateCurrent.getFullYear())) {
                if (parseInt($("select.ui-dropdown-booking-payment-method-miraserv-expiration-month").val()) < parseInt($dtmDateCurrent.getMonth() + 1)) {
                    $("select.ui-dropdown-booking-payment-method-miraserv-expiration-month").addClass("ui-state-global-error");
                    $("select.ui-dropdown-booking-payment-method-miraserv-expiration-year").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(9, $intScroll)
                }
            }

            //// MiraServ / Credit Card Date validation
            //if ($("input.ui-hidden-booking-payment-miraserv-validation-date").val() == "1") {
            //  $bitValidated = false;
            //}

        } else if ($strPaymentControl == "MiraSecure") {
            //alert("bitMiraSecureCardValid:" + bitMiraSecureCardValid)
            //alert("bitMiraSecureExpirationValid:" + bitMiraSecureExpirationValid);

            if (!bitMiraSecureCardValid) {
                sendMessage({ Type: 'SetErrorClass', FieldName: 'CardNumber' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecureCardHolderNameValid) {
                sendMessage({ Type: 'SetErrorClass', FieldName: 'CardHolderName' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecureExpirationValid) {
                //sendMessage({ Type: 'SetErrorClass', FieldName: 'Expiry' });
                sendMessage({ Type: 'SetErrorClass', FieldName: 'ExpiryMonth' });
                sendMessage({ Type: 'SetErrorClass', FieldName: 'ExpiryYear' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecureCVVValid) {
                //sendMessage({ Type: 'SetErrorClass', FieldName: 'Expiry' });
                sendMessage({ Type: 'SetErrorClass', FieldName: 'CVV' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecureAddressValid) {
                sendMessage({ Type: 'SetErrorClass', FieldName: 'Address' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecureCityValid) {
                sendMessage({ Type: 'SetErrorClass', FieldName: 'City' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

            if (!bitMiraSecurePostalCodeValid) {
                sendMessage({ Type: 'SetErrorClass', FieldName: 'PostalCode' });
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll)
            }

        } else if ($strPaymentControl == "Stripe") {

        } else if ($strPaymentControl == "GreatPlains") {
            if ($("input.ui-textbox-booking-payment-method-greatplains-number").val() == "") {
                $("input.ui-textbox-booking-payment-method-greatplains-number").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll);
            }
        } else if ($strPaymentControl == "Voucher") {
            if ($("input.ui-textbox-booking-payment-method-voucher-ticket").val() == "") {
                $("input.ui-textbox-booking-payment-method-voucher-ticket").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(9, $intScroll);
            }
        }

        // Validation: Manual Travel Agent | Member
        if ($("input.ui-hidden-global-agent").val() == 0) {
            if ($(".ui-labelbox-booking-summary-billing-agent input[type='checkbox']").is(":checked") == true) {
                if ($("select.ui-dropdown-booking-summary-billing-agent-service").val() == "" ||
                    $("input.ui-textbox-booking-summary-billing-agent-member").val() == "") {
                    $("select.ui-dropdown-booking-summary-billing-agent-service").addClass("ui-state-global-error");
                    $("input.ui-textbox-booking-summary-billing-agent-member").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(8, $intScroll);
                }
            }
        }

        // Transport: Pickup and Dropoff
        $(".ui-hidden-booking-summary-schedules-transport").each(function (e) {
            // Validate to ensure it is part of the drop-down list
            if (
                $(this)
                    .parent()
                    .find(".ui-dropdown-booking-summary-schedules-transport")
                    .find("option")
                    .slice(1)
                    .filter("[value='" + $(this).val() + "']")
                    .length == 0) {
                $(this).val("");
            };
        });

        var $strConfirmationMethod = $(".ui-radio-booking-confirmation-option input[type='radio']:checked").closest("span").attr("data-option");

        if ($strConfirmationMethod == "Email") {
            // Validate Primary Email Address
            if ($.fn.IsEmail($("input.ui-textbox-booking-confirmation-email-primary").val(), true) == false) {
                $("input.ui-textbox-booking-confirmation-email-primary").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(10, $intScroll)
            }
            // Validate Alternate Email, if exists
            if ($("input.ui-textbox-booking-confirmation-email-alternate").val() != "") {
                if ($.fn.IsEmail($("input.ui-textbox-booking-confirmation-email-alternate").val(), true) == false) {
                    $("input.ui-textbox-booking-confirmation-email-alternate").addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(10, $intScroll)
                }
            }
        } else if ($strConfirmationMethod == "Text") {
            // Validate text number
            if ($("input.ui-textbox-booking-confirmation-text").val() == "") {
                $("input.ui-textbox-booking-confirmation-text").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(10, $intScroll)
            }
        } else if ($strConfirmationMethod == "Phone") {
            // Validate phone number
            if ($("input.ui-textbox-booking-confirmation-phone").val() == "") {
                $("input.ui-textbox-booking-confirmation-phone").addClass("ui-state-global-error");
                $("select.ui-dropdown-booking-confirmation-phone-method").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(10, $intScroll)
            }
        } else if ($strConfirmationMethod == "None") {
        }

        var $objAgreement = $(".ui-labelbox-agreement-confirmation input[type='checkbox']")

        if ($objAgreement.length == 1) {
            if ($objAgreement.is(":checked") == false) {
                $(".ui-agreement-confirmation").addClass("ui-state-global-error");
                //$(".ui-agreement-legal").slideDown($intSlideTime);

                //$(".ui-button-confirmation-agreement").delay(500).effect("pulsate", { times: 2 }, 1000);
                $bitValidated = false;
                $intScroll = Math.min(11, $intScroll)
            }
        }

        // If new customer, validate email
        // All fields are validated
        if ($bitValidated == true) {

            // If Logged In
            if ($(".ui-hidden-global-contact").val() == -1) {
            } else if ($(".ui-hidden-global-agent").val() == -1 &&
                $(".ui-radio-booking-passengers-agents-option-new input[type='radio']").is(":checked") == false) {
            } else {
                var $strBookingAddressEmail = $(".ui-textbox-booking-passengers-address-email").val();

                //$bitValidated = false;
                $.ajax({
                    type: "GET",
                    //url: "/Search/BookingDetails.aspx",
                    //data: "Booking_ID=330114",
                    url: "/Search/EmailValidation.aspx",
                    //data: "Company_ID=" & $intCompany_ID & + "Session=" + $strSession + "&Email=" + $strBookingAddressEmail,
                    data: "Session=" + $strSession + "&Email=" + $strBookingAddressEmail,
                    async: false,
                    error: function (xhr, ajaxOptions, thrownError) {
                        //alert(xhr.status); 
                        //alert(thrownError); 
                        $bitValidated = false;
                    },
                    success: function (data) {
                        if (data.Validation == 0) {
                            $bitValidated = false;
                            var $objDialog = $(".ui-dialog-booking-book-validation");

                            if ($(".ui-hidden-global-agent").val() == -1) {
                                $objDialog = $(".ui-dialog-booking-book-validation-agent");
                            }

                            $objDialog.html($objDialog.html().replace("{0}", $strBookingAddressEmail));

                            // Continue
                            $objDialog.find("a.ui-link-booking-dialog-validation-accept").bind("click", function (e) {
                                $.Watermark.HideAll();

                                $objDialog.dialog("close");

                                mBookNow($strCardProcess);

                                ////$.fn.Submit($(".ui-button-booking-book").attr("ID"), true, false, false);

                                //$.fn.Processing();

                                //__doPostBack($(".ui-button-booking-book").attr("id"), "")

                                e.preventDefault();
                                return false;
                            });

                            // Recover Password
                            $objDialog.find("a.ui-link-booking-dialog-validation-password").bind("click", function (e) {

                                $.Watermark.HideAll();

                                $(".ui-radio-booking-passengers-credentials-login[data-option='Email'] input[type='radio']").trigger("click"); // attr("checked", "checked");
                                $("input.ui-textbox-booking-passengers-credentials-email").val($strBookingAddressEmail);

                                // Submit()
                                //$.fn.Submit($(".ui-link-booking-passengers-credentials-password-recovery").attr("ID"), true, false, false);

                                $.fn.Processing();

                                // lnkBookingPassengersCredentialsPasswordRecoveryEmail"
                                __doPostBack($(".ui-link-booking-passengers-credentials-password-recovery-email").attr("id"), "")

                                $objDialog.dialog("close");

                                e.preventDefault();
                                return false;
                            });

                            // Cancel
                            $objDialog.find("a.ui-link-booking-dialog-validation-cancel").bind("click", function (e) {
                                $objDialog.dialog("close");

                                e.preventDefault();
                                return false;
                            });

                            //ui-dialog-validation
                            //$objDialog.dialog('destroy');
                            $objDialog.dialog({
                                height: 'auto',
                                width: 650,
                                draggable: false,
                                resizable: false,
                                modal: true,
                                //                buttons: [
                                //                  { text: "Recover Password",
                                //                    "class": 'ui-dialog-validation-button-password ui-button-xlarge ui-state-error',
                                //                    click: function () {
                                //                      showProgress(true, true);

                                //                      $(".ui-radio-credentials-email input:radio").prop("checked", true);
                                //                      $(".ui-field-credentials-email").val($strBookingAddressEmail);

                                //                      $("#__EVENTTARGET").val("btnPassword");
                                //                      $("#__EVENTARGUMENT").val("");
                                //                      $("form").submit();

                                //                      $(this).dialog("close");

                                //                      return false;
                                //                    }
                                //                  },
                                //                  { text: "Cancel",
                                //                    click: function () {
                                //                      $(this).dialog("close");
                                //                    }
                                //                  }
                                //                ],
                                create: function (ev, ui) {
                                    //                  $(this).parent().find(".ui-dialog-validation-email").text($strBookingAddressEmail);
                                    //                  $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
                                    //                  $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
                                    //                  $(this).parent().find('.ui-dialog-validation-button-password').css({ 'float': 'left' });
                                    //                  if ($(".ui-field-login-agent").val() == -1) {
                                    //                    $(this).parent().find('.ui-dialog-validation-button-password').hide();
                                    //                  }
                                },
                                close: function (ev, ui) {
                                    $objDialog.find("a.ui-link-booking-dialog-validation-accept").unbind("click");
                                    $objDialog.find("a.ui-link-booking-dialog-validation-password").unbind("click");
                                    $objDialog.find("a.ui-link-booking-dialog-validation-cancel").unbind("click");
                                }
                            });
                        };
                    }
                });

                if ($bitValidated == false) {
                    $.Watermark.ShowAll();
                    e.preventDefault();
                    return false;
                }
            }

            mBookNow($strCardProcess);
            return true;
        }

        //if ($bitValidated == true) {
        //}

        $.Watermark.ShowAll();

        if ($bitValidated == false) {
            var $intOffset = $("html, body").offset().top;

            //alert($intScroll);

            if ($intScroll == 1) { $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20; }
            if ($intScroll == 2) {
                if ($intScrollOption == 1) {
                    if ($(".ui-tablerow-global-schedules-conditions[data-schedule='Departure']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-conditions[data-schedule='Departure']").offset().top - 600;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20;
                    }
                }

                if ($intScrollOption == 2) {
                    if ($(".ui-tablerow-global-schedules-waiting[data-schedule='Departure']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-waiting[data-schedule='Departure']").offset().top - 100;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20;
                    }
                }
            }
            if ($intScroll == 3) { $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20; }
            if ($intScroll == 4) {
                if ($(".ui-tablerow-global-schedules-conditions[data-schedule='Return']").is(":visible")) {
                    $intOffset = $(".ui-tablerow-global-schedules-conditions[data-schedule='Return']").offset().top - 100;
                } else {
                    $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20;
                }

                if ($(".ui-tablerow-global-schedules-waiting[data-schedule='Return']").is(":visible")) {
                    $intOffset = $(".ui-tablerow-global-schedules-waiting[data-schedule='Return']").offset().top - 100;
                } else {
                    $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20;
                }
            }

            if ($intScroll == 5) { $intOffset = $(".ui-booking-passengers").offset().top - 20; }
            if ($intScroll == 6) { $intOffset = $(".ui-booking-passengers-flags").offset().top - 20; }
            if ($intScroll == 7) { $intOffset = $(".ui-booking-passengers-address").offset().top - 20; }
            if ($intScroll == 8) { $intOffset = $(".ui-booking-summary").offset().top - 20; }
            if ($intScroll == 9) { $intOffset = $(".ui-booking-payment").offset().top - 20; }
            if ($intScroll == 10) { $intOffset = $(".ui-booking-confirmation").offset().top - 20; }
            if ($intScroll == 11) { $intOffset = $(".ui-agreement-confirmation").offset().top - 20; }

            //$intOffset = $("[data-Schedule='Return']")

            $('html, body').animate({ scrollTop: $intOffset }, 'slow');
        };

        //    var $objScrollArea = $("html, body");

        //    if ($intScroll == 1) { $objScrollArea = $("[data-Schedule='Departure']"); }
        //    if ($intScroll == 2) { $objScrollArea = $("[data-Schedule='Departure'][data-Section='Error']"); }
        //    if ($intScroll == 3) { $objScrollArea = $("[data-Schedule='Return']"); }
        //    if ($intScroll == 4) { $objScrollArea = $("[data-Schedule='Return'][data-Section='Error']"); }
        //    if ($intScroll == 5) { $objScrollArea = $(".ui-booking-passengers"); }
        //    if ($intScroll == 6) { $objScrollArea = $(".ui-booking-passengers-address"); }
        //    if ($intScroll == 7) { $objScrollArea = $("#Payment"); }
        //    if ($intScroll == 8) { $objScrollArea = $("#Confirmation"); }

        //    //$objScrollArea = $("[data-Schedule='Return']")

        //    $('html, body').animate({ scrollTop: $objScrollArea.offset().top - 30 - 20 }, 'slow');

        //    e.preventDefault();
        //    return false;

        //    //      if ($("[data-Schedule='Return'][data-Enabled='True']").length == 1) {
        //    //        alert("return");
        //    //      };

        //    //      alert($("[data-Schedule='Departure'][data-Enabled='True']").length); // 1
        //    //        alert($(".Route_Class_Tier_ID[data-Schedule='Departure']:checked").val()); // 12345 | undefined
        //    //        alert($("[data-Schedule='Departure'][data-section='WaitingListOption']").val()); // 0
        //    //        alert($("[data-Schedule='Departure'][data-section='WaitingListFlag']").val());  // 0
        //    //      alert($("[data-Schedule='Return'][data-Enabled='True']").length); // 1 | undefined
        //    //        alert($(".Route_Class_Tier_ID[data-Schedule='Return']:checked").val()); // 12345 | undefined
        //    //      alert($(".ui-field-address-phone").val());
        //    //      alert($(".ui-field-address-email").val());
        //    //      alert($(".ui-field-payment input:checked").closest("span").attr("data-Control")); // Charge | Eigen.* | Voucher
        //    //         alert($(".ui-field-payment-eigen-number").val());
        //    //         alert($(".ui-field-payment-eigen-ccv").val());
        //    //      alert($(".ui-field-confirmation-option input:checked").closest("span").attr("data-Method")); // Email | Phone | None
        //    //        alert($(".ui-field-confirmation-email").val());
        //    //        alert($(".ui-field-confirmation-phone").val());
        //    //      alert($(".ui-field-confirmation-agreement input:checked").val()); // on | undefined

        //    //      //alert($(".ui-field-confirmation-option input option:checked").val());

        //    //      if ($(".ui-field-address-email").val() == "") {
        //    //        $(".ui-field-address-email").css("background-color", "crimson");
        //    //        $("html, body").animate({ scrollTop: $('.ui-field-address-email').offset().top - 25 }, "fast");
        //    //        $bitValidated = false;
        //    //      };

        //    //      e.preventDefault();

        // End of ui-booking-book : Click()

        e.preventDefault();
        return false;
    };

    $(".ui-button-booking-book-final").click(function () {
        //$.Watermark.HideAll();

        // User clicked
        //$(".ui-hidden-global-book").val("1");

        $.fn.Processing(".ui-label-global-processing-description-book");

        //__doPostBack($(".ui-button-booking-book-final").attr("id"), "");

        //e.preventDefault();
        //return true;
    });

    function mBookNow($strCardProcess) {
        switch ($strCardProcess) {
            case "MiraSecure":
                $.fn.Processing(".ui-label-global-processing-description-mirasecure");

                sendMessage({ Type: 'FormSubmit' });
                return false;
                break;
            case "Stripe":
                //$.fn.Processing(".ui-label-global-processing-description-mirasecure");

                var $intPayment_ID = $(".ui-radiolist-booking-payment input:checked").val();
                var $objStripeProcess = $(".ui-booking-payment-method-stripe-card-process[data-payment_id=\"" + $intPayment_ID + "\"]");
                $objStripeProcess.trigger("click");
                return false;
                break;
        }

        $(".ui-button-booking-book-final").trigger("click");
        return true;
    };

    $(".ui-button-booking-request").click(function (e) {
        var $bitValidated = true;
        var $strCardProcess = "";
        var $intScroll = 99;
        var $intScrollOption = 0;

        $.Watermark.HideAll();

        var $arrValidationErrors = [];

        // Passengers Contact_ID, if number entered by not searched on
        $(".ui-textbox-booking-passengers-contact_id").each(function (e) {
            var $objValidation = $(this);
            var $strItem = $objValidation.attr("data-item");

            if ($objValidation.val() != "") {
                if ($(".ui-hidden-booking-passengers-activated[data-item='" + $strItem + "']").val() == 0) {

                    $("input.ui-textbox-booking-passengers-contact_id[data-Item='" + $strItem + "']").addClass("ui-state-global-error");
                    $("input.ui-button-booking-passengers-search[data-Item='" + $strItem + "']").addClass("ui-state-global-error");

                    $bitValidated = false;
                    $intScroll = Math.min(5, $intScroll)
                }
            }
        });

        var $objAddressRequestNameOption = $(".ui-labelbox-booking-passengers-request-option INPUT").prop("checked");

        if ($objAddressRequestNameOption) {
            if ($(".ui-hidden-global-contact").val() != -1) {
                var $objValidation = $(".ui-textbox-booking-passengers-address-request-name");

                if ($objValidation.val() == "") {
                    $objValidation.addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(5, $intScroll)
                }
            }
        } else {
            // Passengers First and Last Name
            $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last").each(function () {
                var $objValidation = $(this);

                if ($(".ui-hidden-booking-passengers-activated[data-item='" + $objValidation.attr("data-item") + "']").val() == "-1") {
                    // Activated / Ignore
                } else if ($objValidation.val() == "") {
                    $objValidation.addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(5, $intScroll);
                };
            });
        }

        // Agents

        // If Agent, Existing Customer Radio selected, no drop-down selected
        if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-agent_contact_id input[type='radio']").is(":checked") == true &&
            $(".ui-dropdown-booking-passengers-agents-contact_id").val() == 0) {

            $("select.ui-dropdown-booking-passengers-agents-contact_id").addClass("ui-state-global-error");

            $bitValidated = false;
            $intScroll = Math.min(5, $intScroll)
        }

        // If Agent, Existing Customer # selected, no Customer # entered
        if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-existing input[type='radio']").is(":checked") == true &&
            $("input.ui-hidden-booking-passengers-activated").first().val() == "0") {

            $("input.ui-textbox-booking-passengers-contact_id").first().addClass("ui-state-global-error");
            $("input.ui-button-booking-passengers-search").first().addClass("ui-state-global-error");

            $bitValidated = false;
            $intScroll = Math.min(5, $intScroll)
        }

        if ($.fn.IsBookingDocumentation()) {
            var $bitValidatedDocumentation = true;

            $(".ui-panel-booking-passengers-documentation").each(function () {
                //debugger;

                var $strItem = $(this).attr("data-Item");
                if ($(this).find("input.ui-hidden-booking-passengers-documentation-enabled").val() == "0") { return true; }

                var $objName = $(this).find(".ui-labelbox-booking-passengers-documentation-name input");

                if ($objName.prop("checked")) {
                    var $objNameFirst = $(this).find("input.ui-textbox-booking-passengers-documentation-first");
                    var $objNameMiddle = $(this).find("input.ui-textbox-booking-passengers-documentation-middle");
                    var $objNameLast = $(this).find("input.ui-textbox-booking-passengers-documentation-last");

                    if ($objNameFirst.val() == "") {
                        $objNameFirst.addClass("ui-state-global-error");
                        $bitValidatedDocumentation = false;
                    }

                    if ($objNameLast.val() == "") {
                        $objNameLast.addClass("ui-state-global-error");
                        $bitValidatedDocumentation = false;
                    }
                }

                $(this).find("select.ui-dropdown-booking-passengers-documentation-gender").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_birth").each(function () {
                    if (!IsValidISODate($(this).val(), void 0, new Date())) {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-code").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-number").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-nationality").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-residence").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("select.ui-dropdown-booking-passengers-documentation-issued").each(function () {
                    if ($(this).val() == "") {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_activation").each(function () {
                    if ($(this).val() != '') {
                        if (!IsValidISODate($(this).val(), new Date(1900, 0, 0), void 0)) {
                            $bitValidatedDocumentation = false;
                            $(this).addClass("ui-state-global-error");
                        }
                    }
                })

                $(this).find("input.ui-textbox-booking-passengers-documentation-date_expiration").each(function () {
                    if (!IsValidISODate($(this).val(), new Date(), void 0)) {
                        $bitValidatedDocumentation = false;
                        $(this).addClass("ui-state-global-error");
                    }
                })
            })

            if (!$bitValidatedDocumentation) {
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll);
            }
        }

        // Address

        // If logged in as contact, ignore
        if ($(".ui-hidden-global-contact").val() == -1) {
            // If logged in as agent, and new customer not selected
        } else if ($(".ui-hidden-global-agent").val() == -1 &&
            $(".ui-radio-booking-passengers-agents-option-new input[type='radio']").is(":checked") == false) {
        } else {
            // Validate Address
            var $bitValidatedPhone = false;

            if ($("select.ui-dropdown-booking-passengers-address-primary").val() == null) {
                $objLogin = $(".ui-labelbox-booking-passengers-credentials-account input[type='checkbox']");
                $objLogin.prop("checked", true);

                $.fn.PassengersCredentialsAccountClick($objLogin, $("a.ui-link-booking-passengers-credentials-account"));

                $objContact_ID = $(".ui-hidden-booking-passengers-selected[Value!='0']")

                $(".ui-textbox-booking-passengers-credentials-contact_id").val($objContact_ID.val());
                //$(".ui-textbox-booking-passengers-credentials-contact_id").focus();

                //$("select.ui-dropdown-booking-passengers-address-primary").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(5, $intScroll)
            }

            // Add error state to all required address fields
            $(".ui-type-global-address[data-required='True'], .ui-type-global-city[data-required='True'], .ui-type-global-state[data-required='True'], .ui-type-global-zip[data-required='True'], .ui-type-global-country[data-required='True']").each(function (e) {

                $objField = $(this);

                if ($objField.val() == "") {
                    $objField.addClass("ui-state-global-error");
                    $bitValidated = false;
                    $intScroll = Math.min(7, $intScroll)
                }
            });

            // Ensure at least one phone number
            $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").each(function (e) {
                var $objPhone = $(this);

                if ($objPhone.val().replace(/[_ -]/g, "") !== "") {
                    $bitValidatedPhone = true;
                }
            });

            // Add error state to all address phone fields
            if ($bitValidatedPhone == false) {
                $("input.ui-textbox-booking-passengers-address-business, input.ui-textbox-booking-passengers-address-home, input.ui-textbox-booking-passengers-address-mobile").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(7, $intScroll)
            };

            // Validate email address
            if ($.fn.IsEmail($(".ui-textbox-booking-passengers-address-email").val(), false) == false) {
                //if ($(".ui-field-address-email").val() == "") {
                $(".ui-textbox-booking-passengers-address-email").addClass("ui-state-global-error");
                $bitValidated = false;
                $intScroll = Math.min(7, $intScroll)
            }
        };

        if ($bitValidated == false) {
            var $intOffset = $("html, body").offset().top;

            //alert($intScroll);

            if ($intScroll == 1) { $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20; }
            if ($intScroll == 2) {
                if ($intScrollOption == 1) {
                    if ($(".ui-tablerow-global-schedules-conditions[data-schedule='Departure']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-conditions[data-schedule='Departure']").offset().top - 600;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20;
                    }
                }

                if ($intScrollOption == 2) {
                    if ($(".ui-tablerow-global-schedules-waiting[data-schedule='Departure']").is(":visible")) {
                        $intOffset = $(".ui-tablerow-global-schedules-waiting[data-schedule='Departure']").offset().top - 100;
                    } else {
                        $intOffset = $(".ui-panel-global-schedules[data-Schedule='Departure']").offset().top - 20;
                    }
                }
            }
            if ($intScroll == 3) { $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20; }
            if ($intScroll == 4) {
                if ($(".ui-tablerow-global-schedules-conditions[data-schedule='Return']").is(":visible")) {
                    $intOffset = $(".ui-tablerow-global-schedules-conditions[data-schedule='Return']").offset().top - 100;
                } else {
                    $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20;
                }

                if ($(".ui-tablerow-global-schedules-waiting[data-schedule='Return']").is(":visible")) {
                    $intOffset = $(".ui-tablerow-global-schedules-waiting[data-schedule='Return']").offset().top - 100;
                } else {
                    $intOffset = $(".ui-panel-global-schedules[data-Schedule='Return']").offset().top - 20;
                }
            }

            if ($intScroll == 5) { $intOffset = $(".ui-booking-passengers").offset().top - 20; }
            if ($intScroll == 6) { $intOffset = $(".ui-booking-passengers-address").offset().top - 20; }
            if ($intScroll == 7) { $intOffset = $(".ui-booking-summary").offset().top - 20; }
            if ($intScroll == 8) { $intOffset = $(".ui-booking-payment").offset().top - 20; }
            if ($intScroll == 9) { $intOffset = $(".ui-booking-confirmation").offset().top - 20; }
            if ($intScroll == 10) { $intOffset = $(".ui-agreement-confirmation").offset().top - 20; }

            //$intOffset = $("[data-Schedule='Return']")

            $('html, body').animate({ scrollTop: $intOffset }, 'slow');

            $.Watermark.ShowAll();
            e.preventDefault();
            return false;
        };

        $.fn.Processing();
    });

    //  $(".ui-search-passenger-gender-total").change(function () {
    //    $(".ui-search-passenger").removeClass("ui-state-error");
    //  });

    //  $(".ui-field-credentials-contact_id, .ui-field-credentials-email").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-passenger-first, .ui-field-passenger-last").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-agent-customers-contact_id").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-address-phone").focus(function () {
    //    $(".ui-field-address-phone").each(function () {
    //      var $this = $(this)
    //      $this.removeClass("ui-state-error");
    //    });
    //  });

    //  $(".ui-field-address-email, .ui-field-recovery-email").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-payment-eigen-number, .ui-field-payment-eigen-ccv, .ui-field-payment-greatplains-number, .ui-field-payment-voucher-ticket, .ui-field-payment-voucher-password").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-payment-eigen-expiration-month, .ui-field-payment-eigen-expiration-year").focus(function () {
    //    $(".ui-field-payment-eigen-expiration-month").removeClass("ui-state-error");
    //    $(".ui-field-payment-eigen-expiration-year").removeClass("ui-state-error");
    //  });

    //  $(".ui-field-confirmation-email, .ui-field-confirmation-phone").focus(function () {
    //    var $this = $(this)
    //    $this.removeClass("ui-state-error");
    //  });

    //  $(".ui-field-confirmation-agreement, .ui-button-confirmation-agreement").click(function () {
    //    var $this = $(".ui-button-confirmation-agreement")
    //    //$this.removeClass("ui-state-error");
    //  });

    //  //    $(".ui-schedule-confirmation-waitinglist[data-Schedule='Departure'][data-Section='WaitingList']").click(function() {
    //  //      var $this = $(this)
    //  //      $this.stop(true, true);
    //  //      $this.show();
    //  //      $this.css('visibility', 'visible'); 
    //  //      $this.css('display', ''); 

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //    //    alert($bitValidated)
    //    if ($bitValidated == false) {
    //      //      alert($bitValidated)
    //      //alert($arrValidationErrors.length);

    //      var $objBookingErrorDialog = $(".ui-dialog-booking-book").clone();

    //      e.preventDefault();

    //      //var $objBookingErrorMessage = $("div").html("Test");

    //      $objBookingErrorMessage.append("<ul>")
    //      $arrValidationErrors.each(function (e) {
    //        $objBookingErrorMessage.append("<li>" + this + "</li>")
    //      });
    //      $objBookingErrorMessage.append("</ul>")

    //      $objBookingErrorDialog.html($objBookingErrorDialog.html().replace("{0}", $objBookingErrorMessage));
    //      //$objHTML.html($objHTML.html().replace("{3}", data.Vouchers[intRow].Date_Expiration));

    //      $objBookingErrorDialog.dialog({
    //        height: 'auto',
    //        width: 650,
    //        resizable: false,
    //        modal: true,
    //        buttons: [
    //          { text: "Continue",
    //            click: function () {
    //              $(this).dialog("close");
    //            }
    //          }],
    //        create: function (ev, ui) { },
    //        close: function (ev, ui) { $(this).remove(); }
    //      });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //  // Setup Watermarks
    //  $("input.ui-watermark-global-contact_id").Watermark($("input.ui-label-global-watermark-contact_id").val());
    //  $("input.ui-watermark-global-first").Watermark($("input.ui-label-global-watermark-first").val());
    //  $("input.ui-watermark-global-last").Watermark($("input.ui-label-global-watermark-last").val());
    //  $("input.ui-watermark-global-alert").Watermark($("input.ui-label-global-watermark-alert").val());

    //  $("input.ui-watermark-global-address").Watermark($("input.ui-label-global-watermark-address").val());
    //  $("input.ui-watermark-global-city").Watermark($("input.ui-label-global-watermark-city").val());
    //  $("input.ui-watermark-global-state").Watermark($("input.ui-label-global-watermark-state").val());
    //  $("input.ui-watermark-global-zip").Watermark($("input.ui-label-global-watermark-zip").val());

    //  $("input.ui-watermark-global-phone").Watermark($("input.ui-label-global-watermark-phone").val());
    //  $("input.ui-watermark-global-card-number").Watermark($("input.ui-label-global-watermark-card-number").val());

    // AutoScroll after all formatting
    $.fn.AutoScroll = function () {
        // Automatically Scroll to Section (ui-hidden-booking-auto-scroll)
        if (!$("input.ui-hidden-booking-auto-scroll").length > 0) {
        } else if ($("input.ui-hidden-booking-auto-scroll").val() != "") {
            $objAutoScrollSection = $($(".ui-hidden-booking-auto-scroll").val());
            $('html, body').animate({ scrollTop: $objAutoScrollSection.offset().top }, 'fast');
            $("input.ui-hidden-booking-auto-scroll").val("");
        };
    };

    // Startup Functions
    $.fn.AutoScroll();
    $.fn.PassengersAddressPrimary();

    // Remove pre-load disabled styling
    $(".ui-page-booking, .ui-page-change").removeClass("ui-page-global-disabled");

    // Timing
    // console.log('= ' + new Date().getTime() / 1000);

    // MiraSecure //
    var bitMiraSecureCardValid = false;
    var bitMiraSecureCardHolderNameValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-cardholdername").val()) === 0;
    var bitMiraSecureExpirationValid = false;
    var bitMiraSecureCVVValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-ccv").val()) === 0;
    var bitMiraSecureAddressValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-address").val()) === 0;
    var bitMiraSecureCityValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-city").val()) === 0;
    var bitMiraSecurePostalCodeValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-postalcode").val()) === 0;
    var bitMiraSecureIsFocused = false;

    var srvMiraSecureHost = $("INPUT.ui-hidden-booking-payment-method-mirasecure-host").val(); // "https://staging.eigendev.com";
    var srvMiraSecureClient = $("INPUT.ui-hidden-booking-payment-method-mirasecure-client").val(); // "https://localhost:44393";
    //var srvMiraSecureClient = window.location.origin;

    //alert(srvMiraSecureHost);
    //alert(srvMiraSecureClient);

    // Utility function to attach event callbacks to elements
    function onEvent(obj, type, callback) {
        if (obj.addEventListener) {
            obj.addEventListener(type, callback, false);
            return true;
        } else if (obj.attachEvent) {
            obj.attachEvent('on' + type, callback);
            return true;
        }
        return false;
    }

    // Handle window message events with receiveMessage
    function mMiraServInit() {
        onEvent(window, 'message', receiveMessage);
    }

    // Used because array.indexOf is not universally supported
    function arrayIndexOf(array, searchElement, fromIndex) {
        var obj = Object(array), len = obj.length >>> 0, idx = +fromIndex || 0;

        if (idx < len && len > 0) {
            idx = Math.max(idx >= 0 ? idx : len - Math.abs(idx), 0);

            while (idx < len) {
                if (idx in obj && obj[idx] === searchElement) return idx;
                idx++;
            }
        }

        return -1;
    }

    function fnMiraSecureStatus($strType, $objData) {
        //console.log($strType);
        //console.log($objData);

        if ($strType === "FormReady") {
            //alert("ready");
        } else if ($strType === "FormTimeout") {
            mMiraSecureReset();
        } else if ($strType === "CardGetCurrent" || $strType === "CardChange") {
            $("ul.ui-list-booking-payment-mirasecure-cards li").removeClass("ui-card-disabled");
            var strMiraSecureCardType = JSON.parse($objData)["CardType"];

            if (arrayIndexOf(['A', 'M', 'V'], strMiraSecureCardType) >= 0) {
                mMiraSecureSelection(strMiraSecureCardType);

                //bitMiraSecureCardValid = JSON.parse($objData)["Valid"];
                bitMiraSecureCardValid = ["true", "1", 1, true].includes(JSON.parse($objData)["Valid"]);
            } else {
                bitMiraSecureCardValid = false;
            }
            //console.log("bitMiraSecureCardValid: " + bitMiraSecureCardValid);
        } else if ($strType === "FieldChange" && JSON.parse($objData)["FieldName"] === "CardHolderName") {
            bitMiraSecureCardHolderNameValid = ("" != JSON.parse($objData)["Value"]);
        } else if ($strType === "FieldChange" && JSON.parse($objData)["FieldName"] === "Address") {
            bitMiraSecureAddressValid = ("" != JSON.parse($objData)["Value"]);
        } else if ($strType === "FieldChange" && JSON.parse($objData)["FieldName"] === "City") {
            bitMiraSecureCityValid = ("" != JSON.parse($objData)["Value"]);
        } else if ($strType === "FieldChange" && JSON.parse($objData)["FieldName"] === "PostalCode") {
            bitMiraSecurePostalCodeValid = ("" != JSON.parse($objData)["Value"]);
        } else if ($strType === "ExpiryGetCurrent" || $strType === "ExpiryChange") {
            bitMiraSecureExpirationValid = JSON.parse($objData)["Valid"];
        } else if ($strType === "CVVGetCurrent" || $strType === "CVVChange") {
            bitMiraSecureCVVValid = JSON.parse($objData)["Valid"];
        } else if ($strType === "FieldFocus") {
            if (JSON.parse($objData)["FieldName"] === "CardNumber") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'CardNumber' });
            } else if (JSON.parse($objData)["FieldName"] === "CardHolderName") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'CardHolderName' });
            } else if (JSON.parse($objData)["FieldName"] === "ExpiryMonth") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'ExpiryMonth' });
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'ExpiryYear' });
            } else if (JSON.parse($objData)["FieldName"] === "ExpiryYear") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'ExpiryMonth' });
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'ExpiryYear' });
            } else if (JSON.parse($objData)["FieldName"] === "CVV") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'CVV' });
            } else if (JSON.parse($objData)["FieldName"] === "Address") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'Address' });
            } else if (JSON.parse($objData)["FieldName"] === "City") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'City' });
            } else if (JSON.parse($objData)["FieldName"] === "PostalCode") {
                sendMessage({ Type: 'UnsetErrorClass', FieldName: 'PostalCode' });
            }
        }
    };

    function mMiraSecureSelection(strMiraSecureCardType) {
        var $strReference = "";
        var $strReferenceCard = "";
        var $bitUpdatePaymentMethod = true;

        var $strReferenceCurrent = $("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'] input[type='radio']:checked").parent().attr("data-Reference");

        // If auto, do not switch payment method
        if ($strReferenceCurrent == "Auto") { $bitUpdatePaymentMethod = false; };

        if (strMiraSecureCardType === 'A') { $strReference = "American Express"; $strReferenceCard = "amex"; }
        //if (strMiraSecureCardType === 'O') { $strReference = "Other"; $strReferenceCard = "other"; }
        if (strMiraSecureCardType === 'M') { $strReference = "Master Card"; $strReferenceCard = "mastercard"; }
        if (strMiraSecureCardType === 'V') { $strReference = "Visa"; $strReferenceCard = "visa"; }
        if (strMiraSecureCardType === 'P') { $strReference = "UnionPay"; $strReferenceCard = "china_unionpay"; }

        // Set Payment Method
        if ($bitUpdatePaymentMethod === true) {
            $("ul.ui-radiolist-booking-payment span[data-control='MiraSecure'][data-reference='" + $strReference + "'] input[type='radio']").not(":disabled").prop("checked", true);
        }

        $("ul.ui-list-booking-payment-mirasecure-cards li:not(." + $strReferenceCard + ")").addClass("ui-card-disabled");
    }

    // Receive a message event
    function receiveMessage(event) {
        console.log("received message: " + event.origin + " [" + event.data + "]");
        // Event origin did not match expected MiraSecure server
        if (srvMiraSecureHost === undefined) { srvMiraSecureHost = ""; }
        if (srvMiraSecureClient === undefined) { srvMiraSecureClient = ""; }

        console.log("received message: " + event.origin + "  || " + event.origin.toLowerCase() + " === " + srvMiraSecureHost.toLowerCase());

        if (!event.origin || event.origin.toLowerCase() === srvMiraSecureHost.toLowerCase()) {
            try {
                // Parse the message JSON
                var message = JSON.parse(event.data);
                //alert(message)

                // All valid messages have a Type property
                if (message && message.Type) {
                    //console.log('Received [' + message.Type + ']: ' + event.data);
                    fnMiraSecureStatus(message.Type, event.data);

                    if (message.Type === "FieldFocus") {
                        bitMiraSecureIsFocused = true;
                        //console.log("Focus: " + bitMiraSecureIsFocused);
                    } else if (message.Type === "FieldBlur") {
                        bitMiraSecureIsFocused = false;
                        //console.log("Blur: " + bitMiraSecureIsFocused);
                    }
                }
            } catch (ex) {
                console.log('Received message with parsing error: ' + event.data);
            }
        } else if ((!event.origin || event.origin.toLowerCase() === srvMiraSecureClient.toLowerCase()) && event.data["Event_Type"] === "MiraSecure") {
            //try {
            // Parse the message JSON
            //var message = JSON.parse(event.data);
            //alert(message)

            //console.log('Received:' + event.data);
            //console.log(event.data);

            //var message = JSON.parse(event.data);

            //if (event.data["ResponseCode"] == "01") {

            $(".ui-label-global-processing-description-mirasecure").hide();
            $(".ui-label-global-processing-description-book").show();

            $(".ui-hidden-booking-payment-method-mirasecure-response").val($.trim(event.data));
            $(".ui-hidden-booking-payment-method-mirasecure-response-actioncode").val($.trim(event.data["ActionCode"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-avsresponse").val($.trim(event.data["AVSResponse"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-authorization").val($.trim(event.data["ApprovalCode"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-cardholdername").val($.trim(event.data["CardHolderName"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-address").val($.trim(event.data["Address"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-city").val($.trim(event.data["City"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-postalcode").val($.trim(event.data["PostalCode"]));
            $(".ui-hidden-booking-payment-method-mirasecure-response-token").val("");

            if (event.data["ActionCode"] === "A") { //  || event.data["ResponseCode"] == "01"
                $(".ui-hidden-booking-payment-method-mirasecure-response-token").val($.trim(event.data["EigenToken"]));
                mMiraSecureSelection($.trim(event.data["CardType"]));
            };

            $(".ui-button-booking-book-final").trigger("click");

            //} else {
            //  mMiraSecureReset();
            //}

            //} catch (ex) {
            //  console.log('YReceived message with parsing error: ' + event.data);
            //}
        } else {
            console.log('Received message from unknown origin: ' + event.origin);
            return;
        }
    }

    // Send a message to MiraSecure iFrame
    function sendMessage(message) {
        var frame = document.getElementById('webBookingPaymentMethodMiraSecure');

        if (frame && frame.contentWindow) {
            // Encode message object as JSON
            var messageJSON = JSON.stringify(message);

            // Only send message if the srvMiraSecureHost is loaded in iFrame
            frame.contentWindow.postMessage(messageJSON, srvMiraSecureHost);

            // Log send to console
            //console.log('Sent [' + message.Type + ']: ' + messageJSON);
        }
    }

    function mMiraSecureReset() {
        var frame = document.getElementById('webBookingPaymentMethodMiraServ');

        //41111111111131111
        //alert("Payment Failed!");

        document.getElementById('webBookingPaymentMethodMiraServ').setAttribute("src", frame.src);
        bitMiraSecureCardValid = false;
        bitMiraSecureCardHolderNameValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-cardholdername").val()) === 0;
        bitMiraSecureExpirationValid = false;
        bitMiraSecureCVVValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-ccv").val()) === 0;
        bitMiraSecureAddressValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-address").val()) === 0;
        bitMiraSecureCityValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-city").val()) === 0;
        bitMiraSecurePostalCodeValid = parseInt($(".ui-hidden-booking-payment-method-mirasecure-postalcode").val()) === 0;
        bitMiraSecureIsFocused = false;
    }

    ////////////////////////////////////////////////////////////////////////////////////

    //// Step 1
    //function BookNowValidation() {
    //  console.log("waitForIt: " + bitMiraSecureIsFocused);
    //  if (bitMiraSecureIsFocused) {
    //    console.log("Waiting...")
    //    setTimeout(function () { BookNowValidation() }, 10);
    //  } else {
    //    mBookNow()
    //    // go do that thing
    //  };
    //}

    //$(".BookNowValidation").click(function (e) {
    //  BookNowValidation();
    //});

    //// Step 2
    //function BookNow() {
    //  // Wait for isFocused=false
    //  // Check for valid payment fields
    //  // Submit the Eigen form
    //  // If CC, Validate Response and Finalize Booking
    //  // Or, jump to Finalize Booking

    //  //if (bitMiraSecureIsFocused) {
    //  //  BookNowValidation()
    //  //}

    //  console.log("Card Valid: " + bitMiraSecureCardValid);

    //  var bitCardProcess = true;
    //  console.log("X:" + bitMiraSecureCardValid);

    //  if (!bitMiraSecureCardValid) {
    //    sendMessage({ Type: 'SetErrorClass', FieldName: 'CardNumber' });
    //    bitCardProcess = false;
    //  }

    //  if (!bitMiraSecureExpirationValid) {
    //    //sendMessage({ Type: 'SetErrorClass', FieldName: 'Expiry' });
    //    sendMessage({ Type: 'SetErrorClass', FieldName: 'ExpiryMonth' });
    //    sendMessage({ Type: 'SetErrorClass', FieldName: 'ExpiryYear' });
    //    bitCardProcess = false;
    //  }

    //  if (bitCardProcess) {
    //    sendMessage({ Type: 'FormSubmit' });
    //  }
    //};

    //// Step 3
    //function BookFinalize() {
    //  alert("This booking is now finalized!");

    //  //document.getElementById("myForm").submit();
    //}


    mMiraServInit();
    // MiraSecure
});
