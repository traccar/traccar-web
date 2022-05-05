import { useSelector } from 'react-redux';

export const useAdministrator = () => useSelector((state) => state.session.user?.administrator);

export const useReadonly = () => useSelector((state) => state.session.server?.readonly || state.session.user?.readonly);

export const useDeviceReadonly = () => useSelector((state) => state.session.server?.readonly || state.session.user?.readonly
    || state.session.server?.deviceReadonly || state.session.user?.deviceReadonly);

export const useEditable = () => useSelector((state) => state.session.user?.administrator
    || (!state.session.server?.readonly && !state.session.user?.readonly));
