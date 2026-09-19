import { Typography } from '@mui/material';
import PositionValue from './PositionValue';
import StatusLabel from './StatusLabel';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { useTranslation } from './LocalizationProvider';

const PositionDetailsContent = ({ item, classes }) => {
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);

  if (!item) {
    return null;
  }

  const properties = Object.getOwnPropertyNames(item).filter((key) => key !== 'attributes');
  const attributes = Object.getOwnPropertyNames(item.attributes || {});

  return (
    <>
      {properties.map((property) => (
        <div key={property} className={classes.row}>
          <StatusLabel
            fieldKey={property}
            name={positionAttributes[property]?.name || property}
            classes={classes}
          />
          <Typography className={classes.value} component="div">
            <PositionValue position={item} property={property} />
          </Typography>
        </div>
      ))}
      {attributes.map((attribute) => (
        <div key={attribute} className={classes.row}>
          <StatusLabel
            fieldKey={attribute}
            name={positionAttributes[attribute]?.name || attribute}
            classes={classes}
          />
          <Typography className={classes.value} component="div">
            <PositionValue position={item} attribute={attribute} />
          </Typography>
        </div>
      ))}
    </>
  );
};

export default PositionDetailsContent;
