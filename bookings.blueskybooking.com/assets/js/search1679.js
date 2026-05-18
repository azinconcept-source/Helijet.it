/* Search */
$(document).ready(function () {

  // Auto
  if ($("input.ui-button-auto-search").length != 0) {
    $.fn.Submit($("input.ui-button-auto-search").attr("id"), true, true, false);
  }

  $.fn.Return = function ($objReturn) {
    // Remove error formatting
    $(".ui-textbox-search-return-date").removeClass("ui-state-global-error");

    if ($objReturn.is(':checked')) {
      $(".ui-textbox-search-return-date")
        .removeAttr("disabled")
        .removeClass("ui-state-global-disabled");
      $(".ui-dropdown-search-return-date-range")
        .removeAttr("disabled")
        .removeClass("ui-state-global-disabled");
      $(".ui-dropdown-search-return-time-range")
        .removeAttr("disabled")
        .removeClass("ui-state-global-disabled");
      $(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]")
        .removeAttr("disabled");
    } else {
      $(".ui-textbox-search-return-date")
        .attr("disabled", "disabled")
        .addClass("ui-state-global-disabled");
      $(".ui-dropdown-search-return-date-range")
        .attr("disabled", "disabled")
        .addClass("ui-state-global-disabled");
      $(".ui-dropdown-search-return-time-range")
        .attr("disabled", "disabled")
        .addClass("ui-state-global-disabled");
      $(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]")
        .attr("disabled", "disabled");

      $(".ui-textbox-search-return-date").val("");
    };
    $.fn.ReturningOption()
  };

  $.fn.ReturningOption = function () {
    if ($(".ui-labelbox-search-return-date.ui-checkbox-global input[type=checkbox]").is(":checked") == true &&
          $(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]").is(":checked") == true) {
      $(".ui-dropdown-search-return-location")
        .removeAttr("disabled")
        .removeClass("ui-state-global-disabled");
    } else {
      $(".ui-dropdown-search-return-location")
        .attr("disabled", "disabled")
        .addClass("ui-state-global-disabled");
    };
    $(".ui-dropdown-search-return-location").removeClass("ui-state-global-error");
  };

  // Departure Dropdown : Select()
  // Automatically select return location when Return checkbox unchecked
  $(".ui-dropdown-search-departure-location").change(function (e) {
    var $objDeparture = $(this);
    //if ($(".ui-label-search-return-location.ui-checkbox-global input[type=checkbox]").is(":checked") != true) {
    $(".ui-dropdown-search-return-location").val($objDeparture.val());
    //};
  });

  // Returning Checkbox : Click()
  $(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]").click(function (e) {
    var $this = $(this);
    $.fn.ReturningOption();
  });

  // Return Checkbox : Click()
  $(".ui-labelbox-search-return-date.ui-checkbox-global input[type=checkbox]").click(function (e) {
    $.fn.Return($(this));
  }).each(function () {
    $.fn.Return($(this));
  });

  $.fn.AgentsOption = function () {
    if ($(".ui-labelbox-search-agents-contact_id.ui-checkbox-global input[type=checkbox]").is(":checked") == true) {
      $(".ui-dropdown-search-agents-contact_id")
        .removeAttr("disabled")
        .removeClass("ui-state-global-disabled");
    } else {
      $(".ui-dropdown-search-agents-contact_id")
        .attr("disabled", "disabled")
        .addClass("ui-state-global-disabled");
    };
    $(".ui-dropdown-search-agents-contact_id").removeClass("ui-state-global-error");
  };

  // Agent | Customers : Click()
  $(".ui-labelbox-search-agents-contact_id.ui-checkbox-global input[type=checkbox]").click(function (e) {
    $.fn.AgentsOption($(this));
  }).each(function () {
    $.fn.AgentsOption($(this));
  });

  // Departure / Return Date Picker
  var $objDates = $(".ui-textbox-search-departure-date, .ui-textbox-search-return-date").datepicker({
    //showOn: 'button',
    //buttonImage: '../Images/calendar.gif',
    //buttonImageOnly: true,
    showAnim: 'slideDown',
    showButtonPanel: false,
    minDate: -0,
    defaultDate: "+1d",
    numberOfMonths: 1,
    showOtherMonths: true,
    selectOtherMonths: true,
    dateFormat: "mm/dd/yy",
    onSelect: function (selectedDate) {
      var option =
        this.id == $(".ui-textbox-search-departure-date").attr('ID') ? "minDate" : "maxDate",
        instance = $(this).data("datepicker"),
        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
      $objDates.not(this).datepicker("option", option, date);

      $(".ui-textbox-search-departure-date").removeClass("ui-state-global-error");
      $(".ui-textbox-search-return-date").removeClass("ui-state-global-error");
    }
  });

  // Minimum number of passengers
  $.fn.MinimumPassengers = function () {
    var $bitValid = false;
    var $intTotal = 0;

    $(".ui-dropdown-search-passengers-total").each(function () {
      $intTotal = $intTotal + parseInt($(this).val());
    });

    if ($intTotal == 0) {
      $(".ui-dropdown-search-passengers-total").addClass("ui-state-global-error");
      $bitValid = false;
    } else {
      $(".ui-dropdown-search-passengers-total").removeClass("ui-state-global-error");
      $bitValid = true;
    }

    return $bitValid;
  };

  // Maximum number of passengers
  $.fn.MaximumPassengers = function () {
    var $bitValid = true;
    var $intTotal = 0;
    var $intMaximum = parseInt($(".ui-hidden-search-passengers-maximum").val());

    $(".ui-dropdown-search-passengers-total").each(function () {
      $intTotal = $intTotal + parseInt($(this).val());
    });

    if ($intTotal > $intMaximum) {
      $(".ui-listitem-search-passengers-warning").show();
      //$(".ui-button-search-search").attr("disabled", "disabled");
      $bitValid = false;
    } else {
      $(".ui-listitem-search-passengers-warning").hide();
      //$(".ui-button-search-search").removeAttr("disabled");
      $bitValid = true;
    }

    return $bitValid;
  };

  $(".ui-dropdown-search-passengers-total").focus(function() {
    $(".ui-dropdown-search-passengers-total").removeClass("ui-state-global-error");
  })

  $(".ui-dropdown-search-passengers-total").change(function () {
    $.fn.MaximumPassengers()
  });

  // Startup : Check maximum number of passengers
  $.fn.MaximumPassengers();

  // btnSearch : Click() -- Validation
  $(".ui-button-search-search").click(function (e) {
    var $bitSearch = true;

    if ($("input.ui-hidden-search-departure-location").val() == "1") {
      if ($(".ui-dropdown-search-departure-location").val() < 0) {
        $(".ui-dropdown-search-departure-location").addClass("ui-state-global-error");
        $bitSearch = false;
      };
    };
      
    if ($("input.ui-hidden-search-arrival-location").val() == "1") {
      if ($(".ui-dropdown-search-arrival-location").val() < 0) {
        $(".ui-dropdown-search-arrival-location").addClass("ui-state-global-error");
        $bitSearch = false;
      };
    };

    if ($("input.ui-hidden-search-any-location").val() == "1") {
      if ($(".ui-dropdown-search-departure-location").val() < 0 && $(".ui-dropdown-search-arrival-location").val() < 0) {
        $(".ui-dropdown-search-arrival-location").addClass("ui-state-global-error");
        $bitSearch = false;
      };
    };

    if ($(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]:checked").length) {
      if ($("input.ui-hidden-search-return-location").val() == "1") {
        if ($(".ui-dropdown-search-return-location").val() < 0) {
          $(".ui-dropdown-search-return-location").addClass("ui-state-global-error");
          $bitSearch = false;
          };
        };
    }

    if (!IsDate($(".ui-textbox-search-departure-date").val())) {
      $(".ui-textbox-search-departure-date").addClass("ui-state-global-error");
      $bitSearch = false;
    };

    if ($(".ui-labelbox-search-return-date.ui-checkbox-global input[type=checkbox]:checked").length) {
      if (!IsDate($(".ui-textbox-search-return-date").val())) {
        $(".ui-textbox-search-return-date").addClass("ui-state-global-error");
        $bitSearch = false;
      };

      if (Date.parse($(".ui-textbox-search-return-date").val()) < Date.parse($(".ui-textbox-search-departure-date").val())) {
        $(".ui-textbox-search-return-date").addClass("ui-state-global-error");
        $bitSearch = false;
      };
    };

    if ($(".ui-labelbox-search-agents-contact_id.ui-checkbox-global input[type=checkbox]:checked").length) {
      //alert($(".ui-dropdown-search-agents-contact_id").val());
      if ($(".ui-dropdown-search-agents-contact_id").val() < 1) {
        $(".ui-dropdown-search-agents-contact_id").addClass("ui-state-global-error");
        $bitSearch = false;
      };
    }

    // Check maximum number of passengers
    if ($.fn.MinimumPassengers() != true) {
      $bitSearch = false;
    };

    if ($.fn.MaximumPassengers() != true) {
      $bitSearch = false;
    };

    if ($bitSearch != true) {
     e.preventDefault();
     e.stopPropagation();
     e.stopImmediatePropagation();

      return false;
    };

    // Show Waiting Bar
    //ShowProcessing(false, true);
    //$.fn.Submit('', false, false, false);
    $.fn.Processing();

    // Enable fields for saving after submit
    $(".ui-labelbox-search-return-location.ui-checkbox-global input[type=checkbox]").removeAttr("disabled");
    $(".ui-dropdown-search-return-location").removeAttr("disabled");

    return true;
  });

  // Resets on Departure/Return: KeyPress(), Change()
  $(".ui-textbox-search-departure-date, .ui-textbox-search-return-date").keypress(function (e) {
    $(this).removeClass("ui-state-global-error");
  }).change(function (e) {
    $(this).removeClass("ui-state-global-error");
  });

  // Reset on Returns : Click()
  $(".ui-labelbox-search-return-date.ui-checkbox-global input[type=checkbox]").click(function (e) {
    var $objDates = $(".ui-textbox-search-departure-date, .ui-textbox-search-return-date");
    $objDates.removeClass("ui-state-global-error");
  });

  // Function: IsDate()
  function IsDate(strDate) {
    var bits = strDate.split('index.html');
    var d = new Date(bits[2], bits[0] - 1, bits[1]);
    return d && (d.getMonth() + 1) == bits[0] && d.getDate() == Number(bits[1]);
  }

  //  $(".ui-checkbox-search-sorting input[type=checkbox]").click(function () {
  //    var $this = $(this);
  //    if ($this.is(":checked") == true) {
  //      $(".ui-global-cookies").show();
  //    } else {
  //      $(".ui-global-cookies").hide();
  //    }
  //  });
});