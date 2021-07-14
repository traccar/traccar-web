(function () {
    var debugMode, touchMode, locale, localeParameter, extjsVersion, proj4jsVersion, olVersion, i, language, languages, languageDefault;

    function addStyleFile (file) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', file);
        document.head.appendChild(link);
    }

    function addScriptFile (file) {
        var script = document.createElement('script');
        script.setAttribute('src', file);
        script.async = false;
        document.head.appendChild(script);
    }

    function addSvgFile (file, id) {
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
        'en': { name: 'English', code: 'en' }
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

    extjsVersion = '6.2.0';
    olVersion = '6.5.0';
    olLayerSwitcherVersion = '3.8.3';
    proj4jsVersion = '2.6.0';

    if (debugMode) {
        addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/ext-all-debug.js');
        addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/packages/charts/classic/charts-debug.js');
    } else {
        addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/ext-all.js');
        addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/packages/charts/classic/charts.js');
    }
    addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/classic/locale/locale-' + locale.languages[locale.language].code + '.js');

    addStyleFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/classic/theme-triton/resources/theme-triton-all.css');
    addScriptFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/classic/theme-triton/theme-triton.js');

    addStyleFile('https://cdn.traccar.com/js/extjs/' + extjsVersion + '/packages/charts/classic/triton/resources/charts-all.css');

    addStyleFile('https://cdn.traccar.com/js/ol/' + olVersion + '/ol.css');
    addScriptFile('https://cdn.traccar.com/js/ol/' + olVersion + '/ol.js');

    addStyleFile('https://cdn.traccar.com/js/ol-layerswitcher/' + olLayerSwitcherVersion + '/ol-layerswitcher.css');
    addScriptFile('https://cdn.traccar.com/js/ol-layerswitcher/' + olLayerSwitcherVersion + '/ol-layerswitcher.js');

    /** Required for address search **/
    addStyleFile('./assets/address.ol.css');
    addScriptFile('./assets/address.ol.js');

    if (debugMode) {
        addScriptFile('https://cdn.traccar.com/js/proj4js/' + proj4jsVersion + '/proj4-src.js');
    } else {
        addScriptFile('https://cdn.traccar.com/js/proj4js/' + proj4jsVersion + '/proj4.js');
    }

    window.Images = ['arrow', 'default', 'animal', 'bicycle', 'boat', 'bus', 'car', 'crane', 'helicopter', 'motorcycle',
        'offroad', 'person', 'pickup', 'plane', 'ship', 'tractor', 'train', 'tram', 'trolleybus', 'truck', 'van', 'scooter'];

    for (i = 0; i < window.Images.length; i++) {
        addSvgFile('images/' + window.Images[i] + '.svg', window.Images[i] + 'Svg');
    }
})();
