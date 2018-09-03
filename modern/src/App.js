import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import MainToobar from './MainToolbar';
import MainMap from './MainMap';

class App extends Component {
  render() {
    return (
      <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
        <div style={{flex: 0}}>
          <MainToobar />
        </div>
        <div style={{flex: 1}}>
          <ContainerDimensions>
            <MainMap/>
          </ContainerDimensions>
        </div>
      </div>
    );
  }
}

export default App;
