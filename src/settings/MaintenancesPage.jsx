import React, { useState } from "react";
import dayjs from "dayjs";
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
  Button,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useEffectAsync } from "../reactHelper";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import { formatDistance, formatSpeed } from "../common/util/formatter";
import { useAttributePreference } from "../common/util/preferences";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import { filterByKeyword } from "./components/SearchHeader";
import useSettingsStyles from "./common/useSettingsStyles";
import { Add, Search } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const MaintenacesPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();

  const positionAttributes = usePositionAttributes(t);

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const speedUnit = useAttributePreference("speedUnit");
  const distanceUnit = useAttributePreference("distanceUnit");

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/maintenance");
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const convertAttribute = (key, start, value) => {
    const attribute = positionAttributes[key];
    if (key.endsWith("Time")) {
      if (start) {
        return dayjs(value).locale("en").format("YYYY-MM-DD");
      }
      return `${value / 86400000} ${t("sharedDays")}`;
    }
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case "speed":
          return formatSpeed(value, speedUnit, t);
        case "distance":
          return formatDistance(value, distanceUnit, t);
        case "hours":
          return `${value / 3600000} ${t("sharedHours")}`;
        default:
          return value;
      }
    }
    return value;
  };

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

  const filteredItems = items.filter(filterByKeyword(searchKeyword));
  const displayedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


const handleNavigate=()=>{
  navigate('/settings/maintenance')
    }


  return (
    <Box sx={{ marginTop: "20px" }}>
      <PageLayout
        menu={<SettingsMenu />}
        breadcrumbs={["settingsTitle", "sharedMaintenance"]}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" m="30px">
          <Typography variant="h5">{t("sharedMaintenance")}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              padding: "10px 20px",
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "8px",
            }}
            onClick={handleNavigate}
          >
            {t("newMaintenance")} New Maintenance
          </Button>
        </Box>
        <Paper sx={{ margin: "30px", borderRadius: "10px" }}>
          <Toolbar sx={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
          <TextField 
      variant="outlined"
      placeholder="Search Maintenance ..."
      size="small"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      InputProps={{
        startAdornment: (
          <IconButton edge="start" size="small" sx={{ mr: 1 }}>
            <Search  />
          </IconButton>
        ),
      }}
      sx={{
        flex: 1,
        maxWidth: "300px",
        backgroundColor: "white",
        padding:'10px',
        borderRadius: "8px",
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white', 
        },
      
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
        indeterminate={selected.length > 0 && selected.length < items.length}
        checked={items.length > 0 && selected.length === items.length}
        onChange={handleSelectAllClick}
      />
    </TableCell>
    <TableCell>
      <TableSortLabel
        active={orderBy === "name"}
        direction={orderBy === "name" ? order : "asc"}
        onClick={() => handleRequestSort("name")}
      >
        {t("sharedName")}
      </TableSortLabel>
    </TableCell>
    <TableCell>
      <TableSortLabel
        active={orderBy === "type"}
        direction={orderBy === "type" ? order : "asc"}
        onClick={() => handleRequestSort("type")}
      >
        {t("sharedType")}
      </TableSortLabel>
    </TableCell>
    <TableCell>
      <TableSortLabel
        active={orderBy === "start"}
        direction={orderBy === "start" ? order : "asc"}
        onClick={() => handleRequestSort("start")}
      >
        {t("maintenanceStart")}
      </TableSortLabel>
    </TableCell>
    <TableCell>
      <TableSortLabel
        active={orderBy === "period"}
        direction={orderBy === "period" ? order : "asc"}
        onClick={() => handleRequestSort("period")}
      >
        {t("maintenancePeriod")}
      </TableSortLabel>
    </TableCell>
    <TableCell align="right">{t("sharedActions")}</TableCell>
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
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        {convertAttribute(item.type, true, item.start)}
                      </TableCell>
                      <TableCell>
                        {convertAttribute(item.type, false, item.period)}
                      </TableCell>
                      <TableCell align="right">
                        <CollectionActions
                          itemId={item.id}
                          editPath="/settings/maintenance"
                          endpoint="maintenance"
                          setTimestamp={setTimestamp}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableShimmer columns={6} endAction />
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

export default MaintenacesPage;
