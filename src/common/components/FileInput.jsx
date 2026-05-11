import { MuiFileInput } from 'mui-file-input';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiOutlinedInput-root > label > span': {
      left: theme.spacing(1.75),
    },
  },
}));

const FileInput = (props) => {
  const { classes } = useStyles();
  return (
    <MuiFileInput
      {...props}
      className={classes.root}
      clearIconButtonProps={{ children: <CloseIcon fontSize="small" /> }}
    />
  );
};

export default FileInput;
