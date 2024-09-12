/* eslint-disable import/no-relative-packages */
import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import dayjs from 'dayjs';
import usePersistedState from '../util/usePersistedState';

import af from '../../resources/l10n/af.json'; import 'dayjs/locale/af';
import ar from '../../resources/l10n/ar.json'; import 'dayjs/locale/ar';
import az from '../../resources/l10n/az.json'; import 'dayjs/locale/az';
import bg from '../../resources/l10n/bg.json'; import 'dayjs/locale/bg';
import bn from '../../resources/l10n/bn.json'; import 'dayjs/locale/bn';
import ca from '../../resources/l10n/ca.json'; import 'dayjs/locale/ca';
import cs from '../../resources/l10n/cs.json'; import 'dayjs/locale/cs';
import da from '../../resources/l10n/da.json'; import 'dayjs/locale/da';
import de from '../../resources/l10n/de.json'; import 'dayjs/locale/de';
import el from '../../resources/l10n/el.json'; import 'dayjs/locale/el';
import en from '../../resources/l10n/en.json'; import 'dayjs/locale/en';
import es from '../../resources/l10n/es.json'; import 'dayjs/locale/es';
import fa from '../../resources/l10n/fa.json'; import 'dayjs/locale/fa';
import fi from '../../resources/l10n/fi.json'; import 'dayjs/locale/fi';
import fr from '../../resources/l10n/fr.json'; import 'dayjs/locale/fr';
import gl from '../../resources/l10n/gl.json'; import 'dayjs/locale/gl';
import he from '../../resources/l10n/he.json'; import 'dayjs/locale/he';
import hi from '../../resources/l10n/hi.json'; import 'dayjs/locale/hi';
import hr from '../../resources/l10n/hr.json'; import 'dayjs/locale/hr';
import hu from '../../resources/l10n/hu.json'; import 'dayjs/locale/hu';
import id from '../../resources/l10n/id.json'; import 'dayjs/locale/id';
import it from '../../resources/l10n/it.json'; import 'dayjs/locale/it';
import ja from '../../resources/l10n/ja.json'; import 'dayjs/locale/ja';
import ka from '../../resources/l10n/ka.json'; import 'dayjs/locale/ka';
import kk from '../../resources/l10n/kk.json'; import 'dayjs/locale/kk';
import km from '../../resources/l10n/km.json'; import 'dayjs/locale/km';
import ko from '../../resources/l10n/ko.json'; import 'dayjs/locale/ko';
import lo from '../../resources/l10n/lo.json'; import 'dayjs/locale/lo';
import lt from '../../resources/l10n/lt.json'; import 'dayjs/locale/lt';
import lv from '../../resources/l10n/lv.json'; import 'dayjs/locale/lv';
import mk from '../../resources/l10n/mk.json'; import 'dayjs/locale/mk';
import ml from '../../resources/l10n/ml.json'; import 'dayjs/locale/ml';
import mn from '../../resources/l10n/mn.json'; import 'dayjs/locale/mn';
import ms from '../../resources/l10n/ms.json'; import 'dayjs/locale/ms';
import nb from '../../resources/l10n/nb.json'; import 'dayjs/locale/nb';
import ne from '../../resources/l10n/ne.json'; import 'dayjs/locale/ne';
import nl from '../../resources/l10n/nl.json'; import 'dayjs/locale/nl';
import nn from '../../resources/l10n/nn.json'; import 'dayjs/locale/nn';
import pl from '../../resources/l10n/pl.json'; import 'dayjs/locale/pl';
import pt from '../../resources/l10n/pt.json'; import 'dayjs/locale/pt';
import ptBR from '../../resources/l10n/pt_BR.json'; import 'dayjs/locale/pt-br';
import ro from '../../resources/l10n/ro.json'; import 'dayjs/locale/ro';
import ru from '../../resources/l10n/ru.json'; import 'dayjs/locale/ru';
import si from '../../resources/l10n/si.json'; import 'dayjs/locale/si';
import sk from '../../resources/l10n/sk.json'; import 'dayjs/locale/sk';
import sl from '../../resources/l10n/sl.json'; import 'dayjs/locale/sl';
import sq from '../../resources/l10n/sq.json'; import 'dayjs/locale/sq';
import sr from '../../resources/l10n/sr.json'; import 'dayjs/locale/sr';
import sv from '../../resources/l10n/sv.json'; import 'dayjs/locale/sv';
import ta from '../../resources/l10n/ta.json'; import 'dayjs/locale/ta';
import th from '../../resources/l10n/th.json'; import 'dayjs/locale/th';
import tr from '../../resources/l10n/tr.json'; import 'dayjs/locale/tr';
import uk from '../../resources/l10n/uk.json'; import 'dayjs/locale/uk';
import uz from '../../resources/l10n/uz.json'; import 'dayjs/locale/uz';
import vi from '../../resources/l10n/vi.json'; import 'dayjs/locale/vi';
import zh from '../../resources/l10n/zh.json'; import 'dayjs/locale/zh';
import zhTW from '../../resources/l10n/zh_TW.json'; import 'dayjs/locale/zh-tw';

const languages = {
  es: { data: es, country: 'ES', name: 'Español' },
  en: { data: en, country: 'US', name: 'English' },
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
  language: 'es',
  setLanguage: () => {},
});

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = usePersistedState('language', getDefaultLanguage());
  const direction = /^(ar|he|fa)$/.test(language) ? 'rtl' : 'ltr';

  const value = useMemo(() => ({ languages, language, setLanguage, direction }), [languages, language, setLanguage, direction]);

  useEffect(() => {
    let selected;
    if (language.length > 2) {
      selected = `${language.slice(0, 2)}-${language.slice(-2).toLowerCase()}`;
    } else {
      selected = language;
    }
    dayjs.locale(selected);
    document.dir = direction;
  }, [language, direction]);

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
