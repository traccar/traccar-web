import React, {useState, createContext} from "react";
import {defaultLanguage, setSelectedLanguage} from "./common/localization";

export const LanguageContext = createContext({
  language: '',
  setLanguage: () => {}
});

const LanguageProvider = (props) => {
  const [language, setLanguage] = useState(defaultLanguage);

  const handleLanguageChange = (nextLanguage) => {
    setSelectedLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  return <LanguageContext.Provider value={{language, setLanguage: handleLanguageChange}}>
    {props.children}
  </LanguageContext.Provider>
}

export default LanguageProvider;
