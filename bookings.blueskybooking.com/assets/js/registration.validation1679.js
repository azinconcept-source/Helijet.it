/* Registration */
$(document).ready(function (e) {
    // Required fields
    $("input.ui-textbox-registration-email").bind("change", function (e) {
        $.fn.RequiredEmail($(this));
    }).each(function (e) {
        $.fn.RequiredEmail($(this));
    }).focus(function (e) {
        $(this).removeClass("ui-state-global-required");
    }).blur(function (e) {
        $.fn.RequiredEmail($(this));
    });

    // Capital First Letter
    // .ui-type-global-name / global.js
    $(".ui-type-global-company, .ui-type-global-address, .ui-type-global-city").change(function (e) {
        //console.log($(this).val());
        var $objCapsFirst = $(this);
        $objCapsFirst.val($.fn.CapsFirst($objCapsFirst.val()));
    });

    // Upper Case
    $(".ui-type-global-state").change(function (e) {
        var $objState = $(this);
        $objState.val($objState.val().toUpperCase());
    });

    // Zip/Postal Formatting
    $(".ui-type-global-zip").change(function (e) {
        var $objZip = $(this);
        $objZip.val($objZip.val().replace(/\s/g, '').toUpperCase());

        var regexObj = {
            canada: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i, //i for case-insensitive
            us: /^\d{5}(-\d{4})?$/
        }

        var regUS = new RegExp(regexObj.usa);
        var regCanada = new RegExp(regexObj.canada);

        // check for canada at first
        if (regCanada.test($objZip.val()) == true) {
            var $strPostal = $objZip.val();
            $strPostal = $strPostal.substr(0, 3) + ' ' + $strPostal.substr(3, 3);
            $objZip.val($strPostal);
        } else if (regUS.test($objZip.val()) == true) {
        }
    });

    // Lower Case
    $(".ui-type-global-email").change(function (e) {
        var $objEmail = $(this);
        $objEmail.val($objEmail.val().toLowerCase());
    });

    // Phone formatting
    $(".ui-type-global-phone").change(function (e) {
        var $objPhone = $(this);
        var $objNumber = $objPhone.val().replace(/[^0-9]/g, '');

        if ($objNumber.length == 10) {
            $objNumber = $objNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        };

        $objPhone.val($objNumber);
    });
});