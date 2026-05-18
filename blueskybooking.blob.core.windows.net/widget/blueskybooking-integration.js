// 3rd Party Cookies Validation
// http://stackoverflow.com/questions/3550790/check-if-third-party-cookies-are-enabled
var bitThirdPartyCookies = true;
var bitThirdPartyCookiesOverride = false;

var msgThirdPartyCookies = function (evt) {
    if (bitThirdPartyCookiesOverride) {
        bitThirdPartyCookies = true;
    } else if (evt.data === 'BSB:3PCunsupported') {
        //document.getElementById('result').innerHTML = 'not supported';
        bitThirdPartyCookies = false;
    } else if (evt.data === 'BSB:3PCsupported') {
        //document.getElementById('result').innerHTML = 'supported';
        bitThirdPartyCookies = true;
    }
};

window.addEventListener("message", msgThirdPartyCookies, false);

function createiFrame() {
    var iFrame = document.createElement("iframe");
    iFrame.src = "https://blueskybooking.blob.core.windows.net/widget/3pc-check.html";
    iFrame.style.display = "none";
    document.body.appendChild(iFrame);
};

// Check for browser support of event handling capability
if (window.addEventListener)
    window.addEventListener("load", createiFrame, false);
else if (window.attachEvent)
    window.attachEvent("onload", createiFrame);
else window.onload = createiFrame;

// //cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js
// //blueskybooking.blob.core.windows.net/widget/blueskybooking-widget.css
// //blueskybooking.blob.core.windows.net/styles/web/fancybox/default.css

//var sFancyBox = document.createElement("script");
//sFancyBox.src = "//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js";
//document.head.appe(sFancyBox);

//s.type = "text/javascript";
//s.attributes.add("rel", "stylesheet")

//s.src = "http://somedomain.com/somescript";
//$jQueryBookings("head").append(s);

/////////////////////////////////////////////////////////////////////////

var isMobile = function (_, ua) {
    _.Android = ua.match(/Android/i);
    _.BlackBerry = ua.match(/BlackBerry/i);
    _.iOS = ua.match(/iPhone|iPad|iPod/i);
    _.iPad = ua.match(/iPad/i);
    _.Opera = ua.match(/Opera Mini/i);
    _.Windows = ua.match(/IEMobile/i);
    _.Palm = ua.match(/webOS/i);
    _.any = _.Android || _.BlackBerry || _.iOS || _.Opera || _.Windows || _.Palm;
    return _;
}({}, navigator.userAgent);

// Query String
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// https://www.sitepoint.com/javascript-session-variable-library/
if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function () {

    // window object
    var win = window.top || window;

    // session store
    //var store = (win.name ? JSON.parse(win.name) : {});

    var store = {};

    try {
        store = (win.name ? JSON.parse(win.name) : {});
    } catch (e) {
    }

    // save store on page unload
    function Save() {
        win.name = JSON.stringify(store);
    };

    // page unload event
    if (window.addEventListener) window.addEventListener("unload", Save, false);
    else if (window.attachEvent) window.attachEvent("onunload", Save);
    else window.onunload = Save;

    // public methods
    return {

        // set a session variable
        set: function (name, value) {
            store[name] = value;
        },

        // get a session value
        get: function (name) {
            return (store[name] ? store[name] : undefined);
        },

        // clear session
        clear: function () { store = {}; },

        // dump session data
        dump: function () { return JSON.stringify(store); }

    };

})();

/////////////////////////////////////////////////////////////////////////

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};

var $jQueryBookings = jQuery.noConflict(true);

