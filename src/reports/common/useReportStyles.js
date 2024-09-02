import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerMap: {
    flexBasis: "40%",
    flexShrink: 0,
  },
  containerMain: {
    overflow: "auto",
    backgroundColor: "#303234",
    margin: "10px 20px 0px 10px",
    borderRadius: 10,
    boxShadow: "0 0 12px 0 rgba(0, 0, 0, 20%)",
  },
  header: {
    position: "sticky",
    left: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  columnAction: {
    width: "1%",
    paddingLeft: theme.spacing(1),
  },
  filter: {
    display: "inline-flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    padding: theme.spacing(3, 2, 2),
  },
  filterItem: {
    minWidth: 0,
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButtons: {
    display: "flex",
    gap: theme.spacing(1),
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButton: {
    flexGrow: 1,
  },
  chart: {
    flexGrow: 1,
    overflow: "hidden",
  },
}));
