import { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper
} from "@mui/material";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import { useAdministrator } from "../common/util/permissions";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";
import fetchOrThrow from "../common/util/fetchOrThrow";

const ComputedAttributesPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const administrator = useAdministrator();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetchOrThrow("/api/attributes/computed");
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedComputedAttributes"]}>
      <Paper square>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t("sharedDescription")}</TableCell>
            <TableCell>{t("sharedAttribute")}</TableCell>
            <TableCell>{t("sharedExpression")}</TableCell>
            <TableCell>{t("sharedType")}</TableCell>
            {administrator && <TableCell className={classes.columnAction} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? (
            items.filter(filterByKeyword(searchKeyword)).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.attribute}</TableCell>
                <TableCell>{item.expression}</TableCell>
                <TableCell>{item.type}</TableCell>
                {administrator && (
                  <TableCell className={classes.columnAction} padding="none">
                    <CollectionActions
                      itemId={item.id}
                      editPath="/settings/attribute"
                      endpoint="attributes/computed"
                      setTimestamp={setTimestamp}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableShimmer
              columns={administrator ? 5 : 4}
              endAction={administrator}
            />
          )}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/attribute" disabled={!administrator} />
      </Paper>
    </PageLayout>
  );
};

export default ComputedAttributesPage;
