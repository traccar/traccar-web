import React from "react";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CardMedia,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "../common/components/LocalizationProvider";
import PositionValue from "../common/components/PositionValue";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import { useAttributePreference } from "../common/util/preferences";

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: "auto",
    width: theme.dimensions.popupMaxWidth,
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: "difference",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1, 1, 0, 2),
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: "auto",
  },
  delete: {
    color: theme.palette.error.main,
  },
  icon: {
    width: "25px",
    height: "25px",
    filter: "brightness(0) invert(1)",
  },
  table: {
    "& .MuiTableCell-sizeSmall": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  cell: {
    borderBottom: "none",
  },
  actions: {
    justifyContent: "space-between",
  },
  root: ({ desktopPadding }) => ({
    pointerEvents: "none",
    position: "fixed",
    zIndex: 5,
    left: "50%",
    [theme.breakpoints.up("md")]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down("md")]: {
      left: "50%",
      bottom: `calc(${theme.spacing(3)} + ${
        theme.dimensions.bottomBarHeight
      }px)`,
    },
    transform: "translateX(-50%)",
  }),
}));

const StatusRow = ({ name, content }) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose, desktopPadding = 0 }) => {
  const classes = useStyles({ desktopPadding });
  const t = useTranslation();

  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    "positionItems",
    "speed,address,totalDistance,course"
  );

  return (
    <div className={classes.root}>
      {device && (
        <Draggable handle={`.${classes.media}, .${classes.header}`}>
          <Card elevation={3} className={classes.card}>
            {deviceImage ? (
              <CardMedia
                className={classes.media}
                image={`/api/media/${device.uniqueId}/${deviceImage}`}
              >
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize="small" className={classes.mediaButton} />
                </IconButton>
              </CardMedia>
            ) : (
              <div className={classes.header}>
                <Typography variant="body2" color="textSecondary">
                  {device.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            {position && (
              <CardContent className={classes.content}>
                <Table size="small" classes={{ root: classes.table }}>
                  <TableBody>
                    {positionItems
                      .split(",")
                      .filter(
                        (key) =>
                          position.hasOwnProperty(key) ||
                          position.attributes.hasOwnProperty(key)
                      )
                      .map((key) => (
                        <StatusRow
                          key={key}
                          name={
                            positionAttributes.hasOwnProperty(key)
                              ? positionAttributes[key].name
                              : key
                          }
                          content={
                            <PositionValue
                              position={position}
                              property={
                                position.hasOwnProperty(key) ? key : null
                              }
                              attribute={
                                position.hasOwnProperty(key) ? null : key
                              }
                            />
                          }
                        />
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </Draggable>
      )}
    </div>
  );
};

export default StatusCard;
