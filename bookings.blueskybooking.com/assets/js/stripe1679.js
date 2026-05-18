//var PublishableKey = $('.ui-hidden-booking-payment-method-stripe-token');
// Create an instance of Elements.

// Create a Stripe client.
var $objStripeList = $(".ui-radiolist-booking-payment li span[data-Control='Stripe']");

$objStripeList.each(function () {
  var $objStripe = $(this);
  var $intPayment_ID = $objStripe.find("input[type='radio']").val();

  var PublishableKey = $objStripe.attr("data-publishablekey");
  var stripe = Stripe(PublishableKey);

  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  // (Note that this demo uses a wider set of styles than the guide below.)
  var style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  // Create an instance of the card Element.
  var $objCard = elements.create('card'); // , { style: style }

  //var $objStripeControl = $(".ui-booking-payment-method-control[data-Control='Stripe']");

  var $objStripeControl = $(".ui-booking-payment-method-stripe-elements");
  $objStripeControl.append("<div class=\"ui-booking-payment-method-stripe-card\" data-payment_id=\"" + $intPayment_ID + "\" />");
  $objStripeControl.append("<div class=\"ui-booking-payment-method-stripe-card-errors\" data-payment_id=\"" + $intPayment_ID + "\" />");
  $objStripeControl.append("<button class=\"ui-booking-payment-method-stripe-card-process\" data-payment_id=\"" + $intPayment_ID + "\">#" + $intPayment_ID + "</button>");
  //$objStripeControl.append("<div id='Stripe_" + $intPayment_ID + "' class='ui-booking-payment-method-stripe-card-errors' />");

  //var form = document.getElementById('payment-form');
  //var hiddenInput = document.createElement('input');
  //hiddenInput.setAttribute('type', 'hidden');
  //hiddenInput.setAttribute('name', 'stripeToken');
  //hiddenInput.setAttribute('value', token.id);
  //form.appendChild(hiddenInput);

  // Add an instance of the card Element into the `card-element` <div>.
  $objCard.mount(".ui-booking-payment-method-stripe-card[data-payment_id=\"" + $intPayment_ID + "\"]");
  //  card.mount("#" + "Stripe_" + $intPayment_ID);

  // Handle real-time validation errors from the card Element.
  $objCard.addEventListener('change', function (event) {
    var $objStripeError = $(".ui-booking-payment-method-stripe-card-errors[data-payment_id=\"" + $intPayment_ID + "\"]");
    if (event.error) {
      $objStripeError.html(event.error.message);
    } else {
      $objStripeError.html("");
    }
  });

  var $objStripeProcess = $(".ui-booking-payment-method-stripe-card-process[data-payment_id=\"" + $intPayment_ID + "\"]");

  //alert($objStripeProcess);

  $objStripeProcess.click(function (event) {
    stripe.createToken($objCard).then(function (result) {
      var $strReference = $(".ui-radiolist-booking-payment input[type='radio'][value='" + $intPayment_ID + "']").parent().data("reference");
      var $objStripeError = $(".ui-booking-payment-method-stripe-card-errors[data-payment_id=\"" + $intPayment_ID + "\"]");

      if (result.error) {
        $objStripeError.html(result.error.message);
        $intOffset = $(".ui-booking-payment").offset().top - 20;
        $('html, body').animate({ scrollTop: $intOffset }, 'slow');

      } else if ($strReference !== result.token.card.brand && $strReference !== null) {
        $objStripeError.html("" + result.token.card.brand + " card is not supported for the selected payment.");
        $intOffset = $(".ui-booking-payment").offset().top - 20;
        $('html, body').animate({ scrollTop: $intOffset }, 'slow');

      } else {
        $(".ui-hidden-booking-payment-method-stripe-token").val(result.token.id);
        $(".ui-button-booking-book-final").trigger("click");

        return true;
      }
    });
    event.preventDefault();
  });

});

$(".ui-radiolist-booking-payment span[data-Control='Stripe'] input[type='radio']").click(function (e) {
  var $objPaymentList = $(this);
  var $intPayment_ID = $objPaymentList.val();

  $(".ui-booking-payment-method-stripe-card").hide();
  $(".ui-booking-payment-method-stripe-card-errors").hide();
  $(".ui-booking-payment-method-stripe-card-process").hide();
  $(".ui-booking-payment-method-stripe-card[data-payment_id=\"" + $intPayment_ID + "\"]").show();
  $(".ui-booking-payment-method-stripe-card-errors[data-payment_id=\"" + $intPayment_ID + "\"]").show();
  //$(".ui-booking-payment-method-stripe-card-process[data-payment_id=\"" + $intPayment_ID + "\"]").show();
});

$(".ui-radiolist-booking-payment span[data-Control='Stripe'] input[type='radio']:checked").each(function (e) {
  var $objPaymentList = $(this);
  var $intPayment_ID = $objPaymentList.val();

  $(".ui-booking-payment-method-stripe-card").hide();
  $(".ui-booking-payment-method-stripe-card-errors").hide();
  $(".ui-booking-payment-method-stripe-card-process").hide();
  $(".ui-booking-payment-method-stripe-card[data-payment_id=\"" + $intPayment_ID + "\"]").show();
  $(".ui-booking-payment-method-stripe-card-errors[data-payment_id=\"" + $intPayment_ID + "\"]").show();
  //$(".ui-booking-payment-method-stripe-card-process[data-payment_id=\"" + $intPayment_ID + "\"]").show();
});
