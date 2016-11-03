(function () {

    function addStyleFile(file) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', file);
        document.head.appendChild(link)
    }

    function addScriptFile(file) {
        var script = document.createElement('script');
        script.setAttribute('src', file);
        script.async = false
        document.head.appendChild(script);
    }

    var debugMode = document.getElementById('loadScript').getAttribute('mode') === 'debug';
    var touchMode = 'ontouchstart' in window || navigator.maxTouchPoints;

    var locale = {};
    window.Locale = locale;

    locale.languages = {
        'ar': { name: 'العربية', code: 'en' },
        'bg': { name: 'Български', code: 'bg' },
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
        'hu': { name: 'Magyar', code: 'hu' },
        'id': { name: 'Bahasa Indonesia', code: 'id' },
        'it': { name: 'Italiano', code: 'it' },
        'ka': { name: 'ქართული', code: 'en' },
        'lo': { name: 'ລາວ', code: 'en' },
        'lt': { name: 'Lietuvių', code: 'lt' },
        'ml': { name: 'മലയാളം', code: 'en' },
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
        'ta': { name: 'தமிழ்', code: 'en' },
        'th': { name: 'ไทย', code: 'th' },
        'tr': { name: 'Türkçe', code: 'tr' },
        'uk': { name: 'Українська', code: 'ukr' },
        'vi': { name: 'Tiếng Việt', code: 'en' },
        'zh': { name: '中文', code: 'zh_CN' }
    };

    var localeParameter = window.location.search.match(/locale=([^&#]+)/);
    locale.language = localeParameter && localeParameter[1];
    if (locale.language === undefined) {
        locale.language = window.navigator.userLanguage || window.navigator.language;
        locale.language = locale.language.substr(0, 2);
    }

    if (!(locale.language in locale.languages)) {
        locale.language = 'en'; // default
    }

    window.addEventListener("load", function (event) {

        if (debugMode) {
            Ext.Loader.setConfig({
                disableCaching: false
            });
        }

        Ext.Ajax.request({
            url: 'l10n/' + Locale.language + '.json',
            callback: function (options, success, response) {
                window.Strings = Ext.decode(response.responseText);

                if (debugMode) {
                    addScriptFile('app.js');
                } else {
                    addScriptFile('app.min.js');
                }
            }
        });

    });

    var extjsVersion = '6.0.1';
    var fontAwesomeVersion = '4.6.3';
    var olVersion = '3.18.2';

    if (debugMode) {
        addScriptFile('//cdnjs.cloudflare.com/ajax/libs/extjs/' + extjsVersion + '/ext-all-debug.js');
    } else {
        addScriptFile('//cdnjs.cloudflare.com/ajax/libs/extjs/' + extjsVersion + '/ext-all.js');
    }
    addScriptFile('//cdnjs.cloudflare.com/ajax/libs/extjs/' + extjsVersion + '/classic/locale/locale-' + locale.languages[locale.language].code + '.js');

    addStyleFile('//cdnjs.cloudflare.com/ajax/libs/extjs/' + extjsVersion + '/classic/theme-triton/resources/theme-triton-all.css');
    addScriptFile('//cdnjs.cloudflare.com/ajax/libs/extjs/' + extjsVersion + '/classic/theme-triton/theme-triton.js');

    addStyleFile('//cdnjs.cloudflare.com/ajax/libs/font-awesome/' + fontAwesomeVersion + '/css/font-awesome.min.css');

    addStyleFile('//cdnjs.cloudflare.com/ajax/libs/ol3/' + olVersion + '/ol.css');
    addScriptFile('//cdnjs.cloudflare.com/ajax/libs/ol3/' + olVersion + '/ol-debug.js');

    addStyleFile('app.css');
    addScriptFile('arrow.js');

})();
