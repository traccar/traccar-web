import React, { useEffect, useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, TextField, FormControlLabel, Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditItemView from '../EditItemView';
import { useTranslation } from '../LocalizationProvider';
import SelectField from '../form/SelectField';
import { prefixString } from '../common/stringUtils';
import useCommandAttributes from '../attributes/useCommandAttributes';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const CommandPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const availableAttributes = useCommandAttributes(t);

  const [item, setItem] = useState();
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    if (item && item.type) {
      setAttributes(availableAttributes[item.type] || []);
    }
  }, [availableAttributes, item]);

  const validate = () => item && item.type;

  return (
    <EditItemView endpoint="commands" item={item} setItem={setItem} validate={validate}>
      {item && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              margin="normal"
              value={item.description || ''}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              label={t('sharedDescription')}
              variant="filled"
            />
            <SelectField
              margin="normal"
              value={item.type || 'custom'}
              emptyValue={null}
              onChange={(e) => setItem({ ...item, type: e.target.value, attributes: {} })}
              endpoint="/api/commands/types"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('command', it.type))}
              label={t('sharedType')}
              variant="filled"
            />
            {attributes.map((attribute) => (
              <TextField
                margin="normal"
                value={item.attributes[attribute.key]}
                onChange={(e) => {
                  const updateItem = { ...item, attributes: { ...item.attributes } };
                  updateItem.attributes[attribute.key] = e.target.value;
                  setItem(updateItem);
                }}
                label={attribute.name}
                variant="filled"
              />
            ))}
            <FormControlLabel
              control={<Checkbox checked={item.textChannel} onChange={(event) => setItem({ ...item, textChannel: event.target.checked })} />}
              label={t('commandSendSms')}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </EditItemView>
  );
};

export default CommandPage;
