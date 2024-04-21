import React from 'react';
import { TextField, useTheme, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from '../../common/components/LocalizationProvider';

export const filterByKeyword = (keyword) => (item) => !keyword || JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase());

const useStyles = makeStyles((theme) => ({
  header: {
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: theme.spacing(3, 2, 2),
  },
}));

const SearchHeader = ({ keyword, setKeyword }) => {
  const theme = useTheme();
  const classes = useStyles();
  const t = useTranslation();

  const phone = useMediaQuery(theme.breakpoints.down('sm'));

  return phone ? (
    <div className={classes.header}>
      <TextField
        variant="outlined"
        placeholder={t('sharedSearch')}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  ) : '';
};

export default SearchHeader;
