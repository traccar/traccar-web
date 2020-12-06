import React, { useState } from 'react';

import t from '../common/localization';

import { Button, Checkbox, FilledInput, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, makeStyles } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import AddAttributeDialog from './AddAttributeDialog';

const useStyles = makeStyles(theme => ({
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

  const [addDialogShown, setAddDialogShown] = useState(false);

  const convertToList = (attributes) => {
    let booleanList = [];
    let otherList = [];
    for (const key in attributes) {
      const value = attributes[key];
      const type = getAttributeType(value);
      if (type === 'boolean') {
        booleanList.push({ key, value, type });
      } else {
        otherList.push({ key, value, type });
      }
    }
    return otherList.concat(booleanList);
  }

  const handleAddResult = (definition) => {
    setAddDialogShown(false);
    if (definition) {
      switch(definition.type) {
        case 'number':
          updateAttribute(definition.key, 0);
          break;
        case 'boolean':
          updateAttribute(definition.key, false);
          break;
        default:
          updateAttribute(definition.key, "");
          break;
      }
    }
  }

  const updateAttribute = (key, value) => {
    let updatedAttributes = {...attributes};
    updatedAttributes[key] = value;
    setAttributes(updatedAttributes);
  };

  const deleteAttribute = (key) => {
    let updatedAttributes = {...attributes};
    delete updatedAttributes[key];
    setAttributes(updatedAttributes);
  };

  const getAttributeName = (key) => {
    const definition = definitions[key];
    return definition ? definition.name : key;
  };

  const getAttributeType = (value) => {
    if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else {
      return 'string';
    }
  };

  return (
    <>
      {convertToList(attributes).map(({ key, value, type }) => {
        if (type === 'boolean') {
          return (
            <Grid container direction="row" justify="space-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={e => updateAttribute(key, e.target.checked)}
                    />
                }
                label={getAttributeName(key)} />
              <IconButton className={classes.removeButton} onClick={() => deleteAttribute(key)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          );
        } else {
          return (
            <FormControl variant="filled" margin="normal" key={key}>
              <InputLabel>{getAttributeName(key)}</InputLabel>
              <FilledInput
                type={type === 'number' ? 'number' : 'text'}
                value={value || ''}
                onChange={e => updateAttribute(key, e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => deleteAttribute(key)}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                }
                />
            </FormControl>
          );
        }
      })}
      <Button
        size="large"
        variant="outlined"
        color="primary"
        onClick={() => setAddDialogShown(true)}
        startIcon={<AddIcon />}
        className={classes.addButton}>
        {t('sharedAdd')}
      </Button>
      <AddAttributeDialog
        open={addDialogShown}
        onResult={handleAddResult}
        definitions={definitions}
        />
    </>
  );
}

export default EditAttributesView;
