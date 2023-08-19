import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import theme from './common/theme';

const AppThemeProvider = ({ children }) => {
  const server = useSelector((state) => state.session.server);
  const themeInstance = theme(server);

  return (
    <ThemeProvider theme={themeInstance}>
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
