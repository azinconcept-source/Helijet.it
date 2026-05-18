//function ShowProcessing(bitProcessing, bitScrollTop) {
//  if (bitProcessing == true) {
//    $(".ui-processing").show();
//    $("form").addClass("ui-priority-secondary");
//  } else {
//    $("html, body").addClass("ui-priority-secondary");
//  };

//  //      $.jStorage.set("ui-field-payment-eigen-number", "12345");
//  //      alert($(".ui-field-payment-eigen-number").val());

//  if (bitScrollTop == true) {
//    $("html,body").animate({ scrollTop: 0 }, "fast");
//  };

//  //var $overlay = $('<div class="ui-widget-overlay"></div>').appendTo('body').fadeIn();
//  //if (blnOverlay) {
//  //  //  var $overlay = $('<div class="ui-widget-overlay ui-corner-all"></div>').appendTo('body').fadeIn();
//  //};



//  // TEMPORARILY DISABLED -- ERRORED
//  //  var pb = document.getElementById("progressBar");
//  //  pb.innerHTML = '<img src="/images/spinner-loading.gif" width="51" height ="19"/>';
//  //  pb.style.display = '';

//  //document.addEventListener('mousedown', function(e) { e.stopPropagation(); e.preventDefault(); return false; }, true);
//  //  document.addEventListener('mouseup', function (e) { e.stopPropagation(); e.preventDefault(); return false; }, true);
//  //document.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); return false; }, true);

//  //    document.addEventListener('mousedown', function(e) {
//  //      e.stopPropagation();
//  //      e.preventDefault();
//  //      return false;
//  //    }, true);

//}

////  function ProcessingRestricted(e) {
////    e.stopPropagation();
////    e.preventDefault();
////    return false;
////  }

