import React, { useState, useRef, useEffect } from 'react';

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
import { SketchPicker } from 'react-color';
import AddAttributeDialog from './AddAttributeDialog';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';
import {
  distanceFromMeters, distanceToMeters, distanceUnitString, speedFromKnots, speedToKnots, speedUnitString, volumeFromLiters, volumeToLiters, volumeUnitString,
} from '../../common/util/converter';
import useFeatures from '../../common/util/useFeatures';
import useSettingsStyles from '../common/useSettingsStyles';
import SliderInput from './SliderInput';

const EditAttributesAccordion = ({ attribute, attributes, setAttributes, definitions, focusAttribute }) => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const features = useFeatures();

  const speedUnit = useAttributePreference('speedUnit');
  const distanceUnit = useAttributePreference('distanceUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [addDialogShown, setAddDialogShown] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const colorPickerRef = useRef(null);

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
    if (typeof value === 'number') {
      return 'number';
    } if (typeof value === 'boolean') {
      return 'boolean';
    }
    return 'string';
  };

  const getAttributeSubtype = (key) => {
    const definition = definitions[key];
    return definition && definition.subtype;
  };

  const getDisplayValue = (value, subtype) => {
    if (value) {
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
    }
    return '';
  };

  const convertToList = (attributes) => {
    const booleanList = [];
    const otherList = [];
    const excludeAttributes = ['speedUnit', 'distanceUnit', 'volumeUnit', 'timezone'];
    Object.keys(attributes || []).filter((key) => !excludeAttributes.includes(key)).forEach((key) => {
      const value = attributes[key];
      const type = getAttributeType(value);
      const subtype = getAttributeSubtype(key);
      if (type === 'boolean') {
        booleanList.push({
          key, value, type, subtype,
        });
      } else {
        otherList.push({
          key, value, type, subtype,
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

  const handleColorChange = (color, key) => {
    const updatedAttributes = { ...attributes };
    updatedAttributes[key] = color.hex;
    setAttributes(updatedAttributes);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerOpen && colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setColorPickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerOpen]);

  return features.disableAttributes ? '' : (
    <Accordion defaultExpanded={!!attribute}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">
          {t('sharedAttributes')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {convertToList(attributes).map(({
          key, value, type, subtype,
        }) => {
          if (type === 'boolean') {
            return (
              <Grid container direction="row" justifyContent="space-between" key={key}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={value}
                      onChange={(e) => updateAttribute(key, e.target.checked)}
                    />
                  )}
                  label={getAttributeName(key, subtype)}
                />
                <IconButton size="small" className={classes.removeButton} onClick={() => deleteAttribute(key)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
            );
          }
          if (subtype === 'color') {
            return (
              <FormControl key={key}>
                <InputLabel>{getAttributeName(key, subtype)}</InputLabel>
                <OutlinedInput
                  label={getAttributeName(key, subtype)}
                  value={value}
                  onChange={(e) => updateAttribute(key, e.target.value, type, subtype)}
                  endAdornment={(
                    <InputAdornment position="end">
                      {/* Color preview block */}
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: value, // Use the current color value
                          marginRight: '8px',
                          border: '1px solid #ccc',
                        }}
                      />
                      <IconButton size="small" onClick={() => setColorPickerOpen(key)}>
                        ... {/* Your color picker icon */}
                      </IconButton>
                      <IconButton size="small" edge="end" onClick={() => deleteAttribute(key)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
                {colorPickerOpen === key && (
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 1000,
                      right: 0,
                      top: '100%',
                    }}
                    ref={colorPickerRef}
                  >
                    <div style={{ position: 'relative' }}>
                      <SketchPicker
                        color={value}
                        onChange={(color) => handleColorChange(color, key)}
                      />
                    </div>
                  </div>
                )}
              </FormControl>
            );
          }
          if (subtype === 'range') {
            const definition = definitions[key];
            const rangeMin = definition?.rangeMin || 0;
            const rangeMax = definition?.rangeMax || 100;
            const decimalPlaces = definition?.decimalPlaces || 0;
            return (
              <SliderInput
                label={getAttributeName(key, subtype)}
                value={value}
                onChange={(event, newValue) => updateAttribute(key, newValue, 'number', subtype)}
                min={rangeMin}
                max={rangeMax}
                decimalPlaces={decimalPlaces}
                onDelete={() => deleteAttribute(key)}
                key={key}
              />
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
                endAdornment={(
                  <InputAdornment position="end">
                    <IconButton size="small" edge="end" onClick={() => deleteAttribute(key)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )}
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
