
var debug_ignore_cookie = false;
var debug_ssl_alwaysFail = false;
var debug_return_unexpectedError = false;
var verificationUrl = "https://www.howsmyssl.com/a/check";

//---------------------------------------------------------------------
function VerifySsl(ignoreCookie) {
  // Temporary Fix
  return true;

  if (!ignoreCookie && !debug_ignore_cookie) {
    var sslCookie = SslSecurity_GetCookie("tlsTransportVerified");

    if (sslCookie != "") {
      SslSecurity_DisplayTestResult("There has not been any issue found with the SSL version in this browser<br/>Cookie = " + sslCookie);
      return;
    }
  }

  GetSslTransport();
}

//---------------------------------------------------------------------
function GetSslTransport() {
  $.ajax({ url: verificationUrl, success: OnSuccess, error: OnError, dataType: "json" });
}

//---------------------------------------------------------------------
function OnSuccess(result) {
  try {
    EnsureSecurity(result.tls_version);
  }
  catch (err) {
    OnUnexpectedError()
  }

}

//---------------------------------------------------------------------
function OnError(result) {
  try {
    ShowWarning();
    //alert("Call failed");
    SslSecurity_DisplayTestResult("API Error contacting " + verificationUrl);
    //$(".ui-panel-global-ssl").show();
    //window.location.replace("https://blueskybooking.zendesk.com/hc/en-us/articles/205880296");
  }
  catch (err) {
  }
}

//---------------------------------------------------------------------
function OnUnexpectedError() {
  try {
    ShowWarning();
    //alert("Unexpected error");
    SslSecurity_DisplayTestResult("Unexpected error." + verificationUrl);
    //$(".ui-panel-global-ssl").show();
    //window.location.replace("https://blueskybooking.zendesk.com/hc/en-us/articles/205880296");
  }
  catch (err) {
  }
}

//---------------------------------------------------------------------
function EnsureSecurity(tlsVersion) {
  if (SslSecurity_IsSecure(tlsVersion)) {
    SslSecurity_SetCookie("tlsTransportVerified", tlsVersion, 1);
    SslSecurity_DisplayTestResult("There has not been any issue found with the SSL version in this browser<br/>API = " + verificationUrl + "<br/> version: " + tlsVersion);
  }
  else {
    ShowWarning();
    //window.location.href = "sslerror.htm";
    //$(".ui-panel-global-ssl").show();
    //window.location.replace("https://blueskybooking.zendesk.com/hc/en-us/articles/205880296");
  }
}

//---------------------------------------------------------------------
function SslSecurity_IsSecure(tlsVersion) {
  return !debug_ssl_alwaysFail
      && tlsVersion.toLowerCase().indexOf("ssl") == -1;
}

//---------------------------------------------------------------------
function SslSecurity_DisplayTestResult(strMessage) {
  //$("#SslTestResult").html(strMessage);
}

//---------------------------------------------------------------------
function SslSecurity_GetCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

//---------------------------------------------------------------------
function SslSecurity_SetCookie(cname, cvalue, exdays) {
  var d = new Date();
  var currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  currentDate.setTime(currentDate.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + currentDate.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function ShowWarning() {
  $(".ui-panel-global-ssl").show();
  $(".ui-page-global").addClass("ui-state-disabled").hide();
  $(".ui-page-global select, .ui-page-global input").bind("focus keydown keyup change mouseover hover mousedown mouseup click", function (e) {
    return false;
  });

}
