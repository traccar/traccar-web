import {LanguageContext} from "./LanguageContext";
import React, {useState} from "react";
import {defaultLanguage, setSelectedLanguage} from "./common/localization";

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
