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
  Box,
  Tooltip,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AddAttributeDialog from './AddAttributeDialog';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

import {
  distanceFromMeters,
  distanceToMeters,
  distanceUnitString,
  speedFromKnots,
  speedToKnots,
  speedUnitString,
  volumeFromLiters,
  volumeToLiters,
  volumeUnitString,
} from '../../common/util/converter';

import useFeatures from '../../common/util/useFeatures';
import useSettingsStyles from '../common/useSettingsStyles';

const colorPalette = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];

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

  const speedUnit = useAttributePreference('speedUnit');
  const distanceUnit = useAttributePreference('distanceUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [addDialogShown, setAddDialogShown] = useState(false);

  const updateAttribute = (key, value, type, subtype) => {
    const updatedAttributes = { ...attributes };

    switch (subtype) {
      case 'speed':
        updatedAttributes[key] = speedToKnots(Number(value), speedUnit);
        break;

      case 'distance':
        updatedAttributes[key] = distanceToMeters(Number(value), distanceUnit);
        break;

      case 'volume':
        updatedAttributes[key] = volumeToLiters(Number(value), volumeUnit);
        break;

      default:
        updatedAttributes[key] = type === 'number' ? Number(value) : value;
        break;
    }

    setAttributes(updatedAttributes);
  };

  const deleteAttribute = (key) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
  };

  const getAttributeName = (key, subtype) => {
    const definition = definitions[key];
    const name = definition ? definition.name : key;

    switch (subtype) {
      case 'speed':
        return `${name} (${speedUnitString(speedUnit, t)})`;

      case 'distance':
        return `${name} (${distanceUnitString(distanceUnit, t)})`;

      case 'volume':
        return `${name} (${volumeUnitString(volumeUnit, t)})`;

      default:
        return name;
    }
  };

  const getAttributeType = (value) => {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'string';
  };

  const getAttributeSubtype = (key) => {
    const definition = definitions[key];
    return definition && definition.subtype;
  };

  const getDisplayValue = (value, subtype) => {
    if (!value) return '';

    switch (subtype) {
      case 'speed':
        return speedFromKnots(value, speedUnit);

      case 'distance':
        return distanceFromMeters(value, distanceUnit);

      case 'volume':
        return volumeFromLiters(value, volumeUnit);

      default:
        return value;
    }
  };

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
        const subtype = getAttributeSubtype(key);

        const item = { key, value, type, subtype };

        if (type === 'boolean') booleanList.push(item);
        else otherList.push(item);
      });

    return [...otherList, ...booleanList];
  };

  const handleAddResult = (definition) => {
    setAddDialogShown(false);

    if (!definition) return;

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
  };

  return features.disableAttributes ? (
    ''
  ) : (
    <Accordion defaultExpanded={!!attribute}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t('sharedAttributes')}</Typography>
      </AccordionSummary>

      <AccordionDetails className={classes.details}>
        {convertToList(attributes).map(({ key, value, type, subtype }) => {
          if (type === 'boolean') {
            return (
              <Grid container justifyContent="space-between" key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => updateAttribute(key, e.target.checked)}
                    />
                  }
                  label={getAttributeName(key, subtype)}
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

          if (key === 'color') {
            return (
              <FormControl key={key} fullWidth>
                <InputLabel shrink>{getAttributeName(key, subtype)}</InputLabel>

                <Box mt={2}>
                  {/* palette */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {colorPalette.map((color) => (
                      <Tooltip key={color} title={color}>
                        <Box
                          onClick={() => updateAttribute(key, color)}
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            backgroundColor: color,
                            border: value === color ? '3px solid black' : '1px solid #ccc',
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>

                  {/* picker + preview */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <input
                      type="color"
                      value={value || '#2196f3'}
                      onChange={(e) => updateAttribute(key, e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    />

                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: value || '#2196f3',
                        border: '1px solid #ccc',
                      }}
                    />

                    <IconButton size="small" onClick={() => deleteAttribute(key)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </FormControl>
            );
          }

          return (
            <FormControl key={key}>
              <InputLabel>{getAttributeName(key, subtype)}</InputLabel>

              <OutlinedInput
                label={getAttributeName(key, subtype)}
                type={type === 'number' ? 'number' : 'text'}
                value={getDisplayValue(value, subtype)}
                onChange={(e) => updateAttribute(key, e.target.value, type, subtype)}
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
