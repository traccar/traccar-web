import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  IconButton,
  Paper,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import ReportsMenu from "./components/ReportsMenu";
import TableShimmer from "../common/components/TableShimmer";
import RemoveDialog from "../common/components/RemoveDialog";
import fetchOrThrow from "../common/util/fetchOrThrow";

const useStyles = makeStyles()((theme) => ({
  columnAction: {
    width: "1%",
    paddingRight: theme.spacing(1),
  },
}));

const ScheduledPage = () => {
  const { classes } = useStyles();
  const t = useTranslation();

  const calendars = useSelector((state) => state.calendars.items);

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetchOrThrow("/api/reports");
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const formatType = (type) => {
    switch (type) {
      case "events":
        return t("reportEvents");
      case "route":
        return t("reportPositions");
      case "summary":
        return t("reportSummary");
      case "trips":
        return t("reportTrips");
      case "stops":
        return t("reportStops");
      default:
        return type;
    }
  };

  return (
    <PageLayout
      menu={<ReportsMenu />}
      breadcrumbs={["settingsTitle", "reportScheduled"]}>
      <Paper
        square
        style={{
          width: "100%",
          height: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("sharedType")}</TableCell>
              <TableCell>{t("sharedDescription")}</TableCell>
              <TableCell>{t("sharedCalendar")}</TableCell>
              <TableCell className={classes.columnAction} />
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatType(item.type)}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{calendars[item.calendarId].name}</TableCell>
                  <TableCell className={classes.columnAction} padding="none">
                    <IconButton
                      size="small"
                      onClick={() => setRemovingId(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableShimmer columns={4} endAction />
            )}
          </TableBody>
        </Table>
        <RemoveDialog
          style={{ transform: "none" }}
          open={!!removingId}
          endpoint="reports"
          itemId={removingId}
          onResult={(removed) => {
            setRemovingId(null);
            if (removed) {
              setTimestamp(Date.now());
            }
          }}
        />
      </Paper>
    </PageLayout>
  );
};

export default ScheduledPage;
