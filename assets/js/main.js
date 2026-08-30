/* ==========================================================================
   download.amsol.ca
   Progressive enhancement only. With JavaScript disabled or the GitHub API
   unreachable, every download link in index.html still works — this file just
   adds the visitor's platform, live version numbers, file sizes and checksums,
   and switches on the macOS Magic Video button once that build is published.
   ========================================================================== */
(function () {
  'use strict';

  var OWNER = 'alaahadyhostinger';

  /* ---------------------------------------------------------------- theme -- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      var next = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }
  }

  try {
    var saved = localStorage.getItem('amsol-theme');
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
    else applyTheme(effectiveTheme());
  } catch (e) {
    applyTheme(effectiveTheme());
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('amsol-theme', next); } catch (e) {}
    });
  }

  /* ------------------------------------------------------------- the year -- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --------------------------------------------------- platform detection -- */
  function detectOS() {
    var ua = navigator.userAgent || '';
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) ||
               navigator.platform || '';

    // iPadOS reports "MacIntel" with touch points, and no desktop build applies.
    if (/iPhone|iPad|iPod/i.test(ua) ||
        (/Mac/i.test(plat) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    if (/Win/i.test(plat) || /Windows/i.test(ua)) return 'windows';
    if (/Mac/i.test(plat) || /Mac OS X/i.test(ua)) return 'mac';
    if (/Linux|X11|CrOS/i.test(ua)) return 'linux';
    return 'other';
  }

  function platformOf(el) {
    var name = el.getAttribute('data-asset') || el.getAttribute('data-pending-asset') || '';
    if (/\.dmg$/i.test(name)) return 'mac';
    // Checked before the .zip rule: macOS builds ship as .zip too, and calling
    // one of those a Windows download would promote the wrong button.
    if (/macos/i.test(name)) return 'mac';
    if (/\.(?:exe|zip)$/i.test(name)) return 'windows';
    return '';
  }

  var os = detectOS();
  var allButtons = document.querySelectorAll('[data-asset], [data-pending-asset]');
  var note = document.getElementById('platform-note');

  if (os === 'windows' || os === 'mac') {
    Array.prototype.forEach.call(allButtons, function (el) {
      var isMatch = platformOf(el) === os;
      // never promote a placeholder to the primary call-to-action
      el.classList.toggle('is-primary', isMatch && !el.classList.contains('is-pending'));
    });
  } else {
    // No desktop build matches — don't imply one does.
    Array.prototype.forEach.call(allButtons, function (el) {
      el.classList.remove('is-primary');
    });
    if (note) {
      note.textContent = os === 'ios' || os === 'android'
        ? 'These are desktop applications. Open this page on a Windows PC or a Mac to install them.'
        : 'We don’t publish a build for your operating system yet. The files below are for Windows and macOS.';
      note.hidden = false;
    }
  }

  /* ------------------------------------------------------- release lookup -- */
  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    var mb = bytes / (1024 * 1024);
    if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
    if (mb >= 100) return Math.round(mb) + ' MB';
    if (mb >= 1) return mb.toFixed(1) + ' MB';
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  var checksumRows = document.getElementById('checksum-rows');
  var checksumBox = document.getElementById('checksums');
  var checksumFallback = document.getElementById('checksums-fallback');
  var digestsFound = 0;

  function addChecksumRow(name, size, digest) {
    if (!checksumRows || !digest) return;
    var tr = document.createElement('tr');

    var tdName = document.createElement('td');
    tdName.textContent = name;

    var tdSize = document.createElement('td');
    tdSize.textContent = formatSize(size);

    var tdDigest = document.createElement('td');
    tdDigest.className = 'digest';
    tdDigest.textContent = digest.replace(/^sha256:/i, '');

    tr.appendChild(tdName);
    tr.appendChild(tdSize);
    tr.appendChild(tdDigest);
    checksumRows.appendChild(tr);
    digestsFound++;
  }

  /* Replace the "Coming soon" placeholder with a real download link. */
  function activatePending(span, asset) {
    var a = document.createElement('a');
    a.className = span.className.replace(/\bis-pending\b/, '').trim();
    a.href = span.getAttribute('data-pending-href') || asset.browser_download_url;
    a.setAttribute('data-asset', asset.name);

    var icon = span.querySelector('.os-icon');
    if (icon) a.appendChild(icon.cloneNode(true));

    var text = document.createElement('span');
    text.className = 'btn-text';

    var label = document.createElement('span');
    label.className = 'btn-label';
    var oldLabel = span.querySelector('.btn-label');
    label.textContent = oldLabel ? oldLabel.textContent : 'Download';

    var meta = document.createElement('span');
    meta.className = 'btn-meta';
    meta.setAttribute('data-role', 'meta');
    meta.setAttribute('data-base', 'macOS 11 Big Sur or newer');
    meta.textContent = 'macOS 11 Big Sur or newer · ' + formatSize(asset.size);

    text.appendChild(label);
    text.appendChild(meta);
    a.appendChild(text);

    if (os === 'mac') a.classList.add('is-primary');
    span.parentNode.replaceChild(a, span);
  }

  function hydrate(card, release) {
    var assets = release.assets || [];
    var byName = {};
    assets.forEach(function (a) { byName[a.name] = a; });

    // version badge + publish date
    var badge = card.querySelector('[data-role="version-badge"]');
    if (badge && release.tag_name) {
      badge.textContent = 'Version ' + String(release.tag_name).replace(/^v/i, '');
    }
    var versionEl = card.querySelector('[data-role="version"]');
    if (versionEl && release.published_at) {
      var span = document.createElement('span');
      span.className = 'version-date';
      span.textContent = 'released ' + formatDate(release.published_at);
      versionEl.appendChild(span);
    }

    // real download buttons: append the file size, keep the platform text
    Array.prototype.forEach.call(card.querySelectorAll('[data-asset]'), function (el) {
      var asset = byName[el.getAttribute('data-asset')];
      if (!asset) return;
      var meta = el.querySelector('[data-role="meta"]');
      if (meta) {
        var base = meta.getAttribute('data-base') || meta.textContent;
        meta.setAttribute('data-base', base);
        meta.textContent = base + ' · ' + formatSize(asset.size);
      }
      addChecksumRow(asset.name, asset.size, asset.digest);
    });

    // placeholder: switch it on if the build has landed
    var pending = card.querySelector('[data-pending-asset]');
    if (pending) {
      var pendingAsset = byName[pending.getAttribute('data-pending-asset')];
      if (pendingAsset) {
        activatePending(pending, pendingAsset);
        addChecksumRow(pendingAsset.name, pendingAsset.size, pendingAsset.digest);
      }
    }
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card[data-repo]'));

  Promise.all(cards.map(function (card) {
    var repo = card.getAttribute('data-repo');
    return fetch('https://api.github.com/repos/' + OWNER + '/' + repo + '/releases/latest', {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (release) { if (release) hydrate(card, release); })
      .catch(function () { /* offline or rate-limited: static page stands */ });
  })).then(function () {
    if (digestsFound > 0) {
      if (checksumBox) checksumBox.hidden = false;
      if (checksumFallback) checksumFallback.hidden = true;
    }
  });
})();
