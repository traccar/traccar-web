import { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import { useEffectAsync } from "../reactHelper";
import { prefixString } from "../common/util/stringUtils";
import { formatBoolean } from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";
import fetchOrThrow from "../common/util/fetchOrThrow";

const NotificationsPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetchOrThrow("/api/notifications");
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const formatList = (prefix, value) => {
    if (value) {
      return value
        .split(/[, ]+/)
        .filter(Boolean)
        .map((it) => t(prefixString(prefix, it)))
        .join(", ");
    }
    return "";
  };

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedNotifications"]}>
      <Paper square>
        <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{t("sharedDescription")}</TableCell>
              <TableCell>{t("notificationType")}</TableCell>
              <TableCell>{t("notificationAlways")}</TableCell>
              <TableCell>{t("sharedAlarms")}</TableCell>
              <TableCell>{t("notificationNotificators")}</TableCell>
              <TableCell className={classes.columnAction} />
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              items.filter(filterByKeyword(searchKeyword)).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{t(prefixString("event", item.type))}</TableCell>
                  <TableCell>{formatBoolean(item.always, t)}</TableCell>
                  <TableCell>
                    {formatList("alarm", item.attributes.alarms)}
                  </TableCell>
                  <TableCell>
                    {formatList("notificator", item.notificators)}
                  </TableCell>
                  <TableCell className={classes.columnAction} padding="none">
                    <CollectionActions
                      itemId={item.id}
                      editPath="/settings/notification"
                      endpoint="notifications"
                      setTimestamp={setTimestamp}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableShimmer columns={5} endAction />
            )}
          </TableBody>
        </Table>
        <CollectionFab editPath="/settings/notification" />
      </Paper>
    </PageLayout>
  );
};

export default NotificationsPage;
