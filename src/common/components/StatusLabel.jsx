import { Typography } from '@mui/material';
import { getPositionFieldIcon } from '../util/positionFieldIcons';

const StatusLabel = ({ fieldKey, name, classes }) => {
  const iconConfig = getPositionFieldIcon(fieldKey);

  if (!iconConfig) {
    return (
      <Typography className={classes.label}>{name}</Typography>
    );
  }

  const { Icon, color } = iconConfig;

  return (
    <div className={classes.labelCell}>
      <span
        className={classes.labelIconWrap}
        style={{ backgroundColor: `${color}16` }}
      >
        <Icon sx={{ color, fontSize: 14 }} />
      </span>
      <Typography className={classes.labelText}>{name}</Typography>
    </div>
  );
};

export default StatusLabel;
