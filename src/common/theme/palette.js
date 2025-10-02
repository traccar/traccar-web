import { grey, green, indigo } from "@mui/material/colors";
import { persianColors } from "./persianColors";

const darkerBlue = "#244a57";
const darkBlue = "#417e94";
const midBlue = "#87bac6";
const lightBlue = "#bddde0";
const lighterBlue = "#dde7dc";

const HGreen = "#76ab1d";
const HRed = "#cd3730";
const HBlack = "#343434";

const validatedColor = (color) =>
  /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;

export default (server, darkMode) => ({
  mode: darkMode ? "dark" : "light",

  background: {
    default: darkMode ? lightBlue : darkBlue,
    paper: darkMode ? darkerBlue : lighterBlue,
  },
  primary: {
    main:
      validatedColor(server?.attributes?.colorPrimary) ||
      (darkMode ? midBlue : midBlue),
  },
  secondary: {
    main:
      validatedColor(server?.attributes?.colorSecondary) ||
      (darkMode ? lighterBlue : darkerBlue),
  },
  neutral: {
    main: darkMode ? lightBlue : darkBlue,
  },
  geometry: {
    main: darkMode ? lightBlue : darkBlue,
  },
  success: {
    main: HGreen,
  },
  error: {
    main: HRed,
  },
  // background: {
  //   default: "#244a57",
  //   paper: "#bddde0",
  // },
  // primary: {
  //   main: "#ffffff",
  // },
  // secondary: {
  //   main: "#89b9c5",
  // },
  // neutral: {
  //   main: "#244a57",
  // },
  // geometry: {
  //   main: "#244a57",
  // },
});
