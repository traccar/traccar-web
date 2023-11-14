import React from "react";
import Draggable from "react-draggable";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import { useSelector } from "react-redux";

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

const MobileGroupStatusCard = ({ position, onClose, desktopPadding = 0 }) => {
  const t = useTranslation();
  const { language } = useLocalization();
  const classes = useStyles({ desktopPadding });
  const mobileGroupStatuses = useSelector(
    (state) => state.dictionaries.mobileGroupStatuses
  );

  const groupStatus = mobileGroupStatuses.find(
    (item) => item?.value == position?.["mobileGroup.groupStatus"]
  );

  const groupNumber = position?.["mobileGroup.groupNumber"];
  const groupRole =
    position?.["mobileGroup.groupInspector.jobTitleFunction.name"];
  const groupPhoneNumber = position?.["mobileGroup.groupNumber"];

  const rows = [
    {
      name: t("axelorMobileGroupStatus"),
      content: groupStatus?.[`title_${language}`] ?? groupStatus?.title ?? "",
    },
    {
      name: t("axelorMobileGroupNumber"),
      content: groupNumber ?? "",
    },
    {
      name: t("axelorMobileGroupChiefInspector"),
      content: groupRole ?? "",
    },
    {
      name: t("axelorMobileGroupPhoneNumber"),
      content: groupPhoneNumber ?? "",
    },
  ];

  return (
    <div className={classes.root}>
      <Draggable handle={`.${classes.media}, .${classes.header}`}>
        <Card elevation={3} className={classes.card}>
          {position && (
            <CardContent className={classes.content}>
              <Table size="small" classes={{ root: classes.table }}>
                <TableBody>
                  {rows.map(({ name, content }, index) => (
                    <StatusRow key={index} name={name} content={content} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      </Draggable>
    </div>
  );
};

export default MobileGroupStatusCard;
