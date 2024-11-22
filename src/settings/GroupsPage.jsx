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
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import PublishIcon from "@mui/icons-material/Publish";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";

const GroupsPage = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/groups");
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = items.map((item) => item.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ marginTop: "20px" }}>
      <PageLayout menu={<SettingsMenu />} breadcrumbs={["settingsTitle", "settingsGroups"]}>
        <Box display="flex" alignItems="center" justifyContent="space-between" m="30px">
          <Typography variant="h5">{t("settingsGroups")}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/settings/group")}
            sx={{
              padding: "10px 20px",
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "8px",
            }}
          >
            {t("newGroup")} New Group
          </Button>
        </Box>
        <Paper sx={{ margin: "30px", borderRadius: "10px" }}>
          <Toolbar sx={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
            <TextField
              variant="outlined"
              placeholder="Search Group ..."
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
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white', 
                },
                padding: "10px",
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
                      indeterminate={
                        selected.length > 0 && selected.length < items.length
                      }
                      checked={items.length > 0 && selected.length === items.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, "name")}
                    >
                      {t("sharedName")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">{t("sharedActions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  displayedItems.map((item) => {
                    const isItemSelected = isSelected(item.id);
                    return (
                      <TableRow
                        key={item.id}
                        hover
                        onClick={() => handleClick(item.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          <CollectionActions
                            itemId={item.id}
                            editPath="/settings/group"
                            endpoint="groups"
                            setTimestamp={setTimestamp}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
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

export default GroupsPage;
