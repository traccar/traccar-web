import af from '../../../web/l10n/af.json';
import ar from '../../../web/l10n/ar.json';
import az from '../../../web/l10n/az.json';
import bg from '../../../web/l10n/bg.json';
import bn from '../../../web/l10n/bn.json';
import cs from '../../../web/l10n/cs.json';
import da from '../../../web/l10n/da.json';
import de from '../../../web/l10n/de.json';
import el from '../../../web/l10n/el.json';
import en from '../../../web/l10n/en.json';
import es from '../../../web/l10n/es.json';
import fa from '../../../web/l10n/fa.json';
import fi from '../../../web/l10n/fi.json';
import fr from '../../../web/l10n/fr.json';
import he from '../../../web/l10n/he.json';
import hi from '../../../web/l10n/hi.json';
import hr from '../../../web/l10n/hr.json';
import hu from '../../../web/l10n/hu.json';
import id from '../../../web/l10n/id.json';
import it from '../../../web/l10n/it.json';
import ja from '../../../web/l10n/ja.json';
import ka from '../../../web/l10n/ka.json';
import kk from '../../../web/l10n/kk.json';
import km from '../../../web/l10n/km.json';
import ko from '../../../web/l10n/ko.json';
import lo from '../../../web/l10n/lo.json';
import lt from '../../../web/l10n/lt.json';
import lv from '../../../web/l10n/lv.json';
import ml from '../../../web/l10n/ml.json';
import ms from '../../../web/l10n/ms.json';
import nb from '../../../web/l10n/nb.json';
import ne from '../../../web/l10n/ne.json';
import nl from '../../../web/l10n/nl.json';
import nn from '../../../web/l10n/nn.json';
import pl from '../../../web/l10n/pl.json';
import pt from '../../../web/l10n/pt.json';
import pt_BR from '../../../web/l10n/pt_BR.json';
import ro from '../../../web/l10n/ro.json';
import ru from '../../../web/l10n/ru.json';
import si from '../../../web/l10n/si.json';
import sk from '../../../web/l10n/sk.json';
import sl from '../../../web/l10n/sl.json';
import sq from '../../../web/l10n/sq.json';
import sr from '../../../web/l10n/sr.json';
import sv from '../../../web/l10n/sv.json';
import ta from '../../../web/l10n/ta.json';
import th from '../../../web/l10n/th.json';
import tr from '../../../web/l10n/tr.json';
import uk from '../../../web/l10n/uk.json';
import uz from '../../../web/l10n/uz.json';
import vi from '../../../web/l10n/vi.json';
import zh from '../../../web/l10n/zh.json';
import zh_TW from '../../../web/l10n/zh_TW.json';

const supportedLanguages = {
  'af': { data: af, name: 'Afrikaans' },
  'ar': { data: ar, name: 'العربية' },
  'az': { data: az, name: 'Azərbaycanca' },
  'bg': { data: bg, name: 'Български' },
  'bn': { data: bn, name: 'বাংলা' },
  'cs': { data: cs, name: 'Čeština' },
  'de': { data: de, name: 'Deutsch' },
  'da': { data: da, name: 'Dansk' },
  'el': { data: el, name: 'Ελληνικά' },
  'en': { data: en, name: 'English' },
  'es': { data: es, name: 'Español' },
  'fa': { data: fa, name: 'فارسی' },
  'fi': { data: fi, name: 'Suomi' },
  'fr': { data: fr, name: 'Français' },
  'he': { data: he, name: 'עברית' },
  'hi': { data: hi, name: 'हिन्दी' },
  'hr': { data: hr, name: 'Hrvatski' },
  'hu': { data: hu, name: 'Magyar' },
  'id': { data: id, name: 'Bahasa Indonesia' },
  'it': { data: it, name: 'Italiano' },
  'ja': { data: ja, name: '日本語' },
  'ka': { data: ka, name: 'ქართული' },
  'kk': { data: kk, name: 'Қазақша' },
  'ko': { data: ko, name: '한국어' },
  'km': { data: km, name: 'ភាសាខ្មែរ' },
  'lo': { data: lo, name: 'ລາວ' },
  'lt': { data: lt, name: 'Lietuvių' },
  'lv': { data: lv, name: 'Latviešu' },
  'ml': { data: ml, name: 'മലയാളം' },
  'ms': { data: ms, name: 'بهاس ملايو' },
  'nb': { data: nb, name: 'Norsk bokmål' },
  'ne': { data: ne, name: 'नेपाली' },
  'nl': { data: nl, name: 'Nederlands' },
  'nn': { data: nn, name: 'Norsk nynorsk' },
  'pl': { data: pl, name: 'Polski' },
  'pt': { data: pt, name: 'Português' },
  'pt_BR': { data: pt_BR, name: 'Português (Brasil)' },
  'ro': { data: ro, name: 'Română' },
  'ru': { data: ru, name: 'Русский' },
  'si': { data: si, name: 'සිංහල' },
  'sk': { data: sk, name: 'Slovenčina' },
  'sl': { data: sl, name: 'Slovenščina' },
  'sq': { data: sq, name: 'Shqipëria' },
  'sr': { data: sr, name: 'Srpski' },
  'sv': { data: sv, name: 'Svenska' },
  'ta': { data: ta, name: 'தமிழ்' },
  'th': { data: th, name: 'ไทย' },
  'tr': { data: tr, name: 'Türkçe' },
  'uk': { data: uk, name: 'Українська' },
  'uz': { data: uz, name: 'Oʻzbekcha' },
  'vi': { data: vi, name: 'Tiếng Việt' },
  'zh': { data: zh, name: '中文' },
  'zh_TW': { data: zh_TW, name: '中文 (Taiwan)' }
};

const languages = window.navigator.languages !== undefined ? window.navigator.languages.slice() : [];
let language = window.navigator.userLanguage || window.navigator.language;
languages.push(language);
languages.push(language.substring(0, 2));
languages.push('en');
for (let i = 0; i < languages.length; i++) {
  language = languages[i].replace('-', '_');
  if (language in supportedLanguages) {
    break;
  }
  if (language.length > 2) {
    language = languages[i].substring(0, 2);
    if (language in supportedLanguages) {
      break;
    }
  }
}

const selectedLanguage = supportedLanguages[language];

export const findStringKeys = (predicate) => {
  return Object.keys(selectedLanguage.data).filter(predicate);
}

export default key => {
  return selectedLanguage.data[key];
};
