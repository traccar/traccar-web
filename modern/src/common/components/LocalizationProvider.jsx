/* eslint-disable import/no-relative-packages */
import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import moment from 'moment';
import 'moment/min/locales.min';

import af from '../../resources/l10n/af.json';
import ar from '../../resources/l10n/ar.json';
import az from '../../resources/l10n/az.json';
import bg from '../../resources/l10n/bg.json';
import bn from '../../resources/l10n/bn.json';
import ca from '../../resources/l10n/ca.json';
import cs from '../../resources/l10n/cs.json';
import da from '../../resources/l10n/da.json';
import de from '../../resources/l10n/de.json';
import el from '../../resources/l10n/el.json';
import en from '../../resources/l10n/en.json';
import es from '../../resources/l10n/es.json';
import fa from '../../resources/l10n/fa.json';
import fi from '../../resources/l10n/fi.json';
import fr from '../../resources/l10n/fr.json';
import gl from '../../resources/l10n/gl.json';
import he from '../../resources/l10n/he.json';
import hi from '../../resources/l10n/hi.json';
import hr from '../../resources/l10n/hr.json';
import hu from '../../resources/l10n/hu.json';
import id from '../../resources/l10n/id.json';
import it from '../../resources/l10n/it.json';
import ja from '../../resources/l10n/ja.json';
import ka from '../../resources/l10n/ka.json';
import kk from '../../resources/l10n/kk.json';
import km from '../../resources/l10n/km.json';
import ko from '../../resources/l10n/ko.json';
import lo from '../../resources/l10n/lo.json';
import lt from '../../resources/l10n/lt.json';
import lv from '../../resources/l10n/lv.json';
import ml from '../../resources/l10n/ml.json';
import mn from '../../resources/l10n/mn.json';
import ms from '../../resources/l10n/ms.json';
import nb from '../../resources/l10n/nb.json';
import ne from '../../resources/l10n/ne.json';
import nl from '../../resources/l10n/nl.json';
import nn from '../../resources/l10n/nn.json';
import pl from '../../resources/l10n/pl.json';
import pt from '../../resources/l10n/pt.json';
import ptBR from '../../resources/l10n/pt_BR.json';
import ro from '../../resources/l10n/ro.json';
import ru from '../../resources/l10n/ru.json';
import si from '../../resources/l10n/si.json';
import sk from '../../resources/l10n/sk.json';
import sl from '../../resources/l10n/sl.json';
import sq from '../../resources/l10n/sq.json';
import sr from '../../resources/l10n/sr.json';
import sv from '../../resources/l10n/sv.json';
import ta from '../../resources/l10n/ta.json';
import th from '../../resources/l10n/th.json';
import tr from '../../resources/l10n/tr.json';
import uk from '../../resources/l10n/uk.json';
import uz from '../../resources/l10n/uz.json';
import vi from '../../resources/l10n/vi.json';
import zh from '../../resources/l10n/zh.json';
import zhTW from '../../resources/l10n/zh_TW.json';
import usePersistedState from '../util/usePersistedState';