$jQueryBookings(document).ready(function ($) {
    // https://stackoverflow.com/questions/2379529/how-to-call-a-function-within-document-ready-from-outside-it
    // window.initializeBookingWidget = function () {
    // var $bitWidget = 0;
    var $intCompany_ID = -1;
    var $strServer = "../bookings.blueskybooking.com/index.html";
    var $strGroup = "";

    var $intMinimumDefault = 1;
    var $intMaximumDefault = 6;

    var $strDateFormat = "yy-mm-dd";

    // Setup data variable
    var $JSONTypes = {};
    var $JSONLocations = {};
    var $JSONSegments = {};

    //$jQueryBookings(".blueskybooking-widget").first().each(function (e) {
    //  $bitWidget = parseInt($jQueryBookings(this).val());
    //});

    if (getParameterByName("Company_ID") != null) {
        $jQueryBookings(".blueskybooking-company_id").val(getParameterByName("Company_ID"));
    }

    $jQueryBookings(".blueskybooking-company_id").first().each(function (e) {
        $intCompany_ID = $jQueryBookings(this).val();
    });

    $jQueryBookings(".blueskybooking-settings-thirdpartycookies").first().each(function (e) {
        bitThirdPartyCookiesOverride = ($jQueryBookings(this).val().toLowerCase() === "false");
    });

    $jQueryBookings(".blueskybooking-server").first().each(function (e) {
        $strServer = $jQueryBookings(this).val();
    });

    $jQueryBookings(".blueskybooking-dateformat, .blueskybooking-settings-dateformat").first().each(function (e) {
        $strDateFormat = $jQueryBookings(this).val();
    });

    var $chrBookingURL = $strServer + "Booking.aspx?Company_ID=" + $intCompany_ID;
    var $chrStatusURL = $strServer + "Status.aspx?Company_ID=" + $intCompany_ID;
    var $chrLookupURL = $strServer + "Lookup.aspx?Company_ID=" + $intCompany_ID;
    var $chrLoginURL = $strServer + "Login.aspx?Company_ID=" + $intCompany_ID;
    var $chrDashboardURL = $strServer + "Dashboard.aspx?Company_ID=" + $intCompany_ID;

    if ($intCompany_ID > 0) {
        $jQueryBookings(".blueskybooking-book")
            .attr("href", $chrBookingURL);

        $jQueryBookings(".blueskybooking-widget-book")
            .attr("href", $chrBookingURL);

        $jQueryBookings(".blueskybooking-widget-search")
            .attr("href", $chrBookingURL);

        $jQueryBookings(".blueskybooking-widget-login")
            .attr("href", $chrLoginURL);

        $jQueryBookings(".blueskybooking-widget-dashboard")
            .attr("href", $chrDashboardURL);

        $jQueryBookings(".blueskybooking-widget-status")
            .attr("href", $chrStatusURL);

        $jQueryBookings(".blueskybooking-widget-lookup")
            .attr("href", $chrLookupURL);
    }

    $jQueryBookings(".blueskybooking-widget-path").each(function () {
        var $dataPath = $jQueryBookings(this).attr("data-Path");
        $jQueryBookings(this).attr("href", $strServer + $dataPath);
    });

    $jQueryBookings("a[href^='" + $strServer + "'], input[href^='" + $strServer + "'], button[href^='" + $strServer + "']")
        .not(".blueskybooking-launch-disabled")
        .addClass("blueskybooking-launch")
        .attr("data-fancybox-type", "iframe");

    // Add grouping to all non-grouped elements
    $jQueryBookings("[class^='blueskybooking-widget-search']:not([data-Group]), [class*=' blueskybooking-widget-search']:not([data-Group]), .blueskybooking-widget-book:not([data-Group]), .blueskybooking-widget-status:not([data-Group]), [class^='blueskybooking-request']:not([data-Group])").each(function (e) {
        //console.log($jQueryBookings(this).attr("class"));
        $jQueryBookings(this).attr("data-Group", "");
    })

    //#~blueskybooking-widget=...
    //#:~:blueskybooking-widget= is not caught by window.location.hash (not formatted for #content)
    var $strBlueSkyBookingAuto = "#~blueskybooking-widget=";

    if (window.location.hash.substring(0, $strBlueSkyBookingAuto.length) === $strBlueSkyBookingAuto) {
        $strBlueSkyBookingAutoUrl = window.location.hash.substring($strBlueSkyBookingAuto.length);
        $jQueryBookings("<a class='blueskybooking-widget-auto blueskybooking-launch' href='" + $strServer + "" + $strBlueSkyBookingAutoUrl + "' data-fancybox-type='iframe' style='display: none;'>Fragment</a>").appendTo("body");
    }

    var $arrMethod = ["Departure", "Return"];
    var $arrTransport = ["Pickup", "Dropoff"];

    for (var $intMethod in $arrMethod) {
        for (var $intTransport in $arrTransport) {
            $jQueryBookings(".blueskybooking-widget-search-" + $arrMethod[$intMethod].toLowerCase() + "-" + $arrTransport[$intTransport].toLowerCase())
                .addClass("blueskybooking-widget-search-transport")
                .attr("data-Method", $arrMethod[$intMethod])
                .attr("data-Transport", $arrTransport[$intTransport]);
        }
    };

    $jQueryBookings.fn.IsCategoryOptGroup = function (Category, $optCategory) {
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
    $jQueryBookings.fn.GetLocations = function ($intDeparture_Location_ID, $intArrival_Location_ID, $objLocations, $intSelected) {
        // If nothing defined, exit (failsafe)
        if ($jQueryBookings.isEmptyObject($JSONLocations.Routes)) {
            return false;
        }

        // Loop through each drop-down list passed through
        $objLocations.each(function (e) {
            // Grab the drop-down list
            var $objList = $jQueryBookings(this);

            // Save current selected item, unless manually passed
            if ($intSelected < 0) {
                $intSelected = $objList.val();
            }

            // Find and keep description, if applicable
            var $strOptionDescription = "";
            $strOptionDescription = $objList.find("option[value='-1']").text();

            $objList.find("optgroup").remove().end();
            $objList.find("option").remove().end();

            // Add blank / default item
            $objList.append($jQueryBookings("<option>",
                {
                    value: -1,
                    text: $strOptionDescription,
                    selected: false
                }));

            //if ($objLocations.hasClass("blueskybooking-widget-search-location-unselected-allowed")) {
            //  $objList.append($jQueryBookings("<option>",
            //      {
            //        value: -1,
            //        text: '',
            //        selected: false
            //      }));
            //}

            // Force reset of enter list, then exit
            // Occurs when user select blank (-1) option from the list
            if ($intDeparture_Location_ID == -1 &&
                $intArrival_Location_ID == -1) {

                var $optCategory;

                // Loop through the list of Locations
                $jQueryBookings($JSONLocations.Location).each(function (index, data) {

                    if ($.fn.IsCategoryOptGroup(data.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $jQueryBookings("<optgroup>",
                            {
                                label: data.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $jQueryBookings("<option>",
                        {
                            value: data.Location_ID,
                            text: data.Location,
                            selected: ($intSelected) == (data.Location_ID)
                        });

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
            $jQueryBookings($JSONLocations.Routes).each(function (index, data) {

                var $objLocationOption;

                // Check if location matches, either departure or arrival ID
                if ($intDeparture_Location_ID == data.Arrival.Location_ID) {
                    if ($jQueryBookings.fn.IsCategoryOptGroup(data.Departure.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $jQueryBookings("<optgroup>",
                            {
                                label: data.Departure.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $jQueryBookings("<option>",
                        {
                            value: data.Departure.Location_ID,
                            text: data.Departure.Location,
                            selected: ($intSelected) == (data.Departure.Location_ID)
                        });

                } else if ($intArrival_Location_ID == data.Departure.Location_ID) {
                    if ($jQueryBookings.fn.IsCategoryOptGroup(data.Arrival.Category, $optCategory)) {
                        if ($optCategory !== undefined) {
                            $objList.append($optCategory);
                        }

                        $optCategory = $jQueryBookings("<optgroup>",
                            {
                                label: data.Arrival.Category
                            });
                    }

                    // Add location as option
                    $objLocationOption = $jQueryBookings("<option>",
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

    setLocations = function () {
        var $intDeparture_Location_ID = -1;
        var $intArrival_Location_ID = -1;

        if ($jQueryBookings(".blueskybooking-widget-search-departure_location_id").val() > 0) { $intDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-search-departure_location_id").val(); };
        if ($jQueryBookings(".blueskybooking-widget-search-arrival_location_id").val() > 0) { $intArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id").val(); };

        // console.log($intDeparture_Location_ID + " : " + $intArrival_Location_ID);

        $jQueryBookings.fn.GetLocations(-1, $intDeparture_Location_ID, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), $intArrival_Location_ID);
        $jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), $intDeparture_Location_ID);

        //$jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), 0);
        //$jQueryBookings.fn.GetLocations(-1, $intArrival_Location_ID, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), 0);
        //$jQueryBookings.fn.GetLocations($intDeparture_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), 0);

        //// Process the initial listings
        //$jQueryBookings.fn.GetLocations($intDeparture_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), -1);
        //// Arrival Location
        //$jQueryBookings(".blueskybooking-widget-search-arrival_location_id").not(".blueskybooking-widget-search-arrival_location_id-disabled").first().each(function (e) {
        //  $jQueryBookings.fn.GetLocations(-1, $intArrival_Location_ID, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), -1);
        //});
        //$jQueryBookings.fn.GetLocations($intArrival_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id"), -1);

        enableLocations(true);
    }

    enableLocations = function (bitEnabled) {
        $jQueryBookings(".blueskybooking-widget-search-departure_location_id, .blueskybooking-widget-search-arrival_location_id").prop("disabled", !bitEnabled);
    }

    if ($jQueryBookings(".blueskybooking-widget-search-departure_location_id").length > 0 ||
        $jQueryBookings(".blueskybooking-widget-search-arrival_location_id").length > 0) {
        // Disable drop-down lists at startup
        //$jQueryBookings(".blueskybooking-widget-search-departure_location_id, .blueskybooking-widget-search-arrival_location_id").prop("disabled", true);

        var savLocations = Session.get("locations")

        if (savLocations !== undefined) {
            //  // if found, use cookie list
            $JSONLocations = JSON.parse(JSON.stringify(savLocations));
            setLocations();
            enableLocations(true);
        } else {
            // Otherwise, grab location Routes into JSON table and update cookie
            $jQueryBookings.ajax({
                type: "GET",
                url: $strServer + "/Search/Locations.aspx?Company_ID=" + $intCompany_ID,
                data: "Web=1&Active=1",
                async: true,
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert("{Error / Network / " + xhr.status + " : " + thrownError + "}");
                },
                success: function (data) {
                    Session.set("locations", data);

                    // Assign the JSON data to the local variable
                    $JSONLocations = JSON.parse(JSON.stringify(data));;

                    setLocations();
                },
                complete: function () {
                    // Enable the drop-down lists
                    enableLocations(true);
                }
            });
        }
    } else {
        enableLocations(true);
    }

    // Segments

    // Function to reset the segment drop-down lists
    $jQueryBookings.fn.GetSegments = function ($intSegment_ID, $objSegments) {
        // Loop through each drop-down list passed through

        //var $xstrGroup = $objSegments.attr("data-Group");
        //alert($xstrGroup);

        //var $objList = $objSegments; // $jQueryBookings(".blueskybooking-widget-search-segment_id"); // [data-Group='" + $strGroup + "']
        //console.log($objList);

        $objSegments.each(function (e) {
            var $objList = $(this);

            var $objSegment_ID_Filter = $objList.attr("data-filter-segment_id");
            var $objSegment_Type_Filter = $objList.attr("data-filter-type");

            // Find and keep description, if applicable
            //var $strOptionDescription = "";
            //$strOptionDescription = $objList.find("option[value='-1']").text();

            $objList.find("optgroup").remove().end();
            $objList.find("option").remove().end();

            //// Add blank / default item
            //$objList.append($jQueryBookings("<option>",
            //    {
            //        value: -1,
            //        text: $strOptionDescription,
            //        selected: false
            //    }));

            var $optCategory;

            $jQueryBookings($JSONSegments).each(function (index, data) {

                var $strCategory = data.Type

                //console.log($objList.attr("data-group") + ' : ' + $objSegment_Type_Filter + ' : ' + data.Type + ' / ' + data.Segment);

                switch (data.Type) {
                    case 0:
                        $strCategory = "Miscellaneous";
                        break;
                    case 1:
                        $strCategory = "Scheduled";
                        break;
                    case 2:
                        $strCategory = "Charters";
                        break;
                    case 3:
                        $strCategory = "Tours";
                        break;
                    case 4:
                        $strCategory = "Cargo";
                        break;
                    case 5:
                        $strCategory = "Training";
                        break;
                }

                if ($objSegment_ID_Filter !== undefined) {
                    if ($objSegment_ID_Filter.split(",").indexOf(data.Segment_ID.toString()) < 0) {
                        return true;
                    } else {
                        $strCategory = "";
                    }
                }
                if ($objSegment_Type_Filter !== undefined) {
                    if ($objSegment_Type_Filter != data.Type) {
                        return true;
                    } else {
                        $strCategory = "";
                    }
                }

                if ($.fn.IsCategoryOptGroup($strCategory, $optCategory)) {

                    if ($optCategory !== undefined) {
                        $objList.append($optCategory);
                    }

                    $optCategory = $jQueryBookings("<optgroup>",
                        {
                            label: $strCategory
                        });
                }

                // Add segment as option
                $objSegmentOption = $jQueryBookings("<option>",
                    {
                        value: data.Segment_ID,
                        text: data.Segment,
                        //selected: ($intSelected) == (data.Departure.Location_ID)
                    });

                if ($optCategory === undefined) {
                    $objList.append($objSegmentOption);
                } else {
                    $optCategory.append($objSegmentOption);
                }
            });

            if ($optCategory !== undefined) {
                $objList.append($optCategory);
            }
        });
    }

    setSegments = function () {
        var $intSegment_ID = -1;

        if ($jQueryBookings("select.blueskybooking-widget-search-segment_id").val() > 0) { $intSegment_ID = $jQueryBookings("select.blueskybooking-widget-search-segment_id").val(); };

        $jQueryBookings.fn.GetSegments($intSegment_ID, $jQueryBookings("select.blueskybooking-widget-search-segment_id"));

        enableSegments(true);
    }

    enableSegments = function (bitEnabled) {
        $jQueryBookings(".blueskybooking-widget-search-segment_id").prop("disabled", !bitEnabled);
    }

    if ($jQueryBookings(".blueskybooking-widget-search-segment_id").length > 0) {
        var savSegments = Session.get("segments")

        if (savSegments !== undefined) {
            //  // if found, use cookie list
            $JSONSegments = JSON.parse(JSON.stringify(savSegments));
            setSegments();
            enableSegments(true);
        } else {
            // Otherwise, grab location Routes into JSON table and update cookie
            $jQueryBookings.ajax({
                type: "GET",
                url: $strServer + "/Search/Segments.aspx?Company_ID=" + $intCompany_ID,
                data: "Active=1",
                async: true,
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert("{Error / Network / " + xhr.status + " : " + thrownError + "}");
                },
                success: function (data) {
                    Session.set("segments", data);

                    // Assign the JSON data to the local variable
                    $JSONSegments = JSON.parse(JSON.stringify(data));;

                    setSegments();
                },
                complete: function () {
                    // Enable the drop-down lists
                    enableSegments(true);
                }
            });
        }
    } else {
        enableSegments(true);
    }

    $jQueryBookings.fn.TransportList = function ($lstTransport, $strData, $strDefault, $bitRequired, $bitEnabled) {
        $jQueryBookings(".blueskybooking-widget-search-transport").removeClass("blueskybooking-widget-search-error");

        var $blnFoundTransport = false;

        $lstTransport.prop("disabled", !$strData.length || !$bitEnabled)

        $lstTransport.attr("data-Default", $strDefault);
        $lstTransport.attr("data-Required", $bitRequired);

        $strTransport = $lstTransport.attr("data-Value");
        if ($strTransport === undefined) { $strTransport = ""; }

        // If none assigned, use default
        if ($strTransport == "") {
            $lstTransport.attr("data-Value", $strDefault);
            $strTransport = $strDefault;
        };

        //$lstTransport
        //  .find("option:not(:first-child), optgroup")
        //  .remove();

        //$lstTransport
        //  .find("option:first-child")
        //  .prop("selected", true);

        // Find and keep description, if applicable
        var $strOptionDescription = "";
        $strOptionDescription = $lstTransport.find("option[value='']").text();

        $lstTransport
            .find("option, optgroup")
            .remove();

        // Add description
        if ($strOptionDescription != "") {
            $lstTransport.append($jQueryBookings("<option>",
                {
                    value: '',
                    text: $strOptionDescription,
                    disabled: true,
                    selected: true
                }));
        };

        if (!$strData.length == 0) {
            $strTransportGroup = ""
            var arrTransport = $strData.split('\\n');
            for (var i = 0; i < arrTransport.length; i++) {
                //console.log("[Outbound]".length)
                //console.log("x:" + arrTransport[i] + "x: " + arrTransport[i].slice(0, 1) + arrTransport[i].slice(-1));

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
            $lstTransport.attr("data-Value", "");
        };

        $lstTransport
            .find('option:not(:first-child)').each(function () {
                $strOptionGroup = $jQueryBookings(this).attr("optiongroup");
                $lstTransport.find("optgroup[label='" + $strOptionGroup + "']").last().append($jQueryBookings(this));
            });
    }

    $setTransport = function () {
        var $lstDeparture = $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']")
        var $lstArrival = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']")
        var $bitReturn = ($jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']").prop("checked"));
        var $bitReturnLocation = $jQueryBookings(".blueskybooking-widget-search-return_location[data-Group='" + $strGroup + "']").prop("checked");
        var $lstReturn = $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']")

        //alert($lstReturn.val())
        //alert($lstDeparture.val());

        //var $strMethod = "Departure";
        //var $strTransport = "Pickup";

        //console.log($strMethod)
        //console.log($strTransport);

        //var $objLocation = $getLocation(parseInt($lstDeparture.val()));

        //alert($objLocation);
        //console.log($objLocation);

        var $strDeparturePickup = "";
        var $strDeparturePickupDefault = "";
        var $bitDeparturePickupRequired = "";

        var $strDepartureDropoff = "";
        var $strDepartureDropoffDefault = "";
        var $bitDepartureDropoffRequired = "";

        var $strReturnPickup = "";
        var $strReturnPickupDefault = "";
        var $bitReturnPickupRequired = "";

        var $strReturnDropoff = "";
        var $strReturnDropoffDefault = "";
        var $bitReturnDropoffRequired = "";

        $jQueryBookings($JSONLocations.Location).each(function (index, data) {
            // Departure
            if (data.Location_ID == $lstDeparture.val()) {
                $strDeparturePickup = data.Pickup;
                $strDeparturePickupDefault = data.PickupDefault;
                $bitDeparturePickupRequired = data.PickupRequired;
            }

            if (data.Location_ID == $lstArrival.val()) {
                $strDepartureDropoff = data.Dropoff;
                $strDepartureDropoffDefault = data.DropoffDefault;
                $bitDepartureDropoffRequired = data.DropoffRequired;
            }

            // Return
            if (data.Location_ID == $lstArrival.val()) {
                $strReturnPickup = data.Dropoff;
                $strReturnPickupDefault = data.DropoffDefault;
                $bitReturnPickupRequired = data.DropoffRequired;
            }

            if (data.Location_ID == $lstDeparture.val()) {
                $strReturnDropoff = data.Pickup;
                $strReturnDropoffDefault = data.PickupDefault;
                $bitReturnDropoffRequired = data.PickupRequired;
            }

            if ($bitReturnLocation) {
                if (data.Location_ID == $lstReturn.val()) {
                    $strReturnDropoff = data.Dropoff;
                    $strReturnDropoffDefault = data.DropoffDefault;
                    $bitReturnDropoffRequired = data.DropoffRequired;
                }
            }
        });

        //$lstLocation, $strMethod, $strTransport)

        //$jQueryBookings($JSONLocations.Location.each(function (index, data) {

        //  // Add location as option
        //  $objList.append($jQueryBookings("<option>",
        //    {
        //      value: data.Location_ID,
        //      text: data.Location,
        //      selected: ($intSelected) == (data.Location_ID)
        //    }));
        //});

        var $lstDeparturePickup = $jQueryBookings(".blueskybooking-widget-search-departure-pickup[data-Group='" + $strGroup + "']");
        var $lstDepartureDropoff = $jQueryBookings(".blueskybooking-widget-search-departure-dropoff[data-Group='" + $strGroup + "']");

        var $lstReturnPickup = $jQueryBookings(".blueskybooking-widget-search-return-pickup[data-Group='" + $strGroup + "']");
        var $lstReturnDropoff = $jQueryBookings(".blueskybooking-widget-search-return-dropoff[data-Group='" + $strGroup + "']");

        //var $strData = "abc\ndef\nghi";
        //var $strDefault = "def";
        //var $bitRequired = false;

        $jQueryBookings.fn.TransportList($lstDeparturePickup, $strDeparturePickup, $strDeparturePickupDefault, $bitDeparturePickupRequired, true);
        $jQueryBookings.fn.TransportList($lstDepartureDropoff, $strDepartureDropoff, $strDepartureDropoffDefault, $bitDepartureDropoffRequired, true);

        $jQueryBookings.fn.TransportList($lstReturnPickup, $strReturnPickup, $strReturnPickupDefault, $bitReturnPickupRequired, $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']").prop("checked"));
        $jQueryBookings.fn.TransportList($lstReturnDropoff, $strReturnDropoff, $strReturnDropoffDefault, $bitReturnDropoffRequired, $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']").prop("checked"));
    };

    setTypes = function () {
        //alert($JSONTypes.length);

        $jQueryBookings(".blueskybooking-widget-search-types").each(function (e) {
            var $objTypes = $jQueryBookings(this);
            $strGroup = $objTypes.attr("data-Group");

            $jQueryBookings.each($JSONTypes, function () {
                //alert(this.Gender + " : " + this.Weight_ID);

                var $objTypesModel = $jQueryBookings(".blueskybooking-widget-search-types-model[data-Group='" + $strGroup + "']:not([Weight_ID])")
                    .clone()
                    .show();

                $objTypesModel
                    .attr("Weight_ID", this.Weight_ID);

                //$objTypesModel.find(".blueskybooking-widget-search-types-weight_id").val(this.Weight_ID);

                $objTypesModel.find(".blueskybooking-widget-search-types-total")
                    .attr("Weight_ID", this.Weight_ID);

                $objTypesModel.find(".blueskybooking-widget-search-types-decrease")
                    .attr("Weight_ID", this.Weight_ID);

                $objTypesModel.find(".blueskybooking-widget-search-types-increase")
                    .attr("Weight_ID", this.Weight_ID);

                //$objTypesModel.find(".blueskybooking-widget-search-types-gender")
                //  .attr("Weight_ID", this.Weight_ID);

                $objTypesModel.find(".blueskybooking-widget-search-types-gender")
                    .text(this.Web_Gender != '' ? this.Web_Gender : this.Gender);

                $objTypesModel.find(".blueskybooking-widget-search-types-web_preview")
                    .text(this.Web_Preview);

                $objTypesModel.find(".blueskybooking-widget-search-types-decrease")
                    .click(function (e) {
                        var value = parseInt($objTypesModel.find(".blueskybooking-widget-search-types-total").val()) - 1;
                        if ($objTypesModel.find(".blueskybooking-widget-search-types-total option[value='" + value + "']").length !== 0) {
                            $objTypesModel.find(".blueskybooking-widget-search-types-total").val(value);
                            $objTypesModel.find(".blueskybooking-widget-search-types-total").trigger("change");
                        }
                    });

                $objTypesModel.find(".blueskybooking-widget-search-types-increase")
                    .click(function (e) {
                        var value = parseInt($objTypesModel.find(".blueskybooking-widget-search-types-total").val()) + 1;
                        if ($objTypesModel.find(".blueskybooking-widget-search-types-total option[value='" + value + "']").length !== 0) {
                            $objTypesModel.find(".blueskybooking-widget-search-types-total").val(value);
                            $objTypesModel.find(".blueskybooking-widget-search-types-total").trigger("change");
                        }
                    });

                $objTypes
                    .append($objTypesModel)
            })

            //$jQueryBookings('#myTable > tbody').append(
            //    '<tr><td>'
            //    + this.userName
            //    + '</td><td>'
            //    + this.count +
            //    '</td></tr>'
            //);
        });

        //for intCount = 0 to $JSONTypes.length
        //alert($JSONTypes[0].Gender)

        //$JSONTypes.each(function (e) {
        //  alert(e);
        //});


        //var $intDeparture_Location_ID = -1;
        //var $intArrival_Location_ID = -1;

        //if ($jQueryBookings(".blueskybooking-widget-search-departure_location_id").val() > 0) { $intDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-search-departure_location_id").val(); };
        //if ($jQueryBookings(".blueskybooking-widget-search-arrival_location_id").val() > 0) { $intArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id").val(); };


        //console.log($intDeparture_Location_ID + " : " + $intArrival_Location_ID);

        //$jQueryBookings.fn.GetLocations(-1, $intDeparture_Location_ID, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), $intArrival_Location_ID);
        //$jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), $intDeparture_Location_ID);

        ////$jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), 0);
        ////$jQueryBookings.fn.GetLocations(-1, $intArrival_Location_ID, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), 0);
        ////$jQueryBookings.fn.GetLocations($intDeparture_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), 0);

        ////// Process the initial listings
        ////$jQueryBookings.fn.GetLocations($intDeparture_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id"), -1);
        ////// Arrival Location
        ////$jQueryBookings(".blueskybooking-widget-search-arrival_location_id").not(".blueskybooking-widget-search-arrival_location_id-disabled").first().each(function (e) {
        ////  $jQueryBookings.fn.GetLocations(-1, $intArrival_Location_ID, $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), -1);
        ////});
        ////$jQueryBookings.fn.GetLocations($intArrival_Location_ID, -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id"), -1);
    }

    setTypesValidation = function () {
        // Error Validation
        $jQueryBookings(".blueskybooking-widget-search-types-total").focus(function (e) {
            $strGroup = $jQueryBookings(this).attr("data-Group");

            var $intMinimum = $intMinimumDefault;
            var $intMaximum = $intMaximumDefault;

            $jQueryBookings(".blueskybooking-widget-search-types-minimum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMinimum = parseInt($jQueryBookings(this).val());
            });

            $jQueryBookings(".blueskybooking-widget-search-types-maximum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMaximum = parseInt($jQueryBookings(this).val());
            });

            //if (searchTypesTotal() >= $intMinimum &&
            if (searchTypesTotal() <= $intMaximum) {
                $jQueryBookings(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
                //$jQueryBookings(".blueskybooking-widget-search-types-minimum-warning[data-Group='" + $strGroup + "']").hide();
                //$jQueryBookings(".blueskybooking-widget-search-types-maximum-warning[data-Group='" + $strGroup + "']").hide();
            }

            $jQueryBookings(".blueskybooking-widget-search-types-count[data-Group='" + $strGroup + "']").text(searchTypesTotal());
        });

        $jQueryBookings(".blueskybooking-widget-search-types-total").change(function (e) {
            $intWeight_ID = $jQueryBookings(this).attr("Weight_ID");
            $strGroup = $jQueryBookings(this).attr("data-Group");

            var $intMinimum = $intMinimumDefault;
            var $intMaximum = $intMaximumDefault;

            $jQueryBookings(".blueskybooking-widget-search-types-minimum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMinimum = parseInt($jQueryBookings(this).val());
            });

            $jQueryBookings(".blueskybooking-widget-search-types-maximum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMaximum = parseInt($jQueryBookings(this).val());
            });

            $jQueryBookings(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
            $jQueryBookings(".blueskybooking-widget-search-types-minimum-warning[data-Group='" + $strGroup + "']").hide();
            $jQueryBookings(".blueskybooking-widget-search-types-maximum-warning[data-Group='" + $strGroup + "']").hide();

            if (searchTypesTotal() < $intMinimum) {
                //$jQueryBookings(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").addClass("blueskybooking-widget-search-error");
                $jQueryBookings(".blueskybooking-widget-search-types-minimum-warning[data-Group='" + $strGroup + "']").show();
            }

            if (searchTypesTotal() > $intMaximum) {
                $jQueryBookings(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").addClass("blueskybooking-widget-search-error");
                $jQueryBookings(".blueskybooking-widget-search-types-maximum-warning[data-Group='" + $strGroup + "']").show();
            }

            // Decrease | Increase
            $jQueryBookings(".blueskybooking-widget-search-types-decrease[data-Group='" + $strGroup + "'][Weight_ID='" + $intWeight_ID + "']").removeClass("blueskybooking-widget-search-types-increment-disabled");
            $jQueryBookings(".blueskybooking-widget-search-types-increase[data-Group='" + $strGroup + "'][Weight_ID='" + $intWeight_ID + "']").removeClass("blueskybooking-widget-search-types-increment-disabled");

            if ($jQueryBookings(this).val() <= 0) {
                $jQueryBookings(".blueskybooking-widget-search-types-decrease[data-Group='" + $strGroup + "'][Weight_ID='" + $intWeight_ID + "']").addClass("blueskybooking-widget-search-types-increment-disabled");
            }

            if ($jQueryBookings(this).val() >= $intMaximum) {
                $jQueryBookings(".blueskybooking-widget-search-types-increase[data-Group='" + $strGroup + "'][Weight_ID='" + $intWeight_ID + "']").addClass("blueskybooking-widget-search-types-increment-disabled");
            }

            $jQueryBookings(".blueskybooking-widget-search-types-count[data-Group='" + $strGroup + "']").text(searchTypesTotal());
        });

        $jQueryBookings(".blueskybooking-widget-search-types-total").trigger("change");

        // Enable the drop-down lists
        //$jQueryBookings(".blueskybooking-widget-search-departure_location_id, blueskybooking-widget-search-arrival_location_id").prop("disabled", false);
    }

    if ($jQueryBookings(".blueskybooking-widget-search-types").length > 0) {
        var savTypes = Session.get("types");

        if (savTypes !== undefined) {
            $JSONTypes = JSON.parse(JSON.stringify(savTypes));
            setTypes();
            setTypesValidation();
        } else {
            // Grab Passenger Types
            $jQueryBookings.ajax({
                type: "GET",
                url: $strServer + "/Search/Types.aspx?Company_ID=" + $intCompany_ID,
                data: "Web=1",
                async: true,
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert("{Error / Network / " + xhr.status + " : " + thrownError + "}");
                },
                success: function (data) {
                    Session.set("types", data);

                    // Assign the JSON data to the local variable
                    $JSONTypes = JSON.parse(JSON.stringify(data));

                    setTypes();
                },
                complete: function () {
                    setTypesValidation();
                }
            });
        };
    } else {
        setTypesValidation();
    }

    // Setup Transportation
    $setTransport();

    // Departure changed, force refresh
    $jQueryBookings(".blueskybooking-widget-search-departure_location_id").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $jQueryBookings.fn.GetLocations($jQueryBookings(this).val(), -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']"), -1);
        $setTransport();
        //$jQueryBookings.fn.GetLocations($jQueryBookings(".blueskybooking-widget-search-arrival_location_id").val(), -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id"));
    });

    // Arrival changed, force refresh
    // .not(".XXui-search-arrival-location-disabled")
    $jQueryBookings(".blueskybooking-widget-search-arrival_location_id").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        //$jQueryBookings.fn.GetLocations(-1, $jQueryBookings(this).val(), $jQueryBookings(".blueskybooking-widget-search-departure_location_id"), -1);
        // Automatically set the return location
        $jQueryBookings.fn.GetLocations($jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']").val(), -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']"), -1);
        $setTransport();
    });

    $jQueryBookings(".blueskybooking-widget-search-departure-pickup, .blueskybooking-widget-search-departure-dropoff, .blueskybooking-widget-search-return-pickup, .blueskybooking-widget-search-return-dropoff").change(function (e) {
        $jQueryBookings(this).attr("data-Value", $jQueryBookings(this).val());
    });

    $jQueryBookings(".blueskybooking-widget-search-departure-pickup").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $strTransport = $jQueryBookings(this).val();
        var $lstReturnDropoff = $jQueryBookings(".blueskybooking-widget-search-return-dropoff[data-Group='" + $strGroup + "']");
        var $optReturnDropoff = $lstReturnDropoff.find("option[value='" + $strTransport + "']");

        if ($optReturnDropoff.length != 0) {
            $lstReturnDropoff.attr("data-Value", $strTransport);
            $optReturnDropoff.prop("selected", true);
        }
    });

    $jQueryBookings(".blueskybooking-widget-search-departure-dropoff").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $strTransport = $jQueryBookings(this).val();
        var $lstReturnPickup = $jQueryBookings(".blueskybooking-widget-search-return-pickup[data-Group='" + $strGroup + "']");
        var $optReturnPickup = $lstReturnPickup.find("option[value='" + $strTransport + "']");

        if ($optReturnPickup.length != 0) {
            $lstReturnPickup.attr("data-Value", $strTransport);
            $optReturnPickup.prop("selected", true);
        }
    });

    // Swap departure and arrival location
    $jQueryBookings(".blueskybooking-widget-search-location-swap").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        e.preventDefault();
        searchSwap();
        $setTransport();
    });

    // Reset departure and arrival location
    $jQueryBookings(".blueskybooking-widget-search-location-reset").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        e.preventDefault();
        searchReset();
        $setTransport();
    });

    $jQueryBookings(".blueskybooking-widget-search-return_location").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        //var $bitReturn = $jQueryBookings(".blueskybooking-widget-search-return");
        $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);

        $setTransport();
    });

    $jQueryBookings(".blueskybooking-widget-search-return_location_id").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $setTransport();
    });

    $jQueryBookings(".blueskybooking-widget-search-return").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $jQueryBookings(".blueskybooking-widget-search-return_date[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);
        $jQueryBookings(".blueskybooking-widget-search-return_date_range[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);
        $jQueryBookings(".blueskybooking-widget-search-return_time_range[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);

        var $bitReturnLocation = $jQueryBookings(".blueskybooking-widget-search-return_location[data-Group='" + $strGroup + "']");

        $jQueryBookings(".blueskybooking-widget-search-return_location[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);
        $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']").prop('disabled', !$bitReturnLocation.prop("checked") || !this.checked);

        $jQueryBookings(".blueskybooking-widget-search-return-pickup[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);
        $jQueryBookings(".blueskybooking-widget-search-return-dropoff[data-Group='" + $strGroup + "']").prop('disabled', !this.checked);

        $setTransport();
    });

    var $datDateLocal = new Date();
    var $datToday = [$datDateLocal.getFullYear(), $datDateLocal.getMonth() + 1, $datDateLocal.getDate()];
    var $strToday = $datToday[0].pad(4) + '-' + $datToday[1].pad(2) + '-' + $datToday[2].pad(2);

    $jQueryBookings(".blueskybooking-widget-search-departure_date[type='date'], .blueskybooking-widget-search-return_date[type='date']").focus(function (e) {
        this.showPicker();
    });

    $jQueryBookings(".blueskybooking-widget-search-departure_date[type='date'], .blueskybooking-widget-search-return_date[type='date']")
        .attr("min", $strToday)
        .val($strToday);

    $jQueryBookings(".blueskybooking-widget-search-departure_date[type='text'], .blueskybooking-widget-search-return_date[type='text']")
        .val($datToday[1] + '/' + $datToday[2] + '/' + $datToday[0]);

    $jQueryBookings(".blueskybooking-widget-search-departure_date[type='date']").focusout(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $objDeparture_Date = $jQueryBookings(this);
        var $bitReturn = $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']").prop("checked");
        var $objReturn_Date = $jQueryBookings(".blueskybooking-widget-search-return_date[type='date'][data-Group='" + $strGroup + "']")

        $objReturn_Date
            .attr("min", $objDeparture_Date.val());

        if ($objDeparture_Date.val() > $objReturn_Date.val() && $objReturn_Date.val() != "") {
            $objReturn_Date.val($objDeparture_Date.val());
        }
    });

    $jQueryBookings(".blueskybooking-widget-search-return_date[type='date']").focusout(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $objDeparture_Date = $jQueryBookings(".blueskybooking-widget-search-departure_date[type='date'][data-Group='" + $strGroup + "']")
        var $bitReturn = $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']").prop("checked");
        var $objReturn_Date = $jQueryBookings(this);

        //$objDeparture_Date
        //  .attr("max", $objReturn_Date.val());

        if ($objDeparture_Date.val() > $objReturn_Date.val() && $objDeparture_Date.val() != "") {
            $objDeparture_Date.val($objReturn_Date.val());
        }
    });

    $jQueryBookings(".blueskybooking-widget-search-departure_location_id, .blueskybooking-widget-search-arrival_location_id, .blueskybooking-widget-search-return_location_id, .blueskybooking-widget-search-departure_date").focus(function (e) {
        $jQueryBookings(this).removeClass("blueskybooking-widget-search-error");
    })

    $jQueryBookings(".blueskybooking-widget-search-return").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $jQueryBookings(".blueskybooking-widget-search-return_date[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
        $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
    });

    $jQueryBookings(".blueskybooking-widget-search-return_date").focus(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $objReturn = $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']")

        $jQueryBookings(".blueskybooking-widget-search-return-pickup[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
        $jQueryBookings(".blueskybooking-widget-search-return-dropoff[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");

        if ($objReturn.prop("checked")) {
            $jQueryBookings(this).removeClass("blueskybooking-widget-search-error");
        }
    });

    $jQueryBookings(".blueskybooking-widget-search-return_location").click(function (e) {
        $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
    });

    $jQueryBookings(".blueskybooking-widget-search-transport").focus(function (e) {
        $jQueryBookings(this).removeClass("blueskybooking-widget-search-error");
    });

    $jQueryBookings(".blueskybooking-widget-search-transport").change(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $jQueryBookings(".blueskybooking-widget-search-transport[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
    });

    $jQueryBookings(".blueskybooking-widget-search-types-toggle").click(function (e) {
        $strGroup = $jQueryBookings(this).attr("data-Group");

        $jQueryBookings(".blueskybooking-widget-search-types[data-Group='" + $strGroup + "']").toggle();

        if ($jQueryBookings(".blueskybooking-widget-search-types-model[data-Group='" + $strGroup + "']").is(":visible")) {
            $jQueryBookings(".blueskybooking-widget-search-types-toggle[data-Group='" + $strGroup + "']").addClass("blueskybooking-widget-search-types-toggle-open");
        } else {
            $jQueryBookings(".blueskybooking-widget-search-types-toggle[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-types-toggle-open");
        }
    });

    // Departure / Return Date Picker
    var $objBookingDates = $jQueryBookings("input[type='text'].blueskybooking-widget-search-departure_date, INPUT[type='text'].blueskybooking-widget-search-return_date");

    switch ($objBookingDates.length) {
        case 1:
            var $objBookingDatePicker = $objBookingDates.datepicker();
        case 2:
            var $objBookingDates = $objBookingDates.datepicker({
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
                dateFormat: $strDateFormat,
                onSelect: function (selectedDate) {
                    $strGroup = $jQueryBookings("input[Type='text'].blueskybooking-widget-search-departure_date").attr("data-Group");
                    var option =
                        this.id == $jQueryBookings("input[Type='text'].blueskybooking-widget-search-departure_date").attr('ID') ? "minDate" : "maxDate",
                        instance = $jQueryBookings(this).data("datepicker"),
                        date = $jQueryBookings.datepicker.parseDate(instance.settings.dateFormat || $jQueryBookings.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                    $objBookingDates.not(this).datepicker("option", option, date);

                    $jQueryBookings("input[Type='text'].blueskybooking-widget-search-departure_date[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
                    $jQueryBookings("input[Type='text'].blueskybooking-widget-search-return_date[data-Group='" + $strGroup + "']").removeClass("blueskybooking-widget-search-error");
                }
            });
        default:
    }

    function searchSwap() {
        var $intDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']").val();
        var $intArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']").val();

        $intDeparture_Location_ID = Math.max($intDeparture_Location_ID, 0);
        $intArrival_Location_ID = Math.max($intArrival_Location_ID, 0);

        $jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']"), $intArrival_Location_ID);
        $jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']"), $intDeparture_Location_ID);

        // Automatically set the return location
        $jQueryBookings.fn.GetLocations($jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']").val(), -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']"), -1);
    };

    function searchReset() {
        var $intDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']").val();
        var $intArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']").val();

        $jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']"), 0);
        $jQueryBookings.fn.GetLocations(-1, -1, $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']"), 0);

        // Automatically set the return location
        $jQueryBookings.fn.GetLocations($jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']").val(), -1, $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']"), -1);
    };

    function searchTypesTotal() {
        var $intTotal = 0;

        var $objTypes = $jQueryBookings(".blueskybooking-widget-search-types-model[data-Group='" + $strGroup + "']:has([Weight_ID]) .blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']");

        if ($objTypes.length == 0) {
            return undefined;
        }

        $objTypes.each(function (e) {
            $intTotal = $intTotal + parseInt($jQueryBookings(this).val());
        });

        return $intTotal
    }

    function gAddOptionRequest($chrURL) {
        $objRequestDeparture = $jQueryBookings(".blueskybooking-request-departure[data-Group='" + $strGroup + "']");
        $objRequestReturn = $jQueryBookings(".blueskybooking-request-return[data-Group='" + $strGroup + "']");

        if ($objRequestDeparture.prop("checked")) {
            $objRequestDepartureSection = $jQueryBookings("input.blueskybooking-request-departure-section[data-Group='" + $strGroup + "']");

            $objRequestDepartureSchedule = $jQueryBookings("input.blueskybooking-request-departure-schedule[data-Group='" + $strGroup + "']");
            $objRequestDepartureDate = $jQueryBookings("input.blueskybooking-request-departure-date[data-Group='" + $strGroup + "']");
            $objRequestDepartureDeparture_Time = $jQueryBookings("input.blueskybooking-request-departure-departure_time[data-Group='" + $strGroup + "']");
            $objRequestDepartureDeparture_Location = $jQueryBookings("input.blueskybooking-request-departure-departure_location[data-Group='" + $strGroup + "'], select.blueskybooking-request-departure-departure_location[data-Group='" + $strGroup + "'] option:selected");
            $objRequestDepartureArrival_Time = $jQueryBookings("input.blueskybooking-request-departure-arrival_time[data-Group='" + $strGroup + "']");
            $objRequestDepartureArrival_Location = $jQueryBookings("input.blueskybooking-request-departure-arrival_location[data-Group='" + $strGroup + "'], select.blueskybooking-request-departure-arrival_location[data-Group='" + $strGroup + "'] option:selected");
            $objRequestDepartureClass = $jQueryBookings("input.blueskybooking-request-departure-class[data-Group='" + $strGroup + "']");
            $objRequestDepartureTier = $jQueryBookings("input.blueskybooking-request-departure-tier[data-Group='" + $strGroup + "']");
            $objRequestDepartureWarning = $jQueryBookings("input.blueskybooking-request-departure-warning[data-Group='" + $strGroup + "']");
            $objRequestDepartureTotal = $jQueryBookings("input.blueskybooking-request-departure-total[data-Group='" + $strGroup + "']");
            $objRequestDepartureAdvisory = $jQueryBookings("input.blueskybooking-request-departure-advisory[data-Group='" + $strGroup + "']");
            $objRequestDepartureInformation = $jQueryBookings("input.blueskybooking-request-departure-information[data-Group='" + $strGroup + "']");
            $objRequestDepartureOptions = $jQueryBookings("input.blueskybooking-request-departure-options[data-Group='" + $strGroup + "']");
            $objRequestDepartureFeatures = $jQueryBookings("input.blueskybooking-request-departure-features[data-Group='" + $strGroup + "']");
            $objRequestDepartureComments = $jQueryBookings("input.blueskybooking-request-departure-comments[data-Group='" + $strGroup + "']");

            $chrURL = $chrURL
                + "&Request.Departure=1"
                + ($objRequestDepartureSection.val() !== undefined ? "&Request.Departure.Section=" + $objRequestDepartureSection.val() : "")
                + ($objRequestDepartureSchedule.val() !== undefined ? "&Request.Departure.Schedule=" + $objRequestDepartureSchedule.val() : "")
                + ($objRequestDepartureDate.val() !== undefined ? "&Request.Departure.Date=" + $objRequestDepartureDate.val() : "")
                + ($objRequestDepartureDeparture_Time.val() !== undefined ? "&Request.Departure.Departure_Time=" + $objRequestDepartureDeparture_Time.val() : "")
                + ($objRequestDepartureDeparture_Location.prop("nodeName") == "INPUT" ?
                    $objRequestDepartureDeparture_Location.val() !== undefined ? "&Request.Departure.Departure_Location=" + $objRequestDepartureDeparture_Location.val() : ""
                    : $objRequestDepartureDeparture_Location.prop("nodeName") == "OPTION" ?
                        $objRequestDepartureDeparture_Location.text() !== undefined ? "&Request.Departure.Departure_Location=" + $objRequestDepartureDeparture_Location.text() : ""
                        : ""
                )
                + ($objRequestDepartureArrival_Time.val() !== undefined ? "&Request.Departure.Arrival_Time=" + $objRequestDepartureArrival_Time.val() : "")
                + ($objRequestDepartureArrival_Location.prop("nodeName") == "INPUT" ?
                    $objRequestDepartureArrival_Location.val() !== undefined ? "&Request.Departure.Arrival_Location=" + $objRequestDepartureArrival_Location.val() : ""
                    : $objRequestDepartureArrival_Location.prop("nodeName") == "OPTION" ?
                        $objRequestDepartureArrival_Location.text() !== undefined ? "&Request.Departure.Arrival_Location=" + $objRequestDepartureArrival_Location.text() : ""
                        : ""
                )
                + ($objRequestDepartureClass.val() !== undefined ? "&Request.Departure.Class=" + $objRequestDepartureClass.val() : "")
                + ($objRequestDepartureTier.val() !== undefined ? "&Request.Departure.Tier=" + $objRequestDepartureTier.val() : "")
                + ($objRequestDepartureWarning.val() !== undefined ? "&Request.Departure.Warning=" + $objRequestDepartureWarning.val() : "")
                + ($objRequestDepartureTotal.val() !== undefined ? "&Request.Departure.Total=" + $objRequestDepartureTotal.val() : "")
                + ($objRequestDepartureAdvisory.val() !== undefined ? "&Request.Departure.Advisory=" + $objRequestDepartureAdvisory.val() : "")
                + ($objRequestDepartureInformation.val() !== undefined ? "&Request.Departure.Information=" + $objRequestDepartureInformation.val() : "")
                + ($objRequestDepartureOptions.val() !== undefined ? "&Request.Departure.Options=" + $objRequestDepartureOptions.val() : "")
                + ($objRequestDepartureFeatures.val() !== undefined ? "&Request.Departure.Features=" + $objRequestDepartureFeatures.val() : "")
                + ($objRequestDepartureComments.val() !== undefined ? "&Request.Departure.Comments=" + $objRequestDepartureComments.val() : "")
                ;

            $objRequestEmail = $jQueryBookings("input.blueskybooking-request-email[data-Group='" + $strGroup + "']");

            $chrURL = $chrURL
                + "&Request.Email=" + $objRequestEmail.val()
                ;
        }
        if ($objRequestReturn.prop("checked")) {
            $objRequestReturnSection = $jQueryBookings("input.blueskybooking-request-return-section[data-Group='" + $strGroup + "']");

            $objRequestReturnSchedule = $jQueryBookings("input.blueskybooking-request-return-schedule[data-Group='" + $strGroup + "']");
            $objRequestReturnDate = $jQueryBookings("input.blueskybooking-request-return-date[data-Group='" + $strGroup + "']");
            $objRequestReturnDeparture_Time = $jQueryBookings("input.blueskybooking-request-return-departure_time[data-Group='" + $strGroup + "']");
            $objRequestReturnDeparture_Location = $jQueryBookings("input.blueskybooking-request-return-departure_location[data-Group='" + $strGroup + "']");
            $objRequestReturnArrival_Time = $jQueryBookings("input.blueskybooking-request-return-arrival_time[data-Group='" + $strGroup + "']");
            $objRequestReturnArrival_Location = $jQueryBookings("input.blueskybooking-request-return-arrival_location[data-Group='" + $strGroup + "']");
            $objRequestReturnClass = $jQueryBookings("input.blueskybooking-request-return-class[data-Group='" + $strGroup + "']");
            $objRequestReturnTier = $jQueryBookings("input.blueskybooking-request-return-tier[data-Group='" + $strGroup + "']");
            $objRequestReturnWarning = $jQueryBookings("input.blueskybooking-request-return-warning[data-Group='" + $strGroup + "']");
            $objRequestReturnTotal = $jQueryBookings("input.blueskybooking-request-return-total[data-Group='" + $strGroup + "']");
            $objRequestReturnAdvisory = $jQueryBookings("input.blueskybooking-request-return-advisory[data-Group='" + $strGroup + "']");
            $objRequestReturnInformation = $jQueryBookings("input.blueskybooking-request-return-information[data-Group='" + $strGroup + "']");
            $objRequestReturnOptions = $jQueryBookings("input.blueskybooking-request-return-options[data-Group='" + $strGroup + "']");
            $objRequestReturnFeatures = $jQueryBookings("input.blueskybooking-request-return-features[data-Group='" + $strGroup + "']");
            $objRequestReturnComments = $jQueryBookings("input.blueskybooking-request-return-comments[data-Group='" + $strGroup + "']");

            $chrURL = $chrURL
                + "&Request.Return=1"
                + ($objRequestReturnSection.val() !== undefined ? "&Request.Return.Section=" + $objRequestReturnSection.val() : "")
                + ($objRequestReturnSchedule.val() !== undefined ? "&Request.Return.Schedule=" + $objRequestReturnSchedule.val() : "")
                + ($objRequestReturnDate.val() !== undefined ? "&Request.Return.Date=" + $objRequestReturnDate.val() : "")
                + ($objRequestReturnDeparture_Time.val() !== undefined ? "&Request.Return.Departure_Time=" + $objRequestReturnDeparture_Time.val() : "")
                + ($objRequestReturnDeparture_Location.val() !== undefined ? "&Request.Return.Departure_Location=" + $objRequestReturnDeparture_Location.val() : "")
                + ($objRequestReturnArrival_Time.val() !== undefined ? "&Request.Return.Arrival_Time=" + $objRequestReturnArrival_Time.val() : "")
                + ($objRequestReturnArrival_Location.val() !== undefined ? "&Request.Return.Arrival_Location=" + $objRequestReturnArrival_Location.val() : "")
                + ($objRequestReturnClass.val() !== undefined ? "&Request.Return.Class=" + $objRequestReturnClass.val() : "")
                + ($objRequestReturnTier.val() !== undefined ? "&Request.Return.Tier=" + $objRequestReturnTier.val() : "")
                + ($objRequestReturnWarning.val() !== undefined ? "&Request.Return.Warning=" + $objRequestReturnWarning.val() : "")
                + ($objRequestReturnTotal.val() !== undefined ? "&Request.Return.Total=" + $objRequestReturnTotal.val() : "")
                + ($objRequestReturnAdvisory.val() !== undefined ? "&Request.Return.Advisory=" + $objRequestReturnAdvisory.val() : "")
                + ($objRequestReturnInformation.val() !== undefined ? "&Request.Return.Information=" + $objRequestReturnInformation.val() : "")
                + ($objRequestReturnOptions.val() !== undefined ? "&Request.Return.Options=" + $objRequestReturnOptions.val() : "")
                + ($objRequestReturnFeatures.val() !== undefined ? "&Request.Return.Features=" + $objRequestReturnFeatures.val() : "")
                + ($objRequestReturnComments.val() !== undefined ? "&Request.Return.Comments=" + $objRequestReturnComments.val() : "")
                ;
        }

        return $chrURL;
    };

    // Lookup Booking

    $jQueryBookings(".blueskybooking-widget-lookup-booking").focus(function (e) {
        $jQueryBookings(".blueskybooking-widget-lookup-booking").removeClass("blueskybooking-widget-search-error");
    });

    // Widget Validation
    $jQueryBookings('.blueskybooking-launch').click(function (event) {
        event.preventDefault();

        $strGroup = $jQueryBookings(this).attr("data-Group");

        var $chrURL = $jQueryBookings(this).attr("href");

        if ($jQueryBookings(this).hasClass("blueskybooking-widget-book")) {
            //if ($jQueryBookings(this).attr("data-Group") !== undefined) { $strGroup = $jQueryBookings(this).attr("data-Group") }

            //alert($jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']").length);

            $chrURL = $chrBookingURL;

            var $bitValidation = true;

            var $objDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-search-departure_location_id[data-Group='" + $strGroup + "']");
            var $objArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-search-arrival_location_id[data-Group='" + $strGroup + "']");
            var $objReturn_Location = $jQueryBookings(".blueskybooking-widget-search-return_location[data-Group='" + $strGroup + "']");
            var $objReturn_Location_ID = $jQueryBookings(".blueskybooking-widget-search-return_location_id[data-Group='" + $strGroup + "']");

            var $objDeparturePickup = $jQueryBookings(".blueskybooking-widget-search-departure-pickup[data-Group='" + $strGroup + "']");
            var $objDepartureDropoff = $jQueryBookings(".blueskybooking-widget-search-departure-dropoff[data-Group='" + $strGroup + "']");
            var $objReturnPickup = $jQueryBookings(".blueskybooking-widget-search-return-pickup[data-Group='" + $strGroup + "']");
            var $objReturnDropoff = $jQueryBookings(".blueskybooking-widget-search-return-dropoff[data-Group='" + $strGroup + "']");

            if ($objReturnPickup.val() === undefined) { $objReturnPickup = $objDepartureDropoff };
            if ($objReturnDropoff.val() === undefined) { $objReturnDropoff = $objDeparturePickup };

            var $objSegment_Type = $jQueryBookings(".blueskybooking-widget-search-segment-type[data-Group='" + $strGroup + "']");
            var $objSegment_ID = $jQueryBookings(".blueskybooking-widget-search-segment_id[data-Group='" + $strGroup + "']");

            var $objDeparture_Date = $jQueryBookings(".blueskybooking-widget-search-departure_date[data-Group='" + $strGroup + "']");
            var $objDeparture_Date_Range = $jQueryBookings(".blueskybooking-widget-search-departure_date_range[data-Group='" + $strGroup + "']");
            var $objDeparture_Time_Range = $jQueryBookings(".blueskybooking-widget-search-departure_time_range[data-Group='" + $strGroup + "']");

            var $objReturn = $jQueryBookings(".blueskybooking-widget-search-return[data-Group='" + $strGroup + "']");
            var $objReturn_Date = $jQueryBookings(".blueskybooking-widget-search-return_date[data-Group='" + $strGroup + "']");
            var $objReturn_Date_Range = $jQueryBookings(".blueskybooking-widget-search-return_date_range[data-Group='" + $strGroup + "']");
            var $objReturn_Time_Range = $jQueryBookings(".blueskybooking-widget-search-return_time_range[data-Group='" + $strGroup + "']");

            var $objSorting = $jQueryBookings(".blueskybooking-widget-search-sorting[data-Group='" + $strGroup + "']");

            var $objDeparture_Route_Class_Tier_ID = $jQueryBookings(".blueskybooking-widget-search-departure_route_class_tier_id[data-Group='" + $strGroup + "']");
            var $objReturn_Route_Class_Tier_ID = $jQueryBookings(".blueskybooking-widget-search-return_route_class_tier_id[data-Group='" + $strGroup + "']");

            var $objTypes = $jQueryBookings(".blueskybooking-widget-search-types-model[Weight_ID][data-Group='" + $strGroup + "']");

            var $objAgent_ID = $jQueryBookings(".blueskybooking-widget-search-agent_id[data-Group='" + $strGroup + "']");

            var $objCoupon = $jQueryBookings(".blueskybooking-widget-search-coupon[data-Group='" + $strGroup + "']");

            if (!$objDeparture_Location_ID.hasClass("blueskybooking-widget-search-location-unselected-allowed")) {
                if ($objDeparture_Location_ID.val() == -1) {
                    $objDeparture_Location_ID.addClass("blueskybooking-widget-search-error");

                    // $('html, body').animate({ scrollTop: $objDeparture_Location_ID.offset().top - 20 }, 'slow');

                    $bitValidation = false;
                }
            }

            if (!$objArrival_Location_ID.hasClass("blueskybooking-widget-search-location-unselected-allowed")) {
                if ($objArrival_Location_ID.val() == -1) {
                    $objArrival_Location_ID.addClass("blueskybooking-widget-search-error");
                    $bitValidation = false;
                }
            }

            // Required
            var $objTransportDeparture = [$objDepartureDropoff, $objDeparturePickup];
            $objTransportDeparture.forEach(function ($itmTransport) {
                if (!$itmTransport.prop("disabled")) {
                    if ($itmTransport.attr("data-Required") == "true") {
                        if ($itmTransport.val() == null || $itmTransport.val() == "") {
                            $itmTransport.addClass("blueskybooking-widget-search-error");
                            $bitValidation = false;
                        }
                    }
                }
            });

            if ($objReturn.prop("checked")) {
                var $objTransportReturn = [$objReturnPickup, $objReturnDropoff];
                $objTransportReturn.forEach(function ($itmTransport) {
                    if (!$itmTransport.prop("disabled")) {
                        if ($itmTransport.attr("data-Required") == "true") {
                            if ($itmTransport.val() == null || $itmTransport.val() == "") {
                                $itmTransport.addClass("blueskybooking-widget-search-error");
                                $bitValidation = false;
                            }
                        }
                    }
                });
            };

            var $datDateLocal = new Date();
            var $datToday = [$datDateLocal.getFullYear(), $datDateLocal.getMonth() + 1, $datDateLocal.getDate()];
            var $strToday = $datToday[0].pad(4) + '-' + $datToday[1].pad(2) + '-' + $datToday[2].pad(2);

            var $utcDeparture_Date = new Date($objDeparture_Date.val());
            var $utcReturn_Date = new Date($objReturn_Date.val());
            var $utcDateLocal = new Date($strToday.toString());

            //alert($utcDeparture_Date);
            //alert($utcReturn_Date);
            //alert($utcDateLocal);

            if ($objDeparture_Date.val() === undefined) {
            } else if (isNaN(Date.parse($objDeparture_Date.val())) == true) {
                $objDeparture_Date.addClass("blueskybooking-widget-search-error");
                $bitValidation = false;
            } else if (Date.parse($utcDeparture_Date.toLocaleDateString()) < Date.parse($utcDateLocal.toLocaleDateString())) {
                $objDeparture_Date.addClass("blueskybooking-widget-search-error");
                $bitValidation = false;
            } else if (Date.parse($utcDeparture_Date.toLocaleDateString()) > Date.parse($utcReturn_Date.toLocaleDateString())) {
                $objDeparture_Date.addClass("blueskybooking-widget-search-error");
                $bitValidation = false;
            }

            if ($objReturn.prop("checked")) {
                if (isNaN(Date.parse($objReturn_Date.val())) == true) {
                    $objReturn_Date.addClass("blueskybooking-widget-search-error");
                    $bitValidation = false;
                }
            }

            if ($objReturn.prop("checked")) {
                if ($objReturn_Location.prop("checked")) {
                    if ($objReturn_Location_ID.val() == null) {
                        $objReturn_Location_ID.addClass("blueskybooking-widget-search-error");
                        $bitValidation = false;
                    }
                    if ($objReturn_Location_ID.val() == -1) {
                        $objReturn_Location_ID.addClass("blueskybooking-widget-search-error");
                        $bitValidation = false;
                    }
                }
            }

            // Stop if maximum passengers reached

            var $intMinimum = $intMinimumDefault;
            var $intMaximum = $intMaximumDefault;

            $jQueryBookings(".blueskybooking-widget-search-types-minimum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMinimum = parseInt($jQueryBookings(this).val());
            });

            $jQueryBookings(".blueskybooking-widget-search-types-maximum[data-Group='" + $strGroup + "']").first().each(function (e) {
                $intMaximum = parseInt($jQueryBookings(this).val());
            });

            if (searchTypesTotal() == undefined) {
            } else if (searchTypesTotal() < $intMinimum || searchTypesTotal() > $intMaximum) {
                $jQueryBookings(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").addClass("blueskybooking-widget-search-error");
                $jQueryBookings(".blueskybooking-widget-search-types[data-Group='" + $strGroup + "']").show();
                if (searchTypesTotal() < $intMinimum) {
                    $jQueryBookings(".blueskybooking-widget-search-types-minimum-warning[data-Group='" + $strGroup + "']").show();
                }
                if (searchTypesTotal() > $intMaximum) {
                    $jQueryBookings(".blueskybooking-widget-search-types-maximum-warning[data-Group='" + $strGroup + "']").show();
                }
                $jQueryBookings(".blueskybooking-widget-search-types-toggle[data-Group='" + $strGroup + "']").addClass("blueskybooking-widget-search-types-toggle-open");
                $bitValidation = false;
            }

            //var $bitValidationTypes = false;

            //$objTypes.each(function (e) {
            //  var $intTotal = $jQueryBookings(this).find(".blueskybooking-widget-search-types-total").val();
            //  if ($intTotal > 0) {
            //    $bitValidationTypes = true;
            //    return false;
            //  }
            //});

            //if (!$bitValidationTypes) {
            //  $objTypes.find(".blueskybooking-widget-search-types-total").addClass("blueskybooking-widget-search-error");
            //  $bitValidation = false;
            //}

            // console.log("$bitValidation: " + $bitValidation);

            if (!$bitValidation) {
                if (typeof fnBookingBookValidated == 'function') {
                    fnBookingBookValidated(false);
                }

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                return false;
            }

            $chrURL = $chrURL + "&Action=Booking";
            if ($objDeparture_Location_ID.val() !== undefined) { $chrURL = $chrURL + "&Departure_Location_ID=" + $objDeparture_Location_ID.val(); }
            if ($objArrival_Location_ID.val() !== undefined) { $chrURL = $chrURL + "&Arrival_Location_ID=" + $objArrival_Location_ID.val(); }
            if ($objReturn_Location.prop("checked") !== undefined) { $chrURL = $chrURL + "&Return_Location=" + ($objReturn_Location.prop("checked") ? "1" : "0"); }
            if ($objReturn_Location_ID.val() !== undefined && $objReturn_Location_ID.val() != null) { $chrURL = $chrURL + "&Return_Location_ID=" + $objReturn_Location_ID.val(); } // ($objReturn_Location.prop("checked") ? $objReturn_Location_ID.val() : "-1"); }
            if ($objDeparturePickup.val() !== undefined && $objDeparturePickup.val() != null) { $chrURL = $chrURL + "&Departure_Pickup=" + encodeURIComponent($objDeparturePickup.val()); }
            if ($objDepartureDropoff.val() !== undefined && $objDepartureDropoff.val() != null) { $chrURL = $chrURL + "&Departure_Dropoff=" + encodeURIComponent($objDepartureDropoff.val()); }
            if ($objReturnPickup.val() !== undefined && $objReturnPickup.val() != null) { $chrURL = $chrURL + "&Return_Pickup=" + encodeURIComponent($objReturnPickup.val()); }
            if ($objReturnDropoff.val() !== undefined && $objReturnDropoff.val() != null) { $chrURL = $chrURL + "&Return_Dropoff=" + encodeURIComponent($objReturnDropoff.val()); }
            if ($objSegment_Type.val() !== undefined) { $chrURL = $chrURL + "&Segment_Type=" + $objSegment_Type.val(); }
            if ($objSegment_ID.val() !== undefined) { $chrURL = $chrURL + "&Segment_ID=" + $objSegment_ID.val(); }
            if ($utcDeparture_Date !== undefined) { $chrURL = $chrURL + "&Departure_Date=" + $utcDeparture_Date.getUTCFullYear() + '-' + ($utcDeparture_Date.getUTCMonth() + 1) + '-' + $utcDeparture_Date.getUTCDate(); }
            //if ($utcDeparture_Date !== undefined) { $chrURL = $chrURL + "&Departure_Date=" + $utcDeparture_Date.getFullYear() + '-' + ($utcDeparture_Date.getMonth() + 1) + '-' + $utcDeparture_Date.getDate(); }
            if ($objDeparture_Date_Range.val() !== undefined) { $chrURL = $chrURL + "&Departure_Date_Range=" + $objDeparture_Date_Range.val(); }
            if ($objDeparture_Time_Range.val() !== undefined) { $chrURL = $chrURL + "&Departure_Time_Range=" + $objDeparture_Time_Range.val(); }
            if ($objReturn.prop("checked") !== undefined) { $chrURL = $chrURL + "&Return=" + ($objReturn.prop("checked") ? "1" : "0"); }
            if ($utcReturn_Date !== undefined && $objReturn_Date.val() != null) { $chrURL = $chrURL + "&Return_Date=" + $utcReturn_Date.getUTCFullYear() + '-' + ($utcReturn_Date.getUTCMonth() + 1) + '-' + $utcReturn_Date.getUTCDate(); }
            //if ($utcReturn_Date !== undefined) { $chrURL = $chrURL + "&Return_Date=" + $utcReturn_Date.getFullYear() + '-' + ($utcReturn_Date.getMonth() + 1) + '-' + $utcReturn_Date.getDate(); }
            if ($objReturn_Date_Range.val() !== undefined) { $chrURL = $chrURL + "&Return_Date_Range=" + $objReturn_Date_Range.val(); }
            if ($objReturn_Time_Range.val() !== undefined) { $chrURL = $chrURL + "&Return_Time_Range=" + $objReturn_Time_Range.val(); }
            if ($objSorting.prop("checked") !== undefined) { $chrURL = $chrURL + "&Sorting=" + ($objSorting.prop("checked") ? "1" : "0"); }

            if ($objCoupon.val() !== undefined) { $chrURL = $chrURL + "&Coupon=" + $objCoupon.val(); }

            if ($objAgent_ID.val() !== undefined) { $chrURL = $chrURL + "&Agent_ID=" + $objAgent_ID.val(); }

            if ($objDeparture_Route_Class_Tier_ID.val() !== undefined) { $chrURL = $chrURL + "&Departure_Route_Class_Tier_ID=" + $objDeparture_Route_Class_Tier_ID.val(); }
            if ($objReturn_Route_Class_Tier_ID.val() !== undefined) { $chrURL = $chrURL + "&Return_Route_Class_Tier_ID=" + $objReturn_Route_Class_Tier_ID.val(); }

            $objTypes.each(function (e) {
                var $intWeight_ID = $jQueryBookings(this).attr("Weight_ID");
                var $intTotal = $jQueryBookings(this).find(".blueskybooking-widget-search-types-total[data-Group='" + $strGroup + "']").val();
                $chrURL = $chrURL
                    + "&Weight_ID[" + $intWeight_ID + "]=" + $intTotal;
            });

        } else if ($jQueryBookings(this).hasClass("blueskybooking-widget-status")) {
            $chrURL = $chrStatusURL;

            var $bitValidation = true;

            var $objDeparture_Location_ID = $jQueryBookings(".blueskybooking-widget-status-departure_location_id[data-Group='" + $strGroup + "']");
            var $objArrival_Location_ID = $jQueryBookings(".blueskybooking-widget-status-arrival_location_id[data-Group='" + $strGroup + "']");
            var $objDeparture_Date = $jQueryBookings(".blueskybooking-widget-status-departure_date[data-Group='" + $strGroup + "']");

            if (!$objDeparture_Location_ID.hasClass("blueskybooking-widget-status-location-unselected-allowed")) {
                if ($objDeparture_Location_ID.val() == -1) {
                    $objDeparture_Location_ID.addClass("blueskybooking-widget-search-error");
                    $bitValidation = false;
                }
            }

            if (!$objArrival_Location_ID.hasClass("blueskybooking-widget-status-location-unselected-allowed")) {
                if ($objArrival_Location_ID.val() == -1) {
                    $objArrival_Location_ID.addClass("blueskybooking-widget-search-error");
                    $bitValidation = false;
                }
            }

            if (!$bitValidation) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                return false;
            }

            if (isNaN(Date.parse($objDeparture_Date.val())) == false) {
                $chrURL = $chrURL
                    + "&Departure_Date=" + $objDeparture_Date.val();
            }

            if ($objDeparture_Location_ID.val() !== undefined) { $chrURL = $chrURL + "&Departure_Location_ID=" + $objDeparture_Location_ID.val(); }
            if ($objArrival_Location_ID.val() !== undefined) { $chrURL = $chrURL + "&Arrival_Location_ID=" + $objArrival_Location_ID.val(); }

        } else if ($jQueryBookings(this).hasClass("blueskybooking-widget-lookup")) {
            $chrURL = $chrLookupURL;

            var $bitValidation = true;

            var $objBooking_ID = $jQueryBookings(".blueskybooking-widget-lookup-booking");

            //var $objInvoice = $jQueryBookings(".blueskybooking-widget-lookup-invoice");

            //if ($objBooking_ID.val() === undefined && $objInvoice.val() === undefined) {
            //    if ($objBooking_ID.val() === undefined) {
            //        alert("Undefined: .blueskybooking-widget-lookup-booking");
            //    } else if ($objInvoice.val() === undefined) {
            //        alert("Undefined: .blueskybooking-widget-lookup-invoice");
            //    }
            //    $bitValidation = false;
            //};

            if ($objBooking_ID.val() === undefined) {
                alert("Undefined: .blueskybooking-widget-lookup-booking");
                $bitValidation = false;
            };

            if ($objBooking_ID.val() == "") {
                $objBooking_ID.addClass("blueskybooking-widget-search-error");
                $bitValidation = false;
            }

            if (isNaN($objBooking_ID.val())) {
                $objBooking_ID.addClass("blueskybooking-widget-search-error");
                $bitValidation = false;
            }

            if (!$bitValidation) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                return false;
            }

            $chrURL = $chrURL + "&Booking_ID=" + $objBooking_ID.val();

        }

        $chrURL = gAddOptionRequest($chrURL);

        $jQueryBookings(".blueskybooking-widget-link").prop("href", $chrURL);
        $jQueryBookings(".blueskybooking-widget-link").text($chrURL);

        if (isMobile.any == null) {
            if (bitThirdPartyCookies) {
                $jQueryBookings(this).attr("href", $chrURL);
            } else {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                // 3rd Party Cookies disabled
                var $objWindow = window.open($chrURL, '_blank');
                $objWindow.focus();
            }
        } else if (isMobile.iPad != null) {
            var $objWindow = window.open($chrURL, '_blank');
            $objWindow.focus();
        } else if (isMobile.any != null) {
            var $chrMobile = $chrURL;
            $chrMobile = $chrMobile.replace(/bookings.blueskybooking.com/, 'mobile.blueskybooking.com');
            $chrMobile = $chrMobile.replace(/localhost:55176/, 'localhost:63656');
            var $objWindow = window.open($chrMobile, '_self');
            $objWindow.focus();
        }
    });

    //launchDesktop($chrDesktop);

    //// Desktop version (Same Window/Fancybox, Desktop)
    //$jQueryBookings('.blueskybooking-widget-book').click(function (event) {
    //  alert("widget");

    //  event.preventDefault();
    //  launchDesktop("http://www.cnn.com");
    //});

    if (isMobile.any == null) {
        // Desktop version (Same Window/Fancybox, Desktop)
        if (bitThirdPartyCookies) {
            $jQueryBookings('.blueskybooking-launch').fancybox({
                //href: $chrDesktop,
                iframe: {
                    preload: false
                },
                height: 950,
                width: 1000,
                maxWidth: 1000,
                margin: 15,
                autoSize: true,
                modal: true,
                //beforeShow: function () {
                //  $jQueryBookings("body").css({ 'overflow-y': 'hidden' });
                //},
                //afterClose: function () {
                //  $jQueryBookings("body").css({ 'overflow-y': 'visible' });
                //},
                //beforeLoad: function () {
                //},
                afterClose: function () {
                },
                afterLoad: function () {
                    if (this.modal) {
                        this.closeBtn = true;
                    }
                },
                //helpers: {
                //}
                scrolling: 'hidden',
                helpers: {
                    overlay: {
                        locked: true
                    }
                }
            });
            //} else {
            //  // 3rd Party Cookies disabled
            //  var $objWindow = window.open($chrDesktop, '_blank');
            //  $objWindow.focus();
        }
    }
    //else if (isMobile.iPad != null) {
    //  alert("ipad");
    //  // IPad version (New Window, Desktop)
    //  $jQueryBookings('.blueskybooking-widget-book').click(function (event) {
    //    event.preventDefault();

    //    var $chrDesktop = $jQueryBookings(this).attr("href");

    //    var $objWindow = window.open($chrDesktop, '_blank');
    //    $objWindow.focus();
    //  });
    //} else if (isMobile.any != null) {
    //  alert("mobile");
    //  // Mobile version (Same Window, Mobile)
    //  $jQueryBookings('.blueskybooking-widget-book').click(function (event) {
    //    event.preventDefault();

    //    var $chrDesktop = $jQueryBookings(this).attr("href");

    //    var $chrMobile = $chrDesktop.replace(/bookings.blueskybooking.com/, 'mobile.blueskybooking.com');
    //    var $objWindow = window.open($chrMobile, '_self');
    //    $objWindow.focus();
    //  });
    //};


    //launchDesktop = function ($chrDesktop) {

    //};

    // Automatic Window Close
    function listener(event) {
        // Valid Origin | Temporarily disabled for testing
        // if (event.origin !== "https://" + $strHost + ".blueskybooking.com/")
        //   return

        //alert(event.origin + " : " + event.data);

        // Add code for closing Iframe window
        if (typeof event.data === 'string' || event.data instanceof String) {
            if (event.data.substring(0, 6) == "launch") {
                alert("launch")

            } else if (event.data == "onclose") {
                // $jQueryBookings.dialog("close");
                $jQueryBookings.fancybox.close();
            }
        }
    }

    if (top.addEventListener) {
        top.addEventListener("message", listener, false)
    } else {
        top.attachEvent("onmessage", listener)
    }

    //function setCookie(cname, cvalue, exSeconds) {
    //  var d = new Date();
    //  d.setTime(d.getTime() + (exSeconds * 1000));
    //  var expires = "expires=" + d.toGMTString();
    //  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    //}

    //function deleteCookie(cname) {
    //  setCookie(cname, "", 0)
    //}

    //function getCookie(cname) {
    //  var name = cname + "=";
    //  var decodedCookie = decodeURIComponent(document.cookie);
    //  var ca = decodedCookie.split(';');
    //  for (var i = 0; i < ca.length; i++) {
    //    var c = ca[i];
    //    while (c.charAt(0) == ' ') {
    //      c = c.substring(1);
    //    }
    //    if (c.indexOf(name) == 0) {
    //      return c.substring(name.length, c.length);
    //    }
    //  }
    //  return;
    //}

    // Autoload fragment, if exists
    $jQueryBookings(".blueskybooking-widget-auto").trigger("click");
    // }

    // initializeBookingWidget();
});