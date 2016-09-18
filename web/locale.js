/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var Locale = {};

Locale.languages = {
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

Locale.language = Ext.Object.fromQueryString(window.location.search.substring(1)).locale;
if (Locale.language === undefined) {
    Locale.language = window.navigator.userLanguage || window.navigator.language;
    Locale.language = Locale.language.substr(0, 2);
}

if (!(Locale.language in Locale.languages)) {
    Locale.language = 'en'; // default
}

Ext.Ajax.request({
    url: 'l10n/' + Locale.language + '.json',
    callback: function (options, success, response) {
        Strings = Ext.decode(response.responseText);
    }
});

Ext.Loader.loadScript('//cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/classic/locale/locale-' + Locale.languages[Locale.language].code + '.js');