const languages = {
  af: { data: af, country: 'ZA', name: 'Afrikaans' },
  ar: { data: ar, country: 'AE', name: 'العربية' },
  az: { data: az, country: 'AZ', name: 'Azərbaycanca' },
  bg: { data: bg, country: 'BG', name: 'Български' },
  bn: { data: bn, country: 'IN', name: 'বাংলা' },
  ca: { data: ca, country: 'ES', name: 'Català' },
  cs: { data: cs, country: 'CZ', name: 'Čeština' },
  de: { data: de, country: 'DE', name: 'Deutsch' },
  da: { data: da, country: 'DK', name: 'Dansk' },
  el: { data: el, country: 'GR', name: 'Ελληνικά' },
  en: { data: en, country: 'US', name: 'English' },
  es: { data: es, country: 'ES', name: 'Español' },
  fa: { data: fa, country: 'IR', name: 'فارسی' },
  fi: { data: fi, country: 'FI', name: 'Suomi' },
  fr: { data: fr, country: 'FR', name: 'Français' },
  gl: { data: gl, country: 'ES', name: 'Galego' },
  he: { data: he, country: 'IL', name: 'עברית' },
  hi: { data: hi, country: 'IN', name: 'हिन्दी' },
  hr: { data: hr, country: 'HR', name: 'Hrvatski' },
  hu: { data: hu, country: 'HU', name: 'Magyar' },
  id: { data: id, country: 'ID', name: 'Bahasa Indonesia' },
  it: { data: it, country: 'IT', name: 'Italiano' },
  ja: { data: ja, country: 'JP', name: '日本語' },
  ka: { data: ka, country: 'GE', name: 'ქართული' },
  kk: { data: kk, country: 'KZ', name: 'Қазақша' },
  ko: { data: ko, country: 'KR', name: '한국어' },
  km: { data: km, country: 'KH', name: 'ភាសាខ្មែរ' },
  lo: { data: lo, country: 'LA', name: 'ລາວ' },
  lt: { data: lt, country: 'LT', name: 'Lietuvių' },
  lv: { data: lv, country: 'LV', name: 'Latviešu' },
  ml: { data: ml, country: 'IN', name: 'മലയാളം' },
  mn: { data: mn, country: 'MN', name: 'Монгол хэл' },
  ms: { data: ms, country: 'MY', name: 'بهاس ملايو' },
  nb: { data: nb, country: 'NO', name: 'Norsk bokmål' },
  ne: { data: ne, country: 'NP', name: 'नेपाली' },
  nl: { data: nl, country: 'NL', name: 'Nederlands' },
  nn: { data: nn, country: 'NO', name: 'Norsk nynorsk' },
  pl: { data: pl, country: 'PL', name: 'Polski' },
  pt: { data: pt, country: 'PT', name: 'Português' },
  ptBR: { data: ptBR, country: 'BR', name: 'Português (Brasil)' },
  ro: { data: ro, country: 'RO', name: 'Română' },
  ru: { data: ru, country: 'RU', name: 'Русский' },
  si: { data: si, country: 'LK', name: 'සිංහල' },
  sk: { data: sk, country: 'SK', name: 'Slovenčina' },
  sl: { data: sl, country: 'SI', name: 'Slovenščina' },
  sq: { data: sq, country: 'AL', name: 'Shqipëria' },
  sr: { data: sr, country: 'RS', name: 'Srpski' },
  sv: { data: sv, country: 'SE', name: 'Svenska' },
  ta: { data: ta, country: 'IN', name: 'தமிழ்' },
  th: { data: th, country: 'TH', name: 'ไทย' },
  tr: { data: tr, country: 'TR', name: 'Türkçe' },
  uk: { data: uk, country: 'UA', name: 'Українська' },
  uz: { data: uz, country: 'UZ', name: 'Oʻzbekcha' },
  vi: { data: vi, country: 'VN', name: 'Tiếng Việt' },
  zh: { data: zh, country: 'CN', name: '中文' },
  zhTW: { data: zhTW, country: 'TW', name: '中文 (Taiwan)' },
};

const getDefaultLanguage = () => {
  const browserLanguages = window.navigator.languages ? window.navigator.languages.slice() : [];
  const browserLanguage = window.navigator.userLanguage || window.navigator.language;
  browserLanguages.push(browserLanguage);
  browserLanguages.push(browserLanguage.substring(0, 2));

  for (let i = 0; i < browserLanguages.length; i += 1) {
    let language = browserLanguages[i].replace('-', '');
    if (language in languages) {
      return language;
    }
    if (language.length > 2) {
      language = language.substring(0, 2);
      if (language in languages) {
        return language;
      }
    }
  }
  return 'en';
};

const LocalizationContext = createContext({
  languages,
  language: 'en',
  setLanguage: () => {},
});

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = usePersistedState('language', getDefaultLanguage());

  const value = useMemo(() => ({ languages, language, setLanguage }), [languages, language, setLanguage]);

  useEffect(() => {
    let selected;
    if (language === 'zh') {
      selected = 'zh-cn';
    } else if (language.length > 2) {
      selected = `${language.slice(0, 2)}-${language.slice(-2).toLowerCase()}`;
    } else {
      selected = language;
    }
    moment.locale([selected, 'en']);
  }, [language]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  const { data } = context.languages[context.language];
  return useMemo(() => (key) => data[key], [data]);
};

export const useTranslationKeys = (predicate) => {
  const context = useContext(LocalizationContext);
  const { data } = context.languages[context.language];
  return Object.keys(data).filter(predicate);
};
