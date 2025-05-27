import { createContext, useContext, useEffect } from "react";
import usePersistedState from "../common/util/usePersistedState.js";
import { usePreference } from "../common/util/preferences.js";

let saveSelectedMapStyleListener = undefined;

export const saveSelectedMapStyle = (styleId) => {
    if (saveSelectedMapStyleListener) {
        saveSelectedMapStyleListener(styleId);
    }
};

const MapStyleContext = createContext(null);

export const MapStyleProvider = ({ children }) => {
    const [selectedMapStyle, saveSelectedMapStyle] = usePersistedState(
        'selectedMapStyle',
        usePreference('map', 'locationIqStreets')
    );

    useEffect(() => {
        saveSelectedMapStyleListener = saveSelectedMapStyle;
    }, [saveSelectedMapStyle]);

    return (
        <MapStyleContext.Provider value={[selectedMapStyle, saveSelectedMapStyle]}>
            {children}
        </MapStyleContext.Provider>
    );
};

export const useSelectedMapStyle = () => {
    return useContext(MapStyleContext);
};
