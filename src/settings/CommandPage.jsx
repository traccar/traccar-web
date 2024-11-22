import React, { useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import { useTranslation } from '../common/components/LocalizationProvider';
import BaseCommandView from './components/BaseCommandView';
import SettingsMenu from './components/SettingsMenu';
import useSettingsStyles from './common/useSettingsStyles';

const CommandPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.type;

  return (
    <Box sx={{marginTop:"50px"}}>
    <EditItemView
      endpoint="commands"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedSavedCommand']}
    >
      {item && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              value={item.description || ''}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              label={t('sharedDescription')}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white', 
              },
            
            }}
            />
            <BaseCommandView item={item} setItem={setItem}  sx={{
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      borderRadius: "8px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.23)", // Default border color
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87)", // Hover state
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3f51b5", // Focused state
    },
  }}
/>
          </AccordionDetails>
        </Accordion>
      )}
    </EditItemView>
    </Box>
  );
};

export default CommandPage;
