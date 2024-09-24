import {
	grey,
	green,
	indigo,
	lightGreen,
	deepOrange,
	blueGrey,
} from '@mui/material/colors';

const validatedColor = color =>
	/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;

export default (server, darkMode) => ({
	mode: darkMode ? 'dark' : 'light',
	background: {
		default: darkMode ? blueGrey[900] : blueGrey[50],
	},
	primary: {
		main:
			validatedColor(server?.attributes?.colorPrimary) ||
			(darkMode ? deepOrange[200] : deepOrange[900]),
	},
	secondary: {
		main:
			validatedColor(server?.attributes?.colorSecondary) ||
			(darkMode ? lightGreen[300] : green[900]),
	},
	neutral: {
		main: blueGrey[500],
	},
	geometry: {
		main: '#ff781f',
	},
});
