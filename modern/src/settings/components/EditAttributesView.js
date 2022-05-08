import React, { useState } from 'react';

import {
  Button, Checkbox, FilledInput, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import AddAttributeDialog from './AddAttributeDialog';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';
import {
  distanceFromMeters, distanceToMeters, distanceUnitString, speedFromKnots, speedToKnots, speedUnitString, volumeFromLiters, volumeToLiters, volumeUnitString,
} from '../../common/util/converter';

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  removeButton: {
    marginRight: theme.spacing(1.5),
  },
}));

const EditAttributesView = ({ attributes, setAttributes, definitions }) => {
  const classes = useStyles();
  const t = useTranslation();

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

  return (
    <>
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
              <IconButton className={classes.removeButton} onClick={() => deleteAttribute(key)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          );
        }
        return (
          <FormControl variant="filled" margin="normal" key={key}>
            <InputLabel>{getAttributeName(key, subtype)}</InputLabel>
            <FilledInput
              type={type === 'number' ? 'number' : 'text'}
              value={getDisplayValue(value, subtype)}
              onChange={(e) => updateAttribute(key, e.target.value, type, subtype)}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton onClick={() => deleteAttribute(key)}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )}
            />
          </FormControl>
        );
      })}
      <Button
        size="large"
        variant="outlined"
        color="primary"
        onClick={() => setAddDialogShown(true)}
        startIcon={<AddIcon />}
        className={classes.addButton}
      >
        {t('sharedAdd')}
      </Button>
      <AddAttributeDialog
        open={addDialogShown}
        onResult={handleAddResult}
        definitions={definitions}
      />
    </>
  );
};

export default EditAttributesView;
