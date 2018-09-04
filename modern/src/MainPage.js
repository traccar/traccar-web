import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import MainToobar from './MainToolbar';
import MainMap from './MainMap';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    fetch('/api/session').then(response => {
      if (response.ok) {
        this.setState({
          loading: false
        });
      } else {
        this.props.history.push('/login');
      }
    });
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div>Loading...</div>
      );
    } else {
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
}

export default MainPage;
