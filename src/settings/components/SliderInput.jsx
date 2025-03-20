import React from 'react';
import {
  FormControl,
  IconButton,
  Slider,
  Input,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SliderInput = ({ label, value, onChange, min, max, onDelete, decimalPlaces = 0 }) => {
  const step = 10 ** -decimalPlaces;

  const handleInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (!Number.isNaN(newValue)) {
      onChange(null, newValue);
    }
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(null, min);
    } else if (value > max) {
      onChange(null, max);
    }
  };

  return (
    <FormControl className="MuiFormControl-root muiltr-1nrlq1o-MuiFormControl-root" fullWidth>
      <label
        className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-outlined muiltr-spzfzy-MuiFormLabel-root-MuiInputLabel-root"
        data-shrink="true"
      >
        {label}
      </label>
      <div
        className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-adornedEnd muiltr-la4e48-MuiInputBase-root-MuiOutlinedInput-root"
        style={{ display: 'flex', alignItems: 'center', height: '40px' }}
      >
        <Grid container spacing={6} sx={{ alignItems: 'center', flex: 1 }}>
          <Grid item xs={9}>
            <Slider
              value={typeof value === 'number' ? value : min}
              onChange={onChange}
              aria-labelledby="input-slider"
              min={min}
              max={max}
              step={step}
              style={{ marginTop: '10px', marginLeft: '20px' }}
              className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall MuiInputBase-inputAdornedEnd muiltr-ciig1k-MuiInputBase-input-MuiOutlinedInput-input"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step,
                min,
                max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
        <div className="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeSmall muiltr-1laqsz7-MuiInputAdornment-root">
          <IconButton
            className="MuiButtonBase-root MuiIconButton-root MuiIconButton-edgeEnd MuiIconButton-sizeSmall muiltr-1bkxqye-MuiButtonBase-root-MuiIconButton-root"
            tabIndex="0"
            type="button"
            onClick={onDelete}
            style={{ padding: '4px' }}
          >
            <CloseIcon className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall muiltr-ptiqhd-MuiSvgIcon-root" />
          </IconButton>
        </div>
        <fieldset
          aria-hidden="true"
          className="MuiOutlinedInput-notchedOutline muiltr-1d3z3hw-MuiOutlinedInput-notchedOutline"
        >
          <legend className="muiltr-14lo706">
            <span>{label}</span>
          </legend>
        </fieldset>
      </div>
    </FormControl>
  );
};

export default SliderInput;
