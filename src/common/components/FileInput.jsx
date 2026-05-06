import { MuiFileInput } from 'mui-file-input';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiOutlinedInput-root > label > span': {
      left: theme.spacing(1.75),
    },
  },
}));

const FileInput = (props) => {
  const { classes } = useStyles();
  return <MuiFileInput {...props} className={classes.root} />;
};

export default FileInput;
