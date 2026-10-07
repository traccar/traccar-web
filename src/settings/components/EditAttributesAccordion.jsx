import { useState } from 'react';

import {
  Button,
  Checkbox,
  OutlinedInput,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddAttributeDialog from './AddAttributeDialog';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useAttributeUnits from '../../common/util/useAttributeUnits';
import {
  attributeFromRaw,
  attributeToRaw,
  attributeUnitString,
} from '../../common/util/attributeUnits';
import useFeatures from '../../common/util/useFeatures';
import useSettingsStyles from '../common/useSettingsStyles';

const EditAttributesAccordion = ({
  attribute,
  attributes,
  setAttributes,
  definitions,
  focusAttribute,
}) => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const features = useFeatures();

  const units = useAttributeUnits();

  const [addDialogShown, setAddDialogShown] = useState(false);

  const updateAttribute = (key, value, type, dataType) => {
    const updatedAttributes = { ...attributes };
    updatedAttributes[key] = attributeToRaw(
      type === 'number' ? Number(value) : value,
      dataType,
      units,
    );
    setAttributes(updatedAttributes);
  };

  const deleteAttribute = (key) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
  };

  const getAttributeName = (key, dataType) => {
    const definition = definitions[key];
    const name = definition ? definition.name : key;
    const unit = attributeUnitString(dataType, units, t);
    return unit ? `${name} (${unit})` : name;
  };

  const getAttributeType = (value) => {
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    return 'string';
  };

  const getAttributeDataType = (key) => {
    const definition = definitions[key];
    return definition && definition.dataType;
  };

  const getDisplayValue = (value, dataType) => attributeFromRaw(value, dataType, units) ?? '';

  const convertToList = (attributes) => {
    const booleanList = [];
    const otherList = [];
    const excludeAttributes = [
      'speedUnit',
      'distanceUnit',
      'altitudeUnit',
      'volumeUnit',
      'timezone',
    ];
    Object.keys(attributes || [])
      .filter((key) => !excludeAttributes.includes(key))
      .forEach((key) => {
        const value = attributes[key];
        const type = getAttributeType(value);
        const dataType = getAttributeDataType(key);
        if (type === 'boolean') {
          booleanList.push({
            key,
            value,
            type,
            dataType,
          });
        } else {
          otherList.push({
            key,
            value,
            type,
            dataType,
          });
        }
      });
    return [...otherList, ...booleanList];
  };

  const handleAddResult = (definition) => {
    setAddDialogShown(false);
    if (definition) {
      switch (definition.type) {
        case 'number':
          updateAttribute(definition.key, 0);
          break;
        case 'boolean':
          updateAttribute(definition.key, false);
          break;
        default:
          updateAttribute(definition.key, '');
          break;
      }
    }
  };

  return features.disableAttributes ? (
    ''
  ) : (
    <Accordion defaultExpanded={!!attribute}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t('sharedAttributes')}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {convertToList(attributes).map(({ key, value, type, dataType }) => {
          if (type === 'boolean') {
            return (
              <Grid container direction="row" justifyContent="space-between" key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => updateAttribute(key, e.target.checked)}
                    />
                  }
                  label={getAttributeName(key, dataType)}
                />
                <IconButton
                  size="small"
                  className={classes.removeButton}
                  onClick={() => deleteAttribute(key)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
            );
          }
          return (
            <FormControl key={key}>
              <InputLabel>{getAttributeName(key, dataType)}</InputLabel>
              <OutlinedInput
                label={getAttributeName(key, dataType)}
                type={type === 'number' ? 'number' : 'text'}
                value={getDisplayValue(value, dataType)}
                onChange={(e) => updateAttribute(key, e.target.value, type, dataType)}
                autoFocus={focusAttribute === key}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton size="small" edge="end" onClick={() => deleteAttribute(key)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          );
        })}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddDialogShown(true)}
          startIcon={<AddIcon />}
        >
          {t('sharedAdd')}
        </Button>
        <AddAttributeDialog
          open={addDialogShown}
          onResult={handleAddResult}
          definitions={definitions}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default EditAttributesAccordion;
