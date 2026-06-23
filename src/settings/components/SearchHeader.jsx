import { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
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
  const { classes } = useStyles();
  const t = useTranslation();

  const [input, setInput] = useState(keyword);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => setKeyword(input), 500);
    return () => clearTimeout(timerRef.current);
  }, [input, setKeyword]);

  return (
    <div className={classes.header}>
      <TextField
        variant="outlined"
        placeholder={t('sharedSearch')}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default SearchHeader;
