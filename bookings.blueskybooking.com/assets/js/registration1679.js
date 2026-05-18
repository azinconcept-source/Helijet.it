/* Registration */
$(document).ready(function (e) {
    //  $("body").submit(function (e) {
    //    alert("SUBMIT");
    //    $(".ui-registration").parent().appendTo("form");
    //  });

    function randomPassword() {
        // Fall-back Password
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$_+";
        var size = 8;
        var i = 1;
        var ret = ""
        while (i <= size) {
            $max = chars.length - 1;
            $num = Math.floor(Math.random() * $max);
            $temp = chars.substr($num, 1);
            ret += $temp;
            i++;
        }

        return ret;
    }

    $("input.ui-textbox-registration-password").passwordStrength({ targetDiv: ".ui-image-registration-password", autogenerate: false });

    //    $objDialog.find("input.ui-textbox-registration-password").passwordStrength({ targetDiv: $objDialog.find(".ui-image-registration-password"), autogenerate: false });
    if ($("input.ui-textbox-registration-password").val() == "") {
        $("input.ui-textbox-registration-password").val(randomPassword()).trigger("keyup");
    };
    // Trigger Password
    $("input.ui-textbox-registration-password").trigger("keyup");

    $(".ui-link-registration-password-generate").click(function (e) {
        $("input.ui-textbox-registration-password").val(randomPassword()).trigger("keyup");
    });

    //  // Text Formatting
    //  // Automatically trim fields
    //  $(".ui-textbox-global").change(function (e) {
    //    var $this = $(this);
    //    $this.val($.trim($this.val()));
    //  });

    // Reset Validations
    $("textarea.ui-textbox-registration-home-address, textarea.ui-textbox-registration-business-address").focus(function (e) {
        $("textarea.ui-textbox-registration-home-address, textarea.ui-textbox-registration-business-address").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-registration-home-city, input.ui-textbox-registration-business-city").focus(function (e) {
        $("input.ui-textbox-registration-home-city, input.ui-textbox-registration-business-city").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-registration-home-address, input.ui-textbox-registration-business-address").focus(function (e) {
        $("input.ui-textbox-registration-home-address, input.ui-textbox-registration-business-address").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-registration-home-state, input.ui-textbox-registration-business-state").focus(function (e) {
        $("input.ui-textbox-registration-home-state, input.ui-textbox-registration-business-state").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-registration-home-zip, input.ui-textbox-registration-business-zip").focus(function (e) {
        $("input.ui-textbox-registration-home-zip, input.ui-textbox-registration-business-zip").removeClass("ui-state-global-error");
    });

    $("select.ui-textbox-registration-home-country, select.ui-textbox-registration-business-country").focus(function (e) {
        $("select.ui-textbox-registration-home-country, select.ui-textbox-registration-business-country").removeClass("ui-state-global-error");
    });

    //$("input.ui-textbox-registration-first, input.ui-textbox-registration-last").keyup(function (e) {
    //    $("input.ui-textbox-registration-first").removeClass("ui-state-global-error");
    //    $("input.ui-textbox-registration-last").removeClass("ui-state-global-error");
    //    //$("input.ui-textbox-registration-business-company").removeClass("ui-state-global-error");
    //});

    $("input.ui-textbox-registration-email").keyup(function (e) {
        $("input.ui-textbox-registration-email").removeClass("ui-state-global-error");
    });

    $("input.ui-textbox-registration-home-phone, input.ui-textbox-registration-home-mobile, input.ui-textbox-registration-business-phone, input.ui-textbox-registration-business-mobile").keyup(function (e) {
        $("input.ui-textbox-registration-home-phone").removeClass("ui-state-global-error");
        $("input.ui-textbox-registration-home-mobile").removeClass("ui-state-global-error");
        $("input.ui-textbox-registration-business-phone").removeClass("ui-state-global-error");
        $("input.ui-textbox-registration-business-mobile").removeClass("ui-state-global-error");
    });

    $(".ui-link-registration-create").click(function (e) {
        RegistrationValidation(e, true);
    });

    $(".ui-link-registration-update").click(function (e) {
        RegistrationValidation(e, false);
    });

    // Update Click()
    //$(".ui-link-registration-create, .ui-link-registration-update").click(function (e) {

    function RegistrationValidation(e, blnEmailValidation) {
        var $bitFull = true;
        var $bitValidated = true;

        $.Watermark.HideAll();

        if ($(".ui-hidden-registration-full").val() == -1) {
            $bitFull = true;
        } else {
            $bitFull = false;
        }

        var $strFirst = $("input.ui-textbox-registration-first").val();
        var $strLast = $("input.ui-textbox-registration-last").val();
        //var $strBusiness_Company = "";

        //if ($("input.ui-textbox-registration-business-company").val() != undefined) {
        //    $strBusiness_Company = $("input.ui-textbox-registration-business-company").val();
        //};

        // Validation
        //if ($strFirst == "" &&
        //    $strLast == "" &&
        //    $strBusiness_Company == "") {

        //    //if ($bitFull) {
        //    $("input.ui-textbox-registration-first").addClass("ui-state-global-error");
        //    $("input.ui-textbox-registration-last").addClass("ui-state-global-error");
        //    $("input.ui-textbox-registration-business-company").addClass("ui-state-global-error");

        //    //$(".ui-textbox-registration-first").select();
        //    //$(".ui-textbox-registration-first").focus();

        //    //      } else {
        //    //        $(".ui-textbox-registration-business-company").addClass("ui-state-global-error");

        //    //        $(".ui-textbox-registration-business-company").select();
        //    //        $(".ui-textbox-registration-business-company").focus();
        //    //      }

        //    $bitValidated = false;
        //};

        // Validation
        if ($strFirst == "") {
            $("input.ui-textbox-registration-first").addClass("ui-state-global-error");
            $bitValidated = false;
        };

        if ($strLast == "") {
            $("input.ui-textbox-registration-last").addClass("ui-state-global-error");
            $bitValidated = false;
        };

        if ($.fn.IsEmail($("input.ui-textbox-registration-email").val()) == false) {
            $("input.ui-textbox-registration-email").addClass("ui-state-global-error");
            $bitValidated = false;
        }

        var $objHome_Address = $("textarea.ui-textbox-registration-home-address.ui-state-global-required");
        var $objBusiness_Address = $("textarea.ui-textbox-registration-business-address.ui-state-global-required");

        if ($objHome_Address.length == 1 && $objBusiness_Address.length == 1) {
            if ($objHome_Address.val() == "" && $objBusiness_Address.val() == "") {
                $objHome_Address.addClass("ui-state-global-error");
                $objBusiness_Address.addClass("ui-state-global-error");

                $bitValidated = false;
            }
        }

        var $objHome_City = $("input.ui-textbox-registration-home-city.ui-state-global-required");
        var $objBusiness_City = $("input.ui-textbox-registration-business-city.ui-state-global-required");

        if ($objHome_City.length == 1 && $objBusiness_City.length == 1) {
            if ($objHome_City.val() == "" && $objBusiness_City.val() == "") {
                $objHome_City.addClass("ui-state-global-error");
                $objBusiness_City.addClass("ui-state-global-error");

                $bitValidated = false;
            }
        }

        var $objHome_State = $("input.ui-textbox-registration-home-state.ui-state-global-required");
        var $objBusiness_State = $("input.ui-textbox-registration-business-state.ui-state-global-required");

        if ($objHome_State.length == 1 && $objBusiness_State.length == 1) {
            if ($objHome_State.val() == "" && $objBusiness_State.val() == "") {
                $objHome_State.addClass("ui-state-global-error");
                $objBusiness_State.addClass("ui-state-global-error");

                $bitValidated = false;
            }
        }

        var $objHome_Zip = $("input.ui-textbox-registration-home-zip.ui-state-global-required");
        var $objBusiness_Zip = $("input.ui-textbox-registration-business-zip.ui-state-global-required");

        if ($objHome_Zip.length == 1 && $objBusiness_Zip.length == 1) {
            if ($objHome_Zip.val() == "" && $objBusiness_Zip.val() == "") {
                $objHome_Zip.addClass("ui-state-global-error");
                $objBusiness_Zip.addClass("ui-state-global-error");

                $bitValidated = false;
            }
        }

        var $objHome_Country = $("select.ui-textbox-registration-home-country.ui-state-global-required");
        var $objBusiness_Country = $("select.ui-textbox-registration-business-country.ui-state-global-required");

        if ($objHome_Country.length == 1 && $objBusiness_Country.length == 1) {
            if ($objHome_Country.val() == "" && $objBusiness_Country.val() == "") {
                $objHome_Country.addClass("ui-state-global-error");
                $objBusiness_Country.addClass("ui-state-global-error");

                $bitValidated = false;
            }
        }


        var $strHome_Phone = "";
        var $strHome_Mobile = "";
        var $strBusiness_Phone = "";
        var $strBusiness_Mobile = "";

        if ($("input.ui-textbox-registration-home-phone").val() != undefined) {
            $strHome_Phone = $("input.ui-textbox-registration-home-phone").val();
        }
        if ($("input.ui-textbox-registration-home-mobile").val() != undefined) {
            $strHome_Mobile = $("input.ui-textbox-registration-home-mobile").val();
        }
        if ($("input.ui-textbox-registration-business-phone").val() != undefined) {
            $strBusiness_Phone = $("input.ui-textbox-registration-business-phone").val();
        }
        if ($("input.ui-textbox-registration-business-mobile").val() != undefined) {
            $strBusiness_Mobile = $("input.ui-textbox-registration-business-mobile").val();
        }

        if ($strHome_Phone == "" &&
            $strHome_Mobile == "" &&
            $strBusiness_Phone == "" &&
            $strBusiness_Mobile == "") {

            $("input.ui-textbox-registration-home-phone").addClass("ui-state-global-error");
            $("input.ui-textbox-registration-home-mobile").addClass("ui-state-global-error");

            $("input.ui-textbox-registration-business-phone").addClass("ui-state-global-error");
            $("input.ui-textbox-registration-business-mobile").addClass("ui-state-global-error");

            $bitValidated = false;
        }

        //    alert($bitValidated);

        //      // If Logged In
        //      if ($(".ui-hidden-global-contact").val() == -1) {
        //      } else if ($(".ui-hidden-global-agent").val() == -1 &&
        //                 $(".ui-radio-booking-passengers-agents-option-new input[type='radio']").is(":checked") == false) {
        //      } else {
        //        var $strBookingAddressEmail = $(".ui-textbox-registration-emaill").val();

        //        //$bitValidated = false;
        //        $.ajax({
        //          type: "GET",
        //          //url: "/Search/BookingDetails.aspx",
        //          //data: "Booking_ID=330114",
        //          url: "/Search/EmailValidation.aspx",
        //          data: "Session=" + $strSession + "&Email=" + $strBookingAddressEmail,
        //          async: false,
        //          error: function (xhr, ajaxOptions, thrownError) {
        //            //alert(xhr.status); 
        //            //alert(thrownError); 
        //            $bitValidated = false;
        //          },
        //          success: function (data) {
        //            if (data.Validation == 0) {
        //              $bitValidated = false;
        //              var $objDialog = $(".ui-dialog-registration-validation");

        //              $objDialog.html($objDialog.html().replace("{0}", $strBookingAddressEmail));

        //              // Continue
        //              $objDialog.find("a.ui-link-registration-dialog-validation-accept").bind("click", function (e) {
        //                e.preventDefault();
        //                $objDialog.dialog("close");

        //                $.fn.Submit($(".ui-button-booking-book").attr("ID"), true, false, false);
        //                return true;
        //              });

        //              // Recover Password
        //              $objDialog.find("a.ui-link-booking-dialog-validation-password").bind("click", function (e) {
        //                e.preventDefault();

        //                $(".ui-radio-booking-passengers-credentials-login[data-option='Email'] input[type='radio']").trigger("click"); // attr("checked", "checked");
        //                $("input.ui-textbox-booking-passengers-credentials-email").val($strBookingAddressEmail);

        //                // Submit()
        //                $.fn.Submit($(".ui-link-booking-passengers-credentials-password-recovery").attr("ID"), true, false, false);

        //                $objDialog.dialog("close");
        //              });

        //              // Cancel
        //              $objDialog.find("a.ui-link-booking-dialog-validation-cancel").bind("click", function (e) {
        //                e.preventDefault();
        //                $objDialog.dialog("close");
        //              });

        //              //ui-dialog-validation
        //              //$objDialog.dialog('destroy');
        //              $objDialog.dialog({
        //                height: 'auto',
        //                width: 650,
        //                draggable: false,
        //                resizable: false,
        //                modal: true,
        //                //                buttons: [
        //                //                  { text: "Recover Password",
        //                //                    "class": 'ui-dialog-validation-button-password ui-button-xlarge ui-state-error',
        //                //                    click: function () {
        //                //                      showProgress(true, true);

        //                //                      $(".ui-radio-credentials-email input:radio").prop("checked", true);
        //                //                      $(".ui-field-credentials-email").val($strBookingAddressEmail);

        //                //                      $("#__EVENTTARGET").val("btnPassword");
        //                //                      $("#__EVENTARGUMENT").val("");
        //                //                      $("form").submit();

        //                //                      $(this).dialog("close");

        //                //                      return false;
        //                //                    }
        //                //                  },
        //                //                  { text: "Cancel",
        //                //                    click: function () {
        //                //                      $(this).dialog("close");
        //                //                    }
        //                //                  }
        //                //                ],
        //                create: function (ev, ui) {
        //                  //                  $(this).parent().find(".ui-dialog-validation-email").text($strBookingAddressEmail);
        //                  //                  $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
        //                  //                  $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
        //                  //                  $(this).parent().find('.ui-dialog-validation-button-password').css({ 'float': 'left' });
        //                  //                  if ($(".ui-field-login-agent").val() == -1) {
        //                  //                    $(this).parent().find('.ui-dialog-validation-button-password').hide();
        //                  //                  }
        //                },
        //                close: function (ev, ui) {
        //                  $objDialog.find("a.ui-link-booking-dialog-validation-password").unbind("click");
        //                  $objDialog.find("a.ui-link-booking-dialog-validation-cancel").unbind("click");
        //                }
        //              });
        //            };
        //          }
        //        });

        //        if ($bitValidated == false) {
        //          e.preventDefault();
        //          return false;
        //        }
        //      }
        //    }

        if ($bitValidated == false) {
            e.preventDefault();

            var $intOffset = 0;
            //$intOffset = $(".ui-section-registration-home").offset().top - 0;
            $(".ui-registration").animate({ scrollTop: $intOffset }, 'slow');

            $.Watermark.ShowAll();

            return false;
        }

        // Check email address
        if (blnEmailValidation) {
            var $strBookingAddressEmail = $("input.ui-textbox-registration-email").val();

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
                        var $objDialog = $(".ui-dialog-registration-validation");

                        //if ($(".ui-hidden-global-agent").val() == -1) {
                        //    $objDialog = $(".ui-dialog-booking-book-validation-agent");
                        //}

                        $objDialog.html($objDialog.html().replace("{0}", $strBookingAddressEmail));

                        // Continue
                        $objDialog.find("a.ui-link-registration-dialog-validation-accept").bind("click", function (e) {
                            $.Watermark.HideAll();

                            //$objDialog.dialog("close");

                            $(".ui-link-registration-auto-create")[0].click();

                            //RegistrationValidation(false);
                            //mBookNow($strCardProcess);

                            ////$.fn.Submit($(".ui-button-booking-book").attr("ID"), true, false, false);

                            //$.fn.Processing();

                            //__doPostBack($(".ui-button-booking-book").attr("id"), "")

                            e.preventDefault();
                            return false;
                        });

                        // Recover Password
                        $objDialog.find("a.ui-link-registration-dialog-validation-password").bind("click", function (e) {

                            $.Watermark.HideAll();

                            $(".ui-radio-booking-passengers-credentials-login[data-option='Email'] input[type='radio']").trigger("click"); // attr("checked", "checked");
                            $("input.ui-textbox-booking-passengers-credentials-email").val($strBookingAddressEmail);

                            // Submit()
                            //$.fn.Submit($(".ui-link-booking-passengers-credentials-password-recovery").attr("ID"), true, false, false);
                            //$.fn.Submit($(".ui-link-registration-password").attr("ID"), true, false, false);

                            //$.fn.Processing();

                            //// lnkBookingPassengersCredentialsPasswordRecoveryEmail"
                            //__doPostBack($(".ui-link-booking-passengers-credentials-password-recovery-email").attr("id"), "")
                            //__doPostBack($(".ui-link-registration-password").attr("id"), "")
                            //__doPostBack('regUpdate$lnkRegistrationPassword','')

                            //$objDialog.dialog("close");

                            $(".ui-link-registration-auto-password")[0].click();

                            e.preventDefault();
                            return false;
                        });

                        // Cancel
                        $objDialog.find("a.ui-link-registration-dialog-validation-cancel").bind("click", function (e) {
                            $objDialog.dialog("close");

                            $.Watermark.ShowAll();

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
                        e.preventDefault();
                        return false;
                    };
                }
            });
        }

        // Success, Create Address Book

        //    // Passengers First and Last Name
        //    $(".ui-textbox-booking-passengers-first, .ui-textbox-booking-passengers-last").each(function () {
        //      var $objValidation = $(this);
        //      if ($objValidation.val() == "") {
        //        $objValidation.addClass("ui-state-global-error");
        //        $bitValidated = false;
        //        $intScroll = Math.min(5, $intScroll)
        //      };
        //    });

        //    // Agents

        //    // If Agent, Existing Customer Radio selected, no drop-down selected
        //    if ($(".ui-hidden-global-agent").val() == -1 &&
        //        $(".ui-radio-booking-passengers-agents-option-agent_contact_id input[type='radio']").is(":checked") == true &&
        //        $(".ui-dropdown-booking-passengers-agents-contact_id").val() == 0) {

        //      $("select.ui-dropdown-booking-passengers-agents-contact_id").addClass("ui-state-global-error");

        //      $bitValidated = false;
        //      $intScroll = Math.min(5, $intScroll)
        //    }

        //    // Address

        //    // If logged in as contact, ignore
        //    if ($(".ui-hidden-global-contact").val() == -1) {
        //      // If logged in as agent, and new customer not selected
        //    } else if ($(".ui-hidden-global-agent").val() == -1 &&
        //               $(".ui-radio-booking-passengers-agents-option-new input[type='radio']").is(":checked") == false) {
        //    } else {
        //      // Validate Address
        //      var $bitValidatedPhone = false;

        //      if ($("select.ui-dropdown-booking-passengers-address-primary").val() == null) {
        //        $("select.ui-dropdown-booking-passengers-address-primary").addClass("ui-state-global-error");
        //        $bitValidated = false;
        //        $intScroll = Math.min(6, $intScroll)
        //      }

        //      // Ensure at least one phone number
        //      $(".ui-booking-passengers .ui-type-global-phone").each(function (e) {
        //        var $objPhone = $(this);

        //        if ($objPhone.val().replace(/[_ -]/g, "") !== "") {
        //          $bitValidatedPhone = true;
        //        }
        //      });

        //      // Add error state to all address phone fields
        //      if ($bitValidatedPhone == false) {
        //        $(".ui-booking-passengers .ui-type-global-phone").addClass("ui-state-global-error");
        //        $bitValidated = false;
        //        $intScroll = Math.min(6, $intScroll)
        //      };

        //      // Validate email address
        //      if ($.fn.IsEmail($(".ui-textbox-booking-passengers-address-email").val(), false) == false) {
        //        //if ($(".ui-field-address-email").val() == "") {
        //        $(".ui-textbox-booking-passengers-address-email").addClass("ui-state-global-error");
        //        $bitValidated = false;
        //        $intScroll = Math.min(6, $intScroll)
        //      }


        //    var $objRegistration = $(".ui-registration").not("ui-clone-global");

        //    //      alert($objRegistration.find("input.ui-textbox-registration-first").val());
        //    //      alert($objDialog.find("input.ui-textbox-registration-first").val());

        //    $objRegistration.find("input.ui-textbox-registration-first").val($objDialog.find("input.ui-textbox-registration-first").val());
        //    $objRegistration.find("input.ui-textbox-registration-last").val($objDialog.find("input.ui-textbox-registration-last").val());
        //    $objRegistration.find("input.ui-textbox-registration-email").val($objDialog.find("input.ui-textbox-registration-email").val());

        //    $objRegistration.find("select.ui-dropdown-registration-gender option").attr("selected", false);
        //    $objRegistration.find("select.ui-dropdown-registration-gender").val($objDialog.find("select.ui-dropdown-registration-gender").val());
        //    $objRegistration.find("select.ui-dropdown-registration-gender option:selected").attr("selected", "selected");
        //    //      $objRegistration.find("select.ui-dropdown-registration-gender").val($objDialog.find("input.ui-textbox-registration-gender").val());

        //    $objRegistration.find("input.ui-textbox-registration-password").val($objDialog.find("input.ui-textbox-registration-password").val());

        //    // Groups
        //    $objDialog.find(".ui-checkboxlist-registration-group input").each(function (e) {
        //      var $chkGroup = $(this);
        //      $objRegistration.find(".ui-checkboxlist-registration-group input[value='" + $chkGroup.attr("value") + "']").prop("checked", $chkGroup.is(":checked"));
        //    });

        //    // Home
        //    $objRegistration.find("input.ui-textbox-registration-home-address").val($objDialog.find("input.ui-textbox-registration-home-address").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-city").val($objDialog.find("input.ui-textbox-registration-home-city").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-state").val($objDialog.find("input.ui-textbox-registration-home-state").val());
        //    $objRegistration.find("select.ui-dropdown-registration-home-country option").attr("selected", false);
        //    $objRegistration.find("select.ui-dropdown-registration-home-country").val($objDialog.find("select.ui-dropdown-registration-home-country").val());
        //    $objRegistration.find("select.ui-dropdown-registration-home-country option:selected").attr("selected", "selected");
        //    $objRegistration.find("input.ui-textbox-registration-home-zip").val($objDialog.find("input.ui-textbox-registration-home-zip").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-phone").val($objDialog.find("input.ui-textbox-registration-home-phone").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-mobile").val($objDialog.find("input.ui-textbox-registration-home-mobile").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-pager").val($objDialog.find("input.ui-textbox-registration-home-pager").val());
        //    $objRegistration.find("input.ui-textbox-registration-home-fax").val($objDialog.find("input.ui-textbox-registration-home-fax").val());

        //    // Business
        //    $objRegistration.find("input.ui-textbox-registration-business-company").val($objDialog.find("input.ui-textbox-registration-business-company").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-address").val($objDialog.find("input.ui-textbox-registration-business-address").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-city").val($objDialog.find("input.ui-textbox-registration-business-city").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-state").val($objDialog.find("input.ui-textbox-registration-business-state").val());
        //    $objRegistration.find("select.ui-dropdown-registration-business-country option").attr("selected", false);
        //    $objRegistration.find("select.ui-dropdown-registration-business-country").val($objDialog.find("select.ui-dropdown-registration-business-country").val());
        //    $objRegistration.find("select.ui-dropdown-registration-business-country option:selected").attr("selected", "selected");
        //    $objRegistration.find("input.ui-textbox-registration-business-zip").val($objDialog.find("input.ui-textbox-registration-business-zip").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-phone").val($objDialog.find("input.ui-textbox-registration-business-phone").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-mobile").val($objDialog.find("input.ui-textbox-registration-business-mobile").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-pager").val($objDialog.find("input.ui-textbox-registration-business-pager").val());
        //    $objRegistration.find("input.ui-textbox-registration-business-fax").val($objDialog.find("input.ui-textbox-registration-business-fax").val());
        //    //      $objRegistration.find("select.ui-dropdown-registration-business-country").attr('selectedIndex', '-1');

        //$(".ui-registration").dialog("close");

        //alert($(".ui-link-registration-update").attr("name"));

        //$.fn.Submit($(".ui-link-registration-update").attr("name"), true, false, false);

        // Force elements to "form"
        //var $objDialog = $(".ui-registration");
        //$objDialog.parent().appendTo("form");

        //e.stopPropagation();

        $(".ui-registration").parent().appendTo("form");

        //$(".ui-registration").parent().dialog("close");

        $(this).dialog('close');
        $(this).dialog('destroy');
    }

    $(".ui-link-registration-cancel").click(function (e) {
        e.preventDefault();
        $(".ui-registration").dialog("close");
    });

    $(".ui-link-registration").click(function (e) {
        e.preventDefault();

        var $objDialog = $(".ui-registration");

        $objDialog.find(".ui-state-global-error").removeClass("ui-state-global-error");

        $objDialog.dialog({
            modal: true,
            width: 600,
            height: 600,
            draggable: false,
            resizable: false,
            create: function (ev, ui) {
                //$.Watermark.ShowAll();
            },
            open: function (ev, ui) {
                // $(this).parent().appendTo("form");

                // Required on first entry when .ui-registration is moved
                //$.Watermark.ShowAll();

                //$objDialog.appendTo(".ui-dialog");

                //$objDialog.parent().appendTo("form");

                if (!$("input.ui-textbox-registration-first").prop("disabled")) {
                    $("input.ui-textbox-registration-first").select();
                    $("input.ui-textbox-registration-first").focus();
                } else {
                    //$(this).find("input.ui-textbox-registration-email").select();
                    //$(this).find("input.ui-textbox-registration-email").focus();
                }

            },
            close: function (event, ui) {
                // Bind fields inside form
                //$(".ui-registration").appendTo("form");

                //$(this).dialog('close');
                $(this).dialog('destroy'); // .remove();
                //$(this).dialog('destroy').remove();
            }
        })
        //.parent().appendTo("form");

        //$.Watermark.ShowAll();
    });

    // Launch Auto-Registration
    if ($("input.ui-hidden-booking-passengers-credentials-registration-automatic").val() == "-1") {
        $(".ui-link-booking-passengers-credentials-registration").trigger("click");
    };
});