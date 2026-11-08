/* ==========================================================================
   download.amsol.ca — 6 Color Themes, 5 Languages (EN/FR/AR/ES/DE) & Platform Helper
   © 2026 Advanced Management Solutions — https://amsol.ca
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeSelect = document.getElementById('theme-select');
  var langSelect = document.getElementById('lang-select');
  var themeDots = document.querySelectorAll('[data-set-theme]');

  var VALID_THEMES = ['dark', 'light', 'classic_commander', 'emerald_matrix', 'sunset_amber', 'royal_amethyst'];

  var I18N = {
    en: {
      dir: 'ltr',
      navDownloads: 'Downloads',
      navPrivacy: 'Privacy Policy',
      heroTitle: 'Official Software Downloads',
      heroSub: 'Professional Windows & Mobile software suites engineered by Advanced Management Solutions (AMSOL) — 100% local execution, fast, and zero telemetry.',
      signpathText: 'This project uses',
      signpathSuffix: 'for secure code signing.',
      downloadSetup: 'Download Setup (Installer)',
      downloadPortable: 'Download Portable',
      recommended: 'Recommended',
      portableZip: 'Portable ZIP',
      notesAndFeatures: 'Installation notes & Features',
      securityTitle: 'Security & Cryptographic SHA-256 Verification',
      smartscreenNote: 'While our signing pipeline is being finalized with the Certificate Authority, Windows SmartScreen may show an "unrecognised publisher" notification — choose More info → Run anyway.',
      verifyIntro: 'You can independently verify that any downloaded package matches our official build by checking its SHA-256 cryptographic fingerprint:'
    },
    fr: {
      dir: 'ltr',
      navDownloads: 'Téléchargements',
      navPrivacy: 'Confidentialité',
      heroTitle: 'Téléchargements Officiels de Logiciels',
      heroSub: 'Suites logicielles professionnelles Windows et mobiles conçues par Advanced Management Solutions (AMSOL) — exécution 100 % locale, rapide et sans télémétrie.',
      signpathText: 'Ce projet utilise',
      signpathSuffix: 'pour la signature sécurisée du code.',
      downloadSetup: 'Télécharger l’Installateur (Setup)',
      downloadPortable: 'Télécharger la Version Portable',
      recommended: 'Recommandé',
      portableZip: 'ZIP Portable',
      notesAndFeatures: 'Notes d’installation et fonctionnalités',
      securityTitle: 'Sécurité et Vérification Cryptographique SHA-256',
      smartscreenNote: 'Si Windows SmartScreen affiche un avertissement d’éditeur inconnu, cliquez sur Informations complémentaires → Exécuter quand même.',
      verifyIntro: 'Vous pouvez vérifier l’intégrité de chaque archive téléchargée à l’aide de son empreinte SHA-256 officielle :'
    },
    ar: {
      dir: 'rtl',
      navDownloads: 'التحميلات',
      navPrivacy: 'سياسة الخصوصية',
      heroTitle: 'بوابة التحميل الرسمية للبرامج',
      heroSub: 'حزم برمجيات احترافية لأنظمة ويندوز والهواتف الذكية من شركة الحلول الإدارية المتقدمة (AMSOL) — تشغيل محلي 100%، سرعة فائقة، وخصوصية تامة بدون تتبع.',
      signpathText: 'يستخدم هذا المشروع',
      signpathSuffix: 'للتوقيع الرقمي الآمن للبرمجيات.',
      downloadSetup: 'تحميل برنامج التثبيت (Setup)',
      downloadPortable: 'تحميل النسخة المحمولة (Portable)',
      recommended: 'موصى به',
      portableZip: 'نسخة محمولة ZIP',
      notesAndFeatures: 'ملاحظات التثبيت والمميزات',
      securityTitle: 'الأمان والتحقق الرقمي عبر بصمة SHA-256',
      smartscreenNote: 'في حال ظهور تنبيه Windows SmartScreen، اختر مزيد من المعلومات (More info) ثم التشغيل على أي حال (Run anyway).',
      verifyIntro: 'يمكنك التحقق من سلامة وموثوقية أي حزمة تم تنزيلها عبر مطابقة بصمة التشفير SHA-256 الرسمية:'
    },
    es: {
      dir: 'ltr',
      navDownloads: 'Descargas',
      navPrivacy: 'Política de Privacidad',
      heroTitle: 'Descargas Oficiales de Software',
      heroSub: 'Suites de software profesionales para Windows y dispositivos móviles desarrolladas por Advanced Management Solutions (AMSOL) — ejecución 100 % local y cero telemetría.',
      signpathText: 'Este proyecto utiliza',
      signpathSuffix: 'para la firma segura de código.',
      downloadSetup: 'Descargar Instalador (Setup)',
      downloadPortable: 'Descargar Versión Portátil',
      recommended: 'Recomendado',
      portableZip: 'ZIP Portátil',
      notesAndFeatures: 'Notas de instalación y características',
      securityTitle: 'Seguridad y Verificación Criptográfica SHA-256',
      smartscreenNote: 'Si Windows SmartScreen muestra una notificación, seleccione Más información → Ejecutar de todas formas.',
      verifyIntro: 'Puede verificar de forma independiente que cualquier paquete descargado coincide con nuestra compilación oficial mediante su huella SHA-256:'
    },
    de: {
      dir: 'ltr',
      navDownloads: 'Downloads',
      navPrivacy: 'Datenschutz',
      heroTitle: 'Offizielle Software-Downloads',
      heroSub: 'Professionelle Windows- und Mobile-Softwarepakete von Advanced Management Solutions (AMSOL) — 100 % lokale Ausführung, schnell und ohne Telemetrie.',
      signpathText: 'Dieses Projekt nutzt',
      signpathSuffix: 'für sichere Code-Signierung.',
      downloadSetup: 'Setup-Installer herunterladen',
      downloadPortable: 'Portable Version herunterladen',
      recommended: 'Empfohlen',
      portableZip: 'Portables ZIP',
      notesAndFeatures: 'Installationshinweise & Funktionen',
      securityTitle: 'Sicherheit & Kryptografische SHA-256-Prüfung',
      smartscreenNote: 'Falls Windows SmartScreen einen Hinweis anzeigt, wählen Sie Weitere Informationen → Trotzdem ausführen.',
      verifyIntro: 'Sie können jedes heruntergeladene Paket anhand seines offiziellen SHA-256-Fingerabdrucks überprüfen:'
    }
  };

  function applyTheme(theme) {
    if (VALID_THEMES.indexOf(theme) === -1) theme = 'dark';
    root.setAttribute('data-theme', theme);
    if (themeSelect && themeSelect.value !== theme) {
      themeSelect.value = theme;
    }
    Array.prototype.forEach.call(themeDots, function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-set-theme') === theme);
    });
    try { localStorage.setItem('amsol-theme', theme); } catch (e) {}
  }

  function applyLanguage(lang) {
    var dict = I18N[lang] || I18N.en;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', dict.dir);
    if (langSelect && langSelect.value !== lang) {
      langSelect.value = lang;
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    try { localStorage.setItem('amsol-lang', lang); } catch (e) {}
  }

  // Initialize saved theme & language
  try {
    var savedTheme = localStorage.getItem('amsol-theme') || 'dark';
    applyTheme(savedTheme);
    var savedLang = localStorage.getItem('amsol-lang') || 'en';
    applyLanguage(savedLang);
  } catch (e) {
    applyTheme('dark');
    applyLanguage('en');
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', function (e) {
      applyTheme(e.target.value);
    });
  }

  Array.prototype.forEach.call(themeDots, function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-set-theme'));
    });
  });

  if (langSelect) {
    langSelect.addEventListener('change', function (e) {
      applyLanguage(e.target.value);
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
