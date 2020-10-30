import React, { useState } from "react";
import MainToolbar from "../MainToolbar";
import {
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  makeStyles,
} from "@material-ui/core";
import t from "../common/localization";
import { formatPosition } from "../common/formatter";
import ReportFilter from "./ReportFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(1, 2, 2),
  },
}));

const EventReportPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);

  const handleSubmit = (deviceId, from, to) => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    fetch(`/api/reports/events?${query.toString()}`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (response.ok) {
        response.json().then(setData);
      }
    });
  };

  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <Paper className={classes.form}>
              <ReportFilter handleSubmit={handleSubmit} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("positionFixTime")}</TableCell>
                    <TableCell>{t("sharedType")}</TableCell>
                    <TableCell>{t("sharedGeofence")}</TableCell>
                    <TableCell>{t("sharedMaintenance")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {formatPosition(item, "serverTime")}
                      </TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{}</TableCell>
                      <TableCell>{}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default EventReportPage;