/* Global */
$(document).ready(function () {
  var $intSlideTime = 50;

  $strSession = $(".ui-hidden-global-session").val();

  $.fn.browserEnhanced = function () {
    var $bitBrowserEnhanced = true;

    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null) $bitBrowserEnhanced = (parseFloat(RegExp.$1) >= 9);
      //$bitBrowserEnhanced = (parseFloat( RegExp.$1 ) > 9.0);
    }

    return $bitBrowserEnhanced;
  }

  // Processing message
  $.fn.Processing = function (strMessage) {
    if (strMessage === undefined) {
      strMessage = ".ui-label-global-processing-description-basic";
    }

    $(".ui-page-search, .ui-page-booking, .ui-page-change").addClass("ui-page-global-disabled");

    $("html *").not(".ui-global-prevent-disabled").off();

    $("select, input, a").not(".ui-global-prevent-disabled").bind("focus keydown keyup change mouseover hover mousedown mouseup click", function (e) {
      return false;
    });

    // Hide Watermarking on Submit()
    $.Watermark.HideAll();

    $(".ui-label-global-processing-description").hide();
    $(strMessage).show();

    $(".ui-panel-global-processing").show();
  }

  // Set ASP.NET Event
  $.fn.SetEvent = function ($strEventTarget) {
    if ($strEventTarget != "") {
      $("#__EVENTTARGET").val($strEventTarget);
      $("#__EVENTARGUMENT").val("");
    }
  }

  // On links
  $(".ui-link-global-processing, .ui-link-global-calendar a").click(function (e) {
    $.fn.Processing();
    //$.fn.Submit("", false, true, false);
  });


  // $.fn.Submit()
  $.fn.SubmitQuick = function ($strEventTarget) {
    //    alert("Submit Quick:")

    //console.log("submitQuick")
    if ($strEventTarget != "") {
      $("#__EVENTTARGET").val($strEventTarget);
      $("#__EVENTARGUMENT").val("");
    }

    $("form").submit();
  }

  $.fn.Submit = function ($strEventTarget, $bitSubmit, $bitProcessing, $bitScrollTop) {
    //    alert("Submit:")

    //console.log("$.fn.Submit")
    $(".ui-page-search, .ui-page-booking").addClass("ui-page-global-disabled");

    $("html *").off();

    $("select, input, a").bind("focus keydown keyup change mouseover hover mousedown mouseup click", function (e) {
      return false;
    });

    // Hide Watermarking on Submit()
    $.Watermark.HideAll();

    if ($bitProcessing == true) {
      $(".ui-panel-global-processing").show();
    };

    if ($bitScrollTop == true) {
      $("html,body").animate({ scrollTop: 0 }, "fast");
    };

    if ($strEventTarget != "") {
      $("#__EVENTTARGET").val($strEventTarget);
      $("#__EVENTARGUMENT").val("");
    }

    if ($bitSubmit == true) {
      // Activate disabled fields
      $(".ui-field-confirmation-email").removeAttr("disabled");
      $(".ui-field-confirmation-phone").removeAttr("disabled");
      $(".ui-field-confirmation-phone-method").removeAttr("disabled");

      //$("form#frmBooking").trigger("submit");
      $("form").trigger("submit");
    };
  }

  $.fn.CookiesValidation = function () {
    // Set a test cookie
    document.cookie = "CookieValidation=yes; SameSite=None; Secure";

    // Check for cookie
    if (document.cookie == "") {
      $(".ui-labelbox-booking-passengers-credentials-option-remember input[type='checkbox']")
      .attr("disabled", "disabled")
      .removeAttr("checked");

      $(".ui-labelbox-booking-passengers-credentials-option-automatic input[type='checkbox']")
      .attr("disabled", "disabled")
      .removeAttr("checked");

      /* if a cookie is not found - alert user -
      change cookieexists field value to false */
      $(".ui-panel-global-cookies").show();
      $(".ui-page-global").addClass("ui-state-disabled").hide();
      $(".ui-page-global select, .ui-page-global input").bind("focus keydown keyup change mouseover hover mousedown mouseup click", function (e) {
        return false;
      });

      //      // Auto-load cookie window
      //      function cookieWindow() {
      //        //window.open('/Cookie.aspx', 'CookieWindow', 'width=500,height=150');
      //      }

      //      window.onload = cookieWindow;

      $("html,body").animate({ scrollTop: 0 }, "fast");
    }
  }

  $.fn.CookiesValidation();

  // SSL Check
  VerifySsl(false);

  $(".ui-button-global-window-close").click(function (e) {
    parent.$.fn.fancybox.close();
    e.preventDefault();
  });

  // Menu
  $("html, body").click(function (e) {
    $(".ui-menu-global").removeClass("ui-menu-global-open");
    $(".ui-menulist-global").slideUp($intSlideTime);
    //    $(".ui-splitbutton-global").removeClass("ui-splitbutton-global-open");
    //    $(".ui-splitbuttonlist-global").slideUp($intSlideTime);
  });

  //  $(".ui-splitbutton-global").click(function (e) {
  //    $(".ui-splitbuttonlist-global").not($(this).siblings()).slideUp($intSlideTime);
  //    $(this).toggleClass("ui-splitbutton-global-open");
  //    $(this).siblings().slideToggle();
  //    $("form")[0].reset();
  //  }).parent().click(function (e) {
  //    e.stopPropagation();
  //  });

  $(".ui-menu-global").click(function (e) {
    $(".ui-menulist-global").not($(this).siblings()).slideUp($intSlideTime);
    $(this).toggleClass("ui-menu-global-open");
    $(this).siblings().slideToggle($intSlideTime);
    //$("form")[0].reset();
  }).parent().click(function (e) {
    e.stopPropagation();
  });

  // Generic Date Picker
  var $objDates = $(".ui-textbox-global-date-start, .ui-textbox-global-date-finish").datepicker({
    beforeShow: function () {
      $(".ui-datepicker").click(function (e) {
        e.stopPropagation();
      });
    },
    //showOn: 'button',
    //buttonImage: '../Images/calendar.gif',
    //buttonImageOnly: true,
    showAnim: 'slideDown',
    showButtonPanel: false,
    //minDate: -0,
    //defaultDate: "+1d",
    numberOfMonths: 1,
    //changeMonth: true,
    //changeYear: true,
    //showOtherMonths: true,
    //selectOtherMonths: true,
    dateFormat: "mm/dd/yy",
    onSelect: function (selectedDate) {
      var option =
          this.id == $(".ui-textbox-global-date-start").attr('ID') ? "minDate" : "maxDate",
          instance = $(this).data("datepicker"),
          date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
      $objDates.not(this).datepicker("option", option, date);

      $(".ui-textbox-global-date-start").removeClass("ui-state-global-error");
      $(".ui-textbox-global-date-finish").removeClass("ui-state-global-error");
    }
  });

  // Disable [Enter] key: Automatic Form Submit(), bind to "form"
  $("form :input:not(textarea)").keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  //  $(".ui-link-global-dashboard").click(function (e) {
  //    e.preventDefault();
  //    //$.fn.SubmitQuick($(this).attr("id"));
  //  });

  // <li> cleanup
  //  $("li:empty").remove();
  //  $('li').each(function () {
  //    // !$.trim($(this).html())
  //    if ($(this).html().length == 0) {
  //      console.log($(this).html());
  //      $(this).remove();
  //    }
  //  });


  //  // Input CheckBox/Radio styling
  //  $.fn.InputCheckedStyle = function ($objInput) {
  //    if ($objInput.find("[type='checkbox'], [type='radio']").is(":checked")) {
  //      $objInput.addClass("ui-input-global-checked");
  //    } else {
  //      $objInput.removeClass("ui-input-global-checked");
  //    }
  //  };

  //  $(".ui-checkbox-global.ui-sprite-global, .ui-radio-global.ui-sprite-global").each(function (e) {
  //    var $objInput = $(this);
  //    $.fn.InputCheckedStyle($objInput);
  //  });

  //  $(".ui-checkbox-global.ui-sprite-global, .ui-radio-global.ui-sprite-global").change(function (e) {
  //    var $objInput = $(this);
  //    $.fn.InputCheckedStyle($objInput);

  //  });

  // Text Formatting
  // Automatically trim fields
  $(".ui-textbox-global").change(function (e) {
    var $this = $(this);
    $this.val($.trim($this.val()));
  });

  // Capital First Letter
  $(".ui-type-global-name").change(function (e) {
    //console.log($(this).val());
    var $objCapsFirst = $(this);
    $objCapsFirst.val($.fn.CapsFirst($objCapsFirst.val()));
  });

  // Phone Values Only
  $("input.ui-restriction-global-phone").keypress(function (e) {
    // 999-999-9999
    return !(
        e.which != 8 &&
        e.which != 0 &&
        e.which != 45 &&
        (e.which < 48 || e.which > 57));
  });

  // Numeric Values Only
  $("input.ui-restriction-global-numeric").keypress(function (e) {
    // 99999
    return !(
        e.which != 8 &&
        e.which != 0 &&
        (e.which < 48 || e.which > 57));
  }).blur(function (e) {
    $(this).val($(this).val().replace(/[^\d]/g, ""));
  });

  // Function: CapsFirst()
  $.fn.CapsFirst = function (strString) {
    var $strString = strString.toLowerCase();
    $strString = $strString.replace(/^(.)|\s(.)/g, function ($1) { return $1.toUpperCase(); });
    return $strString
  }

  // $.fn.IsEmail() Validation
  $.fn.IsEmail = function (strEmail, bitMultiple) {
    var regEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var $bitValid = true;

    $.each(strEmail.split(","), function () {
      var $this = $.trim(this);
      if (regEmail.test($this) == false) {
        $bitValid = false;
      };
    });

    if (bitMultiple == false) {
      if (strEmail.split(",").length > 1) {
        $bitValid = false;
      };
    };

    return $bitValid; //regEmail.test(strEmail);
  };

  // Email Validation
  $.fn.ValidationEmail = function ($objEmail) {
    if ($.fn.IsEmail($objEmail.val()) == false) {
      $objEmail.addClass("ui-state-global-highlight");
    } else {
      $objEmail.removeClass("ui-state-global-highlight");
    };

    //var regEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    //if (!regEmail.test($objEmail.val())) {
    //  $objEmail.addClass("ui-field-required-highlight");
    //}
    //return pattern.test(emailAddress);
  };

  //  String.format = function () {
  //    var s = arguments[0];
  //    for (var i = 0; i < arguments.length - 1; i++) {
  //      var reg = new RegExp("\\{" + i + "\\}", "gm");
  //      s = s.replace(reg, arguments[i + 1]);
  //    }

  //    return s;
  //  }

  // ui-link-global-email-warning (Safe Senders List)
  $(".ui-link-global-email-warning").click(function (e) {
    e.stopPropagation();

    var $objModal = $(this);
    //var $strTitle = $objModal.attr("data-title");
    //var $strSource = $objModal.attr("data-source");
    var $strSource = "assets/Resources/whitelist.html";

    $.ajaxSetup({ async: false });

    var $objDialog = $(".ui-dialog-booking-confirmation-email-warning")
    //.wrapAll("<div></div>")
    //.parent()
      .clone();

    //$("<div class='ui-global-dialog'><div class='ui-message-global'>xxx</div>yyy</div>");

    //    var $objDialog = $objModel.after(".ui-dialog-global")
    //      .wrapAll("<div></div>")
    //      .parent()
    //      .clone();

    $objDialog
      .addClass("ui-clone-global")
    //.attr("title", $strTitle)
    //.children().empty();

    $objDialog
      .find("a.ui-link-booking-confirmation-email-warning-cancel")
      .click(function (e) {
        $objDialog.dialog("close");
      });

    //alert($objDialog.html());
    $.get($strSource,
      function (data) {
        if (data.length == 0) {
          $objDialog.find(".ui-content-global-dialog").html("[Connection Error: Data.Length=0]<br />Please check network connection and retry.");
          //$objDialog.find("div.ui-dialog-global-window").html("[Connection Error: Data.Length=0]<br />Please check network connection and retry.");
          //return false;
        } else {
          $objDialog.find(".ui-content-global-dialog").html(data);
        };
      }, "html");

    $objDialog.dialog({
      height: 400,
      width: 650,
      draggable: false,
      resizable: false,
      modal: true,
      //      show: 'fade',
      //      hide: 'fade',
      //      buttons: {
      //        Close: function () { $(this).dialog("close"); }
      //      },
      create: function (ev, ui) {
        $(this).parent().css('box-shadow', '12px 12px 12px 0px gray');
        $(this).parent().find('.ui-dialog-buttonset').css({ 'width': '100%', 'text-align': 'right' })
      },
      close: function (ev, ui) {
        //alert($objDialog.html());
        $objDialog.remove();
      }
    });
    //    e.preventDefault();
  });

});

