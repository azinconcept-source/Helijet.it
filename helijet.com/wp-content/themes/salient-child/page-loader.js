/**
 * Helijet Page-Transition Loader
 * Shows a full-screen spinning loader for 12 seconds before any
 * link or button that would navigate to another page.
 */
(function () {
  'use strict';

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '#hj-page-loader{',
      'display:none;',
      'position:fixed;',
      'inset:0;',
      'z-index:999999;',
      'background:rgba(13,43,107,0.94);',
      'backdrop-filter:blur(6px);',
      '-webkit-backdrop-filter:blur(6px);',
      'align-items:center;',
      'justify-content:center;',
      'flex-direction:column;',
      'gap:28px;',
    '}',
    '#hj-page-loader.hj-loading{display:flex;}',

    /* Helicopter SVG spinner */
    '#hj-loader-spinner{',
      'width:80px;height:80px;',
      'position:relative;',
    '}',
    '.hj-ring{',
      'position:absolute;',
      'inset:0;',
      'border-radius:50%;',
      'border:4px solid transparent;',
    '}',
    '.hj-ring-outer{',
      'border-top-color:#4a90e2;',
      'border-right-color:#4a90e2;',
      'animation:hjSpin 1.1s linear infinite;',
    '}',
    '.hj-ring-inner{',
      'inset:12px;',
      'border-bottom-color:#cce0ff;',
      'border-left-color:#cce0ff;',
      'animation:hjSpin 0.7s linear infinite reverse;',
    '}',
    '.hj-ring-dot{',
      'position:absolute;',
      'inset:34px;',
      'border-radius:50%;',
      'background:#fff;',
      'animation:hjPulse 1.1s ease-in-out infinite;',
    '}',
    '@keyframes hjSpin{to{transform:rotate(360deg)}}',
    '@keyframes hjPulse{0%,100%{opacity:.5;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}',

    '#hj-loader-text{',
      'color:#cce0ff;',
      'font-family:"Open Sans",sans-serif;',
      'font-size:14px;',
      'font-weight:600;',
      'letter-spacing:.5px;',
      'text-align:center;',
    '}',
    '#hj-loader-sub{',
      'color:rgba(200,220,255,.55);',
      'font-family:"Open Sans",sans-serif;',
      'font-size:12px;',
      'margin-top:-18px;',
      'text-align:center;',
    '}',

    /* Animated dots */
    '#hj-loader-text .dots{display:inline-block}',
    '#hj-loader-text .dots span{animation:hjDot 1.4s infinite;display:inline-block}',
    '#hj-loader-text .dots span:nth-child(2){animation-delay:.2s}',
    '#hj-loader-text .dots span:nth-child(3){animation-delay:.4s}',
    '@keyframes hjDot{0%,80%,100%{opacity:0;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}'
  ].join('');
  document.head.appendChild(style);

  /* ── Inject HTML overlay ── */
  var overlay = document.createElement('div');
  overlay.id = 'hj-page-loader';
  overlay.innerHTML =
    '<div id="hj-loader-spinner">' +
      '<div class="hj-ring hj-ring-outer"></div>' +
      '<div class="hj-ring hj-ring-inner"></div>' +
      '<div class="hj-ring-dot"></div>' +
    '</div>' +
    '<div id="hj-loader-text">Loading<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>' +
    '<div id="hj-loader-sub">Please wait while we prepare your page</div>';
  document.body.appendChild(overlay);

  /* ── Helper: show loader then navigate ── */
  function showLoaderAndGo(url) {
    if (!url || url === '#' || url === 'javascript:void(0)' || url === 'javascript:;') return;
    // Don't block mailto / tel links
    if (/^(mailto:|tel:|#)/.test(url)) return;

    overlay.classList.add('hj-loading');
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      window.location.href = url;
    }, 12000);
  }

  /* ── Intercept clicks ── */
  document.addEventListener('click', function (e) {
    /* Find nearest anchor or button with data-href */
    var el = e.target;
    while (el && el !== document.body) {
      /* Anchor tags that navigate */
      if (el.tagName === 'A') {
        var href = el.getAttribute('href');
        if (href && !/^(#|javascript|mailto|tel)/.test(href)) {
          /* Skip if it opens a new tab */
          if (el.target === '_blank') return;
          e.preventDefault();
          showLoaderAndGo(href);
          return;
        }
        return; // let normal hash / mailto links through
      }

      /* Buttons with onclick containing window.location */
      if (el.tagName === 'BUTTON') {
        var onclickAttr = el.getAttribute('onclick') || '';
        if (/window\.location/.test(onclickAttr)) {
          /* Extract URL from the onclick attribute */
          var match = onclickAttr.match(/window\.location\s*(?:\.href\s*)?=\s*['"]([^'"]+)['"]/);
          if (match) {
            e.preventDefault();
            e.stopImmediatePropagation();
            showLoaderAndGo(match[1]);
            return;
          }
        }
        break; // let other buttons (submit, etc.) work normally
      }
      el = el.parentElement;
    }
  }, true); /* capture phase so we run before other handlers */

})();
