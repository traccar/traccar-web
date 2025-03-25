import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';
import { Card, Typography, IconButton, CardContent, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { catchActions } from '../../store/catch';
import dayjs from 'dayjs';
import PieChartComponent from './PieChart';

const useStyles = makeStyles((theme: any) => ({
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: 'difference',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 0, 2),
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiTableCell-sizeSmall:first-child': {
      paddingRight: theme.spacing(1),
    },
  },
  cell: {
    borderBottom: 'none',
  },
  actions: {
    justifyContent: 'space-between',
  },
  root: ({ desktopPadding }: any) => ({
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${
        theme.dimensions.bottomBarHeight
      }px)`,
    },
    transform: 'translateX(-50%)',
  }),
}));

const CatchCard = ({ desktopPadding = 0 }) => {
  const classes = useStyles({ desktopPadding });
  const dispatch = useDispatch();

  const [data, setData] = useState<any[]>([]);
  const catchDetails = useSelector((state: any) => state.catch.catchDetails);
  useEffect(() => {
    if (catchDetails) {
      const fishCatch = JSON.parse(catchDetails?.catchDetails);
      const tempData: any[] = [];
      fishCatch?.map((item) =>
        tempData.push({ name: item.name, value: item.quantity })
      );
      setData(tempData);
    }
  }, [catchDetails]);

  const convertToSWFormat = (latitude, longitude) => {
    const latDirection = latitude < 0 ? 'S' : 'N';
    const lonDirection = longitude < 0 ? 'W' : 'E';

    // Convert latitude and longitude into absolute values and round to 2 decimal places
    const latDegree = Math.abs(latitude).toFixed(2);
    const lonDegree = Math.abs(longitude).toFixed(2);

    return `${latDegree}°${latDirection}, ${lonDegree}°${lonDirection}`;
  };
  return (
    <>
      <div className={classes.root}>
        {catchDetails && (
          <Draggable handle={`.${classes.media}, .${classes.header}`}>
            <Card elevation={3} className={classes.card}>
              <div className={classes.header}>
                <Typography variant="body2" color="textPrimary">
                  {catchDetails.vesselID}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => dispatch(catchActions.clearDetails())}
                  onTouchStart={() => dispatch(catchActions.clearDetails())}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <CardContent>
                <PieChartComponent data={data} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary">
                   Catch Date -{' '}
                    {dayjs(catchDetails.date).locale('en').format('YYYY-MM-DD')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary">
                    Fishing Technique - {catchDetails.fishingTechnique}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary">
                    Position -{' '}
                    {convertToSWFormat(
                      catchDetails.latitude,
                      catchDetails.longitude
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Draggable>
        )}
      </div>
    </>
  );
};

export default CatchCard;