function formatCurrency(number) {
  number = number.toFixed(2) + '';
  x = number.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  if (x1 == -0) { x1 = 0; }

  return x1 + x2;
}

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

if (!String.prototype.format) {
  String.prototype.format = function () {

    var s = this;

    for (var i = 0; i < arguments.length - 1; i++) {
      //console.log(i);
      //console.log(arguments[i]);
      //console.log(s);
      var reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, arguments[i + 1]);
    }

    alert(s);

    return s;

    //    var args = arguments;
    //    return this.replace(/{(\d+)}/g, function (match, number) {
    //      return typeof args[number] != 'undefined'
    //        ? args[number]
    //        : match
    //      ;
    //    });
  };
}

function getQueryString(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//String.prototype.format = function () {
//    var s = arguments[0];
//    for (var i = 0; i < arguments.length - 1; i++) {
//      var reg = new RegExp("\\{" + i + "\\}", "gm");
//      s = s.replace(reg, arguments[i + 1]);
//    }

//    return s;
//  }

//if (!String.prototype.format) {
//  String.prototype.format = function () {
//    var args = arguments;
//    return this.replace(/{(\d+)}/g, function (match, number) {
//      return typeof args[number] != 'undefined'
//        ? args[number]
//        : match
//      ;
//    });
//  };
//}