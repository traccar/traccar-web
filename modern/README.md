This is a new version of the Traccar web app. It is still in a very early stage of development.

It uses [React](https://reactjs.org/), [Material UI](https://material-ui.com/) and [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/). Feedback and contributions are welcome.

To run the project in development mode:

- Make sure you have Traccar backend running.
- Install dependencies using `npm install` command
- Run development server using `npm start` command

To change the backend server URL:

- Copy the content of the .env to .env.local (new file)
- Change REACT_APP_URL_NAME to your backend URL. Example: 'example.com:8081'

Project was created using [Create React App](https://github.com/facebook/create-react-app). For more information see [user guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).
