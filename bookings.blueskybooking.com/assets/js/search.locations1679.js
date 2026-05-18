$(document).ready(function (e) {
    var $intCompany_ID = -1;

    $(".ui-search-company_id").first().each(function (e) {
        $intCompany_ID = $(this).val();
    });

    // Setup data variable
    var $JSONLocations = {};

    if ($intCompany_ID > 0) {
        // Disable drop-down lists at startup
        $(".ui-search-departure-location, .ui-search-arrival-location").prop("disabled", true);

        var $strURL = "Search/Locations.json";

        if ($("input.ui-search-host").val() == "1") {
            $strURL = "https://" + window.location.host + "/Search/Locations.aspx";
        };

        var $strTrainingParameter = ""
        
        if (typeof getQueryString === 'function') {
            if (getQueryString("Training") == "1") {
                $strTrainingParameter = "&Training=1";
            }
        }

        //console.log($strURL);

        // Grab location Routes into JSON table
        $.ajax({
            type: "GET",
            url: $strURL,
            data: "Company_ID=" + $intCompany_ID + $strTrainingParameter + "&Web=1&Active=1",
            //data: "Session=" + $strSession + "&Web=1&Active=1",
            async: true,
            error: function (xhr, ajaxOptions, thrownError) {
                //alert("{Error / Network / " + xhr.status + " : " + ajaxOptions + " : " + thrownError + "}");
            },
            success: function (data) {
                // Assign the JSON data to the local variable
                $JSONLocations = data;

                var $intDeparture_Location_ID = -1;
                var $intArrival_Location_ID = -1;

                if ($(".ui-search-departure-location").val() > 0) { $intDeparture_Location_ID = $(".ui-search-departure-location").val(); };
                if ($(".ui-search-arrival-location").val() > 0) { $intArrival_Location_ID = $(".ui-search-arrival-location").val(); };

                // Departure Location
                if ($(".ui-search-arrival-location").not(".ui-search-arrival-location-disabled").length == 1) {
                    $.fn.GetLocations(-1, $intArrival_Location_ID, $(".ui-search-departure-location"), -1);
                } else {
                    $.fn.GetLocations(-1, -1, $(".ui-search-departure-location"), -1);
                };

                // Arrival Location
                $.fn.GetLocations($intDeparture_Location_ID, -1, $(".ui-search-arrival-location"), -1);

                $.fn.GetLocations($intArrival_Location_ID, -1, $(".ui-search-return-location"), -1);
            },
            complete: function () {
                // Enable the drop-down lists
                $(".ui-search-departure-location, .ui-search-arrival-location").prop("disabled", false);
            }
        });
    } else {
        $(".ui-search-departure-location, .ui-search-arrival-location").prop("disabled", false);
    }

    $.fn.IsCategoryOptGroup = function (Category, $optCategory) {
        if (Category == "") {
            return false;
        } else if ($optCategory === undefined) {
            return true;
        } else if ($optCategory.attr('Label') != Category) {
            return true;
        }
        return false;
    }

    // Function to reset the location drop-down lists
    $.fn.GetLocations = function ($intDeparture_Location_ID, $intArrival_Location_ID, $objLocations, $intSelected) {
        // If nothing defined, exit (failsafe)
        if ($.isEmptyObject($JSONLocations.Routes)) {
            return false;
        }

        // Loop through each drop-down list passed through
        $objLocations.each(function (e) {
            // Grab the drop-down list
            var $objList = $(this);

            // Save current selected item, unless manually passed
            if ($intSelected < 0) {
                $intSelected = $objList.val();
            }

            // Find "Any Location"
            var $objAnyLocation = $objList.find("option[value='-1']");

            // Clear list
            $objList.find("optgroup").remove().end();
            $objList.find("option").remove().end();

            // Add blank / default item
            //alert("add blank");
            $objList.append($("<option>",
                {
                    value: -1,
                    text: $objAnyLocation.text(),
                    selected: false
                }));

            // Force reset of enter list, then exit
            // Occurs when user select blank (-1) option from the list
            if ($intDeparture_Location_ID == -1 &&
                $intArrival_Location_ID == -1) {

                // https://stackoverflow.com/questions/21288001/adding-options-to-existing-optgroup
                var $optCategory;

                // Loop through the list of Locations
                $($JSONLocations.Location).each(function (index, data) {

                    if ($.fn.IsCategoryOptGroup(data.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $("<optgroup>",
                            {
                                label: data.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $("<option>",
                        {
                            value: data.Location_ID,
                            text: data.Location,
                            selected: ($intSelected) == (data.Location_ID)
                        })

                    if ($optCategory === undefined) {
                        $objList.append($objLocationOption);
                    } else {
                        $optCategory.append($objLocationOption);
                    }
                });

                if ($optCategory !== undefined) {
                    $objList.append($optCategory);
                }

                return true;
            };

            $optCategory = undefined;

            // Loop through list of Routes
            $($JSONLocations.Routes).each(function (index, data) {

                var $objLocationOption;

                // Check if location matches, either departure or arrival ID
                if ($intDeparture_Location_ID == data.Arrival.Location_ID) {
                    if ($.fn.IsCategoryOptGroup(data.Departure.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $("<optgroup>",
                            {
                                label: data.Departure.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $("<option>",
                        {
                            value: data.Departure.Location_ID,
                            text: data.Departure.Location,
                            selected: ($intSelected) == (data.Departure.Location_ID)
                        });

                } else if ($intArrival_Location_ID == data.Departure.Location_ID) {
                    if ($.fn.IsCategoryOptGroup(data.Arrival.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $("<optgroup>",
                            {
                                label: data.Arrival.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $("<option>",
                        {
                            value: data.Arrival.Location_ID,
                            text: data.Arrival.Location,
                            selected: ($intSelected) == (data.Arrival.Location_ID)
                        });
                };

                if ($optCategory === undefined) {
                    $objList.append($objLocationOption);
                } else {
                    $optCategory.append($objLocationOption);
                }
            });

            if ($optCategory !== undefined) {
                $objList.append($optCategory);
            }
        });
    }

    // Departure changed, force refresh
    $(".ui-search-departure-location").change(function (e) {
        $.fn.GetLocations($(this).val(), -1, $(".ui-search-arrival-location"), -1);
        //$.fn.GetLocations($(".ui-search-arrival-location").val(), -1, $(".ui-search-return-location"));
    });

    // Arrival changed, force refresh
    //  $(".ui-search-arrival-location").not(".ui-search-arrival-location-disabled").change(function (e) {
    //    $.fn.GetLocations(-1, $(this).val(), $(".ui-search-departure-location"), -1);
    //  });

    $(".ui-search-arrival-location").change(function (e) {
        var $objLocation = $(this);
        if (!$objLocation.is(".ui-search-arrival-location-disabled")) {
            $.fn.GetLocations(-1, $(this).val(), $(".ui-search-departure-location"), -1);
        }

        // Automatically set the return location
        $.fn.GetLocations($(".ui-search-arrival-location").val(), -1, $(".ui-search-return-location"), -1);
    });

    // Swap departure and arrival location
    $(".ui-search-swap").click(function (e) {
        e.preventDefault();

        var $intDeparture_Location_ID = $(".ui-search-departure-location").val();
        var $intArrival_Location_ID = $(".ui-search-arrival-location").val();

        if ($intDeparture_Location_ID < 0 || $intArrival_Location_ID < 0) {
            return false;
        }

        // Departure | Show Full List
        if ($(".ui-search-arrival-location").not(".ui-search-arrival-location-disabled").length === 0) {
            $.fn.GetLocations(-1, -1, $(".ui-search-departure-location"), $intArrival_Location_ID);
        } else {
            $.fn.GetLocations(-1, $intDeparture_Location_ID, $(".ui-search-departure-location"), $intArrival_Location_ID);
        }

        $.fn.GetLocations($intArrival_Location_ID, -1, $(".ui-search-arrival-location"), $intDeparture_Location_ID);

        // Automatically set the return location
        $.fn.GetLocations($(".ui-search-arrival-location").val(), -1, $(".ui-search-return-location"), -1);
    });

    // Swap departure and arrival location
    $(".ui-search-reset").click(function (e) {
        e.preventDefault();

        var $intDeparture_Location_ID = $(".ui-search-departure-location").val();
        var $intArrival_Location_ID = $(".ui-search-arrival-location").val();

        $.fn.GetLocations(-1, -1, $(".ui-search-departure-location"), 0);
        $.fn.GetLocations(-1, -1, $(".ui-search-arrival-location"), 0);

        // Automatically set the return location
        $.fn.GetLocations($(".ui-search-arrival-location").val(), -1, $(".ui-search-return-location"), -1);
    });
});
