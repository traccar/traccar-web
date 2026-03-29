(function () {
    var debugMode, touchMode, locale, localeParameter, extjsVersion, proj4jsVersion, olVersion, i, language, languages, languageDefault;

    function addStyleFile(file) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', file);
        document.head.appendChild(link);
    }

    function addScriptFile(file) {
        var script = document.createElement('script');
        script.setAttribute('src', file);
        script.async = false;
        document.head.appendChild(script);
    }

    function addSvgFile(file, id) {
        var svg = document.createElement('object');
        svg.setAttribute('id', id);
        svg.setAttribute('data', file);
        svg.setAttribute('type', 'image/svg+xml');
        svg.setAttribute('style', 'visibility:hidden;position:absolute;left:-100px;');
        document.body.appendChild(svg);
    }

    debugMode = document.getElementById('loadScript').getAttribute('mode') === 'debug';
    touchMode = 'ontouchstart' in window || navigator.maxTouchPoints;

    window.updateNotificationToken = function (token) {
        Traccar.app.updateNotificationToken(token);
    };

    locale = {};
    window.Locale = locale;

    locale.languages = {
        'af': { name: 'Afrikaans', code: 'af' },
        'ar': { name: 'العربية', code: 'en' },
        'az': { name: 'Azərbaycanca', code: 'en' },
        'bg': { name: 'Български', code: 'bg' },
        'bn': { name: 'বাংলা', code: 'en' },
        'ca': { name: 'Català', code: 'en' },
        'cs': { name: 'Čeština', code: 'cs' },
        'de': { name: 'Deutsch', code: 'de' },
        'da': { name: 'Dansk', code: 'da' },
        'el': { name: 'Ελληνικά', code: 'el' },
        'en': { name: 'English', code: 'en' },
        'es': { name: 'Español', code: 'es' },
        'fa': { name: 'فارسی', code: 'fa' },
        'fi': { name: 'Suomi', code: 'fi' },
        'fr': { name: 'Français', code: 'fr' },
        'he': { name: 'עברית', code: 'he' },
        'hi': { name: 'हिन्दी', code: 'en' },
        'hr': { name: 'Hrvatski', code: 'hr' },
        'hu': { name: 'Magyar', code: 'hu' },
        'id': { name: 'Bahasa Indonesia', code: 'id' },
        'it': { name: 'Italiano', code: 'it' },
        'ja': { name: '日本語', code: 'ja' },
        'ka': { name: 'ქართული', code: 'en' },
        'kk': { name: 'Қазақша', code: 'en' },
        'ko': { name: '한국어', code: 'ko' },
        'km': { name: 'ភាសាខ្មែរ', code: 'en' },
        'lo': { name: 'ລາວ', code: 'en' },
        'lt': { name: 'Lietuvių', code: 'lt' },
        'lv': { name: 'Latviešu', code: 'lv' },
        'ml': { name: 'മലയാളം', code: 'en' },
        'mn': { name: 'Монгол хэл', code: 'en' },
        'ms': { name: 'بهاس ملايو', code: 'en' },
        'nb': { name: 'Norsk bokmål', code: 'no_NB' },
        'ne': { name: 'नेपाली', code: 'en' },
        'nl': { name: 'Nederlands', code: 'nl' },
        'nn': { name: 'Norsk nynorsk', code: 'no_NN' },
        'pl': { name: 'Polski', code: 'pl' },
        'pt': { name: 'Português', code: 'pt' },
        'pt_BR': { name: 'Português (Brasil)', code: 'pt_BR' },
        'ro': { name: 'Română', code: 'ro' },
        'ru': { name: 'Русский', code: 'ru' },
        'si': { name: 'සිංහල', code: 'en' },
        'sk': { name: 'Slovenčina', code: 'sk' },
        'sl': { name: 'Slovenščina', code: 'sl' },
        'sq': { name: 'Shqipëria', code: 'en' },
        'sr': { name: 'Srpski', code: 'sr' },
        'sv': { name: 'Svenska', code: 'sv' },
        'ta': { name: 'தமிழ்', code: 'en' },
        'th': { name: 'ไทย', code: 'th' },
        'tr': { name: 'Türkçe', code: 'tr' },
        'uk': { name: 'Українська', code: 'ukr' },
        'uz': { name: 'Oʻzbekcha', code: 'en' },
        'vi': { name: 'Tiếng Việt', code: 'en' },
        'zh': { name: '中文', code: 'zh_CN' },
        'zh_TW': { name: '中文 (Taiwan)', code: 'zh_TW' }
    };

    languageDefault = 'en';
    localeParameter = window.location.search.match(/locale=([^&#]+)/);
    locale.language = localeParameter && localeParameter[1];
    if (!(locale.language in locale.languages)) {
        languages = window.navigator.languages !== undefined ? window.navigator.languages.slice() : [];
        language = window.navigator.userLanguage || window.navigator.language;
        languages.push(language);
        languages.push(language.substring(0, 2));
        languages.push(languageDefault);
        for (i = 0; i < languages.length; i++) {
            language = languages[i].replace('-', '_');
            if (language in locale.languages) {
                locale.language = language;
                break;
            }
            if (language.length > 2) {
                language = languages[i].substring(0, 2);
                if (language in locale.languages) {
                    locale.language = language;
                    break;
                }
            }
        }
    }

    window.addEventListener('load', function (event) {

        if (debugMode) {
            Ext.Loader.setConfig({
                disableCaching: false
            });
        }

        Ext.Ajax.request({
            url: 'l10n/' + languageDefault + '.json',
            callback: function (options, success, response) {
                window.Strings = Ext.decode(response.responseText);
                if (Locale.language !== languageDefault) {
                    Ext.Ajax.request({
                        url: 'l10n/' + Locale.language + '.json',
                        callback: function (options, success, response) {
                            var key, data = Ext.decode(response.responseText);
                            for (key in data) {
                                if (data.hasOwnProperty(key)) {
                                    window.Strings[key] = data[key];
                                }
                            }
                            addScriptFile(debugMode ? 'app.js' : 'app.min.js');
                        }
                    });
                } else {
                    addScriptFile(debugMode ? 'app.js' : 'app.min.js');
                }
            }
        });

    });

    // Hack for new versions of Android
    if (navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.indexOf('OPR') !== -1) {
        var __originalUserAgent = navigator.userAgent;
        navigator.__defineGetter__('userAgent', function () { return __originalUserAgent.replace(/\/OPR[^)]*/g, ''); });
    }

    addScriptFile('lib/extjs/ext-all.js');
    addScriptFile('lib/extjs/classic/locale/locale-' + locale.languages[locale.language].code + '.js');

    addStyleFile('lib/extjs/classic/theme-triton/resources/theme-triton-all.css');
    addScriptFile('lib/extjs/classic/theme-triton/theme-triton.js');

    addScriptFile('lib/extjs/packages/charts/classic/charts.js');
    addStyleFile('lib/extjs/packages/charts/classic/triton/resources/charts-all.css');

    addStyleFile('lib/ol/ol.css');
    addScriptFile('lib/ol/ol.js');

    addStyleFile('lib/ol-layerswitcher/ol-layerswitcher.css');
    addScriptFile('lib/ol-layerswitcher/ol-layerswitcher.js');

    addScriptFile('lib/proj4/proj4.js');

    window.Images = ['arrow', 'default', 'animal', 'bicycle', 'boat', 'bus', 'car', 'crane', 'helicopter', 'motorcycle',
        'offroad', 'person', 'pickup', 'plane', 'ship', 'tractor', 'train', 'tram', 'trolleybus', 'truck', 'van', 'scooter'];

    for (i = 0; i < window.Images.length; i++) {
        addSvgFile('images/' + window.Images[i] + '.svg', window.Images[i] + 'Svg');
    }
})();
