import React, { useState, useMemo } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Toolbar,
  TextField,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Button,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";
import { useNavigate } from "react-router-dom";

const DriversPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/drivers");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedItems = useMemo(() => {
    return items.slice().sort((a, b) => {
      const aValue = a[orderBy]?.toString() || "";
      const bValue = b[orderBy]?.toString() || "";
      return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [items, order, orderBy]);

  const filteredItems = sortedItems.filter(filterByKeyword(searchKeyword));
  const displayedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ marginTop: "20px" }}>
      <PageLayout menu={<SettingsMenu />} breadcrumbs={["settingsTitle", "sharedDrivers"]}>
        <Box display="flex" alignItems="center" justifyContent="space-between" m="30px">
          <Typography variant="h5">{t("sharedDrivers")}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/settings/driver")}
            sx={{
              padding: "10px 20px",
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "8px",
            }}
          >
            {t("newDriver")} New Driver
          </Button>
        </Box>
        <Paper sx={{ margin: "30px", borderRadius: "10px" }}>
          <Toolbar sx={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
            <TextField
              variant="outlined"
              placeholder="Search Driver ..."
              size="small"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton edge="start" size="small" sx={{ mr: 1 }}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{
                flex: 1,
                maxWidth: "300px",
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                },
              }}
            />
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, "name")}
                    >
                      {t("sharedName")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "uniqueId"}
                      direction={orderBy === "uniqueId" ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, "uniqueId")}
                    >
                      {t("deviceIdentifier")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">{t("sharedActions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  displayedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.uniqueId}</TableCell>
                      <TableCell align="right">
                        <CollectionActions
                          itemId={item.id}
                          editPath="/settings/driver"
                          endpoint="drivers"
                          setTimestamp={setTimestamp}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableShimmer columns={3} endAction />
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

export default DriversPage;
