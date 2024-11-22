import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Checkbox,
  TableSortLabel,
  Toolbar,
  TextField,
  IconButton,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import { useAdministrator } from "../common/util/permissions";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import TableShimmer from "../common/components/TableShimmer";
import { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";

const ComputedAttributesPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("description");
  const [selected, setSelected] = useState([]);
  const administrator = useAdministrator();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/attributes/computed");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = items.map((item) => item.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedItems = [...items].sort((a, b) => {
    const isAsc = order === "asc";
    if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
    return 0;
  });

  const filteredItems = sortedItems.filter(filterByKeyword(searchKeyword));
  const displayedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ marginTop: "20px" }}>
      <PageLayout
        menu={<SettingsMenu />}
        breadcrumbs={["settingsTitle", "sharedComputedAttributes"]}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" m="30px">
          <Typography variant="h5">{t("sharedComputedAttributes")}</Typography>
        </Box>
        <Paper sx={{ margin: "30px", borderRadius: "10px" }}>
          <Toolbar sx={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
            <TextField
              variant="outlined"
              placeholder="Search Computed Attributes..."
              size="small"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton edge="start" size="small" sx={{ mr: 1 }}>
                    <Search />
                  </IconButton>
                ),
              }}
              sx={{
                flex: 1,
                maxWidth: "300px",
                backgroundColor: "white",
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white', 
                },
                borderRadius: "8px",
              }}
            />
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < items.length
                      }
                      checked={
                        items.length > 0 && selected.length === items.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "description"}
                      direction={orderBy === "description" ? order : "asc"}
                      onClick={() => handleRequestSort("description")}
                    >
                      {t("sharedDescription")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>{t("sharedAttribute")}</TableCell>
                  <TableCell>{t("sharedExpression")}</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "type"}
                      direction={orderBy === "type" ? order : "asc"}
                      onClick={() => handleRequestSort("type")}
                    >
                      {t("sharedType")}
                    </TableSortLabel>
                  </TableCell>
                  {administrator && <TableCell align="right">{t("sharedActions")}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  displayedItems.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      selected={selected.indexOf(item.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selected.indexOf(item.id) !== -1}
                          onClick={() => handleCheckboxClick(item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.attribute}</TableCell>
                      <TableCell>{item.expression}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      {administrator && <TableCell align="right">{t("actionsPlaceholder")}</TableCell>}
                    </TableRow>
                  ))
                ) : (
                  <TableShimmer columns={administrator ? 6 : 5} endAction={administrator} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </PageLayout>
    </Box>
  );
};

export default ComputedAttributesPage;
